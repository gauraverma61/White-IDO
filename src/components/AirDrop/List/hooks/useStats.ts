import { useEffect, useMemo, useState } from "react";
import airdropFactoryAbi from "../../../../ABIs/AirdropManager/AirdropManager.json";
import { toast } from "react-toastify";
import { getWeb3 } from "@constants/connectors";
import { contract } from "@constants/constant";
import { MulticallContractWeb3 } from "@hooks/useContracts";
import useAuth from "@hooks/useAuth";
import { IAirdropDetails } from "@components/AirDrop/Details/hooks/useStats";
import { supportNetwork } from "@constants/network";
import { AirdropManager } from "../../../../blockchain-types";

export const useAirdropPoolListStats = (updater: {
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
    if (!chainId) return contract["default"].airdropmanager;
    return contract[chainId]
      ? contract[chainId].airdropmanager
      : contract["default"].airdropmanager;
  }, [chainId]);

  const mc = useMemo(() => {
    return MulticallContractWeb3(chainId);
  }, [chainId]);

  const poolManagerContract = useMemo(() => {
    if (!web3 || !poolManagerAddress) return undefined;
    // @ts-ignore
    return new web3.eth.Contract(airdropFactoryAbi, poolManagerAddress);
  }, [web3, poolManagerAddress]);

  const [stats, setStats] = useState<{
    getTotalNumberOfPools: number;
    page: number;
    pageSize: number;
    poolList: IAirdropDetails[];
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
          console.log("data", data);

          if (data[0] > 0) {
            let start = data[0] - 1 - page * pageSize - (pageSize - 1);
            let end = start + pageSize - 1;
            console.log("data start", start, end, pageSize);
            const poolData: {
              [key: number]: AirdropManager.CumulativeLockInfoStructOutput[];
            } = await mc.aggregate([
              poolManagerContract.methods.getCumulativePoolInfo(
                start >= 0 ? start : 0,
                end < data[0] ? end : data[0]
              ),
            ]);

            console.log("data poolData", poolData);

            Promise.all(
              poolData[0].map(async (value): Promise<IAirdropDetails> => {
                // const _tdata = await mc.aggregate([
                //   poolManagerContract.methods.getCumulativePoolInfo(
                //     start >= 0 ? start : 0,
                //     end < data[0] ? end : data[0]
                //   ),
                // ]);
                return {
                  poolAddress: value.poolAddress,
                  startTime: value.startTime.toString(),
                  totalusers: 0,
                  poolDetails: JSON.parse(value.poolDetails.toString()),
                  governance: value.governance,
                  tgeBps: Number(value.tgeBps),
                  cycle: Number(value.cycle),
                  cycleBps: Number(value.cycleBps),
                  whitelistedUsers: [],
                  token: {
                    address: value.token,
                    name: value.name,
                    decimals: value.decimals,
                    symbol: value.symbol,
                    supply: "0",
                  },
                  totalClaimed: Number(value.totalClaimed),
                  totalCost: String(value.totalCost),
                  poolState: String(value.poolState),
                  currencySymbol: supportNetwork[chainId || "default"]
                    ? supportNetwork[chainId || "default"].symbol
                    : supportNetwork["default"].symbol,
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
          console.error("err", err);
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
  }, [mc, web3, poolManagerContract, updater.page, updater.pageSize]);

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
    return getWeb3(chainId);
  }, [chainId]);

  const poolManagerAddress = useMemo(() => {
    if (!chainId) return contract["default"].airdropmanager;
    return contract[chainId]
      ? contract[chainId].airdropmanager
      : contract["default"].airdropmanager;
  }, [chainId]);

  const mc = useMemo(() => {
    return MulticallContractWeb3(chainId);
  }, [chainId]);

  const poolManagerContract = useMemo(() => {
    if (!web3 || !poolManagerAddress) return undefined;
    // @ts-ignore
    return new web3.eth.Contract(airdropFactoryAbi, poolManagerAddress);
  }, [web3, poolManagerAddress]);

  const [stats, setStats] = useState<{
    getTotalNumberOfPools: number;
    page: number;
    pageSize: number;
    poolList: IAirdropDetails[];
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
            poolManagerContract.methods.getPoolsOfLength(account),
          ]);

          console.log("my", data);

          if (data[0] > 0) {
            let start = data[0] - 1 - page * pageSize - (pageSize - 1);
            let end = start + pageSize - 1;

            const poolData: {
              [key: number]: AirdropManager.CumulativeLockInfoStructOutput[];
            } = await mc.aggregate([
              poolManagerContract.methods.getCumulativePoolInfo(
                start >= 0 ? start : 0,
                end < data[0] ? end : data[0]
              ),
            ]);

            Promise.all(
              poolData[0].map(async (value): Promise<IAirdropDetails> => {
                return {
                  poolAddress: value.poolAddress,
                  startTime: value.startTime.toString(),
                  totalusers: 0,
                  poolDetails: JSON.parse(value.poolDetails.toString()),
                  governance: value.governance,
                  tgeBps: 0,
                  cycle: 0,
                  cycleBps: 0,
                  whitelistedUsers: [],
                  token: {
                    address: value.token,
                    name: value.name,
                    decimals: 0,
                    symbol: value.symbol,
                    supply: "0",
                  },
                  totalClaimed: Number(0),
                  totalCost: value.totalCost.toString(),
                  poolState: value.poolState.toString(),
                  currencySymbol: supportNetwork[chainId || "default"]
                    ? supportNetwork[chainId || "default"].symbol
                    : supportNetwork["default"].symbol,
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

export const useTopPoolState = (updater: {}) => {
  const context = useAuth();
  const { chainId } = context;

  const web3 = useMemo(() => {
    if (!chainId) return undefined;
    return getWeb3(chainId);
  }, [chainId]);

  const poolManagerAddress = useMemo(() => {
    if (!chainId) return contract["default"].airdropmanager;
    return contract[chainId]
      ? contract[chainId].airdropmanager
      : contract["default"].airdropmanager;
  }, [chainId]);

  const mc = useMemo(() => {
    if (!chainId) return undefined;
    return MulticallContractWeb3(chainId);
  }, [chainId]);

  const poolManagerContract = useMemo(() => {
    if (!web3) return undefined;
    // @ts-ignore
    return new web3.eth.Contract(airdropFactoryAbi, poolManagerAddress);
  }, [web3, poolManagerAddress]);

  const [stats, setStats] = useState({
    topPools: [],
    chainId: chainId,
  });

  useEffect(() => {
    if (mc && poolManagerContract) {
      const fetch = async () => {
        try {
          const data = await mc.aggregate([
            poolManagerContract.methods.getTopPool(),
          ]);

          setStats({
            topPools: data[0],
            chainId: chainId,
          });
        } catch (err: any) {
          console.log(err.message);
          toast.error(err.reason);
        }
      };
      fetch();
    } else {
      setStats({
        topPools: [],
        chainId: chainId,
      });
    }
    // eslint-disable-next-line
  }, [chainId]);

  return stats;
};
