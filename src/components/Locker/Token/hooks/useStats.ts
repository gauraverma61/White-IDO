import { useEffect, useMemo, useState } from "react";
import lockAbi from "../../../../ABIs/Locker/lockerABI.json";
import tokenAbi from "../../../../ABIs/ERC20/ERC20ABI.json";
import LPAbi from "../../../../ABIs/LPAbi/LPAbi.json";
import { toast } from "react-toastify";
import { getWeb3Contract } from "@constants/contractHelper";
import { useRouter } from "next/router";
import { contract } from "@constants/constant";
import { getWeb3 } from "@constants/connectors";
import useAuth from "@hooks/useAuth";
import { MulticallContractWeb3 } from "@hooks/useContracts";

export interface ITokenList {
  name: string;
  amount: string;
  decimals: string;
  symbol: string;
  token: string;
  factory: string;
}

export interface ILockData {
  amount: string;
  cycle: string;
  cycleBps: string;
  description: string;
  id: string;
  lockDate: string;
  owner: string;
  tgeBps: string;
  tgeDate: string;
  token: string;
  unlockedAmount: string;
}

export const useCommonStats = (updater: {
  page: number;
  pageSize: number;
  loading: boolean;
}) => {
  let { page, pageSize, loading } = updater;

  const context = useAuth();
  const { chainId } = context;

  const web3 = useMemo(() => {
    if (!chainId) return undefined;
    return getWeb3(chainId);
  }, [chainId]);

  const lockAddress = useMemo(() => {
    if (!chainId) return contract["default"].lockAddress;
    return contract[chainId]
      ? contract[chainId].lockAddress
      : contract["default"].lockAddress;
  }, [chainId]);

  const [stats, setStats] = useState<{
    allNormalTokenLockedCount: number;
    page: number;
    pageSize: number;
    tokenList: ITokenList[];
    loading: boolean;
  }>({
    allNormalTokenLockedCount: 0,
    page: page,
    pageSize: pageSize,
    tokenList: [],
    loading: true,
  });

  const mc = useMemo(() => {
    if (!chainId) return undefined;
    return MulticallContractWeb3(chainId);
  }, [chainId]);

  const pmc = useMemo(() => {
    if (!web3) return undefined;
    // @ts-ignore
    return new web3.eth.Contract(lockAbi, lockAddress);
  }, [web3, lockAddress]);

  useEffect(() => {
    if (mc && pmc && web3 && chainId) {
      const fetch = async () => {
        try {
          const data = await mc?.aggregate([
            pmc?.methods?.allNormalTokenLockedCount(),
          ]);
          console.log("data[0]", data[0]);
          if (data[0] > 0) {
            let start = data[0] - 1 - page * pageSize - (pageSize - 1);
            let end = start + pageSize - 1;

            const lockdata = await mc?.aggregate([
              pmc?.methods.getCumulativeNormalTokenLockInfo(
                start >= 0 ? start : 0,
                end < data[0] ? end : data[0]
              ),
            ]);

            Promise.all(
              lockdata[0].map(async (value: any) => {
                // @ts-ignore
                let tc = new web3.eth.Contract(tokenAbi, value.token);
                const tokendata = await mc?.aggregate([
                  tc.methods.name(),
                  tc.methods.symbol(),
                  tc.methods.decimals(),
                ]);
                return {
                  amount: value.amount,
                  decimals: tokendata[2],
                  token: value.token,
                  factory: value.factory,
                  name: tokendata[0],
                  symbol: tokendata[1],
                };
              })
            ).then((result) => {
              setStats({
                allNormalTokenLockedCount: data[0],
                // @ts-ignore
                tokenList: result,
                page: page,
                pageSize: pageSize,
                loading: !loading,
              });
            });
          } else {
            setStats({
              allNormalTokenLockedCount: 0,
              tokenList: [],
              page: page,
              pageSize: pageSize,
              loading: !loading,
            });
          }
        } catch (err: any) {
          toast.error(err.reason);
          // history.push("/");
        }
      };
      fetch();
    } else {
      setStats({
        loading: false,
        allNormalTokenLockedCount: 0,
        page: page,
        pageSize: pageSize,
        tokenList: [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, mc, pmc, web3, updater.page, updater.pageSize]);

  return stats;
};

export const useCommonLpStats = (updater: {
  page: number;
  pageSize: number;
  loading: boolean;
}) => {
  let { page, pageSize, loading } = updater;

  const context = useAuth();
  const { chainId } = context;
  let history = useRouter();

  const web3 = useMemo(() => {
    if (!chainId) return undefined;
    return getWeb3(chainId);
  }, [chainId]);

  const lockAddress = useMemo(() => {
    if (!chainId) return contract["default"].lockAddress;
    return contract[chainId]
      ? contract[chainId].lockAddress
      : contract["default"].lockAddress;
  }, [chainId]);

  const [stats, setStats] = useState<{
    allNormalTokenLockedCount: number;
    page: number;
    pageSize: number;
    tokenList: ITokenList[];
    loading: boolean;
  }>({
    allNormalTokenLockedCount: 0,
    page: page,
    pageSize: pageSize,
    tokenList: [],
    loading: true,
  });

  const mc = useMemo(() => {
    if (!chainId) return undefined;
    return MulticallContractWeb3(chainId);
  }, [chainId]);

  const pmc = useMemo(() => {
    if (!web3) return undefined;
    // @ts-ignore
    return new web3.eth.Contract(lockAbi, lockAddress);
  }, [web3, lockAddress]);

  useEffect(() => {
    if (mc && web3 && chainId && pmc) {
      const fetch = async () => {
        try {
          const data = await mc?.aggregate([
            pmc?.methods?.allLpTokenLockedCount(),
          ]);

          if (data[0] > 0) {
            let start = data[0] - 1 - page * pageSize - (pageSize - 1);
            let end = start + pageSize - 1;

            const lockdata = await mc?.aggregate([
              pmc?.methods?.getCumulativeLpTokenLockInfo(
                start >= 0 ? start : 0,
                end < pageSize ? pageSize : end
              ),
            ]);

            Promise.all(
              lockdata[0].map(async (value: any) => {
                // @ts-ignore
                let lpContract = new web3.eth.Contract(LPAbi, value.token);
                let token0 = await lpContract.methods.token0().call();
                let token1 = await lpContract.methods.token1().call();
                let decimals = await lpContract.methods.decimals().call();

                // @ts-ignore
                let token0Contract = getWeb3Contract(tokenAbi, token0, chainId);
                // @ts-ignore
                let token1Contract = getWeb3Contract(tokenAbi, token1, chainId);

                const mc = MulticallContractWeb3(chainId);
                const lpdata = await mc.aggregate([
                  token0Contract.methods.symbol(),
                  token1Contract.methods.symbol(),
                ]);

                return {
                  amount: value.amount,
                  decimals: decimals,
                  token: value.token,
                  factory: value.factory,
                  name: `${lpdata[0]}/${lpdata[1]}`,
                  symbol: `${lpdata[0]}`,
                };
              })
            ).then((result) => {
              setStats({
                allNormalTokenLockedCount: data[0],
                // @ts-ignore
                tokenList: result,
                page: page,
                pageSize: pageSize,
                loading: !loading,
              });
            });
          } else {
            setStats({
              allNormalTokenLockedCount: data[0],
              tokenList: [],
              page: page,
              pageSize: pageSize,
              loading: !loading,
            });
          }
        } catch (err: any) {
          toast.error(err.reason);
          history.push("/");
        }
      };
      fetch();
    } else {
      setStats({
        loading: false,
        allNormalTokenLockedCount: 0,
        page: page,
        pageSize: pageSize,
        tokenList: [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, mc, web3, pmc]);

  return stats;
};

export const useDetailsStats = (updater: { address?: string }) => {
  const context = useAuth();
  const { chainId } = context;
  const urlAddress = updater.address;
  const web3 = useMemo(() => {
    if (!chainId) return undefined;
    return getWeb3(chainId);
  }, [chainId]);

  const lockAddress = useMemo(() => {
    if (!chainId) return contract["default"].lockAddress;
    return contract[chainId]
      ? contract[chainId].lockAddress
      : contract["default"].lockAddress;
  }, [chainId]);

  const [stats, setStats] = useState<{
    lockdata: ILockData[];
    allNormalTokenLockedCount: number;
    tokenList: any[];
    loading: boolean;
    cumulativeLockInfo: number;
    CurrentLockedAmount: number;
    TokenAddress: string;
    TokenName: string;
    TokenSymbol: string;
    TokenDecimals: string;
  }>({
    allNormalTokenLockedCount: 0,
    tokenList: [],
    loading: true,
    cumulativeLockInfo: 0,
    CurrentLockedAmount: 0,
    TokenAddress: "",
    TokenName: "",
    TokenSymbol: "",
    TokenDecimals: "",
    lockdata: [],
  });

  const mc = useMemo(() => {
    if (!chainId) return undefined;
    return MulticallContractWeb3(chainId);
  }, [chainId]);

  const pmc = useMemo(() => {
    if (!web3) return undefined;
    // @ts-ignore
    return new web3.eth.Contract(lockAbi, lockAddress);
  }, [web3, lockAddress]);

  const tc = useMemo(() => {
    if (!web3) return undefined;
    // @ts-ignore
    return new web3.eth.Contract(tokenAbi, urlAddress);
  }, [urlAddress, web3]);

  const lpContract = useMemo(() => {
    if (!web3) return undefined;
    // @ts-ignore
    return new web3.eth.Contract(LPAbi, urlAddress);
  }, [urlAddress, web3]);

  useEffect(() => {
    if (mc && lpContract && tc && web3 && pmc) {
      const fetch = async () => {
        try {
          let data = [];
          let lp = true;
          try {
            let token0 = await lpContract.methods.token0().call();
            let token1 = await lpContract.methods.token1().call();

            let token0Contract = await getWeb3Contract(
              // @ts-ignore
              tokenAbi,
              token0,
              chainId
            );
            let token1Contract = await getWeb3Contract(
              // @ts-ignore
              tokenAbi,
              token1,
              chainId
            );

            data = await mc.aggregate([
              pmc.methods.totalLockCountForToken(urlAddress),
              token0Contract.methods.symbol(),
              token1Contract.methods.symbol(),
              lpContract.methods.decimals(),
              pmc.methods.cumulativeLockInfo(urlAddress),
            ]);
            lp = true;
          } catch (err: any) {
            console.log(err.message);
            data = await mc.aggregate([
              pmc.methods.totalLockCountForToken(urlAddress),
              tc.methods.name(),
              tc.methods.symbol(),
              tc.methods.decimals(),
              pmc.methods.cumulativeLockInfo(urlAddress),
            ]);
            lp = false;
          }

          const lockdata = await mc.aggregate([
            pmc.methods.getLocksForToken(
              urlAddress,
              0,
              data[0] <= 0 ? 0 : data[0] - 1
            ),
          ]);

          setStats({
            allNormalTokenLockedCount: 0,
            loading: false,
            tokenList: [],
            cumulativeLockInfo: data[4][2] / Math.pow(10, data[3]),
            CurrentLockedAmount: 0,
            TokenAddress: urlAddress || "",
            TokenName: lp ? `${data[1]}/${data[2]}` : data[1],
            TokenSymbol: lp ? `${data[1]}/${data[2]}` : data[2],
            TokenDecimals: data[3],
            lockdata: lockdata[0],
          });
        } catch (err: any) {
          console.log(err.message);
          // toast.error(err.message)
          // history.push('/');
        }
      };
      fetch();
    } else {
      setStats({
        allNormalTokenLockedCount: 0,
        loading: false,
        tokenList: [],
        cumulativeLockInfo: 0,
        CurrentLockedAmount: 0,
        TokenAddress: "",
        TokenName: "",
        TokenSymbol: "",
        TokenDecimals: "",
        lockdata: [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lpContract, web3]);

  return stats;
};

export const useRecordStats = (updater: { lockId?: string }) => {
  const context = useAuth();
  const { chainId } = context;
  const lockId = updater.lockId;

  const web3 = useMemo(() => {
    if (!chainId) return undefined;
    return getWeb3(chainId);
  }, [chainId]);

  const lockAddress = useMemo(() => {
    if (!chainId) return contract["default"].lockAddress;
    return contract[chainId]
      ? contract[chainId].lockAddress
      : contract["default"].lockAddress;
  }, [chainId]);

  const [stats, setStats] = useState<{
    amount: number;
    cycle: number;
    cycleBps: number;
    id: number;
    lockDate: number;
    tgeBps: number;
    tgeDate: number;
    unlockedAmount: number;
    withdrawableTokens: number;
    TokenAddress: string;
    owner: string;
    TokenName: string;
    TokenSymbol: string;
    TokenDecimals: string;
    description: string;
  }>({
    TokenAddress: "",
    TokenName: "",
    TokenSymbol: "",
    TokenDecimals: "",
    amount: 0,
    cycle: 0,
    cycleBps: 0,
    id: 0,
    lockDate: 0,
    owner: "",
    tgeBps: 0,
    tgeDate: 0,
    unlockedAmount: 0,
    withdrawableTokens: 0,
    description: "",
  });

  const mc = useMemo(() => {
    if (!chainId) return undefined;
    return MulticallContractWeb3(chainId);
  }, [chainId]);

  const pmc = useMemo(() => {
    if (!web3) return undefined;
    // @ts-ignore
    return new web3.eth.Contract(lockAbi, lockAddress);
  }, [web3, lockAddress]);

  useEffect(() => {
    if (mc && web3 && pmc && mc && lockId) {
      const fetch = async () => {
        try {
          const data = await mc.aggregate([
            pmc.methods.getLockById(lockId),
            pmc.methods.withdrawableTokens(lockId),
          ]);
          let tokendata = [];
          let lp = true;

          try {
            // @ts-ignore
            let lpContract = new web3.eth.Contract(LPAbi, data[0].token);
            let token0 = await lpContract.methods.token0().call();
            let token1 = await lpContract.methods.token1().call();

            let token0Contract = await getWeb3Contract(
              // @ts-ignore
              tokenAbi,
              token0,
              chainId
            );
            let token1Contract = await getWeb3Contract(
              // @ts-ignore
              tokenAbi,
              token1,
              chainId
            );

            tokendata = await mc.aggregate([
              token0Contract.methods.symbol(),
              token1Contract.methods.symbol(),
              lpContract.methods.decimals(),
            ]);
            lp = true;
          } catch (err: any) {
            // @ts-ignore
            let tc = new web3.eth.Contract(tokenAbi, data[0].token);

            tokendata = await mc.aggregate([
              tc.methods.name(),
              tc.methods.symbol(),
              tc.methods.decimals(),
            ]);
            lp = false;
          }

          setStats({
            TokenAddress: data[0].token,
            TokenName: lp ? `${tokendata[0]}/${tokendata[1]}` : tokendata[0],
            TokenSymbol: lp ? `${tokendata[0]}/${tokendata[1]}` : tokendata[1],
            TokenDecimals: tokendata[2],
            amount: data[0].amount / Math.pow(10, tokendata[2]),
            cycle: data[0].cycle,
            cycleBps: data[0].cycleBps,
            id: data[0].id,
            lockDate: data[0].lockDate,
            owner: data[0].owner,
            tgeBps: data[0].tgeBps,
            tgeDate: data[0].tgeDate,
            unlockedAmount: data[0].unlockedAmount / Math.pow(10, tokendata[2]),
            description: data[0].description,
            withdrawableTokens: data[1] / Math.pow(10, tokendata[2]),
          });
        } catch (err: any) {
          console.log(err);
        }
      };
      fetch();
    } else {
      setStats({
        TokenAddress: "",
        TokenName: "",
        TokenSymbol: "",
        TokenDecimals: "",
        amount: 0,
        cycle: 0,
        cycleBps: 0,
        id: 0,
        lockDate: 0,
        owner: "",
        tgeBps: 0,
        tgeDate: 0,
        unlockedAmount: 0,
        withdrawableTokens: 0,
        description: "",
      });
    }
  }, [chainId, mc, web3, pmc, lockId]);

  return stats;
};

export const useMyTokenLockStats = (updater: { loading: boolean }) => {
  let { loading } = updater;

  const context = useAuth();
  const { chainId, account } = context;
  let location = useRouter();
  let lockId = location.pathname.split("/").pop();

  const web3 = useMemo(() => {
    if (!chainId) return undefined;
    return getWeb3(chainId);
  }, [chainId]);

  const lockAddress = useMemo(() => {
    if (!chainId) return contract["default"].lockAddress;
    return contract[chainId]
      ? contract[chainId].lockAddress
      : contract["default"].lockAddress;
  }, [chainId]);

  const mc = useMemo(() => {
    if (!chainId) return undefined;
    return MulticallContractWeb3(chainId);
  }, [chainId]);

  const pmc = useMemo(() => {
    if (!web3) return undefined;
    // @ts-ignore
    return new web3.eth.Contract(lockAbi, lockAddress);
  }, [web3, lockAddress]);

  const [stats, setStats] = useState<{
    allNormalTokenLockedCount: number;
    tokenList: ITokenList[];
    loading: boolean;
  }>({
    allNormalTokenLockedCount: 0,
    tokenList: [],
    loading: true,
  });

  useEffect(() => {
    if (mc && pmc && account && chainId && web3) {
      const fetch = async () => {
        try {
          const data = await mc.aggregate([
            pmc.methods.normalLockCountForUser(account),
          ]);

          if (data[0] > 0) {
            const lockdata = await mc.aggregate([
              pmc.methods.normalLocksForUser(account),
            ]);

            Promise.all(
              lockdata[0].map(async (value: any) => {
                // @ts-ignore
                let tc = new web3.eth.Contract(tokenAbi, value.token);
                const tokendata = await mc.aggregate([
                  tc.methods.name(),
                  tc.methods.symbol(),
                  tc.methods.decimals(),
                ]);
                return {
                  amount: value.amount,
                  decimals: tokendata[2],
                  token: value.token,
                  factory: value.factory,
                  name: tokendata[0],
                  symbol: tokendata[1],
                };
              })
            ).then((result) => {
              setStats({
                allNormalTokenLockedCount: data[0],
                tokenList: result,
                loading: !loading,
              });
            });
          } else {
            setStats({
              allNormalTokenLockedCount: data[0],
              tokenList: [],
              loading: !loading,
            });
          }
        } catch (err: any) {
          toast.error(err.reason);
          // history.push("/");
        }
      };
      fetch();
    } else {
      setStats({
        allNormalTokenLockedCount: 0,
        tokenList: [],
        loading: !loading,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, mc, pmc, account, web3]);

  return stats;
};

export const useMyLpLockStats = (updater: { loading: boolean }) => {
  let { loading } = updater;

  const context = useAuth();
  const { chainId, account } = context;
  let history = useRouter();

  const web3 = useMemo(() => {
    if (!chainId) return undefined;
    return getWeb3(chainId);
  }, [chainId]);

  const lockAddress = useMemo(() => {
    if (!chainId) return contract["default"].lockAddress;
    return contract[chainId]
      ? contract[chainId].lockAddress
      : contract["default"].lockAddress;
  }, [chainId]);

  const mc = useMemo(() => {
    if (!chainId) return undefined;
    return MulticallContractWeb3(chainId);
  }, [chainId]);

  const pmc = useMemo(() => {
    if (!web3) return undefined;
    // @ts-ignore
    return new web3.eth.Contract(lockAbi, lockAddress);
  }, [web3, lockAddress]);

  const [stats, setStats] = useState<{
    allNormalTokenLockedCount: number;
    tokenList: ITokenList[];
    loading: boolean;
  }>({
    allNormalTokenLockedCount: 0,
    tokenList: [],
    loading: true,
  });

  useEffect(() => {
    if (mc && account && chainId && pmc && web3) {
      const fetch = async () => {
        try {
          const data = await mc.aggregate([
            pmc.methods.lpLockCountForUser(account),
          ]);

          if (data[0] > 0) {
            const lockdata = await mc.aggregate([
              pmc.methods.lpLocksForUser(account),
            ]);

            Promise.all(
              lockdata[0].map(async (value: any) => {
                // @ts-ignore
                let lpContract = new web3.eth.Contract(LPAbi, value.token);
                let token0 = await lpContract.methods.token0().call();
                let token1 = await lpContract.methods.token1().call();

                let token0Contract = await getWeb3Contract(
                  // @ts-ignore
                  tokenAbi,
                  token0,
                  chainId
                );
                let token1Contract = await getWeb3Contract(
                  // @ts-ignore
                  tokenAbi,
                  token1,
                  chainId
                );

                let tokendata = await mc.aggregate([
                  token0Contract.methods.symbol(),
                  token1Contract.methods.symbol(),
                  lpContract.methods.decimals(),
                ]);
                return {
                  amount: value.amount,
                  decimals: tokendata[2],
                  token: value.token,
                  factory: value.factory,
                  name: `${tokendata[0]}/${tokendata[1]}`,
                  symbol: `${tokendata[0]}/${tokendata[1]}`,
                };
              })
            ).then((result) => {
              setStats({
                allNormalTokenLockedCount: data[0],
                // @ts-ignore
                tokenList: result,
                loading: !loading,
              });
            });
          } else {
            setStats({
              allNormalTokenLockedCount: data[0],
              tokenList: [],
              loading: !loading,
            });
          }
        } catch (err: any) {
          toast.error(err.reason);
          // history.push("/");
        }
      };
      fetch();
    } else {
      setStats({
        allNormalTokenLockedCount: 0,
        tokenList: [],
        loading: !loading,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, mc, account, pmc, web3]);

  return stats;
};
