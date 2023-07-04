import { parseProposalRecord } from "@/helper/parseData";
import { getAddressFromRegistry } from "@/helper/registry";
import { governanceABI } from "@/utils/Celo";
import {
  DequeuedProposals,
  ProposalRecordMetadata,
  QueuedProposals,
} from "@/utils/types/proposal.type";
import { valueToInt } from "@celo/contractkit/lib/wrappers/BaseWrapper";
import { ProposalStage } from "@celo/contractkit/lib/wrappers/Governance";
import {} from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { readContracts } from "wagmi";

interface Proposal {
  proposalMetadata: ProposalRecordMetadata;
  proposalStage: ProposalStage;
  upvotes?: bigint;
}

export const useProposals = () => {
  const [loading, setLoading] = useState(false);
  const [allDequeuedProposals, setAllDequeuedProposals] = useState<any>([]);
  const [allQueuedProposals, setAllQueuedProposals] = useState<any>([]);
  var governanceAddress: `0x${string}` | null = null;

  const getAllProposals = async () => {
    try {
      const govAddress = await getGovernanceAddress();
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
        var proposal: Proposal = {
          proposalMetadata,
          proposalStage,
        };
        if (proposalStage === ProposalStage.Queued) {
          const upvotes = await getUpvotes(proposalId);
          proposal = {
            ...proposal,
            upvotes,
          };
        }
        return {
          ...proposal,
        };
      }
    } catch (error) {
      console.log("Error in getting proposal ::>", error);
      throw error;
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
      console.log("response.result", response.result);
      return parseProposalRecord(response.result);
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
  };
};
