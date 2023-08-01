/* eslint-disable react-hooks/exhaustive-deps */
import { readContract } from "@/helper/ethersHelper";
import { parseProposalRecord } from "@/helper/parseData";
import { getAddressFromRegistry } from "@/helper/registry";
import { governanceABI } from "@/utils/Celo";
import {
  DequeuedProposals,
  GovernanceConfig,
  Proposal,
  ProposalData,
  ProposalRecord,
  ProposalRecordMetadata,
  QueuedProposals,
  VoteValue,
} from "@/utils/types/proposal.type";
import { valueToInt } from "@celo/contractkit/lib/wrappers/BaseWrapper";
import { ProposalStage } from "@celo/contractkit/lib/wrappers/Governance";
import {} from "@rainbow-me/rainbowkit";
import axios from "axios";
import { load } from "cheerio";
import matter from "gray-matter";
import { ProposalSchedule } from "./types/proposal.type";

var governanceConfig: GovernanceConfig | undefined;
var allDequeuedProposals: Proposal[] | [];
var allQueuedProposals: Proposal[] | [];

var governanceAddress: `0x${string}` | null = null;

export const getAllProposals = async (limit: number, skip: number) => {
  try {
    const dequeuedProposalsIds: DequeuedProposals = await getDequeue();
    const sortedDequeuedProposalsIds = {
      proposalIds: dequeuedProposalsIds.proposalIds.sort(
        (a: bigint, b: bigint) => {
          return parseInt(b.toString()) - parseInt(a.toString());
        }
      ),
    };

    // skip the proposals
    const skippedProposalList = sortedDequeuedProposalsIds.proposalIds.slice(
      skip,
      sortedDequeuedProposalsIds.proposalIds.length
    );

    const dequeuedProposals = await Promise.all(
      skippedProposalList.slice(0, limit).map(async (proposalId: bigint) => {
        const proposal = await getProposal(proposalId.toString());
        if (proposal) {
          return proposal;
        }
      })
    );
    // removed all the undefined proposals
    const filteredDequeuedProposals = dequeuedProposals.filter(
      (proposal) => proposal !== undefined
    ) as Proposal[];

    // sort proposals w.r.t. proposal.proposalId
    filteredDequeuedProposals.sort((a: Proposal, b: Proposal) => {
      return parseInt(b.proposalId) - parseInt(a.proposalId);
    });
    return filteredDequeuedProposals;
  } catch (error) {
    return null;
  } finally {
  }
};

export const getProposal = async (
  proposalId: string
): Promise<Proposal | undefined> => {
  try {
    const [proposalMetadata, proposalStage] = await Promise.all([
      getProposalMetadata(proposalId),
      getProposalStage(proposalId),
    ]);
    if (proposalMetadata && proposalStage) {
      const [proposalData, proposalSchedule, proposalRecord] =
        await Promise.all([
          getProposalData(proposalMetadata.descriptionURL),
          getProposalSchedule(proposalMetadata.timestamp, proposalStage),
          getProposalRecord(proposalId, proposalStage),
        ]);
      return {
        proposalId,
        proposalMetadata,
        proposalStage,
        proposalData,
        proposalSchedule,
        proposalRecord,
      };
    }
  } catch (error) {
    console.log("Error in getting proposal ::>", error);
    throw error;
  }
};

const getProposalSchedule = async (
  timestamp: bigint,
  stage: ProposalStage
): Promise<ProposalSchedule> => {
  const config = await getGovernanceConfig();
  if (stage == ProposalStage.Queued) {
    const queueExpiry = config.queueExpiry;
    const queueExpiration = BigInt(timestamp) + BigInt(queueExpiry ?? 0);
    return {
      [ProposalStage.Queued]: timestamp,
      [ProposalStage.Expiration]: queueExpiration,
    };
  }

  const durations = config.stageDurations;
  const referendum = timestamp;
  const execution = BigInt(referendum) + BigInt(durations!.Referendum);
  const expiration = BigInt(execution) + BigInt(durations!.Execution);

  return {
    [ProposalStage.Referendum]: referendum,
    [ProposalStage.Execution]: execution,
    [ProposalStage.Expiration]: expiration,
  };
};

