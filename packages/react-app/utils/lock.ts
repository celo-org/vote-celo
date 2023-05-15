import { defaultBalances } from "@/pages/lock";
import { ContractKit } from "@celo/contractkit";
import { toWei } from "./helper";
import { AccountSummary, Balance } from "./types/lock.type";

export const fetchLockedSummary = async (
  kit: ContractKit,
  address: string | undefined
): Promise<AccountSummary | undefined> => {
  if (!address) {
    return;
  }
  const locked = await kit.contracts.getLockedGold();
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
  kit: ContractKit,
  address: string | undefined
): Promise<Balance> => {
  if (!address) {
    return defaultBalances;
  }

  const [celoContract, cusdContract] = await Promise.all([
    kit.contracts.getGoldToken(),
    kit.contracts.getStableToken(),
  ]);

  const [celo, cusd] = await Promise.all([
    celoContract.balanceOf(address),
    cusdContract.balanceOf(address),
  ]);
  console.log("celo", celo);
  console.log("cusd", cusd);
  return {
    celo,
    cusd,
  };
};

export const lockCelo = async (kit: ContractKit, lockAmount: string) => {
  try {
    const lockedCelo = await kit.contracts.getLockedGold();
    console.log("lockedCelo", lockedCelo);
    const txObj = lockedCelo.lock();
    console.log("txObj", txObj);
    const txResult = await txObj.send({ value: toWei(lockAmount) });
    const txHash = await txResult.getHash();
    console.log("txHash", txHash);
    const txReceipt = await txResult.waitReceipt();
    console.log("txReceipt", txReceipt);
    console.log("CELO locked");
  } catch (e) {
    console.log(e);
  }
};
