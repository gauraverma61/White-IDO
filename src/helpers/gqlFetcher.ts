import { request } from "graphql-request";
import { contract } from "@constants/constant";
export const fetcher = (
  query: any,
  variables: any,
  chainId: number | undefined
) => {
  console.log("fetcher chainId", chainId);
  const url = contract[chainId || "default"]?.subgraph;
  return request(url, query, variables);
};
