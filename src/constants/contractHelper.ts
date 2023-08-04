import { ethers } from "ethers";
import { getWeb3 } from "./connectors";
import { AbiItem } from "web3-utils";
import { Web3Provider } from "@ethersproject/providers";
import tokenAbi from "../ABIs/ERC20/ERC20ABI.json";
import { toast } from "react-toastify";

export const getContract = (
  abi: any,
  address: string,
  library?: Web3Provider
) => {
  try {
    return new ethers.Contract(address, abi, library?.getSigner());
  } catch {
    return false;
  }
};

export const formatPrice = (num: string) => {
  return parseFloat(num).toFixed(3);
};

export const getWeb3Contract = (
  abi: AbiItem[] | AbiItem,
  address: string,
  chainId: number | string
) => {
  let web3 = getWeb3(chainId);
  return new web3.eth.Contract(abi, address);
};

export const mulDecimal = (amount: number | string, decimal: number) => {
  return ethers.utils.parseUnits(amount.toString(), decimal);
};

// (arg0: ethers.providers.Web3Provider | undefined, arg1: string | null, arg2: number | undefined, arg3: string, arg4: string, arg5: string) => boolean | PromiseLike<boolean>(library: ethers.providers.Web3Provider | undefined, account: string | null, chainId: number | undefined, token: string, spender: string, amount: string)
export const approveTokens = async ({
  library,
  account,
  chainId,
  token,
  spender,
  amount,
}: {
  library: ethers.providers.Web3Provider | undefined;
  account: string | null;
  chainId: number | undefined;
  token: string;
  spender: string;
  amount: string;
}): Promise<boolean> => {
  let success = false;
  if (account && library) {
    if (chainId) {
      try {
        if (token) {
          let tokenContract = getContract(tokenAbi, token, library);
          // @ts-ignore
          const allowance = await tokenContract.allowance(account, spender);
          if (allowance.gte(amount)) return true;
          // @ts-ignore
          let tx = await tokenContract.approve(spender, amount, {
            from: account,
          });
          await toast.promise(tx.wait, {
            pending: "Confirming Transaction...",
          });
          let web3 = getWeb3(chainId);
          const response = await web3.eth.getTransactionReceipt(tx.hash);
          if (response != null) {
            if (response.status) {
              success = true;
              toast.success("Transaction confirmed!");
            } else if (!response.status) {
              toast.error("Transaction failed!");
            } else {
              toast.error("Something went wrong!");
            }
          }
        } else {
          toast.error("Invalid address provided");
        }
      } catch (err: any) {
        toast.error(err.reason);
      }
    } else {
      toast.error("Please connect your wallet");
    }
  } else {
    toast.error("Please connect your wallet");
  }
  return success;
};
