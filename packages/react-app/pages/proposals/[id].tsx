import Badge from "@/components/Badge";
import InformationIcon from "@/components/CustomIcons/InformationIcon";
import ResultIcon from "@/components/CustomIcons/ResultIcon";
import VoteListItem from "@/components/Proposal/VoteListItem";
import { ArrowLeftIcon, ArrowLongRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type Props = {
  id: string;
};

const ProposalDetails = ({ id }: Props) => {
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
              cREAL Liquidity Incentive
            </div>
            <div className="flex flex-row items-center mt-3">
              <Badge value="Active" />
              <div className="text-sm font-light text-gray-500">
                By: 0x23A3...A3F
              </div>
            </div>
            <div className="mt-16 text-gray-500">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>
            <div className="mt-6 text-gray-500">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>
            <div className="font-gtalpina text-4xl font-thin mt-16">
              Discussion
            </div>
            <Link
              href="/proposals/0"
              className="flex flex-row justify-between py-6 hover:cursor-pointer border-b border-t mt-8 border-gray-300"
            >
              <div className="flex flex-col">
                <div className="text-xs text-gray-500 mb-1">Celo Forum</div>
                <div className="font-light">cREAL Liquidity Incentive</div>
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
                <span className="font-light">Jan 12, 2023</span>
              </div>
              <div className="flex flex-row justify-between mt-1">
                <span className="font-semibold">End Date:</span>
                <span className="font-light">Jan 17, 2023</span>
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
