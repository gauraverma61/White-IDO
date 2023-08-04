import { useEffect, useState } from "react";
import { supportNetwork } from "@constants/network";
import useAuth from "@hooks/useAuth";
import useSWR from "swr";
import {
  PoolDataResponse,
  PoolsDataResponse,
} from "@components/LaunchPad/Details/hooks/IPool.td";
import { KeyedMutator } from "swr/dist/types";

export interface IPoolData {
  id: string;
  addresses: null;
  logo: string;
  banner: string;
  cycle: number;
  cycleBps: number;
  description: null | string;
  endTime: number;
  feeIndex: number;
  finalFee: null;
  governance: string;
  hardCap: number;
  liquidityListingRate: number;
  liquidityLockDays: number;
  liquidityPercent: number;
  liquidityUnlockTime: number;
  max_payment: number;
  min_payment: number;
  payment_currency?: Token;
  poolDetails: IPoolDetails;
  poolState: string;
  rate: number;
  refundType: string;
  router?: string;
  softCap: number;
  startTime: number;
  tgeBps: number;
  tier1EndTime: number;
  tier2EndTime: number;
  publicStartTime: number;
  token?: Token;
  totalRaised: number;
  totalVolume: number;
  type: string;
  useWhitelisting: boolean;
  listingType: string;
  actualRaised: null;
  contributors: Contributor[];
  myContribution?: Contributor;
}

export interface IPoolDetails {
  logo: string;
  banner: string;
  title: string;
  description: string | null;
  socials: ISocials;
}

export interface ISocials {
  website: string;
  facebook: string;
  twitter: string;
  instagram: string;
  github: string;
  telegram: string;
  discord: string;
  reddit: string;
}

export interface Contributor {
  claimed: number;
  contribution: number;
  id: string;
  address: string;
  purchased: number;
  tier: number;
  whitelisted: boolean;
}

export interface Token {
  decimals: number;
  id: string;
  name: string;
  symbol: string;
  totalSupply: number;
  totalRaised?: number;
}

export const usePool = (update: {
  address: string;
}): {
  stats?: IPoolData;
  error: any;
  isLoading: boolean;
  refetch: KeyedMutator<PoolDataResponse>;
} => {
  const { chainId, account } = useAuth();
  const { address } = update;
  console.log("chainId", chainId);
  const {
    data: newData,
    error,
    isValidating,
    mutate,
  } = useSWR<PoolDataResponse>(
    chainId
      ? `{
  pool(id : "${address}") {
    id
    addresses
    logo
    banner
    cycle
    cycleBps
    description
    endTime
    feeIndex
    finalFee
    governance
    hardCap
    liquidityListingRate
    liquidityLockDays
    liquidityPercent
    liquidityUnlockTime
    max_payment
    min_payment
    payment_currency {
      decimals
      id
      name
      symbol
      totalSupply
    }
    poolDetails
    poolState
    rate
    refundType
    router
    socials
    softCap
    startTime
    tgeBps
    tier1EndTime
    tier2EndTime
    token {
      decimals
      id
      name
      symbol
      totalSupply
    }
    totalRaised
    totalVolume
    type
    listingType
    useWhitelisting
    listingType
    actualRaised
    publicStartTime
    contributors(where: {address: "${account?.toLowerCase()}", pool: "${address}"}, first: 1) {
      claimed
      contribution
      id
      address
      purchased
      tier
      whitelisted
    }
  }
}`
      : undefined,
    {
      refreshInterval: 20 * 1000,
      revalidateOnReconnect: true,
      refreshWhenHidden: true,
      refreshWhenOffline: false,
      revalidateOnFocus: false,
    }
  );

  const [stats, setStats] = useState<IPoolData | undefined>();

  useEffect(() => {
    if (newData?.pool) {
      const { pool } = newData;
      console.log(
        "formated",
        formatPoolResponseData(pool, chainId, account).myContribution,
        pool.contributors,
        account
      );
      setStats(formatPoolResponseData(pool, chainId, account));
    }
  }, [newData]);
  return {
    stats,
    error,
    isLoading: isValidating,
    refetch: mutate,
  };
};

export const usePools = (update: {
  first: number;
  skip: number;
  orderBy: string;
  orderDirection: string;
  where: {
    type?: string;
    type_in?: string[];
    id_in?: string[];
    poolState_in?: string[];
    startTime_gt?: string;
    startTime_lt?: string;
    endTime_gt?: string;
    endTime_lt?: string;
    poolDetails_contains_nocase?: string;
    contributors_?: {
      id?: string;
      address?: string;
    };
    poolState_not?: string;
  };
  where_contributor: {
    id?: string;
    address?: string;
  };
}): {
  stats?: IPoolData[];
  error: any;
  isLoading: boolean;
  refetch: KeyedMutator<PoolsDataResponse>;
} => {
  const context = useAuth();
  const { chainId, account } = context;

  const {
    data: newData,
    error,
    isValidating,
    mutate,
  } = useSWR<PoolsDataResponse>(
    chainId
      ? [
          `query PoolsData($first: Int, $skip: Int, $orderBy: Pool_orderBy, $orderDirection: OrderDirection, $where: Pool_filter) {
  pools(
    first: $first
    skip: $skip
    orderBy: $orderBy
    orderDirection: $orderDirection
    where: $where
  ) {
    id
    addresses
    logo
    banner
    cycle
    cycleBps
    description
    endTime
    feeIndex
    finalFee
    governance
    hardCap
    liquidityListingRate
    liquidityLockDays
    liquidityPercent
    liquidityUnlockTime
    max_payment
    min_payment
    payment_currency {
      decimals
      id
      name
      symbol
      totalSupply
    }
    poolDetails
    poolState
    rate
    refundType
    router
    socials
    softCap
    startTime
    tgeBps
    tier1EndTime
    tier2EndTime
    token {
      decimals
      id
      name
      symbol
      totalSupply
    }
    totalRaised
    totalVolume
    type
    useWhitelisting
    listingType
    actualRaised
    publicStartTime
    contributors(where: $where_contributor, first: 1) {
      claimed
      contribution
      id
      address
      purchased
      tier
      whitelisted
    }
  }
}`,
          update,
        ]
      : undefined,
    {
      refreshInterval: 20 * 1000,
      revalidateOnReconnect: true,
      refreshWhenHidden: true,
      refreshWhenOffline: false,
      revalidateOnFocus: false,
    }
  );

  const [stats, setStats] = useState<IPoolData[] | undefined>();

  useEffect(() => {
    if (newData?.pools) {
      const { pools } = newData;
      setStats(
        pools.map((pool) => formatPoolResponseData(pool, chainId, account))
      );
    }
  }, [newData]);
  return {
    stats,
    error,
    isLoading: isValidating,
    refetch: mutate,
  };
};

