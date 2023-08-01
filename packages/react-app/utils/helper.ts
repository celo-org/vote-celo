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

export function formatTimestamp(timestamp: number) {
  return new Date(timestamp).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function getTimeDifference(timestamp: number) {
  const now = new Date();
  const eventDate = new Date(timestamp);

  // time difference in milliseconds
  let diffInMilliSeconds = Math.abs(eventDate.getTime() - now.getTime());

  const isPast = eventDate.getTime() - now.getTime() < 0;

  // calculating days
  const days = Math.floor(diffInMilliSeconds / (1000 * 60 * 60 * 24));
  diffInMilliSeconds -= days * (1000 * 60 * 60 * 24);

  if (days > 0) {
    return isPast
      ? `Voting ended ${days} day(s) ago`
      : `Voting ends in ${days} day(s)`;
  }

  // calculating hours
  const hours = Math.floor((diffInMilliSeconds / (1000 * 60 * 60)) % 24);
  diffInMilliSeconds -= hours * (1000 * 60 * 60);

  if (hours > 0) {
    return isPast
      ? `Voting ended ${hours} hour(s) ago`
      : `Voting ends in ${hours} hour(s)`;
  }

  // calculating minutes
  const minutes = Math.floor((diffInMilliSeconds / (1000 * 60)) % 60);

  return isPast
    ? `Voting ended ${minutes} minute(s) ago`
    : `Voting ends in ${minutes} minute(s)`;
}

export function formatNumber(num: number) {
  if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + "M";
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(0) + "k";
  }
  if (num >= 100) {
    return num.toLocaleString(); // add commas as thousand separators
  }
  return num.toString(); // no formatting for numbers less than 100
}
