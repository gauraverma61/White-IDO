import PadCard from "@molecules/PadCard";
import React from "react";
import cardBanner from "@public/images/airdrop/bannerImg.png";
import logoImg from "@public/images/airdrop/logoImg.png";
import tokenImg from "@public/images/airdrop/dot.svg";
import {
  IPoolData,
  usePools,
} from "@components/LaunchPad/Details/hooks/usePool";
import useAuth from "@hooks/useAuth";
import Link from "next/link";

const RecentPadSection = () => {
  const { stats } = usePools({
    orderBy: "startTime",
    orderDirection: "desc",
    where: {},
    where_contributor: {},
    first: 6,
    skip: 0,
  });

  const { chainId } = useAuth();

  return (
    <>
      {stats && stats.length > 0 && (
        <div className="mb-32 relative z-10">
          {/*<div className="grad-bg h-[400px] w-full sm:w-[400px] -z-10 right-0 -mt-[200px] top-[50%]"></div>*/}
          <div className=" text-primary-text text-3xl lg:text-5xl mb-14 font-bold">
            Recent Projects
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-12 gap-x-20 2xl:gap-x-24">
            {stats &&
              stats.map((data, index) => {
                return <PadCard key={index} data={data} />;
              })}
          </div>
          <div className="flex justify-center">
            <Link href={`/launchpad/list?blockchain=${chainId}`}>
              <button className="w-full md:max-w-[253px]  border border-primary-green py-3.5 mt-24 bg-card-green-bg3-color text-lg text-white">
                Explore Projects
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default RecentPadSection;
