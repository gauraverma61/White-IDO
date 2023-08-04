import { useEffect, useMemo, useState } from "react";
import {
  multiCallContractConnect,
  MulticallContractWeb3,
} from "../../../../hooks/useContracts";
import { toast } from "react-toastify";
import useAuth from "@hooks/useAuth";
import { getWeb3 } from "@constants/connectors";
import { supportNetwork } from "@constants/network";
import privatePoolAbi from "../../../../ABIs/PrivatePool/PrivatePool.json";
import moment from "moment/moment";
import { IPoolData } from "@components/LaunchPad/Details/hooks/usePool";
import tokenAbi from "../../../../ABIs/ERC20/ERC20ABI.json";

export const useCommonStats = (
  update: { address: string },
  timer?: boolean,
  timeInterval?: number
) => {
  const context = useAuth();
  const { chainId, account } = context;

  let urlAddress = update.address;

  const web3 = useMemo(() => {
    return getWeb3(chainId);
  }, [chainId]);

  const mc = useMemo(() => {
    return MulticallContractWeb3(chainId);
  }, [chainId]);

  const poolContract = useMemo(() => {
    if (!web3 || !urlAddress) return undefined;
    // @ts-ignore
    return new web3.eth.Contract(privatePoolAbi, urlAddress);
  }, [web3, urlAddress]);

  const initialValue = {
    tier1: {
      start_time: 0,
      end_time: 0,
    },
    tier2: {
      start_time: 0,
      end_time: 0,
    },
    hardCap: 0,
    max_payment: 0,
    remainingContribution: 0,
    tgeDate: 0,
    tgeBps: 0,
    cycleBps: 0,
    totalVestedTokens: 0,
    useWhitelisting: 0,
    min_payment: 0,
    cycle: 0,

    endTime: 0,
    startTime: 0,
    softCap: 0,
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
    poolState: 0,
    rate: 0,
    // token: "",
    totalClaimed: 0,
    totalRaised: 0,
    // tokenName: "",
    // tokenDecimal: 0,
    // tokenSymbol: "",
    // tokenSupply: 0,
    percentageRaise: 0,
    refundType: 0,
    poolAddress: "",
    governance: 0,
    userTier: undefined,
    userWhitelisted: false,
    kyc: false,
    audit: false,
    auditStatus: false,
    kycStatus: false,

    currencySymbol: supportNetwork[chainId || "default"]
      ? supportNetwork[chainId || "default"].symbol
      : supportNetwork["default"].symbol,
  };
  const [stats, setStats] = useState(initialValue);

  // let lockAddress = contract[chainId || "default"] ? contract[chainId || "default"].lockAddress : contract['default'].lockAddress;
  // let lmc = new web3.eth.Contract(lockAbi, lockAddress);

  useEffect(() => {
    if (mc && poolContract && web3) {
      const fetch = async () => {
        try {
          const data = await mc.aggregate([
            poolContract.methods.endTime(), //0
            poolContract.methods.startTime(), //1
            poolContract.methods.hardCap(), //2
            poolContract.methods.softCap(), //3
            poolContract.methods.max_payment(), //4
            poolContract.methods.poolDetails(), //5
            poolContract.methods.poolState(), //6
            poolContract.methods.rate(), //7,
            poolContract.methods.remainingContribution(), //8
            poolContract.methods.tgeDate(), //9
            poolContract.methods.tgeBps(), //10
            poolContract.methods.cycle(), //11
            poolContract.methods.cycleBps(), //12
            poolContract.methods.totalClaimed(), //13
            poolContract.methods.totalRaised(), //14
            poolContract.methods.useWhitelisting(), //15
            poolContract.methods.min_payment(), //16
            poolContract.methods.refundType(), //17
            poolContract.methods.governance(), //18
            poolContract.methods.tier1(), //19
            poolContract.methods.tier2(), //20
            poolContract.methods.publicStartTime(), //21
            // poolContract.methods.audit(), //22
            // poolContract.methods.auditStatus(), //23
            // poolContract.methods.kycStatus(), //24
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
          // let tokenContract = new web3.eth.Contract(tokenAbi, data[13]);
          //
          // const tokendata = await mc.aggregate([
          //   tokenContract.methods.name(),
          //   tokenContract.methods.decimals(),
          //   tokenContract.methods.symbol(),
          //   tokenContract.methods.totalSupply(),
          // ]);

          const poolDetailsSplit = data[5].toString().includes("$#$")
            ? data[5].toString().split("$#$")
            : false;
          const startTIme = parseInt(data[1]);
          const tier1EndTime = parseInt(data[19]?.endTime);
          const tier2EndTime = parseInt(data[20]?.endTime);
          const publicStartTime = parseInt(data[21]);
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
              end_time: data[19]?.endTime,
            },
            tier2: {
              start_time: data[19]?.endTime,
              end_time: data[20]?.endTime,
            },
            userWhitelisted: userData ? userData[0] || undefined : undefined,
            userTier: userData ? userData[1] || undefined : undefined,
            endTime: parseInt(data[0]),
            startTime: startTime,
            hardCap: data[2] / Math.pow(10, 18),
            softCap: data[3] / Math.pow(10, 18),
            max_payment: data[4] / Math.pow(10, 18),

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
              : JSON.parse(data[5].toString()),
            poolState: data[6],
            rate: data[7] / Math.pow(10, 18),
            remainingContribution: data[8] / Math.pow(10, 18),
            tgeDate: data[9],
            tgeBps: data[10],
            cycleBps: data[12],
            // token: "",
            totalClaimed: data[13],
            totalRaised: data[14] / Math.pow(10, 18),
            useWhitelisting: data[15],
            min_payment: data[16] / Math.pow(10, 18),
            // tokenName: tokendata[0],
            // tokenDecimal: tokendata[1],
            // tokenSymbol: tokendata[2],
            percentageRaise:
              (data[16] / Math.pow(10, 18) / (data[2] / Math.pow(10, 18))) *
              100,
            // tokenSupply: tokendata[3] / Math.pow(10, tokendata[1]),
            refundType: data[17],
            cycle: data[11],
            poolAddress: urlAddress,
            governance: data[18],
            kyc: false,
            audit: false,
            auditStatus: false,
            kycStatus: false,
            currencySymbol: supportNetwork[chainId || "default"]
              ? supportNetwork[chainId || "default"].symbol
              : supportNetwork["default"].symbol,
            totalVestedTokens: 0,
          });
        } catch (err: any) {
          toast.error("wrong network selected !");
          console.error(err);
          // history.push("/sale-list");
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
      setStats(initialValue);
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
    return new web3.eth.Contract(privatePoolAbi, urlAddress);
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
          console.log(err.message);
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
            poolContract.methods.userAvalibleClaim(account), // 2
          ]);

          console.log(data[3], "userWhitelisted");
          setStats({
            balance:
              data[0] /
              Math.pow(10, updater?.data?.payment_currency?.decimals || 18),
            contributionOf:
              data[1] /
              Math.pow(10, updater?.data?.payment_currency?.decimals || 18),
            userAvailableClaim:
              data[2] /
              Math.pow(10, updater?.data?.payment_currency?.decimals || 18),
          });
        } catch (err: any) {
          console.error(
            "userWhitelisted Privatesale user data fetch error",
            err
          );
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
