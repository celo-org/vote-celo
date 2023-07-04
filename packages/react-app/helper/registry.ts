import { registryABI } from "@/utils/Celo";
import { readContracts } from "wagmi";

export const getAddressFromRegistry = async (module: string) => {
  try {
    const REGISTRY_CONTRACT_ADDRESS =
      "0x000000000000000000000000000000000000ce10";

    const governanceAddress = (
      await readContracts({
        contracts: [
          {
            address: REGISTRY_CONTRACT_ADDRESS,
            abi: registryABI,
            functionName: "getAddressForString",
            args: [module],
          },
        ],
      })
    )[0];
    if (governanceAddress.result) {
      return governanceAddress.result;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
