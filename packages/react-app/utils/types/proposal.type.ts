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
  proposalId: string;
}

export interface QueuedProposals {
  proposalIds: bigint[];
  upvotes: bigint[];
}

export interface DequeuedProposals {
  proposalIds: bigint[];
}

// ------------------------------------------------------------------

export interface GithubData {
  cgp: string;
  title: string;
  "date-created": string;
  author: string;
  status: string;
  "discussions-to": string;
  "governance-proposal-id": string;
  "date-executed": string;
  mainContent?: string;
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

type StageDurations<V> = {
  [Stage in ProposalStage]: V;
};

type DequeuedStageDurations = Pick<
  StageDurations<bigint>,
  ProposalStage.Referendum | ProposalStage.Execution
>;

export interface ParticipationParameters {
  baseline: bigint;
  baselineFloor: bigint;
  baselineUpdateFactor: bigint;
  baselineQuorumFactor: bigint;
}

export interface GovernanceConfig {
  concurrentProposals?: bigint;
  dequeueFrequency?: bigint; // seconds
  minDeposit?: bigint;
  queueExpiry?: bigint;
  stageDurations?: DequeuedStageDurations;
  participationParameters?: ParticipationParameters;
}

export type ProposalSchedule =
  | {
      Queued: bigint;
      Expiration: bigint;
      Referendum?: undefined;
      Execution?: undefined;
    }
  | {
      Referendum: bigint;
      Execution: bigint;
      Expiration: bigint;
      Queued?: undefined;
    };

export enum VoteValue {
  None = "None",
  Abstain = "Abstain",
  No = "No",
  Yes = "Yes",
}

export interface Votes {
  [VoteValue.Abstain]: bigint;
  [VoteValue.No]: bigint;
  [VoteValue.Yes]: bigint;
}

export type ProposalRecord =
  | {
      upvotes: bigint;
      passed: boolean;
      approved: boolean;
    }
  | {
      passed: boolean | undefined;
      votes: {
        Yes: bigint;
        No: bigint;
        Abstain: bigint;
      };
      approved: boolean | undefined;
    }
  | undefined;

export interface Proposal {
  proposalMetadata: ProposalRecordMetadata;
  proposalStage: ProposalStage;
  proposalGithubData: GithubData | null;
  proposalSchedule: ProposalSchedule;
  proposalRecord: ProposalRecord;
  proposalId: string;
}
