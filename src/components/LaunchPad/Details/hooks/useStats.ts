import { useEffect, useMemo, useState } from "react";
import {
  multiCallContractConnect,
  MulticallContractWeb3,
} from "@hooks/useContracts";
import { toast } from "react-toastify";
import { getWeb3 } from "@constants/connectors";
import { supportNetwork } from "@constants/network";
import presalePoolAbi from "../../../../ABIs/PresalePool/PresalePool.json";
import tokenAbi from "../../../../ABIs/ERC20/ERC20ABI.json";
import useAuth from "@hooks/useAuth";
import moment from "moment";
import privatePoolAbi from "../../../../ABIs/PrivatePool/PrivatePool.json";
import useSWR from "swr";
import { IPoolData } from "@components/LaunchPad/Details/hooks/usePool";

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
  remainingContribution: number;
  tgeDate: number;
  tgeBps: number;
  cycleBps: number;
  token: string;
  totalClaimed: number;
  totalRaised: number;
  totalVestedTokens: number;
  useWhitelisting: number;
  min_payment: number;
  tokenName: string;
  tokenDecimal: number;
  tokenSymbol: string;
  percentageRaise: number;
  tokenSupply: number;
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
  whitelists?: {
    address: string;
    tier: string;
  }[];
}

export const useCommonStats = (
  update: { address: string },
  timer?: boolean,
  timeInterval?: number
): IPoolDetails => {
  const context = useAuth();
  const { chainId, account } = context;
  const urlAddress = update.address;

  const web3 = useMemo(() => {
    return getWeb3(chainId || "default");
  }, [chainId]);

  const mc = useMemo(() => {
    return MulticallContractWeb3(chainId || "default");
  }, [chainId]);

  const poolContract = useMemo(() => {
    console.log("WHAT", !web3, urlAddress);
    if (!web3 || !urlAddress) return undefined;
    // @ts-ignore
    return new web3.eth.Contract(presalePoolAbi, urlAddress);
  }, [web3, urlAddress]);

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
    remainingContribution: 0,
    tgeDate: 0,
    tgeBps: 0,
    cycleBps: 0,
    token: "",
    totalClaimed: 0,
    totalRaised: 0,
    totalVestedTokens: 0,
    useWhitelisting: 0,
    min_payment: 0,
    tokenName: "",
    tokenDecimal: 0,
    tokenSymbol: "",
    percentageRaise: 0,
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
    currencySymbol: supportNetwork[chainId || "default"]
      ? supportNetwork[chainId || "default"].symbol
      : supportNetwork["default"].symbol,
  };
  const [stats, setStats] = useState<IPoolDetails>(initialState);

  useEffect(() => {
    if (mc && poolContract && web3) {
      const fetch = async () => {
        try {
          const data = await mc.aggregate([
            poolContract.methods.endTime(), //0
            poolContract.methods.startTime(), //1
            poolContract.methods.hardCap(), //2
            poolContract.methods.softCap(), //3
            poolContract.methods.liquidityListingRate(), //4
            poolContract.methods.liquidityLockDays(), //5
            poolContract.methods.liquidityPercent(), //6
            poolContract.methods.liquidityUnlockTime(), //7
            poolContract.methods.max_payment(), //8
            poolContract.methods.poolDetails(), //9
            poolContract.methods.poolState(), //10
            poolContract.methods.rate(), //11,
            poolContract.methods.remainingContribution(), //12
            poolContract.methods.tgeDate(), //13
            poolContract.methods.tgeBps(), //14
            poolContract.methods.cycle(), //15
            poolContract.methods.cycleBps(), //16
            poolContract.methods.token(), //17
            poolContract.methods.totalClaimed(), //18
            poolContract.methods.totalRaised(), //19
            poolContract.methods.useWhitelisting(), //20
            poolContract.methods.min_payment(), //21
            poolContract.methods.refundType(), //22
            poolContract.methods.governance(), //23
            poolContract.methods.tier1(), //24
            poolContract.methods.tier2(), //25
            poolContract.methods.publicStartTime(), //26
            // poolContract.methods.kycStatus(), //27
            // poolContract.methods.ethFeePercent(), //28
          ]);
          let userData;
          if (account) {
            try {
              console.log("account", account);
              userData = await mc.aggregate([
                poolContract.methods.isWhitelisted(account), //0
                poolContract.methods.whitelistTier(account), //1
              ]);
              console.log("account", account);
            } catch (e) {
              console.error("Error while fetching isUserWhitelisted", e);
            }
          }

          // @ts-ignore
          let tokenContract = new web3.eth.Contract(tokenAbi, data[17]);

          const tokendata = await mc.aggregate([
            tokenContract.methods.name(),
            tokenContract.methods.decimals(),
            tokenContract.methods.symbol(),
            tokenContract.methods.totalSupply(),
          ]);

          const poolDetailsSplit = data[9].toString().includes("$#$")
            ? data[9].toString().split("$#$")
            : false;
          const startTIme = parseInt(data[1]);
          const tier1EndTime = parseInt(data[24]?.endTime);
          const tier2EndTime = parseInt(data[25]?.endTime);
          const publicStartTime = parseInt(data[26]);
          const userTier = userData
            ? parseInt(userData[1]) || undefined
            : undefined;
          let startTime = startTIme;
          if (tier2EndTime > 0) {
            startTime = tier2EndTime;
          }
          if (userTier == 1) {
            startTime = startTIme;
          }
          if (publicStartTime <= moment().utc().unix() && publicStartTime > 0) {
            startTime = publicStartTime;
          }
          console.log(
            "startTime",
            userTier,
            moment().utc().unix() >= tier2EndTime,
            moment().utc().isBefore(moment.unix(startTime)),
            startTIme,
            tier2EndTime,
            publicStartTime
          );
          setStats({
            tier1: {
              start_time: data[1],
              end_time: data[24]?.endTime,
            },
            tier2: {
              start_time: data[24]?.endTime,
              end_time: data[25]?.endTime,
            },
            userWhitelisted: userData ? userData[0] || undefined : undefined,
            userTier: userData ? userData[1] || undefined : undefined,
            endTime: data[0],
            startTime: String(startTime),
            hardCap: data[2] / Math.pow(10, 18),
            softCap: data[3] / Math.pow(10, 18),
            liquidityListingRate: data[4] / Math.pow(10, tokendata[1]),
            liquidityLockDays: data[5],
            liquidityPercent: data[6],
            liquidityUnlockTime: data[7],
            max_payment: data[8] / Math.pow(10, 18),
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
              : JSON.parse(data[9].toString()),
            poolState: data[10],
            totalVestedTokens: 0,
            rate: data[11] / Math.pow(10, tokendata[1]),
            remainingContribution: data[12] / Math.pow(10, 18),
            tgeDate: data[13],
            tgeBps: data[14],
            cycleBps: data[16],
            token: data[17],
            totalClaimed: data[18],
            totalRaised: data[19] / Math.pow(10, 18),
            useWhitelisting: data[20],
            min_payment: data[21] / Math.pow(10, 18),
            tokenName: tokendata[0],
            tokenDecimal: tokendata[1],
            tokenSymbol: tokendata[2],
            percentageRaise:
              (data[19] / Math.pow(10, 18) / (data[2] / Math.pow(10, 18))) *
              100,
            tokenSupply: tokendata[3] / Math.pow(10, tokendata[1]),
            refundType: data[22],
            cycle: data[15],
            poolAddress: urlAddress,
            governance: data[23],
            kyc: 0,
            audit: 0,
            auditStatus: 0,
            kycStatus: 0,
            ethFeePercent: 5,
            currencySymbol: supportNetwork[chainId || "default"]
              ? supportNetwork[chainId || "default"].symbol
              : supportNetwork["default"].symbol,
          });
        } catch (err: any) {
          console.error("WHAT", err);
          toast.error("wrong network selected !");
        }
      };
      if (timer && timeInterval) {
        const interval = setInterval(() => {
          fetch();
        }, timeInterval * 1000);
        return () => clearInterval(interval);
      } else {
        fetch();
      }
    } else {
      setStats(initialState);
    }
    // eslint-disable-next-line
  }, [chainId, mc, web3, poolContract, account]);
  return stats;
};

