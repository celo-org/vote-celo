import { ProposalRecordMetadata } from "@/utils/types/proposal.type";

export const parseProposalRecord = (data: any): ProposalRecordMetadata => {
  return {
    proposer: data.result[0],
    deposit: data.result[1],
    timestamp: data.result[2],
    transactionCount: data.result[3],
    descriptionURL: data.result[4],
  };
};
