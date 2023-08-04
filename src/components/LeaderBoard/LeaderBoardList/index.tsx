import { supportNetwork } from "@constants/network";
import useAuth from "@hooks/useAuth";
import moment from "moment";
import Link from "next/link";
import React from "react";
import getProjectLink from "@helpers/getProjectLink";
import { IPoolData } from "@components/LaunchPad/Details/hooks/usePool";

interface IProps {
  listTitle: string;
  value: string;
  startTime: string;
  logo: string;
  type: string;
  id: string;
  poolDetails: string;
  totalRaised: string;
  payment_currency: IPoolData["payment_currency"];
}

const LeaderBoardList = (props: IProps) => {
  const {
    listTitle,
    value,
    startTime,
    logo,
    type,
    id,
    poolDetails,
    totalRaised,
    payment_currency,
  } = props;
  const { chainId } = useAuth();

  return (
    <div className="text-base font-normal py-2.5 border-b border-bordergraylight flex flex-col md:flex-row  items-start md:items-center justify-between md:px-3">
      <div className="flex items-center">
        <div className=" h-[38px] w-[38px] rounded-old-full bg-[#D9D9D9] mr-2 md:mr-4">
          <img
            src={logo}
            className="h-[38px] w-[38px] rounded-old-full"
            alt=""
          />
        </div>
        <div>
          <div className="font-medium">
            {JSON.parse(poolDetails).title
              ? JSON.parse(poolDetails).title
              : "Unknown"}
          </div>
          <div className="flex flex-col md:flex-row">
            <div className=" text-primary-violet mr-3">
              {parseFloat(totalRaised) /
                10 **
                  ((payment_currency?.decimals || 18) > 0
                    ? payment_currency?.decimals || 18
                    : 18)}{" "}
              &nbsp;
              <span className="text-xs font-semibold">
                {supportNetwork[chainId || "default"]?.symbol}
              </span>
            </div>
            <div>
              <span className="font-medium">Listing time (UTC):</span>{" "}
              {moment
                .unix(Number(startTime))
                .utc()
                .format("YYYY.MM.DD - HH:mm A")}
            </div>
          </div>
        </div>
      </div>
      <Link href={getProjectLink(id, type, chainId)}>
        <div className="bg-[#141414] hover:outline hover:outline-1 hover:bg-[#ffffff] px-4 py-3 text-white hover:text-[#141414] rounded-old-[40px] min-w-fit cursor-pointer my-2.5">
          View Pool
        </div>
      </Link>
    </div>
  );
};

export default LeaderBoardList;
