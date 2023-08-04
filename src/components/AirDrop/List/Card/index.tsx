import { CountdownTimer } from "@atoms/CountdownTimer";
import { IAirdropDetails } from "@components/AirDrop/Details/hooks/useStats";
import useAuth from "@hooks/useAuth";
import { CardWrapper } from "@molecules/PadCard";
import moment from "moment";
import Link from "next/link";
import React, { useMemo } from "react";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";

interface IProps {
  data: IAirdropDetails;
}

const AirdropCard: React.FC<IProps> = ({ data }) => {
  const { chainId } = useAuth();
  const poolLink = `airdrop/details/${data?.poolAddress}?blockchain=${chainId}`;

  const project_status = useMemo(() => {
    return data?.poolState === "0"
      ? moment.unix(Number(data?.startTime)).isAfter(moment())
        ? "upcoming"
        : moment.unix(Number(data?.startTime)).isBefore(moment())
        ? "airdrop live"
        : "airdrop ended"
      : "airdrop ended";
  }, [data?.poolState]);

  return (
    <CardWrapper
      projectStatus={project_status}
      logo={data?.poolDetails?.logo}
      title={data?.poolDetails?.title}
      banner={data?.poolDetails?.banner}
      description={data?.poolDetails?.description as string}>
      <div className="flex justify-between gap-3 text-sm my-3">
        <div className="text-gray12">Airdrop Claimed</div>
        <div className=" text-right">
          {data?.totalClaimed / 10 ** data?.token?.decimals}
        </div>
      </div>
      <div className="flex justify-between gap-3 text-sm my-3">
        <div className="text-gray12">Participants</div>
        <div className=" text-right">{data?.totalusers}</div>
      </div>
      <div className="flex justify-between gap-3 text-sm my-3">
        <div className="text-gray12">Total Cost</div>
        <div className=" text-right">
          {parseFloat(data?.totalCost) / 10 ** data?.token?.decimals}
        </div>
      </div>
      <div className="flex justify-between gap-3 text-sm my-3">
        <div className="text-gray12">Countdown</div>
        <div className=" text-right">
          <CountdownTimer isTimeUnix variant="inBox" date={data?.startTime} />
        </div>
      </div>
      <div className="flex items-center justify-end">
        <Link href={`/${poolLink}`}>
          <div className="text-primary-green cursor-pointer flex gap-2 items-center hover:font-semibold hover:scale-110 transition ease-out">
            View{" "}
            <span>
              <HiOutlineArrowNarrowRight />
            </span>
          </div>
        </Link>
      </div>
    </CardWrapper>
  );
};

export default AirdropCard;
