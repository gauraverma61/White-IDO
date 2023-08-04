import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

const POLLING_INTERVAL = 12000;

enum Networks {
  MAINET = 56,
  TESTNET = 97,
}

const RPC_URLS: { [network in Networks]: any } = {
  [Networks.MAINET]: "https://bsc-dataseed.binance.org",
  [Networks.TESTNET]: "https://data-seed-prebsc-1-s1.binance.org:8545",
};

export const injected = new InjectedConnector({
  supportedChainIds: [Networks.MAINET, Networks.TESTNET],
});
