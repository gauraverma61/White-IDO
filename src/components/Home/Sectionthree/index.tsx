import React, { useState, useMemo } from "react";
import Marquee from "react-fast-marquee";
import HoverImage from "@components/Common/HoverImage";
import Link from "next/link";
import moment from "moment";
import Button from "@atoms/Button";
import {
  IPoolData,
  usePools,
} from "@components/LaunchPad/Details/hooks/usePool";
import getProjectLink from "@helpers/getProjectLink";
import useAuth from "@hooks/useAuth";
import useSWR from "swr";
import {
  getProjectStartEndTime,
  getProjectStatus,
} from "@components/LaunchPad/List/LaunchPadAdvanceMode";

const RenderPoolCircles = ({
  item,
  index,
  chainId,
}: {
  item: IPoolData;
  index: number;
  chainId?: number;
}) => {
  const project_status = useMemo(() => {
    if (!item) return "Loading...";

    return getProjectStatus(item);
  }, [item]);

  const project_time = useMemo(() => {
    if (project_status == "upcoming")
      return moment(getProjectStartEndTime(item).startTime).unix();
    return moment(getProjectStartEndTime(item).endTime).unix();
  }, [item, project_status]);

  return (
    <div
      className="flex items-center justify-center relative mx-2.5"
      key={index}>
      <HoverImage
        type="HomeBanner"
        hardCap={item?.hardCap}
        src={item.logo}
        borderRadius="rounded-old-full"
        classTag={`object-cover rounded-old-full homeCircle aspect-square`}
        tagName={project_status}
        textClass="text-lg my-1"
        tokenName={`${item.poolDetails?.title ?? item.token?.name}`}
        detailsLink={getProjectLink(item.id, item.type, chainId)}
        startTime={String(item.startTime)}
        endTime={String(item.endTime)}
        time={String(project_time)}
      />
    </div>
  );
};
const SectionThree = () => {
  const { chainId } = useAuth();
  const { stats } = usePools({
    orderBy: "startTime",
    orderDirection: "desc",
    where: {},
    where_contributor: {},
    first: 24,
    skip: 0,
  });

  const { data: kycData, isValidating: isPoolsLoading } = useSWR(
    `/api/v1/presales?filter[id]=${stats
      ?.map((pool: IPoolData) => pool.id)
      ?.join(",")}`,
    (url: string) => fetch(url).then((r) => r.json())
  );
  return (
    <div className=" overflow-hidden mt-28 lg:mt-36 mb-14">
      <div className="flex justify-center md:justify-between items-center mb-12 relative md:left-[100px]">
        <div className="relative ml-5">
          <h4 className="font-fonde uppercase text-4xl md:text-6xl 2xl:text-7xl">
            launchpad
          </h4>
          <Link href={"/launchpad/list"}>
            <Button
              variant="primary-sm"
              className="absolute uppercase text-xs sm:text-sm right-[0.1rem] cursor-pointer px-6 py-3 rounded-old-full">
              View all
            </Button>
          </Link>
        </div>
        <div className=" relative md:flex justify-between items-center hidden w-full pl-3">
          <Marquee
            gradient={false}
            speed={30}
            direction="left"
            pauseOnHover={true}>
            {stats &&
              stats
                .filter((lp) => {
                  const tagsData = kycData?.data?.find(
                    (d: any) => d.id == lp.id.toLowerCase()
                  );
                  return !tagsData?.attributes?.hidden;
                })
                .slice(16, 24)
                .map((pool, index) => {
                  return (
                    <RenderPoolCircles
                      key={index}
                      item={pool}
                      index={index}
                      chainId={chainId}
                    />
                  );
                })}
          </Marquee>
          <div className="hidden md:block bg-white-lft absolute left-3 w-[20%] h-full z-20"></div>
        </div>
        <div className="bg-white-rt absolute right-24 w-[10%] h-full z-20"></div>
      </div>
      <div className="flex justify-between items-center mb-12 relative overflow-x-auto md:overflow-x-hidden">
        <Marquee
          gradient={false}
          speed={30}
          direction="right"
          pauseOnHover={true}>
          {stats &&
            stats
              .filter((lp) => {
                const tagsData = kycData?.data?.find(
                  (d: any) => d.id == lp.id.toLowerCase()
                );
                return !tagsData?.attributes?.hidden;
              })
              .slice(0, 8)
              .map((pool, index) => {
                return (
                  <RenderPoolCircles
                    key={index}
                    item={pool}
                    index={index}
                    chainId={chainId}
                  />
                );
              })}
        </Marquee>
        <div className="bg-white-rt absolute right-0 w-[10%] h-full z-20"></div>
        <div className="bg-white-lft absolute left-0 w-[10%] h-full z-20"></div>
      </div>
      <div className="md:flex justify-between items-center mb-12 relative hidden">
        <Marquee
          gradient={false}
          speed={30}
          direction="left"
          pauseOnHover={true}>
          {stats &&
            stats
              .filter((lp) => {
                const tagsData = kycData?.data?.find(
                  (d: any) => d.id == lp.id.toLowerCase()
                );
                return !tagsData?.attributes?.hidden;
              })
              .slice(8, 16)
              .map((pool, index) => {
                return (
                  <RenderPoolCircles
                    key={index}
                    item={pool}
                    index={index}
                    chainId={chainId}
                  />
                );
              })}
        </Marquee>
        <div className="bg-white-rt absolute right-0 w-[10%] h-full z-20"></div>
        <div className="bg-white-lft absolute left-0 w-[10%] h-full z-20"></div>
      </div>
    </div>
  );
};

export default SectionThree;