const getProposalRecord = async (
  proposalId: string,
  stage: ProposalStage
): Promise<ProposalRecord> => {
  const govAddress = await getGovernanceAddress();
  const record = {
    passed: false,
    approved: false,
  };
  if (stage === ProposalStage.Queued) {
    const upvotes = await getUpvotes(proposalId);
    return {
      ...record,
      upvotes,
    };
  } else if (
    stage === ProposalStage.Referendum ||
    stage === ProposalStage.Execution ||
    stage === ProposalStage.Expiration
  ) {
    const [passed, votes, approved] = await Promise.all([
      readContract(govAddress, governanceABI, "isProposalPassing", [
        BigInt(proposalId),
      ]),
      readContract(govAddress, governanceABI, "getVoteTotals", [
        BigInt(proposalId),
      ]),
      readContract(govAddress, governanceABI, "isApproved", [
        BigInt(proposalId),
      ]),
    ]);
    return {
      ...record,
      passed: passed,
      votes: {
        [VoteValue.Yes]: votes ? votes[0] : BigInt(0),
        [VoteValue.No]: votes ? votes[1] : BigInt(0),
        [VoteValue.Abstain]: votes ? votes[2] : BigInt(0),
      },
      approved: approved,
    };
  }
};

const getProposalMetadata = async (
  proposalId: string
): Promise<ProposalRecordMetadata | undefined> => {
  try {
    const govAddress = await getGovernanceAddress();
    const response = await readContract(
      govAddress,
      governanceABI,
      "getProposal",
      [BigInt(proposalId)]
    );
    return parseProposalRecord(response, proposalId);
  } catch (error) {
    console.log("Error in getting proposal metadata ::>", error);
    throw error;
  }
};

const getProposalStage = async (proposalId: string) => {
  try {
    const govAddress = await getGovernanceAddress();
    const queue = await getQueue();
    const existsInQueue =
      queue.proposalIds.find((u) => u === BigInt(proposalId)) !== undefined;
    if (existsInQueue) {
      const expired = await isQueuedProposalExpired(proposalId);
      return expired ? ProposalStage.Expiration : ProposalStage.Queued;
    }
    const response = await readContract(
      govAddress,
      governanceABI,
      "getProposalStage",
      [BigInt(proposalId)]
    );
    return Object.keys(ProposalStage)[valueToInt(response)] as ProposalStage;
  } catch (error) {
    console.log("Error in getting proposal stage ::>", error);
    throw error;
  }
};

const getQueue = async (): Promise<QueuedProposals> => {
  try {
    const govAddress = await getGovernanceAddress();
    const response = await readContract(
      govAddress,
      governanceABI,
      "getQueue",
      []
    );
    return {
      proposalIds: [...response[0]],
      upvotes: [...response[1]],
    };
  } catch (error) {
    console.log("Error in getting queue ::>", error);
    throw error;
  }
};

const getDequeue = async (): Promise<DequeuedProposals> => {
  try {
    const govAddress = await getGovernanceAddress();
    const response = await readContract(
      govAddress,
      governanceABI,
      "getDequeue",
      []
    );
    return {
      proposalIds: [...response],
    };
  } catch (error) {
    console.log("Error in getting dequeue ::>", error);
    throw error;
  }
};

const getGovernanceAddress = async (): Promise<`0x${string}`> => {
  try {
    if (governanceAddress === null) {
      governanceAddress = await getAddressFromRegistry("Governance");
    }
    return governanceAddress!;
  } catch (error) {
    console.log("Error in getting governance address ::>", error);
    throw error;
  }
};

