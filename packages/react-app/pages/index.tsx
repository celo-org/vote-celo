import Badge from "@/components/Badge";
import { getAllProposals } from "@/utils/proposals";
import { timeDistanceFormat, timeFormat } from "@/utils/timeformat";
import { Proposal } from "@/utils/types/proposal.type";
import BigNumber from "bignumber.js";
import Link from "next/link";

interface Props {
  proposals: Proposal[];
}

const Home: React.FC<Props> = ({ proposals }) => {
  return (
    <>
      <div className="w-full">
        <div className="flex flex-col items-center justify-center py-2">
          <main className="flex flex-col items-center justify-center w-full">
            <h1 className="text-2xl font-bold mb-10">Celo Governance</h1>
            <main className="flex flex-col items-center justify-center w-full">
              <div className="flex flex-col items-center justify-center w-full space-y-4">
                {proposals?.map((proposal, index) => (
                  <Link
                    href={`/proposal/${new BigNumber(
                      proposal.record.proposalID
                    ).toNumber()}`}
                    key={index}
                    className="w-full"
                  >
                    <div className="flex flex-col items-start justify-center w-full border-2 border-black rounded-xl p-3">
                      <h2 className="font-bold inline-flex items-center">
                        #{new BigNumber(proposal.record.proposalID).toNumber()}{" "}
                        {proposal.githubData.title}
                        <Badge value="Upvoting" className="ml-2" />
                      </h2>
                      <p className="text-xs text-gray-500 mt-2">
                        Proposed by {proposal.record.metadata.proposer}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Time:{" "}
                        {timeFormat(
                          new BigNumber(
                            proposal.record.metadata.timestamp
                          ).toNumber()
                        )}{" "}
                        |{" "}
                        {timeDistanceFormat(
                          new BigNumber(
                            proposal.record.metadata.timestamp
                          ).toNumber()
                        )}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </main>
          </main>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context: any) {
  const proposals = await getAllProposals();
  return {
    props: {
      proposals,
    },
  };
}

export default Home;
