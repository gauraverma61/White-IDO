import { CountdownTimer } from "@atoms/CountdownTimer";
import { IPoolData } from "@components/LaunchPad/Details/hooks/usePool";
import { getProjectStartEndTime } from "@components/LaunchPad/List/LaunchPadAdvanceMode";
import { supportNetwork } from "@constants/network";
import getProjectLink from "@helpers/getProjectLink";
import useAuth from "@hooks/useAuth";
import { CardWrapper } from "@molecules/PadCard";
import { log } from "console";
import moment from "moment";
import Link from "next/link";
import React, { useMemo } from "react";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";

interface IProps {
  data: IPoolData;
  renderKycAudit?: () => JSX.Element;
}

const PoolCard: React.FC<IProps> = ({ data, renderKycAudit }) => {
  const { chainId } = useAuth();
  const project_status: "upcoming" | "sale live" | "sale ended" =
    useMemo(() => {
      if (data.poolState != "Ongoing") {
        return "sale ended";
      }

      let startTime, endTime;
      if (data.tier2EndTime || data.tier1EndTime) {
        if (data?.myContribution?.whitelisted) {
          if (data?.myContribution?.tier == 2 && data.tier2EndTime) {
            startTime = moment.unix(Number(data.tier1EndTime));
            endTime = moment.unix(Number(data.tier2EndTime));
          } else {
            startTime = moment.unix(Number(data.startTime));
            endTime = moment.unix(Number(data.tier2EndTime));
          }
        } else {
          startTime = moment.unix(Number(data.publicStartTime));
          endTime = moment.unix(Number(data.endTime));
        }
      } else {
        startTime = moment.unix(Number(data.startTime));
        endTime = moment.unix(Number(data.endTime));
      }

      let publicStartTime = moment.unix(Number(data.publicStartTime));
      let realEndTime = moment.unix(Number(data.endTime));

      if (startTime.isAfter(moment().utc())) {
        return "upcoming";
      } else if (
        endTime.isBefore(moment().utc()) &&
        publicStartTime.isAfter(moment().utc())
      ) {
        return "upcoming";
      } else if (
        realEndTime.isAfter(moment().utc()) &&
        publicStartTime.isBefore(moment().utc())
      ) {
        return "sale live";
      } else if (
        startTime.isBefore(moment().utc()) &&
        endTime.isAfter(moment().utc())
      ) {
        return "sale live";
      } else {
        return "sale ended";
      }
    }, [
      data?.endTime,
      data?.startTime,
      data?.tier1EndTime,
      data?.tier2EndTime,
      data?.myContribution?.tier,
      data?.myContribution?.whitelisted,
      data?.poolState,
    ]);

  const countDownTime = useMemo(() => {
    let starttime, endtime;
    if (data.tier2EndTime || data.tier2EndTime) {
      if (data?.myContribution?.whitelisted) {
        if (data?.myContribution?.tier == 2 && data.tier2EndTime) {
          starttime = data.tier2EndTime
            ? moment.unix(data.tier1EndTime)
            : moment.unix(data.startTime);
          endtime = data.tier2EndTime
            ? moment.unix(data.tier2EndTime)
            : moment.unix(data.endTime);
        } else {
          starttime = data.startTime
            ? moment.unix(data.startTime)
            : moment.unix(data.startTime);
          endtime = data.tier1EndTime
            ? moment.unix(data.tier1EndTime)
            : moment.unix(data.endTime);
        }
        if (
          data.tier2EndTime &&
          moment(moment.unix(Number(data?.tier2EndTime)).toString()).isBefore(
            moment(data.publicStartTime).utc()
          )
        ) {
          starttime = moment.unix(data.publicStartTime);
          endtime = moment.unix(data.endTime);
        }
      } else {
        starttime = data.publicStartTime
          ? moment.unix(data.publicStartTime)
          : moment.unix(data.startTime);
        endtime = moment.unix(data.endTime);
      }
    } else {
      starttime = moment.unix(data.startTime);
      endtime = moment.unix(data.endTime);
    }

    if (starttime.isAfter(moment().utc())) {
      return starttime;
    } else {
      return endtime;
    }
  }, [data.endTime, data.startTime, data, project_status]);

  const poolLink = getProjectLink(data.id, data.type, chainId);

  return (
    <CardWrapper
      projectStatus={project_status}
      logo={data.logo}
      title={data.poolDetails.title}
      banner={data.banner}
      description={data.poolDetails.description as string}>
      <div className="flex justify-between gap-3 text-sm my-3">
        <div className="text-gray12">Liquidity</div>
        <div className=" text-right">{data?.liquidityPercent}%</div>
      </div>
      <div className="flex justify-between gap-3 text-sm my-3">
        <div className="text-gray12">Coin</div>
        <div className=" text-right">
          {supportNetwork[chainId || "default"]?.symbol}
        </div>
      </div>
      <div className="flex justify-between gap-3 text-sm my-3">
        <div className="text-gray12">Progress</div>
        <div className=" text-right">{project_status}</div>
      </div>
      {renderKycAudit && (
        <div className="flex justify-between gap-3 text-sm my-3">
          <div className="text-gray12">Badges</div>
          <div className=" text-right">{renderKycAudit()}</div>
        </div>
      )}
      <div className="flex justify-between gap-3 text-sm my-3">
        <div className="text-gray12">Countdown</div>
        <div className=" text-right">
          <CountdownTimer variant="inBox" date={String(countDownTime)} />
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

export default PoolCard;
