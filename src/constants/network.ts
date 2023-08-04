export interface ISupportedNetwork {
  name: string;
  chainId: number;
  rpc: string;
  image: string;
  symbol: string;
  explorer: string;
  decimals: number;
}

export const supportNetwork: Record<number | string, ISupportedNetwork> = {
  80001: {
    name: "Polygon Mumbai",
    chainId: 80001,
    rpc: "https://rpc.ankr.com/polygon_mumbai",
    image: "",
    symbol: "MATIC",
    explorer: "https://mumbai.polygonscan.com",
    decimals: 18,
  },
  42161: {
    name: "Arbitrum One",
    chainId: 42161,
    rpc: "https://arb1.arbitrum.io/rpc",
    image: "",
    symbol: "ETH",
    explorer: "https://arbiscan.io",
    decimals: 18,
  },
  137: {
    name: "Polygon",
    chainId: 137,
    rpc: "https://rpc.ankr.com/polygon",
    image: "",
    symbol: "MATIC",
    explorer: "https://polygonscan.com",
    decimals: 18,
  },
  56: {
    name: "BSC",
    chainId: 56,
    rpc: "https://rpc.ankr.com/bsc",
    image: "",
    symbol: "BNB",
    explorer: "https://bscscan.com",
    decimals: 18,
  },
  1: {
    name: "Ethereum Mainnet",
    chainId: 1,
    rpc: "https://rpc.ankr.com/eth",
    image: "",
    symbol: "ETH",
    explorer: "https://etherscan.io",
    decimals: 18,
  },
  default: {
    name: "BSC",
    chainId: 56,
    rpc: "https://rpc.ankr.com/bsc",
    image: "",
    symbol: "BNB",
    explorer: "https://bscscan.com",
    decimals: 18,
  },
};
export const RPC_URLS = {
  // 56: "https://bsc-dataseed1.defibit.io/",
  // 97: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  137: "https://rpc.ankr.com/polygon",
  80001: "https://rpc.ankr.com/polygon_mumbai",
};
