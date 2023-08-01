import {
  formatAmount,
  formatNumber,
  formatTimestamp,
  getTimeDifference,
} from "@/utils/helper";
import { Proposal } from "@/utils/types/proposal.type";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
import { BigNumber } from "ethers";
import { useRouter } from "next/router";
import Badge from "../Badge";

type Props = {
  proposal: Proposal;
};

const ProposalListItem = ({ proposal }: Props) => {
  const router = useRouter();
  return (
    <tr
      className="bg-gypsum py-8 cursor-pointer"
      onClick={() => {
        router.push(`/proposals/${proposal.proposalId}`);
      }}
    >
      <td>
        <div className="flex flex-col grow">
          <div className="text-xs text-gray-500 mb-1">
            Proposal: #{proposal.proposalId} | By:{" "}
            {proposal.proposalMetadata.proposer.slice(0, 6)}...
            {proposal.proposalMetadata.proposer.slice(-4)}
          </div>
          <div className="font-light text-base">
            {proposal.proposalData?.title}
          </div>
        </div>
      </td>
      <td>
        <div className="flex flex-col">
          <div className="text-xs text-gray-500 mb-1">Date Created</div>
          <div className="font-light text-base">
            {formatTimestamp(
              BigNumber.from(proposal.proposalMetadata.timestamp).toNumber() *
                1000
            )}
          </div>
        </div>
      </td>
      <td>
        <div className="flex flex-col">
          <div className="text-xs text-gray-500 mb-1">Status</div>
          <div className="font-light">
            <Badge value={proposal.proposalStage} />
          </div>
        </div>
      </td>
      <td className="py-4">
        <div className="flex flex-col">
          <div className="flex flex-col items-start justify-start">
            <div className="text-xs text-gray-500 mb-1">
              {getTimeDifference(
                BigNumber.from(
                  proposal.proposalSchedule.Expiration
                ).toNumber() * 1000
              )}
            </div>
            <div className="font-light">
              {formatNumber(
                parseFloat(
                  formatAmount(
                    BigNumber.from(
                      proposal.proposalRecord?.votes?.Yes
                    ).toString(),
                    2
                  )
                )
              )}{" "}
              CELO For
            </div>
            <div className="font-light">
              {formatNumber(
                parseFloat(
                  formatAmount(
                    BigNumber.from(
                      proposal.proposalRecord?.votes?.No
                    ).toString(),
                    2
                  )
                )
              )}{" "}
              CELO Against
            </div>
            <div className="font-light">
              {formatNumber(
                parseFloat(
                  formatAmount(
                    BigNumber.from(
                      proposal.proposalRecord?.votes?.Abstain
                    ).toString(),
                    2
                  )
                )
              )}{" "}
              CELO Abstain
            </div>
          </div>
        </div>
      </td>
      <td className="self-center">
        <ArrowLongRightIcon className="w-8 h-8 text-gray-500" />
      </td>
    </tr>
  );
};

export default ProposalListItem;
