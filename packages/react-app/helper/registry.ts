import { registryABI } from "@/utils/Celo";
import { Contract, providers } from "ethers";

export const getAddressFromRegistry = async (module: string) => {
  try {
    const REGISTRY_CONTRACT_ADDRESS =
      "0x000000000000000000000000000000000000ce10";
    const provider = new providers.JsonRpcProvider("https://forno.celo.org");

    const contract = new Contract(
      REGISTRY_CONTRACT_ADDRESS,
      registryABI,
      provider
    );
    const governanceAddress = await contract.getAddressForString(module);

    if (governanceAddress) {
      return governanceAddress;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
