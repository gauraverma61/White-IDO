import { fetcher } from "@helpers/gqlFetcher";
import React from "react";
import { SWRConfig } from "swr";
import useAuth from "@hooks/useAuth";

const SWRWrapper = ({ children }: { children: React.ReactNode }) => {
  const { chainId } = useAuth();
  const fetch = (query: any[], variables: any) =>
    fetcher(query, variables, chainId);
  return <SWRConfig value={{ fetcher: fetch }}>{children}</SWRConfig>;
};

export default SWRWrapper;
