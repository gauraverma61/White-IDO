import { leaderBoardData } from "@constants/leaderboardData";
import Image from "next/image";
import React from "react";
import Lead from "@public/icons/svgs/lead.svg";
import { Circle } from "rc-progress";
import Button from "@atoms/Button";

interface ILeaderBoardItem {
  listTitle: string;
  value: string;
  listingTime: string;
}

const LeaderBoardItem: React.FC<ILeaderBoardItem> = ({
  listTitle,
  value,
  listingTime,
}) => {
  return (
    <div className="font-normal py-2.5 border-b border-bordergraylight flex flex-wrap sm:flex-nowrap items-center justify-between md:px-3 gap-3">
      <div className="flex items-center">
        <div className=" h-10 w-10 rounded-old-full mr-2 md:mr-4">
          <Image src={Lead} alt="" />
        </div>
        <div className="flex flex-col">
          <div className="font-bold text-base">{listTitle}</div>
          <div className="flex flex-col text-sm font-medium">
            <p className="">{value}</p>
            <p>
              <span className="text-[#64748B]">Listing time: </span>
              {listingTime}
            </p>
          </div>
        </div>
      </div>
      <div className="hidden sm:flex items-center justify-center h-10 w-10 relative ml-3">
        <Circle
          percent={90}
          strokeWidth={7}
          trailColor={"#9FF298"}
          trailWidth={7}
          strokeColor={"#28B81B"}
          className="absolute"
        />
        <div className="text-xs font-semibold">90%</div>
      </div>
      <Button
        className="rounded-old-full text-xs sm:text-sm md:text-base py-2 w-20 ml-3"
        variant="primary-xs">
        {"View"}
      </Button>
    </div>
  );
};

const Leaderboard = () => {
  return (
    <div className="p-6 flex-1 rounded-old-3xl sm:rounded-old-[100px] shadow-boxShadow3 w-full">
      <h2 className="text-2xl font-medium p-3 pb-0 mt-4">Trending</h2>
      <div className="mt-4 mb-10">
        {leaderBoardData[0].data.slice(0, 5).map((data, index) => {
          return <LeaderBoardItem key={index} {...data} />;
        })}
      </div>
    </div>
  );
};

export default Leaderboard;
