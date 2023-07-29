/* eslint-disable react-hooks/exhaustive-deps */
import { parseProposalRecord } from "@/helper/parseData";
import { getAddressFromRegistry } from "@/helper/registry";
import { governanceABI } from "@/utils/Celo";
import {
  DequeuedProposals,
  GithubData,
  GovernanceConfig,
  ProposalRecord,
  ProposalRecordMetadata,
  QueuedProposals,
  VoteValue,
} from "@/utils/types/proposal.type";
import { valueToInt } from "@celo/contractkit/lib/wrappers/BaseWrapper";
import { ProposalStage } from "@celo/contractkit/lib/wrappers/Governance";
import {} from "@rainbow-me/rainbowkit";
import matter from "gray-matter";
import { useEffect, useState } from "react";
import { readContracts } from "wagmi";
import { ProposalSchedule } from "./../utils/types/proposal.type";

interface Proposal {
  proposalMetadata: ProposalRecordMetadata;
  proposalStage: ProposalStage;
  proposalGithubData: GithubData | null;
  proposalSchedule: ProposalSchedule;
  proposalRecord: ProposalRecord;
  proposalId: string;
}

export const useProposals = () => {
  const [loading, setLoading] = useState(false);
  const [governanceConfig, setGovernanceConfig] = useState<
    GovernanceConfig | undefined
  >();
  const [allDequeuedProposals, setAllDequeuedProposals] = useState<Proposal[]>(
    []
  );
  const [allQueuedProposals, setAllQueuedProposals] = useState<any>([]);
  var governanceAddress: `0x${string}` | null = null;

  useEffect(() => {
    getGovernanceConfig();
  }, []);

  const getAllProposals = async () => {
    try {
      const dequeuedProposalsIds: DequeuedProposals = await getDequeue();
      const dequeuedProposals = await Promise.all(
        dequeuedProposalsIds.proposalIds.map(async (proposalId: bigint) => {
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
      setAllDequeuedProposals(filteredDequeuedProposals);
    } catch (error) {
      console.log("Error in getting all proposals ::>", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getProposal = async (
    proposalId: string
  ): Promise<Proposal | undefined> => {
    try {
      const [proposalMetadata, proposalStage] = await Promise.all([
        getProposalMetadata(proposalId),
        getProposalStage(proposalId),
      ]);
      if (proposalMetadata && proposalStage) {
        const [proposalGithubData, proposalSchedule, proposalRecord] =
          await Promise.all([
            getProposalFromGithub(proposalMetadata.descriptionURL),
            getProposalSchedule(proposalMetadata.timestamp, proposalStage),
            getProposalRecord(proposalId, proposalStage),
          ]);
        return {
          proposalId,
          proposalMetadata,
          proposalStage,
          proposalGithubData,
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
      stage === ProposalStage.Execution
    ) {
      const [passed, votes, approved] = await Promise.all([
        readContracts({
          contracts: [
            {
              address: govAddress,
              abi: governanceABI,
              functionName: "isProposalPassing",
              args: [BigInt(proposalId)],
            },
          ],
        }),
        readContracts({
          contracts: [
            {
              address: govAddress,
              abi: governanceABI,
              functionName: "getVoteTotals",
              args: [BigInt(proposalId)],
            },
          ],
        }),
        readContracts({
          contracts: [
            {
              address: govAddress,
              abi: governanceABI,
              functionName: "isApproved",
              args: [BigInt(proposalId)],
            },
          ],
        }),
      ]);
      return {
        ...record,
        passed: passed[0].result,
        votes: {
          [VoteValue.Yes]: votes[0].result ? votes[0].result[0] : BigInt(0),
          [VoteValue.No]: votes[0].result ? votes[0].result[1] : BigInt(0),
          [VoteValue.Abstain]: votes[0].result ? votes[0].result[2] : BigInt(0),
        },
        approved: approved[0].result,
      };
    }
  };

  const getProposalMetadata = async (
    proposalId: string
  ): Promise<ProposalRecordMetadata | undefined> => {
    try {
      const govAddress = await getGovernanceAddress();
      const response = (
        await readContracts({
          contracts: [
            {
              address: govAddress,
              abi: governanceABI,
              functionName: "getProposal",
              args: [BigInt(proposalId)],
            },
          ],
        })
      )[0];
      if (response.error) {
        throw response.error;
      }
      return parseProposalRecord(response.result, proposalId);
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
      const response = (
        await readContracts({
          contracts: [
            {
              address: govAddress,
              abi: governanceABI,
              functionName: "getProposalStage",
              args: [BigInt(proposalId)],
            },
          ],
        })
      )[0];
      if (response.error) {
        throw response.error;
      }
      return Object.keys(ProposalStage)[
        valueToInt(response.result)
      ] as ProposalStage;
    } catch (error) {
      console.log("Error in getting proposal stage ::>", error);
      throw error;
    }
  };

  const getQueue = async (): Promise<QueuedProposals> => {
    try {
      const govAddress = await getGovernanceAddress();
      const response = (
        await readContracts({
          contracts: [
            {
              address: govAddress,
              abi: governanceABI,
              functionName: "getQueue",
            },
          ],
        })
      )[0];
      if (response.error) {
        throw response.error;
      }
      return {
        proposalIds: [...response.result[0]],
        upvotes: [...response.result[1]],
      };
    } catch (error) {
      console.log("Error in getting queue ::>", error);
      throw error;
    }
  };

  const getDequeue = async (): Promise<DequeuedProposals> => {
    try {
      const govAddress = await getGovernanceAddress();
      const response = (
        await readContracts({
          contracts: [
            {
              address: govAddress,
              abi: governanceABI,
              functionName: "getDequeue",
            },
          ],
        })
      )[0];
      if (response.error) {
        throw response.error;
      }
      return {
        proposalIds: [...response.result],
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
      readContracts({
        contracts: [
          {
            address: govAddress,
            abi: governanceABI,
            functionName: "concurrentProposals",
          },
        ],
      }),
      readContracts({
        contracts: [
          {
            address: govAddress,
            abi: governanceABI,
            functionName: "dequeueFrequency",
          },
        ],
      }),
      readContracts({
        contracts: [
          {
            address: govAddress,
            abi: governanceABI,
            functionName: "minDeposit",
          },
        ],
      }),
      readContracts({
        contracts: [
          {
            address: govAddress,
            abi: governanceABI,
            functionName: "queueExpiry",
          },
        ],
      }),
      readContracts({
        contracts: [
          {
            address: govAddress,
            abi: governanceABI,
            functionName: "stageDurations",
          },
        ],
      }),
      readContracts({
        contracts: [
          {
            address: govAddress,
            abi: governanceABI,
            functionName: "getParticipationParameters",
          },
        ],
      }),
    ]);

    const config: GovernanceConfig = {
      concurrentProposals: concurrentProposals[0].result,
      dequeueFrequency: dequeueFrequency[0].result,
      minDeposit: minDeposit[0].result,
      queueExpiry: queueExpiry[0].result,
      stageDurations: {
        Referendum: stageDurations[0].result
          ? stageDurations[0].result[0]
          : BigInt(0),
        Execution: stageDurations[0].result
          ? stageDurations[0].result[1]
          : BigInt(0),
      },
      participationParameters: {
        baseline: participationParameters[0].result
          ? participationParameters[0].result[0]
          : BigInt(0),
        baselineFloor: participationParameters[0].result
          ? participationParameters[0].result[1]
          : BigInt(0),
        baselineQuorumFactor: participationParameters[0].result
          ? participationParameters[0].result[2]
          : BigInt(0),
        baselineUpdateFactor: participationParameters[0].result
          ? participationParameters[0].result[3]
          : BigInt(0),
      },
    };
    setGovernanceConfig(config);
    return config;
  };

  const isQueuedProposalExpired = async (
    proposalId: string
  ): Promise<boolean> => {
    try {
      const govAddress = await getGovernanceAddress();
      const response = (
        await readContracts({
          contracts: [
            {
              address: govAddress,
              abi: governanceABI,
              functionName: "isQueuedProposalExpired",
              args: [BigInt(proposalId)],
            },
          ],
        })
      )[0];
      if (response.error) {
        throw response.error;
      }
      return response.result;
    } catch (error) {
      console.log("Error in checking if queued proposal is expired ::>", error);
      throw error;
    }
  };

  const getUpvotes = async (proposalId: string): Promise<bigint> => {
    try {
      const govAddress = await getGovernanceAddress();
      const response = (
        await readContracts({
          contracts: [
            {
              address: govAddress,
              abi: governanceABI,
              functionName: "getUpvotes",
              args: [BigInt(proposalId)],
            },
          ],
        })
      )[0];
      if (response.error) {
        throw response.error;
      }
      return response.result;
    } catch (error) {
      console.log("Error in getting upvotes ::>", error);
      throw error;
    }
  };

  const getProposalFromGithub = async (
    githubDescriptionUrl: string
  ): Promise<GithubData | null> => {
    try {
      if (
        !githubDescriptionUrl.includes("github.com") &&
        !githubDescriptionUrl.includes("githubusercontent.com")
      ) {
        return null;
      }
      var response = await fetch(
        (githubDescriptionUrl as string)
          .replace("https://github.com", "https://raw.githubusercontent.com")
          .replace("blob", "")
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const markdownContent = await response.text();
      const parsedContent = matter(markdownContent);
      return {
        ...(parsedContent.data as GithubData),
        mainContent: parsedContent.content,
      };
    } catch {
      return null;
    }
  };

  // https://github.com/celo-org/celo-monorepo/blob/e884b03b5a30ccce927bb2effd2ade789c6de777/packages/sdk/contractkit/src/wrappers/Governance.ts#L551
  // const getVoteRecordOfUser = (voter: string, proposalID: bigint): Promise<VoteRecord | null> => {
  // }

  return {
    loading,
    isQueuedProposalExpired,
    getAllProposals,
    getProposal,
    getProposalMetadata,
    getQueue,
    getDequeue,
    getProposalStage,
    getUpvotes,
    allDequeuedProposals,
    allQueuedProposals,
  };
};
