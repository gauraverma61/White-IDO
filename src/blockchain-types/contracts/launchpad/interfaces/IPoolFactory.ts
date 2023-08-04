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
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../common";

export interface IPoolFactoryInterface extends utils.Interface {
  functions: {
    "addTopPool(address,uint256)": FunctionFragment;
    "decreaseTotalValueLocked(uint256)": FunctionFragment;
    "getEmergencyWithdrawFees()": FunctionFragment;
    "increaseTotalValueLocked(uint256)": FunctionFragment;
    "recordContribution(address,address)": FunctionFragment;
    "removePoolForToken(address,address)": FunctionFragment;
    "removePrivatePoolForToken(string,address)": FunctionFragment;
    "removeTopPool(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "addTopPool"
      | "decreaseTotalValueLocked"
      | "getEmergencyWithdrawFees"
      | "increaseTotalValueLocked"
      | "recordContribution"
      | "removePoolForToken"
      | "removePrivatePoolForToken"
      | "removeTopPool"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "addTopPool",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "decreaseTotalValueLocked",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getEmergencyWithdrawFees",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "increaseTotalValueLocked",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "recordContribution",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "removePoolForToken",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "removePrivatePoolForToken",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "removeTopPool",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(functionFragment: "addTopPool", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "decreaseTotalValueLocked",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getEmergencyWithdrawFees",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "increaseTotalValueLocked",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "recordContribution",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removePoolForToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removePrivatePoolForToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeTopPool",
    data: BytesLike
  ): Result;

  events: {
    "ContributionUpdated(uint256)": EventFragment;
    "PoolForTokenRemoved(address,address)": EventFragment;
    "TvlChanged(uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ContributionUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PoolForTokenRemoved"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TvlChanged"): EventFragment;
}

export interface ContributionUpdatedEventObject {
  totalParticipations: BigNumber;
}
export type ContributionUpdatedEvent = TypedEvent<
  [BigNumber],
  ContributionUpdatedEventObject
>;

export type ContributionUpdatedEventFilter =
  TypedEventFilter<ContributionUpdatedEvent>;

export interface PoolForTokenRemovedEventObject {
  token: string;
  pool: string;
}
export type PoolForTokenRemovedEvent = TypedEvent<
  [string, string],
  PoolForTokenRemovedEventObject
>;

export type PoolForTokenRemovedEventFilter =
  TypedEventFilter<PoolForTokenRemovedEvent>;

export interface TvlChangedEventObject {
  totalLocked: BigNumber;
  totalRaised: BigNumber;
}
export type TvlChangedEvent = TypedEvent<
  [BigNumber, BigNumber],
  TvlChangedEventObject
>;

export type TvlChangedEventFilter = TypedEventFilter<TvlChangedEvent>;

export interface IPoolFactory extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IPoolFactoryInterface;

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
    addTopPool(
      poolAddress: PromiseOrValue<string>,
      raisedAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    decreaseTotalValueLocked(
      value: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getEmergencyWithdrawFees(overrides?: CallOverrides): Promise<[BigNumber]>;

    increaseTotalValueLocked(
      value: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    recordContribution(
      user: PromiseOrValue<string>,
      pool: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    removePoolForToken(
      token: PromiseOrValue<string>,
      pool: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    removePrivatePoolForToken(
      tokenName: PromiseOrValue<string>,
      pool: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    removeTopPool(
      poolAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  addTopPool(
    poolAddress: PromiseOrValue<string>,
    raisedAmount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  decreaseTotalValueLocked(
    value: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getEmergencyWithdrawFees(overrides?: CallOverrides): Promise<BigNumber>;

  increaseTotalValueLocked(
    value: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  recordContribution(
    user: PromiseOrValue<string>,
    pool: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  removePoolForToken(
    token: PromiseOrValue<string>,
    pool: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  removePrivatePoolForToken(
    tokenName: PromiseOrValue<string>,
    pool: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  removeTopPool(
    poolAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    addTopPool(
      poolAddress: PromiseOrValue<string>,
      raisedAmount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    decreaseTotalValueLocked(
      value: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    getEmergencyWithdrawFees(overrides?: CallOverrides): Promise<BigNumber>;

    increaseTotalValueLocked(
      value: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    recordContribution(
      user: PromiseOrValue<string>,
      pool: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    removePoolForToken(
      token: PromiseOrValue<string>,
      pool: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    removePrivatePoolForToken(
      tokenName: PromiseOrValue<string>,
      pool: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    removeTopPool(
      poolAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "ContributionUpdated(uint256)"(
      totalParticipations?: null
    ): ContributionUpdatedEventFilter;
    ContributionUpdated(
      totalParticipations?: null
    ): ContributionUpdatedEventFilter;

    "PoolForTokenRemoved(address,address)"(
      token?: PromiseOrValue<string> | null,
      pool?: null
    ): PoolForTokenRemovedEventFilter;
    PoolForTokenRemoved(
      token?: PromiseOrValue<string> | null,
      pool?: null
    ): PoolForTokenRemovedEventFilter;

    "TvlChanged(uint256,uint256)"(
      totalLocked?: null,
      totalRaised?: null
    ): TvlChangedEventFilter;
    TvlChanged(totalLocked?: null, totalRaised?: null): TvlChangedEventFilter;
  };

  estimateGas: {
    addTopPool(
      poolAddress: PromiseOrValue<string>,
      raisedAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    decreaseTotalValueLocked(
      value: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getEmergencyWithdrawFees(overrides?: CallOverrides): Promise<BigNumber>;

    increaseTotalValueLocked(
      value: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    recordContribution(
      user: PromiseOrValue<string>,
      pool: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    removePoolForToken(
      token: PromiseOrValue<string>,
      pool: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    removePrivatePoolForToken(
      tokenName: PromiseOrValue<string>,
      pool: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    removeTopPool(
      poolAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addTopPool(
      poolAddress: PromiseOrValue<string>,
      raisedAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    decreaseTotalValueLocked(
      value: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getEmergencyWithdrawFees(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    increaseTotalValueLocked(
      value: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    recordContribution(
      user: PromiseOrValue<string>,
      pool: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    removePoolForToken(
      token: PromiseOrValue<string>,
      pool: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    removePrivatePoolForToken(
      tokenName: PromiseOrValue<string>,
      pool: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    removeTopPool(
      poolAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
