import { Alfajores, Celo } from "@celo/rainbowkit-celo/chains";
import celoGroups from "@celo/rainbowkit-celo/lists";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import Layout from "../components/Layout";
import "../styles/globals.css";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? ""; // get one at https://cloud.walletconnect.com/app

import localFont from "next/font/local";

export const alpina = localFont({
  src: [
    {
      path: "../public/fonts/GTAlpina/GT-Alpina-Standard-Bold-Italic.woff2",
      weight: "700",
    },
    {
      path: "../public/fonts/GTAlpina//GT-Alpina-Standard-Bold.woff2",
      weight: "700",
    },
    {
      path: "../public/fonts/GTAlpina/GT-Alpina-Standard-Light-Italic.woff2",
      weight: "300",
    },
    {
      path: "../public/fonts/GTAlpina/GT-Alpina-Standard-Light.woff2",
      weight: "300",
    },
    {
      path: "../public/fonts/GTAlpina/GT-Alpina-Standard-Medium-Italic.woff2",
      weight: "500",
    },
    {
      path: "../public/fonts/GTAlpina/GT-Alpina-Standard-Medium.woff2",
      weight: "500",
    },
    {
      path: "../public/fonts/GTAlpina/GT-Alpina-Standard-Regular-Italic.woff2",
      weight: "400",
    },
    {
      path: "../public/fonts/GTAlpina/GT-Alpina-Standard-Regular.woff2",
      weight: "400",
    },
    {
      path: "../public/fonts/GTAlpina/GT-Alpina-Standard-Thin-Italic.woff2",
      weight: "100",
    },
    {
      path: "../public/fonts/GTAlpina/GT-Alpina-Standard-Thin.woff2",
      weight: "100",
    },
  ],
  variable: "--font-alpina",
});

export const inter = localFont({
  src: [
    {
      path: "../public/fonts/Inter/Inter-Black.otf",
      weight: "900",
    },
    {
      path: "../public/fonts/Inter/Inter-BlackItalic.otf",
      weight: "900",
      style: "italic",
    },
    {
      path: "../public/fonts/Inter/Inter-Bold.otf",
      weight: "700",
    },
    {
      path: "../public/fonts/Inter/Inter-BoldItalic.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../public/fonts/Inter/Inter-ExtraBold.otf",
      weight: "800",
    },
    {
      path: "../public/fonts/Inter/Inter-ExtraBoldItalic.otf",
      weight: "800",
      style: "italic",
    },
    {
      path: "../public/fonts/Inter/Inter-ExtraLight.otf",
      weight: "200",
    },
    {
      path: "../public/fonts/Inter/Inter-ExtraLightItalic.otf",
      weight: "200",
      style: "italic",
    },
    {
      path: "../public/fonts/Inter/Inter-Italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/Inter/Inter-Light.otf",
      weight: "300",
    },
    {
      path: "../public/fonts/Inter/Inter-LightItalic.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../public/fonts/Inter/Inter-Medium.otf",
      weight: "500",
    },
    {
      path: "../public/fonts/Inter/Inter-MediumItalic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/fonts/Inter/Inter-Regular.otf",
      weight: "400",
    },
    {
      path: "../public/fonts/Inter/Inter-SemiBold.otf",
      weight: "600",
    },
    {
      path: "../public/fonts/Inter/Inter-SemiBoldItalic.otf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../public/fonts/Inter/Inter-Thin.otf",
      weight: "100",
    },
    {
      path: "../public/fonts/Inter/Inter-ThinItalic.otf",
      weight: "100",
      style: "italic",
    },
  ],
  variable: "--font-inter",
});

const { chains, publicClient } = configureChains(
  [Alfajores, Celo],
  [
    jsonRpcProvider({
      rpc: (chain) => ({ http: chain.rpcUrls.default.http[0] }),
    }),
  ]
);

const connectors = celoGroups({
  chains,
  projectId,
  appName: (typeof document === "object" && document.title) || "Your App Name",
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient: publicClient,
});

function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${alpina.variable} ${inter.variable} font-sans`}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains} coolMode={true}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </RainbowKitProvider>
      </WagmiConfig>
    </main>
  );
}

export default App;
