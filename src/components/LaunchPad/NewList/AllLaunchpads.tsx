import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import {
  IoCheckmarkSharp,
  IoClose,
  IoSearchOutline,
  IoShieldCheckmarkOutline,
  IoShieldHalfOutline,
} from "react-icons/io5";
import { IPoolData, usePools } from "../Details/hooks/usePool";
import useAuth from "@hooks/useAuth";
import moment from "moment";
import useSWR from "swr";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { IChildProps, LAUNCHPAD_LIMIT } from ".";
import { useQuery } from "jsonapi-react";
import { KycOptions } from "@constants/tableDropdownOptions";
import Loader from "@components/Loader";
import PoolCard from "./PoolCard";
import { RiLockLine, RiRegisteredLine, RiSpyLine } from "react-icons/ri";
import { AiOutlineSafety } from "react-icons/ai";

export const getProjectStartEndTime = (
  data: Pick<
    IPoolData,
    | "id"
    | "poolState"
    | "startTime"
    | "endTime"
    | "tier1EndTime"
    | "tier2EndTime"
    | "myContribution"
    | "useWhitelisting"
    | "publicStartTime"
  >
) => {
  const startTime = moment.unix(Number(data?.startTime)).toString();
  let starttime = startTime;
  console.log("YAY", data.useWhitelisting);
  if (data.useWhitelisting) {
    if (data.myContribution?.whitelisted) {
      if (data.myContribution.tier == 2 && data.tier2EndTime > 0) {
        starttime = data.tier1EndTime
          ? moment.unix(Number(data.tier1EndTime)).toString()
          : startTime;
      }
    } else {
      starttime = data.publicStartTime
        ? moment.unix(Number(data.publicStartTime)).toString()
        : startTime;
    }
  }
  return {
    startTime: starttime,
    endTime: moment.unix(Number(data?.endTime)).toString(),
  };
};

export const getProjectStatus = (
  data: Pick<
    IPoolData,
    | "id"
    | "poolState"
    | "startTime"
    | "endTime"
    | "tier1EndTime"
    | "tier2EndTime"
    | "myContribution"
    | "useWhitelisting"
    | "publicStartTime"
  >
) => {
  const times = getProjectStartEndTime(data);
  return data?.poolState === "Ongoing"
    ? moment(times.startTime).isAfter(moment())
      ? "upcoming"
      : moment(times.startTime).isBefore(moment()) &&
        moment(times.endTime).isAfter(moment())
      ? "sale live"
      : "sale ended"
    : "sale ended";
};

export interface ILPProps {
  launchpadList: IPoolData[];
  skip: number;
  setSkip: Dispatch<SetStateAction<number>>;
}

export const Card = ({
  data,
  key,
  kycData,
}: {
  data: IPoolData;
  key: number;
  kycData: any;
}) => {
  const tagsData = useMemo(() => {
    return kycData?.data?.find((d: any) => d.id == data.id);
  }, [data.id, kycData]);

  const tagsList = useMemo(
    () => tagsData?.attributes?.tags?.filter((a: any) => a.name !== ""),
    [tagsData]
  );
  const subKyc = (type: string) => {
    const id = type + "-" + data?.id.substring(0, 5);
    const iconComponent = (value: string) => {
      switch (value) {
        case "anti-rug":
          return <IoShieldHalfOutline color="#0B8A0B" size={12} />;
        case "doxxed":
          return <RiSpyLine color="#0B8A0B" size={12} />;
        case "registered company":
          return <RiRegisteredLine color="#0B8A0B" size={12} />;
        case "pool lock":
          return <RiLockLine color="#0B8A0B" size={12} />;
        case "safe dev":
          return <AiOutlineSafety color="#0B8A0B" size={12} />;
        case "live kyc":
          return <IoShieldCheckmarkOutline color="#0B8A0B" size={12} />;
        case "audit":
          return <IoSearchOutline color="#0B8A0B" size={12} />;
        default:
          return <IoCheckmarkSharp color="#0B8A0B" size={12} />;
      }
    };
    if (
      tagsList?.find(
        (e: { name: string }) => e.name.toLowerCase() === type.toLowerCase()
      )
    ) {
      return (
        <>
          <div className="rounded-old-full p-0.5 bg-primary-green" id={id}>
            {iconComponent(type.toLowerCase())}
          </div>
          <ReactTooltip anchorId={id} place="top" content={type} />
        </>
      );
    } else {
      return (
        <div className="rounded-old-full p-0.5 border-2 border-dull-green bg-tertiary-dark">
          <IoClose color="#0B8A0B" size={12} />
        </div>
      );
    }
  };

  const renderKycAudit = () => {
    return (
      <>
        <div className="flex gap-2 flex-wrap justify-end">
          {KycOptions.map((v) => subKyc(v.name))}
        </div>
      </>
    );
  };
  return <PoolCard data={data} renderKycAudit={renderKycAudit} key={key} />;
};

