import { ContractKit } from "@celo/contractkit/lib/";
import { AddressRegistry } from "@celo/contractkit/lib/address-registry";
import { WrapperCache } from "@celo/contractkit/lib/contract-cache";
import { Web3ContractCache } from "@celo/contractkit/lib/web3-contract-cache";

// This creates a contracts cache exactly the same as contractkit.contracts
export function fullContractsCache(
  connection: ContractKit["connection"],
  registry: AddressRegistry
) {
  const web3Contracts = new Web3ContractCache(registry);
  return new WrapperCache(connection, web3Contracts, registry);
}
