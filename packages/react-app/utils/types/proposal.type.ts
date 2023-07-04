export enum ProposalStage {
  None = "None",
  Queued = "Queued",
  Approval = "Approval",
  Referendum = "Referendum",
  Execution = "Execution",
  Expiration = "Expiration",
}

export interface ProposalRecordMetadata {
  proposer: `0x${string}`;
  deposit: bigint;
  timestamp: bigint;
  transactionCount: bigint;
  descriptionURL: string;
}

export interface QueuedProposals {
  proposalIds: bigint[];
  upvotes: bigint[];
}

export interface DequeuedProposals {
  proposalIds: bigint[];
}

// ------------------------------------------------------------------
export interface Proposal {
  githubData?: GithubData;
  record: Record;
  mainContent?: string;
}

export interface GithubData {
  cgp: string;
  title: string;
  "date-created": string;
  author: string;
  status: string;
  "discussions-to": string;
  "governance-proposal-id": string;
  "date-executed": string;
}

export interface Record {
  proposal: ProposalElement[];
  metadata: Metadata;
  stage: string;
  passed: boolean;
  approved: boolean;
  upvotes: string;
  proposalID: string;
}

export interface Metadata {
  proposer: string;
  deposit: string;
  timestamp: string;
  transactionCount: number;
  descriptionURL: string;
}

export interface ProposalElement {
  value: string;
  to: string;
  input: string;
}
