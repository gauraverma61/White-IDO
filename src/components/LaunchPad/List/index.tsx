import React, { useEffect, useMemo, useState } from "react";
import spaceshipIcon from "@public/icons/svgs/spaceshipicon.svg";
import advanceModeIcon from "@public/icons/svgs/advanceModeIcon.svg";
import myContributionIcon from "@public/icons/svgs/myContributionIcon.svg";
import Image from "next/image";
import AllLaunchPadItem from "./AllLaunchPads";
import LaunchPadAdvanceMode from "./LaunchPadAdvanceMode";
import MyContributionLaunchPad from "./MyContributionLaunchPad";
import { filterByList, sortByList } from "@constants/dropdownItems";
import moment from "moment";
import { IPool, usePoolListStats } from "./hooks/useStats";
import SearchInputV1 from "@atoms/SearchInputV1";
import { AiOutlineSearch } from "react-icons/ai";
import DropdownV1 from "@atoms/DropdownV1";
import useSWR from "swr";
import useAuth from "@hooks/useAuth";
import {
  IPoolData,
  usePools,
} from "@components/LaunchPad/Details/hooks/usePool";

const Tabs = [
  {
    title: "All Presales",
    icon: spaceshipIcon,
  },

  {
    title: "Advanced Mode",
    icon: advanceModeIcon,
  },
  {
    title: "My Contribution",
    icon: myContributionIcon,
  },
];

