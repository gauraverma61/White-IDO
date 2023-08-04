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
} from "../../common";

export interface IAirdropManagerInterface extends utils.Interface {
  functions: {
    "addPoolFactory(address)": FunctionFragment;
    "decreaseTotalValueLocked(uint256)": FunctionFragment;
    "increaseTotalValueLocked(uint256)": FunctionFragment;
    "isPoolGenerated(address)": FunctionFragment;
    "recordContribution(address,address)": FunctionFragment;
    "registerPool(address,address,address,uint8)": FunctionFragment;
    "removePoolForToken(address,address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "addPoolFactory"
      | "decreaseTotalValueLocked"
      | "increaseTotalValueLocked"
      | "isPoolGenerated"
      | "recordContribution"
      | "registerPool"
      | "removePoolForToken"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "addPoolFactory",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "decreaseTotalValueLocked",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "increaseTotalValueLocked",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "isPoolGenerated",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "recordContribution",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "registerPool",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "removePoolForToken",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(
    functionFragment: "addPoolFactory",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "decreaseTotalValueLocked",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "increaseTotalValueLocked",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isPoolGenerated",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "recordContribution",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "registerPool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removePoolForToken",
    data: BytesLike
  ): Result;

  events: {
    "ContributionUpdated(uint256)": EventFragment;
    "PoolForTokenCreated(address,address)": EventFragment;
    "PoolForTokenRemoved(address,address)": EventFragment;
    "TvlChanged(uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ContributionUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PoolForTokenCreated"): EventFragment;
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

export interface PoolForTokenCreatedEventObject {
  token: string;
  pool: string;
}
export type PoolForTokenCreatedEvent = TypedEvent<
  [string, string],
  PoolForTokenCreatedEventObject
>;

export type PoolForTokenCreatedEventFilter =
  TypedEventFilter<PoolForTokenCreatedEvent>;

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

export interface IAirdropManager extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IAirdropManagerInterface;

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
    addPoolFactory(
      factory: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    decreaseTotalValueLocked(
      value: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    increaseTotalValueLocked(
      value: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    isPoolGenerated(
      pool: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    recordContribution(
      user: PromiseOrValue<string>,
      pool: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    registerPool(
      pool: PromiseOrValue<string>,
      token: PromiseOrValue<string>,
      owner: PromiseOrValue<string>,
      version: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    removePoolForToken(
      token: PromiseOrValue<string>,
      pool: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  addPoolFactory(
    factory: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  decreaseTotalValueLocked(
    value: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  increaseTotalValueLocked(
    value: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  isPoolGenerated(
    pool: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  recordContribution(
    user: PromiseOrValue<string>,
    pool: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  registerPool(
    pool: PromiseOrValue<string>,
    token: PromiseOrValue<string>,
    owner: PromiseOrValue<string>,
    version: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  removePoolForToken(
    token: PromiseOrValue<string>,
    pool: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    addPoolFactory(
      factory: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    decreaseTotalValueLocked(
      value: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    increaseTotalValueLocked(
      value: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    isPoolGenerated(
      pool: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    recordContribution(
      user: PromiseOrValue<string>,
      pool: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    registerPool(
      pool: PromiseOrValue<string>,
      token: PromiseOrValue<string>,
      owner: PromiseOrValue<string>,
      version: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    removePoolForToken(
      token: PromiseOrValue<string>,
      pool: PromiseOrValue<string>,
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

    "PoolForTokenCreated(address,address)"(
      token?: PromiseOrValue<string> | null,
      pool?: null
    ): PoolForTokenCreatedEventFilter;
    PoolForTokenCreated(
      token?: PromiseOrValue<string> | null,
      pool?: null
    ): PoolForTokenCreatedEventFilter;

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
    addPoolFactory(
      factory: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    decreaseTotalValueLocked(
      value: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    increaseTotalValueLocked(
      value: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    isPoolGenerated(
      pool: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    recordContribution(
      user: PromiseOrValue<string>,
      pool: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    registerPool(
      pool: PromiseOrValue<string>,
      token: PromiseOrValue<string>,
      owner: PromiseOrValue<string>,
      version: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    removePoolForToken(
      token: PromiseOrValue<string>,
      pool: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addPoolFactory(
      factory: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    decreaseTotalValueLocked(
      value: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    increaseTotalValueLocked(
      value: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    isPoolGenerated(
      pool: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    recordContribution(
      user: PromiseOrValue<string>,
      pool: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    registerPool(
      pool: PromiseOrValue<string>,
      token: PromiseOrValue<string>,
      owner: PromiseOrValue<string>,
      version: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    removePoolForToken(
      token: PromiseOrValue<string>,
      pool: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}