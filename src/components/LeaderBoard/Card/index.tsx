import React, { useMemo } from "react";
import Image, { StaticImageData } from "next/image";
import moment from "moment";
import { IPoolData } from "@components/LaunchPad/Details/hooks/usePool";
import { log } from "console";
import { CountdownTimer } from "@atoms/CountdownTimer";
import getProjectLink from "@helpers/getProjectLink";
import useAuth from "@hooks/useAuth";
import { supportNetwork } from "@constants/network";
import Link from "next/link";
import pIcon from "@public/images/p-icon.png";

interface IProps {
  listTitle: string;
  value: string;
  startTime: string;
  logo: string;
  banner: string;
  type: string;
  id: string;
  poolDetails: {
    title: string;
  };
  totalRaised: string;
  payment_currency: IPoolData["payment_currency"];
}

const Card: React.FC<IProps> = (props: IProps) => {
  const {
    listTitle,
    value,
    startTime,
    logo,
    banner,
    type,
    id,
    poolDetails,
    totalRaised,
    payment_currency,
  } = props;
  const { chainId } = useAuth();

  const poolLink = getProjectLink(id, type, chainId);

  return (
    <Link href={`/${poolLink}`}>
      <div className="cardHover text-white overflow-hidden border-primary-green rounded-old-3xl gap-8 bg-secondary-dark">
        <div
          className="bg-black bg-cover bg-no-repeat bg-center text-center h-[200px] lg:h-[276px] w-full"
          style={{ background: `url(${banner})` }}></div>
        <div className="px-2 py-4 border-t border-primary-green bg-[#000]">
          <div className="bg-black mx-auto p-3 ">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center w-full">
                <div className="mr-4 h-10 w-10  border border-primary-green overflow-hidden">
                  <img src={logo} alt={"Sea"} />
                </div>
                <h3 className="text-2xl truncate"> {poolDetails.title}</h3>
              </div>
              {/* <div>
                <img src={pIcon.src} alt={"PIcon"} />
              </div> */}
            </div>
            <div className="border-b border-secondary-green-border mb-3"></div>
            <div className="flex justify-between text-sm my-2">
              <div className="text-gray12">Launch With</div>
              <div className=" text-right">
                {totalRaised}
                &nbsp;
                <span className="">
                  {supportNetwork[chainId || "default"]?.symbol}
                </span>
              </div>
            </div>
            <div className="flex justify-between text-sm my-2">
              <div className="text-gray12">Launched At</div>
              <div className="text-right">
                {moment
                  .unix(Number(startTime))
                  .utc()
                  .format("YYYY.MM.DD - HH:mm A")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
