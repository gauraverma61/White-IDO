import Multicall from "@dopex-io/web3-multicall";
import multiCallAbi from "../ABIs/MultiCall/MultiCall.json";
import { supportNetwork } from "@constants/network";
import { contract } from "@constants/constant";
import { getWeb3 } from "@constants/connectors";

export const MulticallContractWeb3 = (chainId?: number | string) => {
  let multicallAddress = contract[chainId || "default"]
    ? contract[chainId || "default"].multicallAddress
    : contract["default"].multicallAddress;

  let provider = supportNetwork[chainId || "default"]
    ? supportNetwork[chainId || "default"].rpc
    : supportNetwork["default"].rpc;

  return new Multicall({
    multicallAddress,
    provider,
  });
};

export const multiCallContractConnect = (chainId?: number | string) => {
  let multicallAddress = contract[chainId || "default"]
    ? contract[chainId || "default"].multicallAddress
    : contract["default"].multicallAddress;
  let web3 = getWeb3(chainId);
  // @ts-ignore
  return new web3.eth.Contract(multiCallAbi, multicallAddress);
};
