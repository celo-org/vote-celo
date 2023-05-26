export const TESTNET_API_ENDPOINT = "http://localhost:3000";
export const MAINNET_API_ENDPOINT = "http://localhost:3000";
export const LOCAL_API_ENDPOINT = "http://localhost:3000";

export const TESTNET_RPC_ENDPOINT = "https://alfajores-forno.celo-testnet.org";
export const MAINNET_RPC_ENDPOINT = "https://forno.celo.org";

const getEnvConfig = (): {
  apiEndpoint: string;
  rpcEndpoint: string;
} => {
  switch (NETWORK_MODE) {
    case "mainnet":
      return {
        apiEndpoint: MAINNET_API_ENDPOINT,
        rpcEndpoint: MAINNET_RPC_ENDPOINT,
      };
    case "local":
      return {
        apiEndpoint: LOCAL_API_ENDPOINT,
        rpcEndpoint: TESTNET_RPC_ENDPOINT,
      };
    default:
      return {
        apiEndpoint: TESTNET_API_ENDPOINT,
        rpcEndpoint: TESTNET_RPC_ENDPOINT,
      };
  }
};

export const NETWORK_MODE = process.env.NEXT_PUBLIC_NETWORK_MODE || "testnet";

export const API_ENDPOINT = getEnvConfig().apiEndpoint;
export const RPC_ENDPOINT = getEnvConfig().rpcEndpoint;
