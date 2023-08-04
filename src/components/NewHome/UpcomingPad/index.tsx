import React from "react";
import { usePools } from "@components/LaunchPad/Details/hooks/usePool";
import moment from "moment";
import Link from "next/link";
import useAuth from "@hooks/useAuth";
import { fetcher } from "@helpers/gqlFetcher";
import useSWR from "swr";
import { Card } from "@components/LaunchPad/NewList/AllLaunchpads";

const UpcomingPadSection = () => {
  const { chainId } = useAuth();

  const { stats: upcomingLaunchpads } = usePools({
    orderBy: "startTime",
    orderDirection: "desc",
    where: {
      startTime_gt: moment().utc().unix().toString(),
      poolState_not: "Cancelled",
    },
    where_contributor: {},
    first: 3,
    skip: 0,
  });

  const { data: kycData } = useSWR(
    `/api/v1/presales?filter[id]=${upcomingLaunchpads
      ?.map((pool) => pool.id)
      ?.join(",")}`,
    fetcher
  );

  return (
    <>
      {upcomingLaunchpads && upcomingLaunchpads?.length > 0 ? (
        <div id="upcoming" className="pt-24">
          <div className=" text-primary-text font-bold text-3xl lg:text-5xl mb-14">
            Upcoming on Pario
          </div>
          {upcomingLaunchpads && upcomingLaunchpads?.length > 0 ? (
            <div className="mb-32 z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-12 gap-x-12 lg:gap-x-24">
                {upcomingLaunchpads?.map((data, index) => {
                  return <Card data={data} key={index} kycData={kycData} />;
                })}
              </div>
              <div className="flex justify-center">
                <Link href={`/launchpad/list?blockchain=${chainId}`}>
                  <button className="w-full md:max-w-[253px] rounded-old-full border border-primary-green py-2.5 mt-24 bg-primary-green text-lg">
                    Explore Projects
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center text-white mb-32 h-[400px]">
              No data to show
            </div>
          )}
        </div>
      ) : (
        <div className="pt-0 lg:pt-20"></div>
      )}
    </>
  );
};

export default UpcomingPadSection;
