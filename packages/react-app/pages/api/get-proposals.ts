// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getAllProposals } from "@/utils/proposals";
import { Proposal } from "@/utils/types/proposal.type";
import type { NextApiRequest, NextApiResponse } from "next";
import NodeCache from "node-cache";

const cache = new NodeCache({
  stdTTL: 60 * 60,
  deleteOnExpire: true,
});

interface Data {
  data: Proposal[] | null;
}

const replacer = (key: any, value: any) =>
  typeof value === "bigint" ? value.toString() : value;

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    const cachedProposals = (cache.get("allProposals") as Proposal[]) ?? [];
    console.log(
      "🚀 ~ file: get-proposals.ts:26 ~ handler ~ cachedProposals:",
      cachedProposals
    );
    console.log("cachedProposals.length", cachedProposals.length);
    console.log("skip + limit", skip + limit);
    console.log(typeof cachedProposals);
    if (cachedProposals && cachedProposals.length >= skip + limit) {
      const data = cachedProposals.slice(skip, skip + limit);
      res
        .status(200)
        .json({ data: JSON.parse(JSON.stringify(data, replacer)) });
      return;
    }
    const allProposals = await getAllProposals(limit, skip);
    if (allProposals) {
      cache.set("allProposals", [...cachedProposals, ...allProposals]);
      res
        .status(200)
        .json({ data: JSON.parse(JSON.stringify(allProposals, replacer)) });
    }
    return res.status(404).json({ data: null });
  } catch (e) {}
};

export default handler;
