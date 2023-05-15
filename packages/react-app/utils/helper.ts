import BigNumber from "bignumber.js";
import { utils } from "ethers";

export function truncateAddress(a?: string) {
  if (!a) {
    return "0x";
  }
  return `${a.slice(0, 8)}...${a.slice(36)}`;
}

export function truncate(a: string, length: number) {
  if (a.length > length) {
    return `${a.slice(0, length)}...`;
  }
  return a;
}

export function formatAmount(raw: string | BigNumber, decimalPlaces: number) {
  const wei = typeof raw === "string" ? raw : raw.toString();
  const ether = utils.formatUnits(wei, 18); // 18 is the standard number of decimals for Ether

  const [integer, decimals] = ether.split(".");

  if (decimals) {
    return `${integer}.${decimals.slice(0, decimalPlaces)}`;
  }
  return integer;
}

export function toWei(raw: string) {
  if (!raw) {
    return "0";
  }

  try {
    return utils.parseUnits(raw, 18).toString();
  } catch (_) {
    return "Invalid number";
  }
}
