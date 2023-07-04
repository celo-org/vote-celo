import { useProposals } from "@/hooks/useProposals";
import { Proposal } from "@/utils/types/proposal.type";
import { useEffect } from "react";

interface Props {
  proposals: Proposal[];
}

const Home: React.FC<Props> = ({ proposals }) => {
  const { getAllProposals, getProposal } = useProposals();
  useEffect(() => {
    // getAllProposals();
    // getProposal("109");
  }, []);
  return <div className="w-full bg-red-300">Viral</div>;
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
