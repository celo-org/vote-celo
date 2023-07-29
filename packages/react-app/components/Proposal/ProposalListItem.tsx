import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Badge from "../Badge";
type Props = {};

const ProposalListItem = ({}: Props) => {
  return (
    <Link
      href="/proposals/0"
      className="flex flex-row justify-between py-6 hover:cursor-pointer"
    >
      <div className="flex flex-col">
        <div className="text-xs text-gray-500 mb-1">
          Proposal: ###### By: 0x23A3...A3F
        </div>
        <div className="font-light">cREAL Liquidity Incentive</div>
      </div>
      <div className="flex flex-col">
        <div className="text-xs text-gray-500 mb-1">Date Created</div>
        <div className="font-light">04/05/2023</div>
      </div>
      <div className="flex flex-col">
        <div className="text-xs text-gray-500 mb-1">Status</div>
        <div className="font-light">
          <Badge value="Active" />
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-col">
          <div className="text-xs text-gray-500 mb-1">
            Voting Ended 16 days ago
          </div>
          <div className="font-light">11.23 CELO For</div>
          <div className="font-light">1.2k CELO Against</div>
          <div className="font-light">11.2k CELO Abstain</div>
        </div>
      </div>
      <div className="self-center">
        <ArrowLongRightIcon className="w-8 h-8 text-gray-500" />
      </div>
    </Link>
  );
};

export default ProposalListItem;
