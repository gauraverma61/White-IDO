import { useEffect, useMemo, useState } from "react";
import {
  multiCallContractConnect,
  MulticallContractWeb3,
} from "../../../../hooks/useContracts";
import { toast } from "react-toastify";
import useAuth from "@hooks/useAuth";
import { getWeb3 } from "@constants/connectors";
import { supportNetwork } from "@constants/network";
import fairPoolAbi from "../../../../ABIs/FairPool/FairPool.json";
import tokenAbi from "../../../../ABIs/ERC20/ERC20ABI.json";
import { IPoolData } from "@components/LaunchPad/Details/hooks/usePool";

export const useCommonStats = (
  update: { address: string },
  timer?: boolean,
  timeInterval?: number
) => {
  const context = useAuth();
  const { chainId } = context;

  let urlAddress = update.address;

  const web3 = useMemo(() => {
    return getWeb3(chainId || "default");
  }, [chainId]);

  const mc = useMemo(() => {
    return MulticallContractWeb3(chainId || "default");
  }, [chainId]);

  const poolContract = useMemo(() => {
    if (!web3 || !urlAddress) return undefined;
    // @ts-ignore
    return new web3.eth.Contract(fairPoolAbi, urlAddress);
  }, [web3, urlAddress]);

  const [stats, setStats] = useState({
    endTime: 0,
    startTime: 0,
    softCap: 0,
    totalToken: 0,
    liquidityLockDays: 0,
    liquidityPercent: 0,
    liquidityUnlockTime: 0,
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
    token: "",
    totalClaimed: 0,
    totalRaised: 0,
    tokenName: "",
    tokenDecimal: 0,
    tokenSymbol: "",
    tokenSupply: 0,
    percentageRaise: 0,
    refundType: 0,
    poolAddress: "",
    governance: 0,
    totalPresaleToken: 0,
    PresalePer: 0,
    LiquidityPer: 0,
    BurntPer: 0,
    currencySymbol: supportNetwork[chainId || "default"]
      ? supportNetwork[chainId || "default"].symbol
      : supportNetwork["default"].symbol,
  });

  // let lockAddress = contract[chainId || "default"] ? contract[chainId || "default"].lockAddress : contract['default'].lockAddress;
  // let lmc = new web3.eth.Contract(lockAbi, lockAddress);

  useEffect(() => {
    if (mc && poolContract && web3) {
      const fetch = async () => {
        try {
          const data = await mc.aggregate([
            poolContract.methods.endTime(), //0
            poolContract.methods.startTime(), //1
            poolContract.methods.softCap(), //2
            poolContract.methods.liquidityLockDays(), //3
            poolContract.methods.liquidityPercent(), //4
            poolContract.methods.liquidityUnlockTime(), //5
            poolContract.methods.poolDetails(), //6
            poolContract.methods.poolState(), //7
            poolContract.methods.getPrice(), //8
            poolContract.methods.token(), //9
            poolContract.methods.totalClaimed(), //10
            poolContract.methods.totalRaised(), //11
            poolContract.methods.refundType(), //12
            poolContract.methods.governance(), //13
            poolContract.methods.totalToken(), //14
          ]);

          // @ts-ignore
          let tokenContract = new web3.eth.Contract(tokenAbi, data[9]);

          const tokendata = await mc.aggregate([
            tokenContract.methods.name(),
            tokenContract.methods.decimals(),
            tokenContract.methods.symbol(),
            tokenContract.methods.totalSupply(),
            tokenContract.methods.balanceOf(
              "0x000000000000000000000000000000000000dead"
            ),
          ]);

          // const lockdata = await mc.aggregate([
          //   lmc.methods.cumulativeLockInfo(data[9])
          // ]);

          const poolDetailsSplit = data[6].toString().includes("$#$")
            ? data[6].toString().split("$#$")
            : false;
          setStats({
            endTime: data[0],
            startTime: data[1],
            softCap: data[2] / Math.pow(10, 18),
            liquidityLockDays: data[3],
            liquidityPercent: data[4],
            liquidityUnlockTime: data[5],
            totalToken: data[18],
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
              : JSON.parse(data[6].toString()),
            poolState: Number(data[7]),
            rate: data[8] / Math.pow(10, tokendata[1]),
            token: data[9],
            totalClaimed: data[10],
            totalRaised: data[11] / Math.pow(10, 18),
            tokenName: tokendata[0],
            tokenDecimal: tokendata[1],
            tokenSymbol: tokendata[2],
            percentageRaise:
              (data[11] / Math.pow(10, 18) / (data[2] / Math.pow(10, 18))) *
              100,
            tokenSupply: tokendata[3] / Math.pow(10, tokendata[1]),
            refundType: data[12],
            poolAddress: urlAddress,
            governance: data[13],
            totalPresaleToken: parseFloat(
              String(data[18] / Math.pow(10, tokendata[1]))
            ),
            currencySymbol: supportNetwork[chainId || "default"]
              ? supportNetwork[chainId || "default"].symbol
              : supportNetwork["default"].symbol,
            PresalePer: (data[19] / tokendata[3]) * 100,
            LiquidityPer: ((data[19] * data[4]) / 100 / tokendata[3]) * 100,
            BurntPer: (tokendata[4] / tokendata[3]) * 100,
          });
        } catch (err: any) {
          console.log("something", err);
          toast.error("wrong network selected !");
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
      setStats({
        endTime: 0,
        startTime: 0,
        softCap: 0,
        totalToken: 0,
        liquidityLockDays: 0,
        liquidityPercent: 0,
        liquidityUnlockTime: 0,
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
        token: "",
        totalClaimed: 0,
        totalRaised: 0,
        tokenName: "",
        tokenDecimal: 0,
        tokenSymbol: "",
        tokenSupply: 0,
        percentageRaise: 0,
        refundType: 0,
        poolAddress: "",
        governance: 0,
        totalPresaleToken: 0,
        PresalePer: 0,
        LiquidityPer: 0,
        BurntPer: 0,
        currencySymbol: supportNetwork[chainId || "default"]
          ? supportNetwork[chainId || "default"].symbol
          : supportNetwork["default"].symbol,
      });
    }
    // eslint-disable-next-line
  }, [chainId, mc, web3, poolContract]);

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
    return new web3.eth.Contract(fairPoolAbi, urlAddress);
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
            ...callData,
            poolContract.methods.contributionOf(account),
            poolContract.methods.userAvalibleClaim(account),
          ]);

          setStats({
            balance:
              data[0] /
              Math.pow(10, updater?.data?.payment_currency?.decimals || 18),
            contributionOf:
              data[1] /
              Math.pow(10, updater?.data?.payment_currency?.decimals || 18),
            userAvailableClaim:
              data[2] / Math.pow(10, updater?.data?.token?.decimals || 18),
          });
        } catch (err: any) {
          toast.error(err.reason);
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
  }, [
    account,
    chainId,
    mc,
    web3,
    poolContract,
    tokenContract,
    updater?.data?.payment_currency?.id,
  ]);

  return stats;
};
