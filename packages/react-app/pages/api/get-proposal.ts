// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getProposal } from "@/utils/proposals";
import { Proposal } from "@/utils/types/proposal.type";
import type { NextApiRequest, NextApiResponse } from "next";
import NodeCache from "node-cache";

const cache = new NodeCache({
  stdTTL: 60 * 60,
  deleteOnExpire: true,
});

interface Data {
  data: Proposal | null;
}

const replacer = (key: any, value: any) =>
  typeof value === "bigint" ? value.toString() : value;

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const proposalId = req.query.id as string;
  if (!proposalId) {
    return res.status(404).json({ data: null });
  }

  try {
    const cachedProposals = (cache.get("allProposals") as Proposal[]) ?? [];
    if (
      cachedProposals &&
      cachedProposals.find((p) => p.proposalId === proposalId)
    ) {
      // check if proposal is in cache
      const proposal = cachedProposals.find((p) => p.proposalId === proposalId);
      return res
        .status(200)
        .json({ data: JSON.parse(JSON.stringify(proposal, replacer)) });
    }
    const proposal = await getProposal(proposalId);
    if (proposal) {
      return res
        .status(200)
        .json({ data: JSON.parse(JSON.stringify(proposal, replacer)) });
    }
    return res.status(404).json({ data: null });
  } catch (e) {}
};

export default handler;
