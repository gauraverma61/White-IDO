import { useEffect, useMemo, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { toast } from "react-toastify";
import { getWeb3 } from "@constants/connectors";
import { contract } from "@constants/constant";
import { MulticallContractWeb3 } from "@hooks/useContracts";
import poolFactoryAbi from "../../../ABIs/PoolFactory/PoolFactory.json";

export enum PoolType {
  presale,
  privatesale,
  fairsale,
}
export const usePoolFees = (updater: {}) => {
  const context = useWeb3React();
  const { chainId } = context;

  const web3 = useMemo(() => {
    if (!chainId) return undefined;
    return getWeb3(chainId);
  }, [chainId]);

  const poolFactoryAddress = useMemo(() => {
    if (!chainId) return contract["default"].poolfactory;
    return contract[chainId]
      ? contract[chainId].poolfactory
      : contract["default"].poolfactory;
  }, [chainId]);

  const [stats, setStats] = useState<{
    poolPrice: number;
    auditPrice: number;
    kycPrice: number;
  }>({
    poolPrice: 0,
    auditPrice: 0,
    kycPrice: 0,
  });

  const mc = useMemo(() => {
    if (!chainId) return undefined;
    return MulticallContractWeb3(chainId);
  }, [chainId]);

  const pmc = useMemo(() => {
    if (!web3) return undefined;
    // @ts-ignore
    return new web3.eth.Contract(poolFactoryAbi, poolFactoryAddress);
  }, [web3, poolFactoryAddress]);

  useEffect(() => {
    if (mc && pmc) {
      const fetch = async () => {
        try {
          const data = await mc.aggregate([pmc.methods.masterPrice()]);

          setStats({
            poolPrice: data[0] / Math.pow(10, 18),
            auditPrice: 0,
            kycPrice: 0,
          });
        } catch (err: any) {
          toast.error(err.reason ? err.reason : err.message);
        }
      };
      fetch();
    } else {
      setStats({
        poolPrice: 0,
        auditPrice: 0,
        kycPrice: 0,
      });
    }
    // eslint-disable-next-line
  }, [mc, pmc]);

  return stats;
};