const getGovernanceConfig = async (): Promise<GovernanceConfig> => {
  if (governanceConfig !== undefined) {
    return governanceConfig;
  }
  const govAddress = await getGovernanceAddress();
  const [
    concurrentProposals,
    dequeueFrequency,
    minDeposit,
    queueExpiry,
    stageDurations,
    participationParameters,
  ] = await Promise.all([
    readContract(govAddress, governanceABI, "concurrentProposals", []),
    readContract(govAddress, governanceABI, "dequeueFrequency", []),
    readContract(govAddress, governanceABI, "minDeposit", []),
    readContract(govAddress, governanceABI, "queueExpiry", []),
    readContract(govAddress, governanceABI, "stageDurations", []),
    readContract(govAddress, governanceABI, "getParticipationParameters", []),
  ]);

  const config: GovernanceConfig = {
    concurrentProposals: concurrentProposals,
    dequeueFrequency: dequeueFrequency,
    minDeposit: minDeposit,
    queueExpiry: queueExpiry,
    stageDurations: {
      Referendum: stageDurations ? stageDurations[0] : BigInt(0),
      Execution: stageDurations ? stageDurations[1] : BigInt(0),
    },
    participationParameters: {
      baseline: participationParameters
        ? participationParameters[0]
        : BigInt(0),
      baselineFloor: participationParameters
        ? participationParameters[1]
        : BigInt(0),
      baselineQuorumFactor: participationParameters
        ? participationParameters[2]
        : BigInt(0),
      baselineUpdateFactor: participationParameters
        ? participationParameters[3]
        : BigInt(0),
    },
  };
  governanceConfig = config;
  return config;
};

const isQueuedProposalExpired = async (
  proposalId: string
): Promise<boolean> => {
  try {
    const govAddress = await getGovernanceAddress();
    const response = await readContract(
      govAddress,
      governanceABI,
      "isQueuedProposalExpired",
      [BigInt(proposalId)]
    );
    return response;
  } catch (error) {
    console.log("Error in checking if queued proposal is expired ::>", error);
    throw error;
  }
};

const getUpvotes = async (proposalId: string): Promise<bigint> => {
  try {
    const govAddress = await getGovernanceAddress();
    const response = await readContract(
      govAddress,
      governanceABI,
      "getUpvotes",
      [BigInt(proposalId)]
    );
    return response;
  } catch (error) {
    console.log("Error in getting upvotes ::>", error);
    throw error;
  }
};

const getProposalData = async (
  descriptionUrl: string
): Promise<ProposalData | null> => {
  try {
    if (
      descriptionUrl.includes("github.com") ||
      descriptionUrl.includes("githubusercontent.com")
    ) {
      var response = await fetch(
        (descriptionUrl as string)
          .replace("https://github.com", "https://raw.githubusercontent.com")
          .replace("blob", "")
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const markdownContent = await response.text();
      const parsedContent = matter(markdownContent);
      return {
        ...(parsedContent.data as ProposalData),
        mainContent: parsedContent.content,
      };
    } else if (descriptionUrl.includes("forum.celo")) {
      const response = await axios.get(descriptionUrl);
      const html = response.data;
      const $ = load(html);
      const rawBody = $("#post_1 .cooked");
      console.log("🚀 ~ file: proposals.ts:372 ~ rawBody:", rawBody.text());
      const title = $("#topic-title > h1 > a");
      // console.log("🚀 ~ file: proposals.ts:392 ~ title:", title);

      return {
        title: title.text().trim(),
        mainContent: "rawBody.text().trim()",
        "discussions-to": descriptionUrl,
      };
    } else {
      return null;
    }
  } catch {
    return null;
  }
};

// https://github.com/celo-org/celo-monorepo/blob/e884b03b5a30ccce927bb2effd2ade789c6de777/packages/sdk/contractkit/src/wrappers/Governance.ts#L551
// const getVoteRecordOfUser = (voter: string, proposalID: bigint): Promise<VoteRecord | null> => {
// }
