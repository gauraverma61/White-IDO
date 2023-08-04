import CustomTable from "./Table";
import React, { useState } from "react";
import BannerImage from "@public/images/multisenderBanner.png";
import {
  useCommonLpStats,
  useCommonStats,
  useMyLpLockStats,
  useMyTokenLockStats,
} from "@components/Locker/Token/hooks/useStats";
import { formatUnits } from "ethers/lib/utils";
import Pagination, { IPaginationSelected } from "@components/Pagination";
import Loader from "@components/Loader";
import useAuth from "@hooks/useAuth";

const Tabs = ["All", "My"];

const TokenLockComponent = () => {
  const [updater, setUpdater] = useState({
    page: 0,
    pageSize: 10,
    loading: true,
  });
  const { chainId } = useAuth();
  const stats = useCommonStats(updater);
  console.log("stats", stats);
  const handlePageClick = ({ selected }: IPaginationSelected) => {
    setUpdater({
      ...updater,
      page: selected,
    });
  };
  return (
    <>
      {stats.loading ? (
        <Loader />
      ) : (
        <div className="border border-primary-green  overflow-hidden pb-16">
          {stats.tokenList.length > 0 ? (
            <>
              <CustomTable
                tableHead={["#", "Token", "Amount", ""]}
                data={stats.tokenList.map((tk, index) => ({
                  id: updater.page * updater.pageSize + (index + 1),
                  title: tk.name,
                  amount: formatUnits(tk.amount, tk.decimals),
                  subtitle: tk.symbol,
                  href: `/token-info/${tk.token}?blockchain=${chainId}`,
                }))}
              />
              <Pagination
                handlePageClick={handlePageClick}
                pageSize={stats.pageSize}
                itemsLength={stats.allNormalTokenLockedCount}
              />
            </>
          ) : (
            <div className="text-center text-white py-20">No Data Found </div>
          )}
        </div>
      )}
    </>
  );
};

const LiquidityLockComponent = () => {
  const [updater, setUpdater] = useState({
    page: 0,
    pageSize: 10,
    loading: true,
  });
  const stats = useCommonLpStats(updater);
  console.log("stats", stats);

  const handlePageClick = ({ selected }: IPaginationSelected) => {
    setUpdater({
      ...updater,
      page: selected,
    });
  };
  return (
    <>
      {stats.loading ? (
        <Loader />
      ) : (
        <div className="border border-primary-green  overflow-hidden pb-16">
          {stats.tokenList.length > 0 ? (
            <>
              <CustomTable
                tableHead={["#", "Token", "Amount"]}
                data={stats.tokenList.map((tk) => ({
                  title: tk.name,
                  amount: formatUnits(tk.amount, tk.decimals),
                  subtitle: tk.symbol,
                  href: `/liquidity-info/${tk.token}`,
                }))}
              />
              <Pagination
                handlePageClick={handlePageClick}
                pageSize={stats.pageSize}
                itemsLength={stats.tokenList.length + 1}
              />
            </>
          ) : (
            <div className="text-center text-white py-20">No Data Found </div>
          )}
        </div>
      )}
    </>
  );
};

const MyTokenLockComponent = () => {
  const [updater, setUpdater] = useState({
    page: 0,
    pageSize: 10,
    loading: true,
  });
  const { chainId } = useAuth();
  const stats = useMyTokenLockStats(updater);
  console.log("stats", stats);

  const handlePageClick = ({ selected }: IPaginationSelected) => {
    setUpdater({
      ...updater,
      page: selected,
    });
  };

  return (
    <>
      {stats.loading ? (
        <Loader />
      ) : (
        <div className="border border-primary-green  overflow-hidden pb-16">
          {stats.tokenList.length > 0 ? (
            <>
              <CustomTable
                tableHead={["#", "Token", "Amount"]}
                data={stats.tokenList.map((tk) => ({
                  title: tk.name,
                  amount: formatUnits(tk.amount, tk.decimals),
                  subtitle: tk.symbol,
                  href: `/token-info/${tk.token}?blockchain=${chainId}`,
                }))}
              />
              {/* <Pagination
                handlePageClick={handlePageClick}
                pageSize={stats.pageSize}
                itemsLength={stats.tokenList.length + 1}
              /> */}
            </>
          ) : (
            <div className="text-center text-white py-20">No Data Found </div>
          )}
        </div>
      )}
    </>
  );
};
const MyLpLockComponent = () => {
  const [updater, setUpdater] = useState({
    page: 0,
    pageSize: 10,
    loading: true,
  });
  const stats = useMyLpLockStats(updater);
  console.log("stats", stats);
  const handlePageClick = ({ selected }: IPaginationSelected) => {
    setUpdater({
      ...updater,
      page: selected,
    });
  };
  return (
    <>
      {stats.loading ? (
        <Loader />
      ) : (
        <div className="border border-primary-green  overflow-hidden pb-16">
          {stats.tokenList.length > 0 ? (
            <>
              <CustomTable
                tableHead={["#", "Token", "Amount"]}
                data={stats.tokenList.map((tk) => ({
                  title: tk.name,
                  amount: formatUnits(tk.amount, tk.decimals),
                  subtitle: tk.symbol,
                  href: `/liquidity-info/${tk.token}`,
                }))}
              />
              {/* <Pagination
                handlePageClick={handlePageClick}
                pageSize={stats.pageSize}
                itemsLength={stats.tokenList.length + 1}
              /> */}
            </>
          ) : (
            <div className="text-center text-white py-20">No Data Found </div>
          )}
        </div>
      )}
    </>
  );
};

const TokenAndLiquidityComp = () => {
  const [currentTab, setCurrentTab] = React.useState("All");

  const tableHandler = () => {
    switch (currentTab) {
      case "All":
        return <TokenLockComponent />;
      // case "Liquidity":
      //   return <LiquidityLockComponent />;
      case "My":
        return <MyTokenLockComponent />;
      default:
        return <TokenLockComponent />;
    }
  };

  const Stats: {
    title: string;
    value: string;
  }[] = [
    {
      title: "Total Token Lock",
      value: "283",
    },
    {
      title: "Total Liquidity",
      value: "3",
    },
    {
      title: "My Lock",
      value: "3",
    },
    {
      title: "My Liquidity Lock",
      value: "0",
    },
  ];

  return (
    <div className="container mx-auto pt-20  ">
      <ul className="flex mt-10 md:mt-20 overflow-x-auto">
        {Tabs.map((data, index) => {
          return (
            <li
              key={index}
              className={`cursor-pointer text-lg  min-w-fit py-3 mr-11 ${
                currentTab === data
                  ? " text-primary-green font-semibold"
                  : "text-white"
              }`}
              onClick={() => setCurrentTab(data)}>
              {data}
            </li>
          );
        })}
      </ul>

      <div className="mt-8 md:mt-20">
        <div className=" mt-[20px] md:mt-[40px] mb-10">{tableHandler()}</div>
      </div>
    </div>
  );
};

export default TokenAndLiquidityComp;
