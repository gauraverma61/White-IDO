import React, { useState } from "react";
import ballonIcon from "@public/icons/svgs/ballonicon.svg";
import stackIcon from "@public/icons/svgs/stackicon.svg";
import pieChartIcon from "@public/icons/svgs/piecharticon.svg";
import { filterByList, sortByList } from "@constants/dropdownItems";
import Image from "next/image";
import MyPrivateSale from "./MyPrivateSale";
import CreatedByYou from "./CreatedByYou";
import Dropdown from "@atoms/Dropdown";
import AllPrivateSale from "./AllPrivateSale";

const Tabs = [
  {
    title: "All Private Sale",
    icon: ballonIcon,
  },

  {
    title: "My Private Sale",
    icon: stackIcon,
  },
  {
    title: "Created By You",
    icon: pieChartIcon,
  },
];

const PrivateSaleListComp = () => {
  const [currentTab, setCurrentTab] = React.useState(0);
  const [filterBy, setFilterBy] = useState<string | undefined>(filterByList[0]);
  const [sortBy, setSortBy] = useState<string | undefined>(sortByList[0]);

  const renderTab = (tabIndex: number) => {
    return (
      <li
        className="mr-5 min-w-[10rem] cursor-pointer flex gap-2 items-center"
        onClick={() => setCurrentTab(tabIndex)}>
        <Image
          height={20}
          width={20}
          src={Tabs[tabIndex].icon}
          className="flex-shrink-0"
          alt={`tab-${tabIndex}`}
        />{" "}
        <div className="py-2 relative">
          <div
            className={`whitespace-nowrap ${
              currentTab === tabIndex ? "font-semibold" : ""
            }`}>
            {Tabs[tabIndex].title}
          </div>
          <div
            className={`${
              currentTab === tabIndex
                ? "block absolute w-full h-[5px] bottom-0 bg-black"
                : "hidden"
            }`}></div>
        </div>
      </li>
    );
  };

  return (
    <div className="px-6 md:px-10 container mx-auto">
      <div className="py-6">
        <h2 className="text-5xl font-fonde font-thin">Private Sale List</h2>
      </div>
      <div className="flex flex-wrap gap-6 w-full justify-between mt-8">
        <div className="w-full flex xl:self-end lg:w-auto">
          <div className="overflow-x-auto">
            <ul className="flex text-base font-normal w-full">
              {Tabs.map((tab, index) => renderTab(index))}
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap gap-6  mt-5 w-full lg:mt-0 lg:w-auto shrink-0">
          <div className="">
            <p className="text-sm font-semibold">Filter By</p>
            <Dropdown
              selectedOption={filterBy}
              setSelectedOption={setFilterBy}
              dropdownList={filterByList}
              label={"Filter By"}
              className="w-36"
            />
          </div>
          <div className="">
            <p className="text-sm font-semibold">Sort By</p>
            <Dropdown
              selectedOption={sortBy}
              setSelectedOption={setSortBy}
              dropdownList={sortByList}
              label={"Sort By"}
              className="w-36"
            />
          </div>
        </div>
      </div>
      {currentTab === 0 && <AllPrivateSale />}
      {currentTab === 1 && <MyPrivateSale />}
      {currentTab === 2 && <CreatedByYou />}
    </div>
  );
};

export default PrivateSaleListComp;
