import Web3 from "web3";
import { supportNetwork } from "./network";

export const CHAIN_ID = 97;

export const getRpcUrl = () => {
  return {
    97: "https://data-seed-prebsc-1-s2.binance.org:8545/",
    56: "https://bsc-dataseed.binance.org/",
    3: "https://ropsten.infura.io/v3/84842078b09946638c03157f83405213",
  }[CHAIN_ID];
};

export const getWeb3 = (chainId?: string | number) => {
  const setRpc = supportNetwork[chainId || "default"]
    ? supportNetwork[chainId || "default"].rpc
    : supportNetwork["default"].rpc;
  return new Web3(setRpc);
};

export const supportChainId = Object.keys(supportNetwork).map(function (key) {
  return parseInt(key);
});
