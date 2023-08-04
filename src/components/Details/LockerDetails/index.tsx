import React, { useMemo } from "react";
import { useDetailsStats } from "@components/Locker/Token/hooks/useStats";
import { trimAddress } from "@constants/constant";
import { formatUnits } from "ethers/lib/utils";
import moment from "moment";
import { useRouter } from "next/router";
import Button from "@atoms/Button";
import { IPoolDetailsData } from "@components/Details";
import dynamic from "next/dynamic";
import { TIME_FORMAT } from "@constants/timeFormats";
import useAuth from "@hooks/useAuth";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface ILockerInfo {
  tokenAddress?: string;
  token: IPoolDetailsData["token"];
  liquidity?: IPoolDetailsData["liquidity"];
  hard_cap?: IPoolDetailsData["hard_cap"];
  fees?: IPoolDetailsData["fees"];
}

const tableHeader = [
  "Wallet",
  "Amount",
  "Cycle(d)",
  "Cycle Release(%)",
  "TGE(%)",
  "Unlock time(UTC)",
];

const LockerInfo: React.FC<ILockerInfo> = ({
  tokenAddress,
  token,
  liquidity,
  hard_cap,
  fees,
}) => {
  const lockerStats = useDetailsStats({
    address: tokenAddress,
  });

  const { chainId } = useAuth();
  const labels = useMemo(() => {
    const data = ["Total Supply"];
    if (liquidity && hard_cap && fees) data.push("Liquidity");
    lockerStats.lockdata.forEach((l) => {
      data.push(l.description);
    });
    return data;
  }, [fees, hard_cap, liquidity, lockerStats.lockdata]);

  const series = useMemo(() => {
    const data: number[] = [];
    if (liquidity && hard_cap && fees) {
      const liquidityTokens = parseFloat(
        (
          (hard_cap *
            liquidity.liquidityListingRate *
            liquidity.liquidityPercent) /
          100
        ).toFixed(2)
      );
      data.push(liquidityTokens);
    }
    lockerStats.lockdata.forEach((l) => {
      data.push(
        parseFloat((Number(l.amount) / 10 ** token.decimals).toFixed(2))
      );
    });
    const supply = parseFloat(
      (
        token.supply - (data.length > 0 ? data?.reduce((p, c) => p + c) : 0)
      ).toFixed(2)
    );
    return [supply].concat(data);
  }, [
    fees,
    hard_cap,
    liquidity,
    lockerStats.lockdata,
    token.decimals,
    token?.supply,
  ]);

  const router = useRouter();

  const onViewHandler = (address: string) => {
    router.push(`/pario-lock/unlock-token/${address}?blockchain=${chainId}`);
  };

  if (lockerStats.lockdata.length === 0) {
    return (
      <div className=" text-white py-8">
        {/* <p className=" text-primary-green text-xl font-medium mb-6 border-b border-secondary-green pb-2">
          Vesting
        </p> */}
        <p className="">No Vesting to show </p>
      </div>
    );
  }

  return (
    <div>
      {/* <div className="text-white">Lock</div> */}
      {/* {series?.length > 1 && (
        <div
          className={`shadow-boxShadow1 p-8  border border-primary-green mt-8`}>
          <p className="text-primary-green text-xl font-medium mb-6 pb-1">
            Token Metrics
          </p>
          <div className="my-6">
            <ReactApexChart
              options={{
                labels: labels,
              }}
              series={series}
              type="donut"
              width={"100%"}
            />
          </div>
        </div>
      )} */}

      {lockerStats.lockdata.length > 0 && (
        <div className={""}>
          <div className="border border-primary-green  px-4  overflow-hidden pb-10">
            <div className="overflow-x-auto pb-8">
              <table className=" w-full text-white">
                <thead className="">
                  <tr>
                    {tableHeader.map((head, index) => {
                      return (
                        <th
                          key={index}
                          className={`${
                            index == 0 && "md:pl-8"
                          } text-start text-lg font-medium whitespace-nowrap p-4 pt-10 `}>
                          {head}
                        </th>
                      );
                    })}
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {lockerStats.lockdata.map((singleData, index) => {
                    return (
                      <tr
                        key={index}
                        className="hover border-b border-dull-border last:border-0 py-3 p-4">
                        <td className="text-base whitespace-nowrap font-medium md:pl-8 pl-4">
                          {trimAddress(singleData.owner)}
                        </td>
                        <td className="text-base whitespace-nowrap font-normal p-4">
                          {formatUnits(
                            singleData.amount,
                            lockerStats.TokenDecimals
                          )}
                        </td>
                        <td className="text-base  whitespace-nowrap font-normal p-4">
                          {singleData.cycle
                            ? parseInt(singleData.cycle) / (24 * 60 * 60)
                            : "--"}{" "}
                          Days
                        </td>
                        <td className="text-base whitespace-nowrap font-normal p-4">
                          {singleData.cycleBps
                            ? parseFloat(singleData.cycleBps) / 100
                            : "--"}
                        </td>
                        <td className="text-base whitespace-nowrap font-normal p-4">
                          {singleData.tgeBps
                            ? parseFloat(singleData.tgeBps) / 100
                            : "--"}
                        </td>
                        <td className="text-base whitespace-nowrap font-normal p-4">
                          {moment
                            .unix(Number(singleData.tgeDate))
                            .utc()
                            .format(TIME_FORMAT)}
                        </td>

                        <td onClick={() => onViewHandler(singleData.id)}>
                          <div className=" text-primary-green cursor-pointer pr-8 p-4">
                            View
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LockerInfo;
