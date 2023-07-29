import TextfieldWithIcon from "@/components/Form/TextfieldWithIcon";
import ProposalListItem from "@/components/Proposal/ProposalListItem";
import { useProposals } from "@/hooks/useProposals";
import { Proposal } from "@/utils/types/proposal.type";
import { useEffect } from "react";

interface Props {
  proposals: Proposal[];
}

const Home: React.FC<Props> = ({ proposals }) => {
  const { getDequeue, getAllProposals } = useProposals();
  useEffect(() => {
    const getAll = async () => {
      const proposals = await getAllProposals();
      console.log(
        "🚀 ~ file: index.tsx:16 ~ useEffect ~ proposals:",
        proposals
      );
    };
    getAll();
    // getAllProposals();
  }, []);
  return (
    <div className="w-full mt-10">
      <div className="flex flex-col divide-y divide-gray-300">
        <div className="flex flex-row justify-between pb-6">
          <div className="font-gtalpina font-thin text-5xl">All Proposals</div>
          <TextfieldWithIcon />
        </div>
        <ProposalListItem />
        <ProposalListItem />
        <ProposalListItem />
      </div>
    </div>
  );
};

export async function getServerSideProps(context: any) {
  // const proposals = await getAllProposals();
  return {
    props: {
      proposals: [],
    },
  };
}

export default Home;
