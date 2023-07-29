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
  return (
    <div className="w-full mt-10">
      <div className="flex flex-col">
        <div className="flex flex-row">
          <div className=" text-5xl">All Proposals</div>
        </div>
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