export const getProjectTime = (lp: IPool) => {
  const data = lp;
  const startTime = moment.unix(Number(data.startTime)).utc();
  const endTime = moment.unix(Number(data.endTime)).utc();

  if (data.tier1 || data.tier2) {
    if (data.userWhitelisted) {
      if (data.userTier == 2 && data.tier2) {
        const date = data?.tier2?.start_time
          ? moment.unix(data?.tier2?.start_time || 0).utc()
          : moment(startTime).utc();
        if (date.isAfter(moment().utc())) {
          return date.unix();
        } else {
          return endTime.unix();
        }
      } else {
        const date = data?.tier1?.start_time
          ? moment.unix(data?.tier1?.start_time || 0).utc()
          : moment(startTime).utc();
        if (date.isAfter(moment())) {
          return date.unix();
        } else {
          return endTime.unix();
        }
      }
    } else {
      const date = data?.publicStartTime
        ? moment.unix(Number(data?.publicStartTime || 0)).utc()
        : moment(startTime).utc();
      if (date.isAfter(moment())) {
        return date.unix();
      } else {
        return endTime.unix();
      }
    }
  } else {
    if (startTime.isAfter(moment().utc())) {
      return startTime.unix();
    } else {
      return endTime.unix();
    }
  }
};
export const getProjectStatus = (lp: IPool) => {
  const data = lp;
  let startTime, endTime;
  if (data.poolState === "Cancelled" || data.poolState === "Completed") {
    return "sale ended";
  }

  if (data.tier2 || data.tier1) {
    if (data.userWhitelisted) {
      if (data.userTier == 2 && data.tier2) {
        startTime = moment.unix(
          Number(data.tier2?.start_time || data.startTime)
        );
        if (startTime.isAfter(moment())) {
          return "upcoming";
        } else {
          return "sale live";
        }
      } else {
        console.log("tier1?.start_time", data.tier1?.start_time);
        startTime = moment.unix(
          Number(data.tier1?.start_time || data.startTime)
        );
        console.log("startTime ti", startTime.isAfter(moment()));
        if (startTime.isAfter(moment())) {
          return "upcoming";
        } else {
          return "sale live";
        }
      }
    } else {
      startTime = data.publicStartTime
        ? moment.unix(Number(data.publicStartTime))
        : moment.unix(Number(data.startTime));
      if (startTime.isAfter(moment())) {
        return "upcoming";
      } else {
        return "sale live";
      }
    }
  } else {
    startTime = moment.unix(Number(data.startTime));
    if (startTime.isAfter(moment())) {
      return "upcoming";
    } else {
      return "sale live";
    }
  }
};
const LaunchPadComp = () => {
  const { account } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [filterBy, setFilterBy] = useState<string | undefined>(filterByList[0]);
  const [sortBy, setSortBy] = useState<string | undefined>(sortByList[0]);
  const [updater, setUpdater] = useState({
    page: 0,
    pageSize: 25,
  });

  console.log("query", searchValue, sortBy, filterBy, updater);

  useEffect(() => {
    if (updater.page > 0)
      setUpdater({
        page: 0,
        pageSize: 25,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterBy, sortBy]);
  useEffect(() => {
    if (updater.page > 0 && searchValue.length >= 3)
      setUpdater({
        page: 0,
        pageSize: 25,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);
  const query = useMemo(() => {
    let whereQuery: {
      type_in?: string[];
      id_in?: string[];
      poolState_in?: string[];
      startTime_gt?: string;
      endTime_gt?: string;
      endTime_lt?: string;
      poolDetails_contains_nocase?: string;
    } = {};
    let where_contributor: {
      id?: string;
    } = {};
    if (account) {
      where_contributor = {
        id: account?.toLowerCase() || "",
      };
    }
    // if (checkedHC && checkedHC.length > 0) {
    //   whereQuery["type_in"] = checkedHC;
    // }
    if (searchValue && searchValue.length >= 3) {
      whereQuery["poolDetails_contains_nocase"] = searchValue;
    }
    // if (checkedKyc && checkedKyc.length > 0) {
    //   whereQuery["id_in"] = verifiedIds;
    // }
    if (filterBy) {
      let poolStates: string[] = [];
      if (filterBy.includes("Live") || filterBy.includes("Upcoming")) {
        poolStates = poolStates.concat(["Ongoing"]);
        whereQuery["endTime_gt"] = moment().utc().unix().toString();
      }
      if (filterBy.includes("Upcoming")) {
        whereQuery["startTime_gt"] = moment().utc().unix().toString();
      }
      if (filterBy.includes("Ended")) {
        poolStates = poolStates.concat(["Completed", "Cancelled"]);
        // whereQuery["endTime_lt"] = moment().utc().unix().toString();
      }
      if (poolStates.length > 0) {
        whereQuery["poolState_in"] = poolStates;
      }
    }
    let orderBy = "startTime";
    let orderDirection = "desc";
    switch (sortBy) {
      case "Hard Cap":
        orderBy = "hardCap";
        orderDirection = "asc";
        break;
      case "Soft Cap":
        orderBy = "softCap";
        orderDirection = "asc";
        break;
      case "End time":
        orderBy = "endTime";
        orderDirection = "asc";
        break;
    }
    console.log("whereQuery", JSON.stringify(whereQuery));
    return {
      variables: {
        first: updater.pageSize,
        skip: updater.page * updater.pageSize,
        orderBy: orderBy,
        orderDirection: orderDirection,
        where: whereQuery,
        where_contributor,
      },
    };
  }, [account, searchValue, filterBy, sortBy, updater.pageSize, updater.page]);

  const { stats: launchpadList, error, isLoading } = usePools(query.variables);

  const { data: kycData, isValidating: isPoolsLoading } = useSWR(
    `/api/v1/presales?filter[id]=${launchpadList
      ?.map((pool: IPoolData) => pool.id)
      ?.join(",")}`,
    (url: string) => fetch(url).then((r) => r.json())
  );
  const launchpads: IPool[] = useMemo(() => {
    return (
      launchpadList
        ?.filter((lp) => {
          const tagsData = kycData?.data?.find(
            (d: any) => d.id == lp.id.toLowerCase()
          );
          return !tagsData?.attributes?.hidden;
        })
        ?.map((lp) => {
          const currentContributor = lp.myContribution;
          const userTier = currentContributor?.tier;
          const data: IPool = {
            publicStartTime: lp.publicStartTime,
            decimals: lp.token?.decimals?.toString() || "18",
            liquidityListingRate: String(lp.liquidityListingRate),
            liquidityPercent: String(lp.liquidityPercent),
            max_payment: String(lp.max_payment),
            min_payment: String(lp.min_payment),
            percentageRaise: 0,
            rate: String(lp.rate),
            symbol: lp.token?.symbol || "",
            token: lp.token?.id || "",
            totalRaised: String(lp.totalRaised),
            poolAddress: lp.id,
            logourl: lp.logo,
            poolDetails: {
              logo: lp.poolDetails.logo || "",
              banner: lp.poolDetails.banner || "",
              title: lp.poolDetails.title || "",
              description: lp.poolDetails.description || "",
              socials: {
                website: lp.poolDetails?.socials?.website || "",
                facebook: lp.poolDetails?.socials?.facebook || "",
                twitter: lp.poolDetails?.socials?.twitter || "",
                instagram: lp.poolDetails?.socials?.instagram || "",
                github: lp.poolDetails?.socials?.github || "",
                telegram: lp.poolDetails?.socials?.telegram || "",
                discord: lp.poolDetails?.socials?.discord || "",
                reddit: lp.poolDetails?.socials?.reddit || "",
              },
            },
            hardCap: String(lp.hardCap || 0),
            softCap: String(lp.softCap),
            name: lp?.token?.name || "",
            poolType:
              lp.type === "Private"
                ? "1"
                : lp.type === "Fairlaunch"
                ? "2"
                : "0",
            startTime: String(lp.startTime),
            endTime: String(lp.endTime),
            poolState:
              lp.poolState === "Ongoing"
                ? "0"
                : lp.poolState === "Cancelled"
                ? "2"
                : "1",
            tier1: lp.tier1EndTime
              ? {
                  start_time: lp.startTime,
                  end_time: lp.tier1EndTime,
                }
              : undefined,
            tier2: lp.tier2EndTime
              ? {
                  start_time: lp.tier1EndTime,
                  end_time: lp.tier2EndTime,
                }
              : undefined,
            userWhitelisted: !!currentContributor?.whitelisted,
            userTier: userTier ? Number(userTier) : undefined,
          };
          return data;
        }) || []
    );
  }, [kycData?.data, launchpadList]);

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
  console.log("currentTab", currentTab);
  return (
    <>
      <div className="">
        <div className="px-6 mx-auto container">
          <div className="flex flex-col gap-6 w-full justify-between mt-8 py-8 sm:py-10 lg:py-14 px-4 sm:px-6 md:px-8 xl:px-12 rounded-old-[40px] md:rounded-old-66 shadow-boxShadow4 border border-borderv1">
            <div className="w-full lg:w-auto">
              <h3 className="text-[#141414] font-fonde text-4xl md:text-6xl font-medium mb-2.5">
                Current Presales
              </h3>
              <div className="overflow-x-auto">
                <ul className="flex text-base font-normal w-full">
                  {Tabs.map((tab, index) => renderTab(index))}
                </ul>
              </div>
            </div>

            {currentTab === 0 && (
              <div className="flex flex-wrap gap-6 w-full justify-between items-center my-2">
                <SearchInputV1
                  Icon={AiOutlineSearch}
                  className="sm:max-w-2xl sm:min-w-[240px]"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <div className="flex flex-wrap sm:flex-nowrap gap-6">
                  <DropdownV1
                    selectedOption={filterBy}
                    setSelectedOption={setFilterBy}
                    dropdownList={filterByList}
                    label={"Filter By"}
                    className="w-40"
                  />
                  <DropdownV1
                    selectedOption={sortBy}
                    setSelectedOption={setSortBy}
                    dropdownList={sortByList}
                    label={"Sort By"}
                    className="w-40"
                  />
                </div>
              </div>
            )}
          </div>
          {currentTab === 0 && (
            <AllLaunchPadItem
              showSponsers={
                !searchValue &&
                filterBy == filterByList[0] &&
                sortBy == sortByList[0]
              }
              launchpads={launchpads}
              loading={isLoading}
              updater={updater}
              setUpdater={setUpdater}
            />
          )}
          {currentTab === 1 && <LaunchPadAdvanceMode />}
          {currentTab === 2 && <MyContributionLaunchPad />}
        </div>
      </div>
    </>
  );
};

export default LaunchPadComp;
