import { supportNetwork } from "@constants/network";

export const getExplorerLink = (
  address: string,
  chainId?: number,
  type: "address" | "tx" = "address"
) => {
  const explorerBaseUrl = supportNetwork[chainId || "default"]?.explorer;

  switch (type) {
    case "address":
      return `${explorerBaseUrl}/address/${address}`;
    case "tx":
      return `${explorerBaseUrl}/tx/${address}`;
    default:
      return `${explorerBaseUrl}/address/${address}`;
  }
};
