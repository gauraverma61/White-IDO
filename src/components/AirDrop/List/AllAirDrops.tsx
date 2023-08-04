import React, { useState } from "react";
import { useAirdropPoolListStats } from "@components/AirDrop/List/hooks/useStats";
import Pagination, { IPaginationSelected } from "@components/Pagination";
import Loader from "@components/Loader";
import AirdropCard from "./Card";

const AllAirDrops = () => {
  const [updater, setUpdater] = useState({
    page: 0,
    pageSize: 3,
    loading: true,
  });
  const stats = useAirdropPoolListStats(updater);
  const handlePageClick = ({ selected }: IPaginationSelected) => {
    setUpdater({
      ...updater,
      page: selected,
    });
  };
  return (
    <>
      {stats.loading ? (
        <div className="flex items-center justify-center z-10 relative h-[400px]">
          <Loader />
        </div>
      ) : (
        <div className="">
          {stats.poolList.length <= 0 ? (
            <div className="flex text-lg justify-center items-center text-white mb-20 h-[400px]">
              No data
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-12 gap-x-12 lg:gap-x-24 z-10 relative mt-10">
                {stats.poolList.map((lp, index) => {
                  return <AirdropCard key={index} data={lp} />;
                })}
              </div>
              <Pagination
                handlePageClick={handlePageClick}
                pageSize={stats.pageSize}
                itemsLength={stats.getTotalNumberOfPools + 1}
              />
            </>
          )}
        </div>
      )}
    </>
  );
};
export default AllAirDrops;
