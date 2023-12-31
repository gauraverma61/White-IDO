/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IPool,
  IPoolInterface,
} from "../../../../contracts/launchpad/interfaces/IPool";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "payaddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokens",
        type: "uint256",
      },
    ],
    name: "emergencyWithdrawToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getPoolInfo",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint8[]",
        name: "",
        type: "uint8[]",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "router",
            type: "address",
          },
          {
            internalType: "address",
            name: "governance",
            type: "address",
          },
          {
            internalType: "address",
            name: "token",
            type: "address",
          },
          {
            internalType: "address",
            name: "payment_currency",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "rate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "min_payment",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "max_payment",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "softCap",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "hardCap",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "startTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "endTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "feeIndex",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "liquidityListingRate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "liquidityUnlockTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "liquidityLockDays",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "liquidityPercent",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "refundType",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "poolDetails",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "tgeBps",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "cycle",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "cycleBps",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "listingType",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "useWhitelist",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "publicStartTime",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "endTime",
                type: "uint256",
              },
            ],
            internalType: "struct LibTier.Tier",
            name: "tier1",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "endTime",
                type: "uint256",
              },
            ],
            internalType: "struct LibTier.Tier",
            name: "tier2",
            type: "tuple",
          },
        ],
        internalType: "struct LibPresale.Presale",
        name: "presale",
        type: "tuple",
      },
      {
        internalType: "uint256[2]",
        name: "_fees",
        type: "uint256[2]",
      },
      {
        internalType: "address[3]",
        name: "_linkAddress",
        type: "address[3]",
      },
      {
        internalType: "uint8",
        name: "_version",
        type: "uint8",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "governance_",
        type: "address",
      },
    ],
    name: "setGovernance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IPool__factory {
  static readonly abi = _abi;
  static createInterface(): IPoolInterface {
    return new utils.Interface(_abi) as IPoolInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): IPool {
    return new Contract(address, _abi, signerOrProvider) as IPool;
  }
}
