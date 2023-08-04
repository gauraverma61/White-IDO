import { useEffect, useMemo, useState } from "react";
import {
  multiCallContractConnect,
  MulticallContractWeb3,
} from "@hooks/useContracts";
import { toast } from "react-toastify";
import { getWeb3 } from "@constants/connectors";
import { supportNetwork } from "@constants/network";
import presalePoolAbi from "../../../../ABIs/PresalePool/PresalePool.json";
import useAuth from "@hooks/useAuth";
import useSWR from "swr";

export interface IPoolDetails {
  tier1?: {
    start_time: number;
    end_time: number;
  };
  tier2?: {
    start_time: number;
    end_time: number;
  };
  userWhitelisted?: boolean;
  userTier?: number;
  endTime: string;
  startTime: string;
  hardCap: number;
  softCap: number;
  liquidityListingRate: number;
  liquidityLockDays: number;
  liquidityPercent: number;
  liquidityUnlockTime: number;
  max_payment: number;
  poolDetails: {
    logo: string;
    title: string;
    banner: string;
    description: string;
    socials: {
      website: string;
      facebook: string;
      twitter: string;
      instagram: string;
      github: string;
      telegram: string;
      discord: string;
      reddit: string;
    };
  };
  poolState: string;
  rate: number;
  //   remainingContribution: number;
  //   tgeDate: number;
  tgeBps: number;
  cycleBps: number;
  token: string;
  //   totalClaimed: number;
  totalRaised: number;
  totalVestedTokens: number;
  useWhitelisting: number;
  min_payment: number;
  tokenName: string;
  tokenDecimal: number;
  tokenSymbol: string;
  //   percentageRaise: number;
  tokenSupply: number;
  totalPresaleToken: number;
  refundType: number;
  cycle: number;
  poolAddress: string;
  governance: number;
  kyc: number;
  audit: number;
  auditStatus: number;
  kycStatus: number;
  ethFeePercent: number;
  currencySymbol: string;
  contributionOf: number;
  userAvailableClaim: number;
  whitelists?: {
    address: string;
  }[];
}

