import { ProposalRecordMetadata } from "@/utils/types/proposal.type";

export const parseProposalRecord = (
  data: any,
  proposalId: string
): ProposalRecordMetadata => {
  return {
    proposer: data[0],
    deposit: data[1],
    timestamp: data[2],
    transactionCount: data[3],
    descriptionURL: data[4],
    proposalId,
  };
};
