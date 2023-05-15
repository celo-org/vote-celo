import { GithubData, Proposal, Record } from "@/utils/types/proposal.type";
import { newKit } from "@celo/contractkit";
import { concurrentMap } from "@celo/utils/lib/async";
import { BigNumber } from "bignumber.js";
import matter from "gray-matter";

export const getAllProposals = async () => {
  const kit = newKit("https://forno.celo.org");
  const governance = await kit.contracts.getGovernance();

  const queue = await governance.getQueue();

  const expiredQueueMap = await concurrentMap(5, queue, (upvoteRecord) =>
    governance.isQueuedProposalExpired(upvoteRecord.proposalID)
  );

  const unexpiredQueue = queue.filter((_, idx) => !expiredQueueMap[idx]);
  const sortedQueue: any = governance.sortedQueue(unexpiredQueue);

  // comvert the above to Promise.all
  const queueData = await Promise.all(
    sortedQueue.map(async (id: any) => {
      return getProposalData({ governance, proposalId: id.proposalID });
    })
  );
  const data: Proposal[] = await Promise.all(
    queueData.map(async (record: any): Promise<Proposal> => {
      return getProposalGithubData(record);
    })
  );
  console.log("data::: ", data);
  return data;
};

export const getProposal = async (proposalId: string) => {
  const kit = newKit("https://forno.celo.org");
  const governance = await kit.contracts.getGovernance();
  const record = await getProposalData({
    governance,
    proposalId: new BigNumber(proposalId),
  });
  const data = await getProposalGithubData(record, true);
  return data;
};

export const getProposalData = async ({
  governance,
  proposalId,
}: {
  governance: any;
  proposalId: BigNumber;
}) => {
  const record = await governance.getProposalRecord(
    (proposalId as BigNumber).toNumber()
  );
  return { ...record, proposalID: proposalId };
};

export const getProposalGithubData = async (
  record: Record,
  mainContent?: boolean
): Promise<Proposal> => {
  var githubDescriptionUrl = record.metadata.descriptionURL;
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
  // return githubData: parsedContent.data, record with type
  return {
    record: {
      ...record,
      upvotes: record.upvotes.toString(),
      proposalID: record.proposalID.toString(),
      metadata: {
        ...record.metadata,
        deposit: record.metadata.deposit.toString(),
        timestamp: record.metadata.timestamp.toString(),
      },
    },
    githubData: {
      ...(parsedContent.data as GithubData),
      "date-created": parsedContent.data["date-created"].toString(),
    },
    mainContent: mainContent ? parsedContent.content : "",
  };
};
