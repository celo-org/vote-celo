import { Contract, providers } from "ethers";

export const readContract = (
  address: string,
  abi: any,
  functionName: string,
  args: any[]
) => {
  const provider = new providers.JsonRpcProvider("https://forno.celo.org");

  const contract = new Contract(address, abi, provider);

  return contract[functionName](...args);
};
