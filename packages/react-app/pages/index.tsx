import TextfieldWithIcon from "@/components/Form/TextfieldWithIcon";
import ProposalListItem from "@/components/Proposal/ProposalListItem";
import { Proposal } from "@/utils/types/proposal.type";
import axios from "axios";

interface Props {
  proposals: Proposal[];
}

const Home: React.FC<Props> = ({ proposals }) => {
  return (
    <div className="w-full mt-10">
      <div className="flex flex-col divide-y divide-gray-300">
        <div className="flex flex-row justify-between pb-6">
          <div className="font-gtalpina font-thin text-5xl">All Proposals</div>
          <TextfieldWithIcon />
        </div>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <tbody className="divide-y-2">
              {proposals &&
                proposals.map((proposal) => {
                  if (
                    proposal.proposalMetadata.descriptionURL !=
                    "AddOtherReserveAddress"
                  ) {
                    return (
                      <ProposalListItem
                        proposal={proposal}
                        key={proposal.proposalId}
                      />
                    );
                  }
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const proposals = (await axios({
    method: "get",
    url: "http://localhost:3000/api/get-proposals?page=1&limit=7",
  })) as { data: { data: Proposal[] } };

  return {
    props: {
      proposals: proposals.data.data,
    },
  };
}

export default Home;
