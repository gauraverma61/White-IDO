import React from "react";
import { useRouter } from "next/router";
import { useDetailsStats } from "@components/Locker/Token/hooks/useStats";
import { trimAddress } from "@constants/constant";
import { formatUnits } from "ethers/lib/utils";
import moment from "moment";
import BannerImage from "@public/images/tokenBannerImage.png";
import { walletNameTrimmer } from "@helpers/walletNameTrimmer";
import { TIME_FORMAT } from "@constants/timeFormats";
import useWidth from "@hooks/useWidth";

const tableHeader = [
  // "ID",
  "Wallet",
  "Amount",
  "Cycle",
  "Cycle Release %",
  "First Release %",
  "Unlock time (UTC)",
];

const TokenInfoComp = () => {
  const router = useRouter();
  const width = useWidth();
  const address = router.query.id;
  const stats = useDetailsStats({
    address: Array.isArray(address) ? address[0] : address,
  });

  const onViewHandler = (address: string) => {
    router.push(`/pario-lock/unlock-token/${address}`);
  };

  console.log("stats", stats);

  const tokenInfo = [
    {
      title: "Token Address",
      value: stats.TokenAddress,
      type: "address",
    },
    {
      title: "Total Locked Amount",
      value: `${stats.cumulativeLockInfo} ${stats.TokenSymbol.toUpperCase()}`,
    },
    {
      title: "Token Name",
      value: stats.TokenName,
    },
    // {
    //   title: "Token Symbol",
    //   value: stats.TokenSymbol,
    // },
    // {
    //   title: "Token Decimals",
    //   value: stats.TokenDecimals,
    // },
  ];

  return (
    <>
      <div className="container mx-auto pt-20 lg:pt-28 ">
        <div className="  text-5xl mt-4 text-primary-green font-semibold mb-12">
          Token Information and Lock Records
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mb-12 md:mb-20 ">
          {tokenInfo.map((data, index) => {
            return (
              <div
                key={index}
                className=" px-4 py-7 border border-primary-green  text-2xl bg-blur-background2 text-center">
                <div className="text-white text-lg">{data.title}</div>
                <div className="text-primary-green text-2xl mt-2">
                  {data.type == "address"
                    ? walletNameTrimmer(data.value)
                    : data.value}
                </div>
              </div>
            );
          })}
        </div>
        <div className="border border-primary-green  overflow-hidden pb-10">
          <div className="overflow-x-auto">
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
                {stats.lockdata.map((singleData, index) => {
                  return (
                    <tr
                      key={index}
                      className="hover border-b border-dull-border last:border-0 py-3 p-4">
                      <td className="text-base whitespace-nowrap font-medium md:pl-8 pl-4">
                        {trimAddress(singleData.owner)}
                      </td>
                      <td className="text-base whitespace-nowrap font-normal p-4">
                        {formatUnits(singleData.amount, stats.TokenDecimals)}
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
    </>
  );
};

export default TokenInfoComp;