export const usePool = (update: { address: string }): IPoolDetails => {
  const context = useAuth();
  const { chainId, account } = context;
  const { address } = update;

  const web3 = useMemo(() => {
    return getWeb3(chainId || "default");
  }, [chainId]);

  const initialState: IPoolDetails = {
    endTime: "0",
    startTime: "0",
    hardCap: 0,
    softCap: 0,
    liquidityListingRate: 0,
    liquidityLockDays: 0,
    liquidityPercent: 0,
    liquidityUnlockTime: 0,
    max_payment: 0,
    poolDetails: {
      title: "",
      logo: "",
      banner: "",
      description: "",
      socials: {
        website: "",
        facebook: "",
        twitter: "",
        instagram: "",
        github: "",
        telegram: "",
        discord: "",
        reddit: "",
      },
    },
    poolState: "0",
    rate: 0,
    // remainingContribution: 0,
    // tgeDate: 0,
    tgeBps: 0,
    cycleBps: 0,
    token: "",
    // totalClaimed: 0,
    totalRaised: 0,
    totalVestedTokens: 0,
    useWhitelisting: 0,
    min_payment: 0,
    tokenName: "",
    tokenDecimal: 0,
    tokenSymbol: "",
    totalPresaleToken: 0,
    // percentageRaise: 0,
    tokenSupply: 0,
    refundType: 0,
    cycle: 0,
    poolAddress: "",
    governance: 0,
    kyc: 0,
    audit: 0,
    auditStatus: 0,
    kycStatus: 0,
    ethFeePercent: 0,
    contributionOf: 0,
    userAvailableClaim: 0,
    currencySymbol: supportNetwork[chainId || "default"]
      ? supportNetwork[chainId || "default"].symbol
      : supportNetwork["default"].symbol,
  };

  const {
    data: newData,
    mutate,
    error,
  } = useSWR(
    `{
      pool(id : "${address}") {
        hardCap
    totalRaised
    description
    banner
    softCap
    max_payment
    min_payment
    useWhitelisting
    refundType
    liquidityPercent
    liquidityLockDays
    liquidityListingRate
    liquidityUnlockTime
    startTime
    id
    endTime
    rate
    token {
      id
      name
      symbol
      totalSupply
      decimals
    }
    logo
    tgeBps
    cycle
    cycleBps
    socials
    poolDetails
   	tier1EndTime
    tier2EndTime
    poolState
    type
      }
      poolContributors(where: {id: "${account?.toLowerCase()}", pool: "${address}"}) {
        contribution
        id
        pool {
          id
        }
        whitelisted
        claimed
        purchased
      }
    }`
  );

  useEffect(() => {
    mutate();
  }, [account]);

  const [stats, setStats] = useState<IPoolDetails>(initialState);

  console.log("newData?.pool", newData);

  useEffect(() => {
    if (newData) {
      const { pool, poolContributors } = newData;
      const poolDetailsSplit = pool?.poolDetails?.toString().includes("$#$")
        ? pool.poolDetails.toString().split("$#$")
        : false;

      setStats({
        tier1: {
          start_time: pool.startTime,
          end_time: pool.tier1EndTime,
        },
        tier2: {
          start_time: pool.tier1EndTime,
          end_time: pool.tier2EndTime,
        },
        userWhitelisted: pool.useWhitelisting,
        userTier: pool.type,
        endTime: pool.endTime,
        startTime: pool.startTime,
        hardCap: pool.hardCap / Math.pow(10, 18),
        softCap: pool.softCap / Math.pow(10, 18),
        liquidityListingRate:
          pool.liquidityListingRate / Math.pow(10, pool.token.decimals),
        liquidityLockDays: pool.liquidityLockDays,
        liquidityPercent: pool.liquidityPercent,
        liquidityUnlockTime: pool.liquidityUnlockTime,
        max_payment: pool.max_payment / Math.pow(10, 18),
        poolDetails: poolDetailsSplit
          ? {
              logo: poolDetailsSplit[0],
              banner: poolDetailsSplit[0],
              description: poolDetailsSplit[11],
              socials: {
                website: "",
                facebook: "",
                twitter: "",
                instagram: "",
                github: "",
                telegram: "",
                discord: "",
                reddit: "",
              },
            }
          : JSON.parse(pool.poolDetails.toString()),
        poolState: pool.poolState,
        totalVestedTokens: 0,
        rate: pool.rate / Math.pow(10, pool.token.decimals),
        // remainingContribution: data[12] / Math.pow(10, 18),
        // tgeDate: data[13],
        tgeBps: pool.tgeBps,
        cycleBps: pool.cycleBps,
        token: pool.token.id,
        // totalClaimed: data[18],
        totalRaised: pool.totalRaised / Math.pow(10, 18),
        useWhitelisting: pool.useWhitelisting,
        min_payment: pool.min_payment / Math.pow(10, 18),
        tokenName: pool.token.name,
        tokenDecimal: pool.token.decimals,
        tokenSymbol: pool.token.symbol,
        totalPresaleToken: pool.softCap * pool.rate,
        // percentageRaise:
        //   (pool.totalRaised / Math.pow(10, 18) / (data[2] / Math.pow(10, 18))) *
        //   100,
        tokenSupply: pool.token.totalSupply / Math.pow(10, pool.token.decimals),
        refundType: pool.refundType,
        cycle: pool.cycle,
        poolAddress: pool.id,
        governance: pool.governance,
        kyc: 0,
        audit: 0,
        auditStatus: 0,
        kycStatus: 0,
        ethFeePercent: 5,
        contributionOf:
          poolContributors.contribution / Math.pow(10, pool.token.decimals),
        userAvailableClaim:
          poolContributors.claimed / Math.pow(10, pool.token.decimals),
        currencySymbol: supportNetwork[chainId || "default"]
          ? supportNetwork[chainId || "default"].symbol
          : supportNetwork["default"].symbol,
      });
    } else {
      setStats(initialState);
    }
    // eslint-disable-next-line
  }, [newData]);
  return stats;
};

