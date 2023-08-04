import React, { useMemo } from "react";
import Image, { StaticImageData } from "next/image";
import moment from "moment";
import { IPoolData } from "@components/LaunchPad/Details/hooks/usePool";
import { log } from "console";
import { CountdownTimer } from "@atoms/CountdownTimer";
import getProjectLink from "@helpers/getProjectLink";
import useAuth from "@hooks/useAuth";
import Link from "next/link";
import pIcon from "@public/images/p-icon.png";
import { getProjectStartEndTime } from "@components/LaunchPad/List/LaunchPadAdvanceMode";

interface IProps {
  data: IPoolData;
}
interface ICardWrapper {
  children: React.ReactNode;
  projectStatus: string;
  banner: string;
  logo: string;
  title: string;
  description?: string;
}

export const CardWrapper: React.FC<ICardWrapper> = ({
  children,
  projectStatus,
  banner,
  logo,
  title,
  description,
}) => {
  return (
    <div className=" relative border text-white overflow-hidden border-primary-green-border rounded-old-3xl shadow-card-shadow-primary gap-8 bg-secondary-dark">
      <div className="absolute font-medium capitalize left-3 top-3 text-xs text-black rounded-old-full px-2 py-1 bg-primary-green">
        {projectStatus}
      </div>
      <div
        className="bg-black bg-cover bg-no-repeat bg-center text-center h-[200px] lg:h-[276px] w-full"
        style={{
          backgroundImage: `url(${banner})`,
        }}></div>
      <div className="border-t border-primary-green">
        <div className="bg-black mx-auto p-3">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center w-full">
              <div className="mr-4 h-10 w-10 rounded-old-full border border-primary-green overflow-hidden">
                <img src={logo} alt={title.substring(0, 5)} />
              </div>
              <h3 className="text-2xl truncate">{title}</h3>
            </div>
          </div>
          <p className="pb-3 border-b border-secondary-green-border text-sm">
            {description?.substring(0, 35)}...
          </p>
          {children}
        </div>
      </div>
    </div>
  );
};

const PadCard: React.FC<IProps> = (props: IProps) => {
  const { data } = props;
  const { chainId } = useAuth();

  const project_status: "Loading..." | "upcoming" | "sale live" | "sale ended" =
    useMemo(() => {
      if (!data) return "Loading...";

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

  const poolLink = getProjectLink(data.id, data.type, chainId);

  return (
    <Link href={`/${poolLink}`} className="cardHover">
      <CardWrapper
        banner={data.banner}
        logo={data.logo}
        projectStatus={project_status}
        title={data.poolDetails.title}>
        <div className="flex justify-between text-sm my-3">
          <div className="text-gray12">Hardcap</div>
          <div className=" text-right">{data?.hardCap}</div>
        </div>
        <div className="flex justify-between text-sm my-3">
          <div className="text-gray12">Softcap</div>
          <div className=" text-right">{data?.softCap}</div>
        </div>
        <div className="flex justify-between text-sm my-3">
          <div className="text-gray12">Participants</div>
          <div className=" text-right">{data?.contributors?.length}</div>
        </div>
        <div className="flex justify-between text-sm my-3">
          <div className="text-gray12">Total raised</div>
          <div className=" text-right">{data?.totalRaised}</div>
        </div>
      </CardWrapper>
    </Link>
  );
};

export default PadCard;
