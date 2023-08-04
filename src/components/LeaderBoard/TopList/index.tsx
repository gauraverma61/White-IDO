import React from "react";
import Loader from "@components/Loader";
import Card from "../Card";
import useSWR from "swr";
import { usePools } from "@components/LaunchPad/Details/hooks/usePool";

const TopList = () => {
  const { stats: data, isLoading } = usePools({
    first: 3,
    skip: 0,
    orderBy: "totalRaised",
    orderDirection: "desc",
    where: {},
    where_contributor: {},
  });

  return (
    <div className="">
      <div className="h-20 mb-6">
        {isLoading ? (
          <div className="flex items-center justify-center z-10 relative h-full">
            <Loader className="!h-6 !w-6 !m-0" />
          </div>
        ) : (
          <></>
        )}
      </div>
      {data && data.length === 0 ? (
        <div className="flex justify-center items-center">
          <p className="text-center text-white mt-20">No Data</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-20 lg:gap-12 xl:gap-20">
          {data &&
            data.map((data: any, index: number) => {
              return <Card key={index} {...data} />;
            })}
        </div>
      )}
    </div>
  );
};

export default TopList;
