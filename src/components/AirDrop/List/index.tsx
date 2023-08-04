import React from "react";
import ballonIcon from "@public/icons/svgs/ballonicon.svg";
import pieChartIcon from "@public/icons/svgs/piecharticon.svg";
import AllAirDrops from "./AllAirDrops";
import Image from "next/image";
import CreatedByYou from "./CreatedByYou";
import BannerImage from "@public/images/airdroplist.png";

const Tabs = [
  {
    title: "All",
  },
  {
    title: "My Contribution",
  },
];

const AirDropListComp = () => {
  const [currentTab, setCurrentTab] = React.useState(0);
  const renderTab = (tabIndex: number) => {
    return (
      <li
        className="mr-10  cursor-pointer flex gap-2 items-center "
        onClick={() => setCurrentTab(tabIndex)}>
        <div className="py-2 relative">
          <div
            className={`whitespace-nowrap  ${
              currentTab === tabIndex
                ? "font-semibold  text-primary-green"
                : "text-white"
            }`}>
            {Tabs[tabIndex].title}
          </div>
        </div>
      </li>
    );
  };

  return (
    <>
      <div className="pt-20 pb-12">
        <div className="mt-[4.375rem] flex flex-col gap-5 md:flex-row md:justify-between md:items-center">
          <div className="flex gap-3 relative">
            {Tabs.map((tab, index) => renderTab(index))}
          </div>
        </div>
        {currentTab === 0 && <AllAirDrops />}
        {currentTab === 1 && <CreatedByYou />}
      </div>
    </>
  );
};

export default AirDropListComp;
