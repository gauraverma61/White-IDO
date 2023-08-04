import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { getWeb3 } from "@constants/connectors";
import { MulticallContractWeb3 } from "@hooks/useContracts";
import airdropFactoryAbi from "../../../../ABIs/AirdropMaster/AirdropMaster.json";
import useAuth from "@hooks/useAuth";
import { supportNetwork } from "@constants/network";
import tokenAbi from "../../../../ABIs/ERC20/ERC20ABI.json";

export interface IAirdropDetails {
  startTime: string;
  totalusers: number;
  poolState: string;
  poolDetails: {
    logo: string;
    banner: string;
    title: string;
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
  tgeBps: number;
  cycleBps: number;
  totalClaimed: number;
  totalCost: string;
  cycle: number;
  poolAddress: string;
  currencySymbol: string;
  governance: string;
  token: {
    name: string;
    address: string;
    symbol: string;
    decimals: number;
    supply: string;
  };
  whitelistedUsers: {
    address: string;
    amount: string;
  }[];
}
export const useCommonStats = (
  update: {
    address: string;
  },
  timer?: boolean,
  timeInterval?: number
): IAirdropDetails => {
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
    return new web3.eth.Contract(airdropFactoryAbi, urlAddress);
  }, [web3, urlAddress]);

  const [stats, setStats] = useState<IAirdropDetails>({
    startTime: "0",
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
    totalusers: 0,
    poolState: "0",
    totalCost: "0",
    tgeBps: 0,
    cycleBps: 0,
    totalClaimed: 0,
    cycle: 0,
    poolAddress: "",
    governance: "",
    token: {
      address: "",
      name: "",
      symbol: "",
      supply: "",
      decimals: 0,
    },
    whitelistedUsers: [],
    currencySymbol: supportNetwork[chainId || "default"]
      ? supportNetwork[chainId || "default"].symbol
      : supportNetwork["default"].symbol,
  });

  useEffect(() => {
    if (mc && poolContract && web3) {
      const fetch = async () => {
        try {
          const data = await mc.aggregate([
            poolContract.methods.startTime(), //0
            poolContract.methods.getNumberOfWhitelistedUsers(), //1
            poolContract.methods.poolDetails(), //2
            poolContract.methods.token(), //3
            poolContract.methods.governance(), //4
            poolContract.methods.tgeBps(), //5
            poolContract.methods.cycle(), //6
            poolContract.methods.cycleBps(), //7
            poolContract.methods.totalClaimed(), //8
            poolContract.methods.totalCost(), //9
            poolContract.methods.poolState(), //10
          ]);

          // @ts-ignore
          let tokenContract = new web3.eth.Contract(tokenAbi, data[3]);

          const tokendata = await mc.aggregate([
            tokenContract.methods.name(),
            tokenContract.methods.decimals(),
            tokenContract.methods.symbol(),
            tokenContract.methods.totalSupply(),
          ]);

          const poolDetailsSplit = data[2].toString().includes("$#$")
            ? data[2].toString().split("$#$")
            : false;

          let userAvailableClaim;
          if (account) {
            userAvailableClaim = await poolContract.methods
              .userAvalibleClaim(account)
              .call();
          }

          setStats({
            poolAddress: urlAddress,
            startTime: data[0],
            totalusers: data[1],
            poolState: data[10],
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
              : JSON.parse(data[2].toString()),
            governance: data[4],
            tgeBps: data[5],
            cycle: data[6],
            cycleBps: data[7],
            whitelistedUsers: account
              ? [
                  {
                    address: account,
                    amount: userAvailableClaim || "0",
                  },
                ]
              : [],
            token: {
              address: data[3],
              name: tokendata[0],
              decimals: tokendata[1],
              symbol: tokendata[2],
              supply: tokendata[3],
            },
            totalClaimed: data[8],
            totalCost: data[9],
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
      setStats({
        startTime: "0",
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
        whitelistedUsers: [],
        totalusers: 0,
        poolState: "0",
        tgeBps: 0,
        totalCost: "0",
        cycleBps: 0,
        totalClaimed: 0,
        cycle: 0,
        poolAddress: "",
        governance: "",
        token: {
          address: "",
          name: "",
          symbol: "",
          supply: "",
          decimals: 0,
        },
        currencySymbol: supportNetwork[chainId || "default"]
          ? supportNetwork[chainId || "default"].symbol
          : supportNetwork["default"].symbol,
      });
    }
    // eslint-disable-next-line
  }, [chainId, mc, web3, poolContract, account]);

  return stats;
};

export const useAllocationStats = (update: {
  address: string;
  page: number;
  pageSize: number;
  loading: boolean;
}): IAirdropDetails["whitelistedUsers"] => {
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
    return new web3.eth.Contract(airdropFactoryAbi, urlAddress);
  }, [web3, urlAddress]);

  const [stats, setStats] = useState<IAirdropDetails["whitelistedUsers"]>([]);

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
              poolData[0][0].map((value: string, i: number) => ({
                address: value,
                amount: poolData[0][1][i],
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
