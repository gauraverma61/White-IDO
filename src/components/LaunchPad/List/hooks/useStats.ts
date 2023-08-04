import { useEffect, useMemo, useState } from "react";
import poolManagerAbi from "../../../../ABIs/PoolManager/PoolManager.json";
import { toast } from "react-toastify";
import { getWeb3 } from "@constants/connectors";
import { contract } from "@constants/constant";
import { MulticallContractWeb3 } from "@hooks/useContracts";
import useAuth from "@hooks/useAuth";
import presalePoolAbi from "../../../../ABIs/PresalePool/PresalePool.json";
import { IPoolData } from "@components/LaunchPad/Details/hooks/usePool";

export interface IPool {
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
  decimals: string;
  name: string;
  symbol: string;
  poolAddress: string;
  endTime: string;
  publicStartTime: number;
  hardCap: string;
  liquidityListingRate: string;
  liquidityPercent: string;
  max_payment: string;
  min_payment: string;
  poolState: string;
  poolType: string;
  rate: string;
  softCap: string;
  startTime: string;
  token: string;
  totalRaised: string;
  percentageRaise: number;
  payment_currency?: IPoolData["payment_currency"];
  logourl: string;
  poolDetails?: {
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
}

export const usePoolListStats = (updater: {
  page: number;
  pageSize: number;
  loading: boolean;
}) => {
  let { page, pageSize, loading } = updater;
  const context = useAuth();
  const { chainId, account } = context;

  const web3 = useMemo(() => {
    return getWeb3(chainId);
  }, [chainId]);

  const poolManagerAddress = useMemo(() => {
    if (!chainId) return contract["default"].poolmanager;
    return contract[chainId]
      ? contract[chainId].poolmanager
      : contract["default"].poolmanager;
  }, [chainId]);

  const mc = useMemo(() => {
    return MulticallContractWeb3(chainId);
  }, [chainId]);

  const poolManagerContract = useMemo(() => {
    if (!web3 || !poolManagerAddress) return undefined;
    // @ts-ignore
    return new web3.eth.Contract(poolManagerAbi, poolManagerAddress);
  }, [web3, poolManagerAddress]);

  const [stats, setStats] = useState<{
    getTotalNumberOfPools: number;
    page: number;
    pageSize: number;
    poolList: IPool[];
    loading: boolean;
    chainId?: number;
  }>({
    getTotalNumberOfPools: 0,
    page: page,
    pageSize: pageSize,
    poolList: [],
    loading: true,
    chainId: chainId,
  });

  useEffect(() => {
    if (mc && web3 && poolManagerContract) {
      const fetch = async () => {
        try {
          const data = await mc.aggregate([
            poolManagerContract.methods.getTotalNumberOfPools(),
          ]);

          if (data[0] > 0) {
            let start = data[0] - 1 - page * pageSize - (pageSize - 1);
            let end = start + pageSize - 1;

            const poolData = await mc.aggregate([
              poolManagerContract.methods.getCumulativePoolInfo(
                start >= 0 ? start : 0,
                end < data[0] ? end : data[0]
              ),
            ]);

            Promise.all(
              poolData[0].map(async (value: any) => {
                let userData;
                if (account) {
                  try {
                    const poolContract = new web3.eth.Contract(
                      // @ts-ignore
                      presalePoolAbi,
                      value.poolAddress
                    );
                    console.log("account", account);
                    userData = await mc.aggregate([
                      poolContract.methods.tier1(), //2
                      poolContract.methods.tier2(), //3
                    ]);
                    console.log("account", account);
                  } catch (e) {
                    console.error("Error while fetching isUserWhitelisted", e);
                  }
                }
                return {
                  tier1: userData
                    ? userData[0]
                      ? {
                          start_time: value.startTime,
                          end_time: userData[0]?.endTime,
                        }
                      : undefined
                    : undefined,
                  tier2: userData
                    ? userData[1]
                      ? {
                          start_time: userData[0]?.endTime,
                          end_time: userData[1]?.endTime,
                        }
                      : undefined
                    : undefined,
                  decimals: value.decimals,
                  name: value.name,
                  symbol: value.symbol,
                  poolAddress: value.poolAddress,
                  endTime: value.endTime,
                  hardCap: value.hardCap / Math.pow(10, 18),
                  liquidityListingRate:
                    value.liquidityListingRate / Math.pow(10, value.decimals),
                  liquidityPercent: value.liquidityPercent,
                  max_payment: value.max_payment / Math.pow(10, 18),
                  min_payment: value.min_payment / Math.pow(10, 18),
                  poolState: value.poolState,
                  poolType: value.poolType,
                  rate: value.rate / Math.pow(10, value.decimals),
                  softCap: value.softCap / Math.pow(10, 18),
                  startTime: value.startTime,
                  token: value.token,
                  totalRaised: value.totalRaised / Math.pow(10, 18),
                  percentageRaise:
                    (value.totalRaised /
                      Math.pow(10, 18) /
                      (value.poolType === "2"
                        ? value.softCap / Math.pow(10, 18)
                        : value.hardCap / Math.pow(10, 18))) *
                    100,
                  logourl: value.poolDetails.toString().includes("$#$")
                    ? value.poolDetails.toString().split("$#$")[0]
                    : JSON.parse(value.poolDetails.toString())?.logo,
                  poolDetails: value.poolDetails.toString().includes("$#$")
                    ? value.poolDetails.toString().split("$#$")
                    : JSON.parse(value.poolDetails.toString()),
                  // logourl: value.poolDetails.toString().split("$#$")[0],
                };
              })
            ).then((result) => {
              setStats({
                getTotalNumberOfPools: data[0] - 1,
                poolList: result,
                page: page,
                pageSize: pageSize,
                loading: !loading,
                chainId: chainId,
              });
            });
          } else {
            setStats({
              getTotalNumberOfPools: 0,
              page: page,
              pageSize: pageSize,
              poolList: [],
              loading: false,
              chainId: chainId,
            });
          }
        } catch (err: any) {
          console.error("ERROR WHILE FETCHING LAUNCHPAD LIST: ", err);
          toast.error(err.reason);
        }
      };
      fetch();
    } else {
      console.log("WTF", !!web3);
      setStats({
        getTotalNumberOfPools: 0,
        page: page,
        pageSize: pageSize,
        poolList: [],
        loading: false,
        chainId: chainId,
      });
    }
    // eslint-disable-next-line
  }, [mc, web3, poolManagerContract, updater.page, updater.pageSize, account]);

  return stats;
};

export const usePoolListUser = (updater: {
  page: number;
  pageSize: number;
  loading: boolean;
}) => {
  let { page, pageSize, loading } = updater;
  const context = useAuth();
  const { chainId, account } = context;

  const web3 = useMemo(() => {
    if (!chainId) return undefined;
    return getWeb3(chainId);
  }, [chainId]);

  const poolManagerAddress = useMemo(() => {
    if (!chainId) return contract["default"].poolmanager;
    return contract[chainId]
      ? contract[chainId].poolmanager
      : contract["default"].poolmanager;
  }, [chainId]);

  const mc = useMemo(() => {
    if (!chainId) return undefined;
    return MulticallContractWeb3(chainId);
  }, [chainId]);

  const poolManagerContract = useMemo(() => {
    if (!web3) return undefined;
    // @ts-ignore
    return new web3.eth.Contract(poolManagerAbi, poolManagerAddress);
  }, [web3, poolManagerAddress]);

  const [stats, setStats] = useState<{
    getTotalNumberOfPools: number;
    page: number;
    pageSize: number;
    poolList: IPool[];
    loading: boolean;
    chainId?: number;
  }>({
    getTotalNumberOfPools: 0,
    page: page,
    pageSize: pageSize,
    poolList: [],
    loading: true,
    chainId: chainId,
  });

  useEffect(() => {
    if (mc && account && poolManagerContract) {
      const fetch = async () => {
        try {
          const data = await mc.aggregate([
            poolManagerContract.methods.getTotalNumberOfContributedPools(
              account
            ),
          ]);

          console.log(data);

          if (data[0] > 0) {
            let start = data[0] - 1 - page * pageSize - (pageSize - 1);
            let end = start + pageSize - 1;

            const poolData = await mc.aggregate([
              poolManagerContract.methods.getUserContributedPoolInfo(
                account,
                start >= 0 ? start : 0,
                end < data[0] ? end : data[0]
              ),
            ]);

            console.log(poolData);
            Promise.all(
              poolData[0].map(async (value: any) => {
                return {
                  decimals: value.decimals,
                  name: value.name,
                  symbol: value.symbol,
                  poolAddress: value.poolAddress,
                  endTime: value.endTime,
                  hardCap: value.hardCap / Math.pow(10, 18),
                  liquidityListingRate:
                    value.liquidityListingRate / Math.pow(10, value.decimals),
                  liquidityPercent: value.liquidityPercent,
                  max_payment: value.max_payment / Math.pow(10, 18),
                  min_payment: value.min_payment / Math.pow(10, 18),
                  poolState: value.poolState,
                  poolType: value.poolType,
                  rate: value.rate / Math.pow(10, value.decimals),
                  softCap: value.softCap / Math.pow(10, 18),
                  startTime: value.startTime,
                  token: value.token,
                  totalRaised: value.totalRaised / Math.pow(10, 18),
                  percentageRaise:
                    (value.totalRaised /
                      Math.pow(10, 18) /
                      (value.poolType === "2"
                        ? value.softCap / Math.pow(10, 18)
                        : value.hardCap / Math.pow(10, 18))) *
                    100,
                  logourl: value.poolDetails.toString().includes("$#$")
                    ? value.poolDetails.toString().split("$#$")[0]
                    : JSON.parse(value.poolDetails.toString())?.logo,
                };
              })
            ).then((result) => {
              setStats({
                getTotalNumberOfPools: data[0] - 1,
                poolList: result,
                page: page,
                pageSize: pageSize,
                loading: !loading,
                chainId: chainId,
              });
            });
          } else {
            setStats({
              getTotalNumberOfPools: 0,
              page: page,
              pageSize: pageSize,
              poolList: [],
              loading: false,
              chainId: chainId,
            });
          }
        } catch (err: any) {
          toast.error(err.reason);
        }
      };
      fetch();
    } else {
      setStats({
        getTotalNumberOfPools: 0,
        page: page,
        pageSize: pageSize,
        poolList: [],
        loading: false,
        chainId: chainId,
      });
    }
    // eslint-disable-next-line
  }, [account, poolManagerContract, mc, updater.page, updater.pageSize]);

  return stats;
};
