import type { AppProps } from "next/app";
import LayoutContainer from "../src/components/Layouts/SiteLayout";
import UseWalletProviderWrapper from "@providers/UseWalletProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import { useSetDocumentTitle } from "@hooks/useSetDocumentTitle";
import "@spatie/media-library-pro-react-styles/dist/styles.css";
import "../styles/globals.scss";
import "react-datepicker/dist/react-datepicker.css";
import "react-tooltip/dist/react-tooltip.css";
import DataProviders from "@providers/DataProviders";
import SWRWrapper from "@providers/SWR";
import { ApiClient, ApiProvider } from "jsonapi-react";

const client = new ApiClient({ url: "/api/v1", schema: {} });
function MyApp({ Component, pageProps }: AppProps) {
  useSetDocumentTitle();
  return (
    <UseWalletProviderWrapper>
      <ApiProvider client={client}>
        <SWRWrapper>
          <ToastContainer />
          <LayoutContainer>
            <Head>
              <title>ParioPad</title>
              <link rel="shortcut icon" href="/favicon.ico" />
            </Head>
            <DataProviders>
              <Component {...pageProps} />
            </DataProviders>
          </LayoutContainer>
        </SWRWrapper>
      </ApiProvider>
    </UseWalletProviderWrapper>
  );
}

export default MyApp;
