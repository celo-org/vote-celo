import { PendingWithdrawal } from "@celo/contractkit/lib/wrappers/LockedGold";
import BigNumber from "bignumber.js";

export interface Balance {
  celo: BigNumber;
  cusd: BigNumber;
}

export interface AccountSummary {
  lockedGold: {
    total: BigNumber;
    nonvoting: BigNumber;
    requirement?: BigNumber;
  };
  pendingWithdrawals?: PendingWithdrawal[];
}
