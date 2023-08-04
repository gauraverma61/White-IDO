import React from "react";
import TopPerformer from "./TopPerformer";

const PerformerStats = () => {
  return (
    <div className="px-5 md:px-10 flex flex-col w-full items-center justify-center lg:flex-row gap-10 my-28 lg:my-36">
      {/* <Leaderboard /> */}
      <TopPerformer />
    </div>
  );
};

export default PerformerStats;
