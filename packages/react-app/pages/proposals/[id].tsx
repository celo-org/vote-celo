import Badge from "@/components/Badge";
import InformationIcon from "@/components/CustomIcons/InformationIcon";
import ResultIcon from "@/components/CustomIcons/ResultIcon";
import VoteListItem from "@/components/Proposal/VoteListItem";
import { formatTimestamp } from "@/utils/helper";
import { Proposal } from "@/utils/types/proposal.type";
import { ArrowLeftIcon, ArrowLongRightIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { BigNumber } from "ethers";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

type Props = {
  id: string;
};

const ProposalDetails = ({ id }: Props) => {
  const [proposal, setProposal] = useState<Proposal | null>(null);

  useEffect(() => {
    console.log("id", id);
    const fetchProposal = async () => {
      const proposal = await axios({
        method: "get",
        url: `/api/get-proposal?id=${id}`,
      });
      const proposalData = await proposal.data;
      setProposal(proposalData.data);
      console.log(
        "🚀 ~ file: [id].tsx:27 ~ fetchProposal ~ proposalData.data:",
        proposalData.data
      );
    };

    fetchProposal();
  }, []);

  if (!proposal) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full mt-10">
      <div className="flex flex-col">
        <Link
          href="/"
          className="flex flex-row items-center space-x-2 text-gray-500"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span className="text-sm">Back</span>
        </Link>

        <div className="flex flex-row my-16">
          <div className="w-3/5 flex flex-col mr-12">
            <div className="text-sm font-light text-gray-500">
              Proposal: CGP{id}
            </div>
            <div className="font-gtalpina text-4xl font-thin mt-2">
              {proposal.proposalData?.title}
            </div>
            <div className="flex flex-row items-center mt-3">
              <Badge value="Active" />
              <div className="text-sm font-light text-gray-500">
                By: {proposal.proposalMetadata.proposer.slice(0, 6)}...
                {proposal.proposalMetadata.proposer.slice(-4)}
              </div>
            </div>
            <div className="mt-16 text-gray-500">
              <ReactMarkdown>
                {`${proposal.proposalData?.mainContent}`}
              </ReactMarkdown>
            </div>
            <div className="font-gtalpina text-4xl font-thin mt-16">
              Discussion
            </div>
            <Link
              href={proposal.proposalData?.["discussions-to"] ?? "#"}
              className="flex flex-row justify-between py-6 hover:cursor-pointer border-b border-t mt-8 border-gray-300"
            >
              <div className="flex flex-col">
                <div className="text-xs text-gray-500 mb-1">Celo Forum</div>
                <div className="font-light">{proposal.proposalData?.title}</div>
              </div>

              <div className="self-center">
                <ArrowLongRightIcon className="w-8 h-8 text-gray-500" />
              </div>
            </Link>
            <div className="flex flex-row items-end space-x-4 font-gtalpina font-thin mt-16">
              <div className="text-4xl">Votes</div>
              <div className="font-sans font-sm font-light">
                15.3k Total Votes
              </div>
            </div>
            <div className="flex flex-col divide-y divide-gray-300 border-b border-t mt-8 border-gray-300">
              <VoteListItem />
              <VoteListItem />
              <VoteListItem />
            </div>
          </div>
          <div className="w-2/5">
            <div className="bg-sand ml-12 p-10 flex flex-col border-b border-gray-300">
              <InformationIcon />
              <div className="font-gtalpina text-4xl font-thin mt-20">
                Information
              </div>
              <div className="flex flex-row justify-between mt-7">
                <span className="font-semibold">Start Date:</span>
                <span className="font-light">
                  {formatTimestamp(
                    BigNumber.from(
                      proposal.proposalSchedule.Execution
                    ).toNumber() * 1000
                  )}
                </span>
              </div>
              <div className="flex flex-row justify-between mt-1">
                <span className="font-semibold">End Date:</span>
                <span className="font-light">
                  {formatTimestamp(
                    BigNumber.from(
                      proposal.proposalSchedule.Expiration
                    ).toNumber() * 1000
                  )}
                </span>
              </div>
            </div>
            <div className="bg-sand ml-12 p-10 flex flex-col">
              <ResultIcon />
              <div className="font-gtalpina text-4xl font-thin mt-20 mb-6">
                Results
              </div>
              <ResultProgress />
              <ResultProgress />
              <ResultProgress />
              <ResultProgress />
              <ResultProgress />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResultProgress = () => {
  return (
    <div className="flex flex-col text-sm mb-3">
      <div className="flex flex-row justify-between">
        <div>0x23A3...A3F</div>
        <div>1.2M CELO (12.3%)</div>
      </div>
      <div className="w-full bg-gypsum rounded-full h-2.5">
        <div
          className="bg-black h-2.5 rounded-full"
          style={{ width: "45%" }}
        ></div>
      </div>
    </div>
  );
};

export async function getServerSideProps({ params }: { params: any }) {
  return {
    props: {
      id: params.id,
    },
  };
}

export default ProposalDetails;