export const useAccountStats = (updater: { address: string }) => {
  const context = useAuth();
  const { chainId, account } = context;
  const urlAddress = updater.address;

  const web3 = useMemo(() => {
    return getWeb3(chainId);
  }, [chainId]);

  const mc = useMemo(() => {
    return MulticallContractWeb3(chainId);
  }, [chainId]);

  const mcc = useMemo(() => {
    return multiCallContractConnect(chainId);
  }, [chainId]);

  const poolContract = useMemo(() => {
    if (!web3 || !urlAddress) return undefined;
    // @ts-ignore
    return new web3.eth.Contract(presalePoolAbi, urlAddress);
  }, [web3, urlAddress]);

  const [stats, setStats] = useState<{
    balance: number;
    contributionOf: number;
    userAvailableClaim: number;
  }>({
    balance: 0,
    contributionOf: 0,
    userAvailableClaim: 0,
  });

  useEffect(() => {
    if (mc && account && web3 && mcc && poolContract) {
      const fetch = async () => {
        try {
          const data = await mc.aggregate([
            mcc.methods.getEthBalance(account),
            poolContract.methods.contributionOf(account),
            poolContract.methods.userAvailableClaim(account),
          ]);
          console.log("data[1]", data);
          setStats({
            balance: data[0] / Math.pow(10, 18),
            contributionOf: data[1] / Math.pow(10, 18),
            userAvailableClaim: data[2] / Math.pow(10, 18),
          });
        } catch (err: any) {
          console.log("err", err);
          toast.error(err.reason);
          // history.push('/sale-list');
        }
      };
      fetch();
    } else {
      setStats({
        balance: 0,
        contributionOf: 0,
        userAvailableClaim: 0,
      });
    }
    // eslint-disable-next-line
  }, [account, chainId, mc, web3, poolContract]);

  return stats;
};

export const useWhitelistStats = (update: {
  address: string;
  page: number;
  pageSize: number;
  loading: boolean;
}): IPoolDetails["whitelists"] => {
  const context = useAuth();
  const { chainId } = context;
  const { page, pageSize } = update;
  const urlAddress = update.address;

  const web3 = useMemo(() => {
    return getWeb3(chainId || "default");
  }, [chainId]);

  const mc = useMemo(() => {
    return MulticallContractWeb3(chainId || "default");
  }, [chainId]);

  const poolContract = useMemo(() => {
    if (!web3 || !urlAddress) return undefined;
    // @ts-ignore
    return new web3.eth.Contract(presalePoolAbi, urlAddress);
  }, [web3, urlAddress]);

  const [stats, setStats] = useState<IPoolDetails["whitelists"]>([]);

  useEffect(() => {
    if (mc && poolContract && web3) {
      const fetch = async () => {
        try {
          const data = await mc.aggregate([
            poolContract.methods.getNumberOfWhitelistedUsers(),
          ]);

          if (data[0] > 0) {
            let start = data[0] - 1 - page * pageSize - (pageSize - 1);
            let end = start + pageSize - 1;

            const poolData = await mc.aggregate([
              poolContract.methods.getWhitelistedUsers(
                start >= 0 ? start : 0,
                end < data[0] ? end : data[0]
              ),
            ]);
            setStats(
              poolData[0].map((value: string, i: number) => ({
                address: value,
              }))
            );
          } else {
            setStats([]);
          }
        } catch (err: any) {
          console.error("WHAT", err);
          toast.error("wrong network selected !");
        }
      };
      fetch();
    } else {
      setStats([]);
    }
    // eslint-disable-next-line
  }, [chainId, mc, web3, poolContract]);

  return stats;
};
