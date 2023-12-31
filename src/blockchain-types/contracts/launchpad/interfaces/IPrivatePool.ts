/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../common";

export declare namespace LibTier {
  export type TierStruct = { endTime: PromiseOrValue<BigNumberish> };

  export type TierStructOutput = [BigNumber] & { endTime: BigNumber };
}

export declare namespace LibPresale {
  export type PrivateSaleStruct = {
    governance: PromiseOrValue<string>;
    tokenName: PromiseOrValue<string>;
    payment_currency: PromiseOrValue<string>;
    min_payment: PromiseOrValue<BigNumberish>;
    max_payment: PromiseOrValue<BigNumberish>;
    softCap: PromiseOrValue<BigNumberish>;
    hardCap: PromiseOrValue<BigNumberish>;
    startTime: PromiseOrValue<BigNumberish>;
    endTime: PromiseOrValue<BigNumberish>;
    feeIndex: PromiseOrValue<BigNumberish>;
    poolDetails: PromiseOrValue<string>;
    tgeBps: PromiseOrValue<BigNumberish>;
    cycle: PromiseOrValue<BigNumberish>;
    cycleBps: PromiseOrValue<BigNumberish>;
    useWhitelist: PromiseOrValue<boolean>;
    publicStartTime: PromiseOrValue<BigNumberish>;
    tier1: LibTier.TierStruct;
    tier2: LibTier.TierStruct;
  };

  export type PrivateSaleStructOutput = [
    string,
    string,
    string,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    string,
    BigNumber,
    BigNumber,
    BigNumber,
    boolean,
    BigNumber,
    LibTier.TierStructOutput,
    LibTier.TierStructOutput
  ] & {
    governance: string;
    tokenName: string;
    payment_currency: string;
    min_payment: BigNumber;
    max_payment: BigNumber;
    softCap: BigNumber;
    hardCap: BigNumber;
    startTime: BigNumber;
    endTime: BigNumber;
    feeIndex: BigNumber;
    poolDetails: string;
    tgeBps: BigNumber;
    cycle: BigNumber;
    cycleBps: BigNumber;
    useWhitelist: boolean;
    publicStartTime: BigNumber;
    tier1: LibTier.TierStructOutput;
    tier2: LibTier.TierStructOutput;
  };
}

export interface IPrivatePoolInterface extends utils.Interface {
  functions: {
    "emergencyWithdraw(address,uint256)": FunctionFragment;
    "emergencyWithdrawToken(address,address,uint256)": FunctionFragment;
    "getPoolInfo()": FunctionFragment;
    "initialize((address,string,address,uint256,uint256,uint256,uint256,uint256,uint256,uint256,string,uint256,uint256,uint256,bool,uint256,(uint256),(uint256)),uint256[2],address[3],uint8)": FunctionFragment;
    "setGovernance(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "emergencyWithdraw"
      | "emergencyWithdrawToken"
      | "getPoolInfo"
      | "initialize"
      | "setGovernance"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "emergencyWithdraw",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "emergencyWithdrawToken",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getPoolInfo",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [
      LibPresale.PrivateSaleStruct,
      [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>],
      [PromiseOrValue<string>, PromiseOrValue<string>, PromiseOrValue<string>],
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "setGovernance",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(
    functionFragment: "emergencyWithdraw",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "emergencyWithdrawToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPoolInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setGovernance",
    data: BytesLike
  ): Result;

  events: {};
}

export interface IPrivatePool extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IPrivatePoolInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    emergencyWithdraw(
      to_: PromiseOrValue<string>,
      amount_: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    emergencyWithdrawToken(
      payaddress: PromiseOrValue<string>,
      tokenAddress: PromiseOrValue<string>,
      tokens: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getPoolInfo(
      overrides?: CallOverrides
    ): Promise<[number[], BigNumber[], string, string]>;

    initialize(
      presale: LibPresale.PrivateSaleStruct,
      _fees: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>],
      _linkAddress: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<string>
      ],
      _version: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setGovernance(
      governance_: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  emergencyWithdraw(
    to_: PromiseOrValue<string>,
    amount_: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  emergencyWithdrawToken(
    payaddress: PromiseOrValue<string>,
    tokenAddress: PromiseOrValue<string>,
    tokens: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getPoolInfo(
    overrides?: CallOverrides
  ): Promise<[number[], BigNumber[], string, string]>;

  initialize(
    presale: LibPresale.PrivateSaleStruct,
    _fees: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>],
    _linkAddress: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>
    ],
    _version: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setGovernance(
    governance_: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    emergencyWithdraw(
      to_: PromiseOrValue<string>,
      amount_: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    emergencyWithdrawToken(
      payaddress: PromiseOrValue<string>,
      tokenAddress: PromiseOrValue<string>,
      tokens: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    getPoolInfo(
      overrides?: CallOverrides
    ): Promise<[number[], BigNumber[], string, string]>;

    initialize(
      presale: LibPresale.PrivateSaleStruct,
      _fees: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>],
      _linkAddress: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<string>
      ],
      _version: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setGovernance(
      governance_: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    emergencyWithdraw(
      to_: PromiseOrValue<string>,
      amount_: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    emergencyWithdrawToken(
      payaddress: PromiseOrValue<string>,
      tokenAddress: PromiseOrValue<string>,
      tokens: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getPoolInfo(overrides?: CallOverrides): Promise<BigNumber>;

    initialize(
      presale: LibPresale.PrivateSaleStruct,
      _fees: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>],
      _linkAddress: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<string>
      ],
      _version: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setGovernance(
      governance_: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    emergencyWithdraw(
      to_: PromiseOrValue<string>,
      amount_: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    emergencyWithdrawToken(
      payaddress: PromiseOrValue<string>,
      tokenAddress: PromiseOrValue<string>,
      tokens: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getPoolInfo(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    initialize(
      presale: LibPresale.PrivateSaleStruct,
      _fees: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>],
      _linkAddress: [
        PromiseOrValue<string>,
        PromiseOrValue<string>,
        PromiseOrValue<string>
      ],
      _version: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setGovernance(
      governance_: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