const AllLaunchpads = ({
  searchValue,
  type,
  Props,
  forContributor,
}: {
  searchValue: string;
  type: "Private" | "Fairlaunch" | "Presale" | undefined;
  Props: IChildProps;
  forContributor?: boolean;
}) => {
  const { chainId, account } = useAuth();
  const { checkedProgress, checkedKyc, checkedType } = Props;
  const [sortingLiquidity, setSortingLiquidity] = useState("");
  const [sortingCountdown, setSortingCountdown] = useState("");

  enum orderby {
    liquidityPercent = "liquidityPercent",
    startTime = "startTime",
  }
  enum orderdirection {
    asc = "asc",
    desc = "desc",
  }

  const [orderBy, setOrderBy] = useState(orderby.startTime);
  const [orderDirection, setorderDirection] = useState(orderdirection.desc);
  const [skip, setSkip] = useState(0);
  const FIRST = 3;

  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data: tagsData, error: tagError } = useQuery<
    {
      tags: { link: string; name: string }[];
      id: string;
    }[]
  >([
    "presales",
    {
      page: {
        number: skip / FIRST,
        size: FIRST,
      },
    },
  ]);

  const verifiedIds = useMemo(() => {
    let arr: string[] = [];
    // if (checkedKyc?.includes("Kyc") && kycIds?.length > 0) {
    //   arr = arr.concat(kycIds);
    // }
    // if (checkedKyc?.includes("Audit") && auditIds?.length > 0) {
    //   arr = arr.concat(auditIds);
    // }
    // if (checkedKyc?.includes("Trusted") && safuIds?.length > 0) {
    //   arr = arr.concat(safuIds);
    // }
    //
    // checkedKyc?.every(value => {
    //   return
    // })
    if (checkedKyc) {
      const ids = (
        tagsData?.map((d) => {
          if (
            d?.tags
              ?.map((t: { name: string }) => t.name)
              .some((v) =>
                checkedKyc.map((c) => c.toLowerCase()).includes(v.toLowerCase())
              )
          ) {
            return d.id.toLowerCase();
          }
          return "";
        }) || []
      ).filter((d) => !!d);
      console.log("ids", ids, checkedKyc, tagsData);
      arr = arr.concat(ids);
    }
    return arr;
  }, [tagsData, checkedKyc]);

  const query = useMemo(() => {
    let where_contributor: {
      id?: string;
      address?: string;
    } = {};
    let whereQuery: {
      type_in?: string[];
      id_in?: string[];
      poolState_in?: string[];
      poolState_not?: string;
      startTime_gt?: string;
      startTime_lt?: string;
      endTime_gt?: string;
      endTime_lt?: string;
      poolDetails_contains_nocase?: string;
      contributors_?: {
        id?: string;
        address?: string;
      };
    } = {};
    whereQuery["poolState_not"] = "Cancelled";
    if (forContributor) {
      whereQuery["contributors_"] = {
        address: account?.toLowerCase() || "",
      };
    }
    if (checkedType && checkedType.length > 0) {
      whereQuery["type_in"] = checkedType;
    }
    if (searchValue && searchValue.length > 3) {
      whereQuery["poolDetails_contains_nocase"] = searchValue;
    }
    if (checkedKyc && checkedKyc.length > 0) {
      whereQuery["id_in"] = verifiedIds;
    }
    if (
      checkedProgress &&
      checkedProgress.length > 0 &&
      checkedProgress.length < 3
    ) {
      let poolStates: string[] = [];
      if (checkedProgress.includes("Live")) {
        poolStates = poolStates.concat(["Ongoing"]);
        whereQuery["startTime_lt"] = moment().utc().unix().toString();
        whereQuery["endTime_gt"] = moment().utc().unix().toString();
      }
      if (checkedProgress.includes("Upcoming")) {
        whereQuery["startTime_gt"] = moment().utc().unix().toString();
      }
      if (checkedProgress.includes("Ended")) {
        poolStates = poolStates.concat(["Completed", "Cancelled"]);
        // whereQuery["endTime_lt"] = moment().utc().unix().toString();
        // whereQuery["endTime_gt"] = moment().utc().unix().toString();
      }
      if (poolStates.length > 0) {
        whereQuery["poolState_in"] = poolStates;
      }
    }
    console.log("whereQuery", JSON.stringify(whereQuery));
    return {
      variables: {
        first: FIRST,
        skip: skip,
        orderBy: orderBy,
        orderDirection: orderDirection,
        where: whereQuery,
        where_contributor,
      },
    };
  }, [
    type,
    searchValue,
    checkedKyc,
    checkedProgress,
    checkedType,
    skip,
    orderBy,
    orderDirection,
    verifiedIds,
  ]);

  const { stats: launchpadList, error, isLoading } = usePools(query.variables);

  const { data: kycData } = useSWR(
    `/api/v1/presales?filter[id]=${launchpadList
      ?.map((pool) => pool.id)
      ?.join(",")}`,
    fetcher
  );

  // const tableHeader = [
  //   {
  //     title: "Name",
  //     widthClass: "min-w-[6rem]",
  //   },
  //   {
  //     title: "HC",
  //     widthClass: "min-w-[3rem]",
  //   },
  //   {
  //     title: "Liquidity%",
  //     icon: MdSwitchLeft,
  //     widthClass: "min-w-[6rem]",
  //     sorting: "liquidity",
  //   },
  //   {
  //     title: "Progress",
  //     icon: HiChevronDown,
  //     isDropdown: true,
  //     options: ProgressOptions,
  //     checkedItems: checkedProgress,
  //     setCheckedItems: setCheckedProgress,
  //     isSingleSelect: true,
  //     widthClass: "min-w-[5rem]",
  //   },
  //   {
  //     title: "Badges",
  //     icon: HiChevronDown,
  //     isDropdown: true,
  //     options: KycOptions,
  //     checkedItems: checkedKyc,
  //     setCheckedItems: setCheckedKyc,
  //     widthClass: "min-w-[5.6rem]",
  //   },
  //   {
  //     title: "Countdown",
  //     icon: MdSwitchLeft,
  //     widthClass: "min-w-[6rem]",
  //     sorting: "countdown",
  //   },
  // ];

  // const setSortingParams = (value: string) => {
  //   const sortType =
  //     value === "liquidity" ? sortingLiquidity : sortingCountdown;
  //   const sortSetType =
  //     value === "liquidity" ? setSortingLiquidity : setSortingCountdown;
  //   if (sortType === "" || sortType === "down") {
  //     sortSetType("up");
  //   } else {
  //     sortSetType("down");
  //   }
  // };

  // const activeIcon = (value: string) => {
  //   const sortType =
  //     value === "liquidity" ? sortingLiquidity : sortingCountdown;
  //   if (sortType === "up") {
  //     return "icon-up";
  //   }
  //   if (sortType === "down") {
  //     return "icon-down";
  //   }
  // };

  // useEffect(() => {
  //   if (sortingLiquidity === "up") {
  //     setOrderBy(orderby.liquidityPercent);
  //     setorderDirection(orderdirection.desc);
  //   } else {
  //     setOrderBy(orderby.liquidityPercent);
  //     setorderDirection(orderdirection.asc);
  //   }
  // }, [orderdirection.asc, orderdirection.desc, sortingLiquidity]);

  // useEffect(() => {
  //   if (sortingCountdown === "up") {
  //     setOrderBy(orderby.startTime);
  //     setorderDirection(orderdirection.desc);
  //   } else {
  //     setOrderBy(orderby.startTime);
  //     setorderDirection(orderdirection.asc);
  //   }
  // }, [orderdirection.asc, orderdirection.desc, sortingCountdown]);

  return (
    <>
      <div className="h-20">
        {isLoading ? (
          <div className="flex items-center justify-center z-10 relative h-full">
            <Loader className="!h-6 !w-6 !m-0" />
          </div>
        ) : (
          <></>
        )}
      </div>

      {launchpadList && launchpadList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-12 gap-x-12 lg:gap-x-24 z-10 relative">
          {launchpadList?.map((ul, i) => {
            return <Card data={ul} key={i} kycData={kycData} />;
          })}
        </div>
      ) : (
        <div className="flex text-lg justify-center items-center text-white mb-32 h-[400px]">
          No data to show
        </div>
      )}

      <div className="flex justify-center my-14 z-10 relative">
        <div className="flex gap-5 text-base items-center border border-secondary-green-border rounded px-3 py-2 bg-blur-background2">
          <button
            onClick={() => {
              if (skip > 0) {
                setSkip(skip - LAUNCHPAD_LIMIT);
              }
            }}
            type="button"
            disabled={skip === 0}
            className="text-primary-green disabled:text-dull-green cursor-pointer">
            <IoIosArrowBack size={26} />
          </button>
          <button
            onClick={() => {
              setSkip(skip + LAUNCHPAD_LIMIT);
            }}
            disabled={(launchpadList?.length || 0) < LAUNCHPAD_LIMIT}
            type="button"
            className="text-primary-green disabled:text-dull-green cursor-pointer">
            <IoIosArrowForward size={26} />
          </button>
        </div>
      </div>
    </>
  );
};

export default AllLaunchpads;
