import { defaultBalances } from "@/pages/lock";
import { WrapperCache } from "@celo/contractkit/lib/contract-cache";
import { AccountSummary, Balance } from "./types/lock.type";

export const fetchLockedSummary = async (
  contractsCache: WrapperCache,
  address: string | undefined
): Promise<AccountSummary | undefined> => {
  if (!address) {
    return;
  }
  const locked = await contractsCache.getLockedGold();
  try {
    var accountTotalLockedGold = await locked.getAccountTotalLockedGold(
      address
    );
    var accountNonvotingLockedGold = await locked.getAccountNonvotingLockedGold(
      address
    );
    return {
      lockedGold: {
        total: accountTotalLockedGold,
        nonvoting: accountNonvotingLockedGold,
      },
    };
  } catch (_) {
    return;
  }
};

export const fetchBalances = async (
  contractsCache: WrapperCache,
  address: string | undefined
): Promise<Balance> => {
  if (!address) {
    return defaultBalances;
  }

  const [celoContract, cusdContract] = await Promise.all([
    contractsCache.getGoldToken(),
    contractsCache.getStableToken(),
  ]);

  const [celo, cusd] = await Promise.all([
    celoContract.balanceOf(address),
    cusdContract.balanceOf(address),
  ]);
  return {
    celo,
    cusd,
  };
};

export const lockCelo = async (
  contractsCache: WrapperCache,
  lockAmount: string,
  address: string | undefined
) => {
  try {
    const lockedCelo = await contractsCache.getLockedGold();
    const txObj = lockedCelo.lock();
    const txResult = await txObj.send({
      value: lockAmount,
    });
    const txHash = await txResult.getHash();
    const txReceipt = await txResult.waitReceipt();
  } catch (e) {
    console.log(e);
  }
};