export const formatPoolResponseData = (
  pool: PoolDataResponse["pool"],
  chainId?: number | string,
  account?: string | null
): IPoolData => {
  const payment_currencyDecimals =
    pool.payment_currency.name === ""
      ? supportNetwork[chainId || "default"].decimals
      : Number(pool.payment_currency.decimals);
  const tokenDecimals =
    pool?.token?.name === "" || !pool?.token?.name
      ? 18
      : Number(pool?.token?.decimals);
  let tier = {
    tier1EndTime: 0,
    tier2EndTime: 0,
  };
  if (pool.useWhitelisting) {
    tier = {
      tier1EndTime: Number(pool.tier1EndTime || 0),
      tier2EndTime: Number(pool.tier2EndTime || 0),
    };
  }
  return {
    ...tier,
    publicStartTime: Number(pool.publicStartTime),
    actualRaised: pool.actualRaised,
    addresses: pool.addresses,
    banner: pool.banner,
    contributors: pool.contributors.map((con) => ({
      claimed: Number(con.claimed) / Math.pow(10, tokenDecimals),
      contribution:
        Number(con.contribution) / Math.pow(10, payment_currencyDecimals),
      id: con.address,
      address: con.address,
      purchased: Number(con.purchased) / Math.pow(10, tokenDecimals),
      tier: Number(con.tier),
      whitelisted: !!con.whitelisted,
    })),
    myContribution: pool.contributors
      .map((con) => ({
        claimed: Number(con.claimed) / Math.pow(10, tokenDecimals),
        contribution:
          Number(con.contribution) / Math.pow(10, payment_currencyDecimals),
        id: con.address,
        address: con.address,
        purchased: Number(con.purchased) / Math.pow(10, tokenDecimals),
        tier: Number(con.tier),
        whitelisted: !!con.whitelisted,
      }))
      .find((con) => con.address.toLowerCase() === account?.toLowerCase()),
    cycle: Number(pool.cycle || 0),
    cycleBps: Number(pool.cycleBps || 0),
    description: pool.description,
    endTime: Number(pool.endTime || 0),
    feeIndex: Number(pool.feeIndex || 0),
    finalFee: pool.finalFee,
    governance: pool.governance,
    hardCap: Number(pool.hardCap || 0) / Math.pow(10, payment_currencyDecimals),
    id: pool.id,
    liquidityListingRate:
      Number(pool.liquidityListingRate || 0) / Math.pow(10, tokenDecimals),
    liquidityLockDays: Number(pool.liquidityLockDays || 0),
    liquidityPercent: Number(pool.liquidityPercent || 0),
    liquidityUnlockTime: Number(pool.liquidityUnlockTime || 0),
    logo: pool.logo,
    max_payment:
      Number(pool.max_payment || 0) / Math.pow(10, payment_currencyDecimals),
    min_payment:
      Number(pool.min_payment) / Math.pow(10, payment_currencyDecimals),
    payment_currency: {
      decimals: payment_currencyDecimals,
      id: pool.payment_currency.id,
      name:
        pool.payment_currency.name || supportNetwork[chainId || "default"].name,
      symbol:
        pool.payment_currency.symbol ||
        supportNetwork[chainId || "default"].symbol,
      totalSupply:
        Number(pool.payment_currency.totalSupply) /
        Math.pow(10, payment_currencyDecimals),
      totalRaised:
        Number(pool.payment_currency.totalRaised) /
        Math.pow(10, payment_currencyDecimals),
    },
    poolDetails: JSON.parse(pool.poolDetails),
    poolState: pool.poolState,
    rate: Number(pool.rate || 0) / Math.pow(10, tokenDecimals),
    refundType: pool.refundType || "0",
    router: pool.router || undefined,
    softCap: Number(pool.softCap || 0) / Math.pow(10, payment_currencyDecimals),
    startTime: Number(pool.startTime || 0),
    tgeBps: Number(pool.tgeBps || 0),
    token: pool?.token?.id
      ? {
          decimals: tokenDecimals,
          id: pool.token.id,
          name: pool.token.name,
          symbol: pool.token.symbol,
          totalSupply:
            Number(pool.token.totalSupply) / Math.pow(10, tokenDecimals),
        }
      : undefined,
    totalRaised:
      Number(pool.totalRaised || 0) / Math.pow(10, payment_currencyDecimals),
    totalVolume: Number(pool.totalVolume || 0) / Math.pow(10, tokenDecimals),
    type: pool.type,
    listingType: pool.listingType,
    useWhitelisting: !!pool.useWhitelisting,
  };
};
