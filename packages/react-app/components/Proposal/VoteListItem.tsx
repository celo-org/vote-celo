import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
type Props = {};

const VoteListItem = ({}: Props) => {
  return (
    <Link
      href="/proposals/0"
      className="flex flex-row justify-between py-6 hover:cursor-pointer"
    >
      <div className="flex flex-col">
        <div className="text-xs text-gray-500 mb-1">Voter</div>
        <div className="font-light">0x23A3...A3F</div>
      </div>
      <div className="flex flex-col">
        <div className="text-xs text-gray-500 mb-1">Voting Power</div>
        <div className="font-light">1.2M Celo</div>
      </div>
      <div className="self-center">
        <ArrowLongRightIcon className="w-8 h-8 text-gray-500" />
      </div>
    </Link>
  );
};

export default VoteListItem;
