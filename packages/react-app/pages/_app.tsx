import { Alfajores, CeloProvider } from "@celo/react-celo";
import "@celo/react-celo/lib/styles.css";
import type { AppProps } from "next/app";
import "../styles/globals.css";

import Layout from "../components/Layout";

function App({ Component, pageProps }: AppProps) {
  return (
    <CeloProvider
      dapp={{
        name: "Celo Vote",
        description: "Voting dApp for Celo Governance",
        url: "https://example.com",
        icon: "https://example.com/favicon.ico",
        walletConnectProjectId: "f597db9e215becf1a4b24a7154c26fa2",
      }}
      defaultNetwork={Alfajores.name}
      connectModal={{
        providersOptions: { searchable: true },
      }}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </CeloProvider>
  );
}

export default App;
