import useChainId from "@providers/UseWalletProvider/useChainId";
import { useWallet, UseWalletProvider } from "use-wallet";
import { useEffect } from "react";
import { supportNetwork } from "@constants/network";

export enum Networks {
  BSC = 56,
  ARB = 42161,
  // ETH = 1,
  MAINET = 137,
  MUMBAI = 80001,
}

export const DEFAULT_CHAIN_ID = Networks.BSC;
export const SupportedNetworksArray = [
  Networks.ARB,
  Networks.MAINET,
  Networks.MUMBAI,
  // Networks.ETH,
  Networks.BSC,
];

export async function switchEthereumChain({ chainId }: { chainId: number }) {
  if (!window.ethereum) return;
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  } catch (e: any) {
    if (e.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${chainId.toString(16)}`,
              chainName: supportNetwork[chainId].name,
              nativeCurrency: {
                name: supportNetwork[chainId].name,
                symbol: supportNetwork[chainId].symbol, // 2-6 characters long
                decimals: supportNetwork[chainId].decimals,
              },
              blockExplorerUrls: [supportNetwork[chainId].explorer],
              rpcUrls: [supportNetwork[chainId].rpc],
            },
          ],
        });
      } catch (addError) {
        console.error(addError);
        throw addError;
      }
    } else {
      throw e;
    }
    // console.error(e)
  }
}

const Wallet = ({ children }: any) => {
  const chainId = useChainId();
  console.log("Wallet chainId", chainId);
  const { reset } = useWallet();

  useEffect(() => {
    if (!!chainId) {
      if (!SupportedNetworksArray.includes(chainId)) {
        console.log("Wallet chainId whyyyy", chainId);
        switchEthereumChain({
          chainId: supportNetwork["default"].chainId,
        }).catch((e) => {
          console.log("ERROR", e);
          reset();
        });
      }
    }
    // Do not add reset ad dependency, it causes double requests
  }, [chainId]);
  return children;
};

const UseWalletProviderWrapper = (props: any) => {
  return (
    <UseWalletProvider
      autoConnect={true}
      connectors={{
        injects: {
          chainId: SupportedNetworksArray,
        },
        frame: {
          chainId: SupportedNetworksArray,
        },
      }}
      {...props}>
      <Wallet>{props.children}</Wallet>
    </UseWalletProvider>
  );
};

export default UseWalletProviderWrapper;