export const useAccountStats = (updater: {
  address: string;
  data?: IPoolData;
}) => {
  const context = useAuth();
  const { chainId, account } = context;
  let urlAddress = updater.address;
  let data = updater?.data;

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

  const tokenContract = useMemo(() => {
    if (!web3 || !updater.data?.payment_currency?.id) return undefined;
    // @ts-ignore
    return new web3.eth.Contract(tokenAbi, updater.data?.payment_currency?.id);
  }, [web3, updater.data?.payment_currency?.id]);

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
    if (
      mc &&
      account &&
      web3 &&
      mcc &&
      poolContract &&
      tokenContract &&
      updater?.data?.payment_currency?.id
    ) {
      const fetch = async () => {
        try {
          let poolAddress = web3.utils.isAddress(urlAddress);
          let isCode = await web3.eth.getCode(urlAddress);
          if (isCode === "0x" || !poolAddress) {
            // history.push("/sale-list");
          }
        } catch (err: any) {
          console.error("ERROR", err);
          // history.push("/");
        }
        try {
          let callData: string[] = [];
          if (
            updater?.data?.payment_currency?.id ===
            "0x0000000000000000000000000000000000000000"
          ) {
            callData.push(mcc.methods.getEthBalance(account));
          } else {
            callData.push(tokenContract.methods.balanceOf(account));
          }
          const data = await mc.aggregate([
            ...callData, //0
            poolContract.methods.contributionOf(account), //1
            poolContract.methods.userAvailableClaim(account), // 2
            poolContract.methods.tgeBps(), // 3
            poolContract.methods.purchasedOf(account), // 4
            poolContract.methods.claimedOf(account), // 5
            poolContract.methods.getPoolInfo(), // 6
          ]);
          let userAvailableClaim = 0;
          let decimals = 0;
          if (data[6]) {
            decimals = Number(data[6][1][2]);
          }
          if (Number(data[3]) == 0) {
            userAvailableClaim =
              (Number(data[4]) - Number(data[5])) / Math.pow(10, decimals);
          } else {
            userAvailableClaim = data[2] / Math.pow(10, decimals);
          }
          console.log(
            data[3],
            data[4],
            data[5],
            data[6][1][2],
            "userWhitelisted"
          );
          setStats({
            balance:
              data[0] /
              Math.pow(10, updater?.data?.payment_currency?.decimals || 18),
            contributionOf:
              data[1] /
              Math.pow(10, updater?.data?.payment_currency?.decimals || 18),
            userAvailableClaim,
          });
        } catch (err: any) {
          console.error("Privatesale user data fetch error", err);
          // toast.error(err.reason);
          // history.push("/sale-list");
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
  }, [account, chainId, tokenContract, updater?.data?.payment_currency?.id]);

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

  const { data: contributorsData, error } = useSWR(
    !!urlAddress
      ? `{
      poolContributors(where: {pool: "${urlAddress}", whitelisted: true}) {
        contribution
        id
        address
        whitelisted
        tier
        claimed
        purchased
      }
    }`
      : undefined
  );
  useEffect(() => {
    if (contributorsData?.poolContributors) {
      setStats(
        contributorsData?.poolContributors?.map(
          (con: { address: string; tier: string }) => ({
            address: con.address,
            tier: con.tier,
          })
        )
      );
    } else {
      setStats([]);
    }
  }, [contributorsData?.poolContributors]);

  return stats;
};
