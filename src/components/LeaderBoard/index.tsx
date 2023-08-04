import React from "react";
import TopList from "./TopList";
import Others from "./Others";

const Tabs = [
  {
    title: "Toppers",
  },
  // {
  //   title: "Others",
  // },
];

const LeaderBoardComp: React.FC = () => {
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
                ? "font-semibold  text-primary-green "
                : " text-white"
            }`}>
            {Tabs[tabIndex].title}
          </div>
        </div>
      </li>
    );
  };

  return (
    <>
      <div className="container mx-auto pt-20 pb-16 lg:pt-32 ">
        <div className="flex gap-3 relative ">
          {Tabs.map((tab, index) => renderTab(index))}
        </div>
        <>
          {currentTab === 0 && <TopList />}
          {/* {currentTab === 1 && <Others />} */}
        </>
      </div>
    </>
  );
};

export default LeaderBoardComp;
