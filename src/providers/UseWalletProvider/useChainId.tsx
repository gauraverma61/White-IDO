import { useCallback, useEffect, useState } from "react";
import { useWallet } from "use-wallet";
import {
  SupportedNetworksArray,
  switchEthereumChain,
} from "@providers/UseWalletProvider/index";
import { useRouter } from "next/router";

const useChainId = () => {
  const [chainId, setChainId] = useState();
  const { status } = useWallet();
  const router = useRouter();

  const onChange = useCallback(
    async (chainId_: number) => {
      if (SupportedNetworksArray.includes(chainId_) && router.isReady) {
        await router.push(
          {
            query: {
              ...router.query,
              blockchain: chainId_,
            },
          },
          undefined,
          { shallow: true }
        );
      }
    },
    [router.isReady]
  );
  const fetchChainId = useCallback(
    async (onlyChange: boolean = true) => {
      if (["disconnected", "error"].includes(status)) {
        setChainId(undefined);
      } else {
        if (window.ethereum) {
          const ethereum = window.ethereum;
          let chainId_ = await ethereum.request({
            method: "eth_chainId",
          });
          chainId_ = parseInt(chainId_, 16);
          console.log("network changed");
          if (onlyChange) await onChange(chainId_);
          setChainId(chainId_);
        }
      }
    },
    [setChainId, status, router.isReady, onChange]
  );

  const { blockchain: defaultChainID } = router.query;

  useEffect(() => {
    if (router.isReady) {
      if (
        !defaultChainID &&
        chainId &&
        SupportedNetworksArray.includes(chainId)
      ) {
        router.push(
          {
            query: {
              ...router.query,
              blockchain: chainId,
            },
          },
          undefined,
          { shallow: true }
        );
        return;
      }
      if (
        defaultChainID != chainId &&
        !!defaultChainID &&
        SupportedNetworksArray.includes(Number(defaultChainID))
      ) {
        switchEthereumChain({ chainId: Number(defaultChainID) });
        router.push(
          {
            query: {
              ...router.query,
              blockchain: defaultChainID,
            },
          },
          undefined,
          { shallow: true }
        );
      }
    }
  }, [defaultChainID, router.isReady, chainId]);
  useEffect(() => {
    fetchChainId(false).catch((err) => console.error(err.stack));

    window?.ethereum?.on("networkChanged", fetchChainId);
    return () =>
      window?.ethereum?.removeListener("networkChanged", fetchChainId);
  }, [fetchChainId]);

  return chainId;
};

export default useChainId;
