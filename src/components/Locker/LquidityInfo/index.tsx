import React from "react";
import { useRouter } from "next/router";
import InfoGrid from "@molecules/InfoGrid";

const lockerInfoData = [
  {
    title: "Current Locked Amount",
    value: "99,999.99",
  },
  {
    title: "Current Values Locked",
    value: "$61,656",
  },
  {
    title: "Token Address",
    value: "0x37cE660aA...",
  },
  {
    title: "Token Name",
    value: "Mutant Froggo",
  },
  {
    title: "Token Symbol",
    value: "FROGGO",
  },
  {
    title: "Token Decimals",
    value: "18",
  },
];

const tableHeader = [
  "Wallet",
  "Amount",
  "Cycle(d)",
  "Cycle Release(%)",
  "TGE(%)",
  "Unlock time(UTC)",
];

const lockRecordData = [
  {
    Wallet: "0xeD66...9Af1",
    Amount: "24000",
    cycle: "30",
    cycleRelease: "9.0",
    tge: "3.0",
    unlockTime: "2022.10.19 13:00",
  },
  {
    Wallet: "0xeD66...9Af1",
    Amount: "24000",
    cycle: "30",
    cycleRelease: "9.0",
    tge: "3.0",
    unlockTime: "2022.10.19 13:00",
  },
  {
    Wallet: "0xeD66...9Af1",
    Amount: "24000",
    cycle: "",
    cycleRelease: "",
    tge: "",
    unlockTime: "2022.10.19 13:00",
  },
  {
    Wallet: "0xeD66...9Af1",
    Amount: "24000",
    cycle: "",
    cycleRelease: "",
    tge: "",
    unlockTime: "2022.10.19 13:00",
  },
  {
    Wallet: "0xeD66...9Af1",
    Amount: "24000",
    cycle: "",
    cycleRelease: "",
    tge: "",
    unlockTime: "2022.10.19 13:00",
  },
  {
    Wallet: "0xeD66...9Af1",
    Amount: "24000",
    cycle: "",
    cycleRelease: "",
    tge: "",
    unlockTime: "2022.10.19 13:00",
  },
  {
    Wallet: "0xeD66...9Af1",
    Amount: "24000",
    cycle: "30",
    cycleRelease: "9.0",
    tge: "3.0",
    unlockTime: "2022.10.19 13:00",
  },
  {
    Wallet: "0xeD66...9Af1",
    Amount: "24000",
    cycle: "",
    cycleRelease: "",
    tge: "",
    unlockTime: "2022.10.19 13:00",
  },
];

const LiquidityInfoComp = () => {
  const router = useRouter();
  return (
    <div className=" mx-auto container py-[60px] lg:py-[80px] 2xl:py-[100px] px-8 lg:px-12">
      <h2 className="text-6xl font-fonde font-thin">Liquidity Info</h2>
      <div className="mt-[75px]">
        <h4 className="text-2xl font-medium">Liquidity lock details</h4>
        <div className="w-full md:w-1/2 h-1 border-b border-bordergraydark mt-8"></div>
        <div className="w-full md:w-1/2">
          <InfoGrid data={lockerInfoData} />
        </div>
      </div>
      <h4 className="text-2xl font-medium my-8">Lock records</h4>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-bordergraydark">
            <tr>
              {tableHeader.map((head, index) => {
                return (
                  <th
                    key={index}
                    className="bg-white capitalize text-lg font-medium p-4 text-left">
                    {head}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {lockRecordData.map((singleData, index) => {
              return (
                <tr
                  key={index}
                  className="hover border-b border-bordergraylight ">
                  <td className="text-base font-medium p-4">
                    {singleData.Wallet}
                  </td>
                  <td className="text-base font-normal p-4">
                    {singleData.Amount}
                  </td>
                  <td className="text-base font-normal p-4">
                    {singleData.cycle ? singleData.cycle : "--"}
                  </td>
                  <td className="text-base font-normal p-4">
                    {singleData.cycleRelease ? singleData.cycleRelease : "--"}
                  </td>
                  <td className="text-base font-normal p-4">
                    {singleData.tge ? singleData.tge : "--"}
                  </td>
                  <td className="text-base font-normal p-4">
                    {singleData.unlockTime}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LiquidityInfoComp;
