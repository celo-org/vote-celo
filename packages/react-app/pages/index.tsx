import TextfieldWithIcon from "@/components/Form/TextfieldWithIcon";
import { Proposal } from "@/utils/types/proposal.type";
import { useEffect } from "react";

interface Props {
  proposals: Proposal[];
}

const Home: React.FC<Props> = ({ proposals }) => {
  useEffect(() => {}, []);

  return (
    <div className="w-full mt-10">
      <div className="flex flex-col divide-y divide-gray-300">
        <div className="flex flex-row justify-between pb-6">
          <div className="font-gtalpina font-thin text-5xl">All Proposals</div>
          <TextfieldWithIcon />
        </div>
        {/* {allDequeuedProposals.map((proposal) => (
          <ProposalListItem key={proposal.proposalId} />
        ))} */}
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
