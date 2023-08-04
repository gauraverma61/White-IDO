import { DEFAULT_CHAIN_ID } from "@providers/UseWalletProvider";

export default function getProjectLink(
  poolAddress: string,
  poolType?: string,
  chainId?: number
): string {
  return poolType?.toLowerCase()?.includes("private") || poolType == "1"
    ? `private-sale/details/${poolAddress}?blockchain=${
        chainId || DEFAULT_CHAIN_ID
      }`
    : poolType?.toLowerCase()?.includes("fair") || poolType == "2"
    ? `fair-launch/details/${poolAddress}?blockchain=${
        chainId || DEFAULT_CHAIN_ID
      }`
    : `launchpad/details/${poolAddress}?blockchain=${
        chainId || DEFAULT_CHAIN_ID
      }`;
}
