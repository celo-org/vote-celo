export interface Proposal {
  githubData: GithubData;
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
