export const trimAddress = (addr: string) => {
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
};
//Launchpad Contract
// deploying "CircleLocker" (tx: 0x313f2170c01974866e821aab7207e917c5eafab84fe6c961f23e7f793c1f11a6)...: deployed at 0x52DC8f042B147186D43d32a93D952e1dB95B73Bc with 3468620 gas
// Deploy CirclePoolManager Proxy done -> 0xb92e7e982CBDa643d65233c979c3755917b5570e
// Deploy ParioPoolFactory Proxy done -> 0x3498C08A783E3b5a278E0916E399b23BDD1120A9
export const contract: Record<string | number, any> = {
  // 1: {
  //   poolfactory: "0x7A39Ad93BaBd8C8331E7c6D08Fc1b6A6daaDc4c3",
  //   poolmanager: "0x82d50343068175FF58Df2f80D0933856460F125f",
  //   routeraddress: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  //   multicallAddress: "0x5ba1e12693dc8f9c48aad8770482f4739beed696",
  //   multiSenderAddress: "0x52DC8f042B147186D43d32a93D952e1dB95B73Bc",
  //   lockAddress: "0x6BC2773a3CB24361F62917E787f4ec130387514E",
  //   routername: "UniSwap",
  //   subgraph:
  //     "https://api.thegraph.com/subgraphs/name/circle-launchpad/circle-eth",
  // },
  56: {
    airdropfactory: "0x932900C14f36755B026B5fB49896271bD250Ef33",
    airdropmanager: "0xF047C25e58f74f942710bB2d551Da5156C0f2E06",
    poolfactory: "0xB62730069C6dd5CA980830745c7A612d89D49216",
    poolmanager: "0x9d198FC7d7831C80d1DAC83e1B58127363Ef7a4B",
    routeraddress: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
    multicallAddress: "0x41263cba59eb80dc200f3e2544eda4ed6a90e76c",
    multiSenderAddress: "0x52DC8f042B147186D43d32a93D952e1dB95B73Bc",
    lockAddress: "0xd0685Fe0f989f87A088695864F4C2244eBF8d0F8",
    routername: "PancakeSwap",
    subgraph: "https://api.thegraph.com/subgraphs/name/parioteam/pario-b",
  },
  42161: {
    airdropfactory: "0xF047C25e58f74f942710bB2d551Da5156C0f2E06",
    airdropmanager: "0x7da8e7Ee1c4d2D4AC646a4c4b8136D1DC93c9513",
    poolfactory: "0xCfb98AAf6a7c3BCc1efd65fFBEb40880d78DaA7D",
    poolmanager: "0xe0b7EaDd0b900e67556Adb537674C74cCaf752da",
    routeraddress: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
    multicallAddress: "0x41263cba59eb80dc200f3e2544eda4ed6a90e76c",
    multiSenderAddress: "0x83EB1a5f4AC80a91308A3d11d54Feb9d9ef59B86",
    lockAddress: "0x568edf6C6aDCd4a96E63500b034e5A151A2E9889",
    routername: "PancakeSwap",
    subgraph: "https://api.thegraph.com/subgraphs/name/parioteam/pario-a",
  },
  80001: {
    airdropfactory: "0xA1a859a83AD71D3Dce5cB90065022a50959e85Fe",
    airdropmanager: "0x854E997e26d93b77971c48EF7cF002646624EB6C",
    poolfactory: "0xB62730069C6dd5CA980830745c7A612d89D49216",
    poolmanager: "0x9d198FC7d7831C80d1DAC83e1B58127363Ef7a4B",
    routeraddress: "0x8954AfA98594b838bda56FE4C12a09D7739D179b",
    multicallAddress: "0x08411ADd0b5AA8ee47563b146743C13b3556c9Cc",
    multiSenderAddress: "0xE9a5F4a4F7c0a5b503Ec2a64B80f25B1C3b5fB71",
    lockAddress: "0xd0685Fe0f989f87A088695864F4C2244eBF8d0F8",
    routername: "UniSwap",
    subgraph: "https://api.thegraph.com/subgraphs/name/parioteam/pario-k",
  },
  137: {
    airdropfactory: "0x932900C14f36755B026B5fB49896271bD250Ef33",
    airdropmanager: "0xF047C25e58f74f942710bB2d551Da5156C0f2E06",
    poolfactory: "0xE9a5F4a4F7c0a5b503Ec2a64B80f25B1C3b5fB71",
    poolmanager: "0x44eBBBdD2299f3229286287BdbE96B939381e5c3",
    routeraddress: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
    multicallAddress: "0x11ce4B23bD875D7F5C6a31084f55fDe1e9A87507",
    multiSenderAddress: "0x93917c96f25568BcCDb8cA27c85cEd805d0c93A7",
    lockAddress: "0x9d32D078Eb5e173FB2Fa457A3d7e68177AcF9a61",
    routername: "QuickSwap",
    subgraph: "https://api.thegraph.com/subgraphs/name/parioteam/pario-m",
  },
  default: {
    airdropfactory: "0x932900C14f36755B026B5fB49896271bD250Ef33",
    airdropmanager: "0xF047C25e58f74f942710bB2d551Da5156C0f2E06",
    poolfactory: "0xB62730069C6dd5CA980830745c7A612d89D49216",
    poolmanager: "0x9d198FC7d7831C80d1DAC83e1B58127363Ef7a4B",
    routeraddress: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
    multicallAddress: "0x41263cba59eb80dc200f3e2544eda4ed6a90e76c",
    multiSenderAddress: "0x52DC8f042B147186D43d32a93D952e1dB95B73Bc",
    lockAddress: "0xd0685Fe0f989f87A088695864F4C2244eBF8d0F8",
    routername: "PancakeSwap",
    subgraph: "https://api.thegraph.com/subgraphs/name/parioteam/pario-b",
  },
};
