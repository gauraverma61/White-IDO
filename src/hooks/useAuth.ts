import { useWallet } from "use-wallet";
import { ethers } from "ethers";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import {
  SupportedNetworksArray,
  switchEthereumChain,
} from "@providers/UseWalletProvider";

const useAuth = () => {
  const wallet = useWallet();
  const router = useRouter();
  const { blockchain: defaultChainID } = router.query;
  const activate = (connector: string) => wallet.connect(connector);
  const debugAccount = useMemo(() => {
    if (typeof window !== "undefined") {
      return localStorage?.getItem("debug_account");
    }
  }, []);

  const finalChainId = useMemo(() => {
    if (defaultChainID) {
      return Number(defaultChainID);
    }
    return wallet.status === "connected" &&
      wallet.account &&
      wallet.chainId &&
      SupportedNetworksArray.includes(wallet.chainId)
      ? wallet.chainId
      : undefined;
  }, [defaultChainID, wallet.account, wallet.chainId, wallet.status]);
  return {
    ethereum: wallet.ethereum,
    chainId: finalChainId,
    balance: wallet.balance,
    balance_formatted: parseInt(wallet.balance || "0") / 10 ** 18,
    connect: () => activate("injected"),
    loading: wallet.status === "connecting",
    account: debugAccount || wallet.account,
    disconnect: wallet.reset,
    isLoggedIn: wallet.status === "connected" && wallet.chainId == finalChainId,
    library: wallet.ethereum
      ? new ethers.providers.Web3Provider(wallet.ethereum)
      : undefined,
  };
};

export default useAuth;
