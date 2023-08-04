import CheckBoxDropdown from "@atoms/CheckboxDropdownV2";
import { CountdownTimer } from "@atoms/CountdownTimer";
import {
  HCOptions,
  KycOptions,
  ProgressOptions,
} from "@constants/tableDropdownOptions";
import React, { useEffect, useMemo, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
  MdOutlineSearch,
  MdSwitchLeft,
} from "react-icons/md";
import { IPool } from "@components/LaunchPad/List/hooks/useStats";
import moment from "moment";
import Link from "next/link";
import Loader from "@components/Loader";
import { title } from "case";
import { supportNetwork } from "@constants/network";
import useAuth from "@hooks/useAuth";
import { BsFillCaretDownFill, BsFillCaretUpFill } from "react-icons/bs";
import useSWR from "swr";
import { BiCheckCircle, BiXCircle } from "react-icons/bi";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useQuery } from "jsonapi-react";
import {
  IPoolData,
  usePools,
} from "@components/LaunchPad/Details/hooks/usePool";
import getProjectLink from "@helpers/getProjectLink";

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
  singleData: Pick<
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
  const times = getProjectStartEndTime(singleData);
  return singleData?.poolState === "Ongoing"
    ? moment(times.startTime).isAfter(moment())
      ? "upcoming"
      : moment(times.startTime).isBefore(moment()) &&
        moment(times.endTime).isAfter(moment())
      ? "sale live"
      : "sale ended"
    : "sale ended";
};

const LaunchPadAdvanceMode = ({
  forContributor,
}: {
  forContributor?: boolean;
}) => {
  const { chainId, account } = useAuth();
  const [checkedHC, setCheckedHC] = useState<undefined | string[]>([]);
  const [checkedProgress, setCheckedProgress] = useState<string[]>([]);
  const [checkedKyc, setCheckedKyc] = useState<undefined | string[]>([]);
  const [searchValue, setSearchValue] = useState("");
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

  const [orderBy, setOrderBy] = useState(orderby.liquidityPercent);
  const [orderDirection, setorderDirection] = useState(orderdirection.asc);
  const [skip, setSkip] = useState(0);
  const FIRST = 10;

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
  const kycIds = useMemo(
    () =>
      (
        tagsData?.map((d) => {
          if (d?.tags?.map((t: { name: string }) => t.name).includes("KYC")) {
            return d.id.toLowerCase();
          }
          return "";
        }) || []
      ).filter((d) => !!d),
    [tagsData]
  );
  const auditIds = useMemo(
    () =>
      (
        tagsData?.map((d) => {
          if (d?.tags?.map((t: { name: string }) => t.name).includes("AUDIT")) {
            return d.id.toLowerCase();
          }
          return "";
        }) || []
      ).filter((d) => !!d),
    [tagsData]
  );
  const safuIds = useMemo(
    () =>
      (
        tagsData?.map((d) => {
          if (d?.tags?.map((t: { name: string }) => t.name).includes("SAFU")) {
            return d.id.toLowerCase();
          }
          return "";
        }) || []
      ).filter((d) => !!d),
    [tagsData]
  );

  const verifiedIds = useMemo(() => {
    let arr: string[] = [];
    if (checkedKyc?.includes("Kyc") && kycIds?.length > 0) {
      arr = arr.concat(kycIds);
    }
    if (checkedKyc?.includes("Audit") && auditIds?.length > 0) {
      arr = arr.concat(auditIds);
    }
    if (checkedKyc?.includes("Trusted") && safuIds?.length > 0) {
      arr = arr.concat(safuIds);
    }
    return arr;
  }, [auditIds, checkedKyc, kycIds, safuIds]);

  const commonQuery = useMemo(() => {
    return `
    id
    addresses
    logo
    banner
    cycle
    cycleBps
    description
    endTime
    feeIndex
    finalFee
    governance
    hardCap
    liquidityListingRate
    liquidityLockDays
    liquidityPercent
    liquidityUnlockTime
    max_payment
    min_payment
    payment_currency {
      decimals
      id
      name
      symbol
      totalSupply
    }
    poolDetails
    poolState
    rate
    refundType
    router
    socials
    softCap
    startTime
    tgeBps
    tier1EndTime
    tier2EndTime
    token {
      decimals
      id
      name
      symbol
      totalSupply
    }
    totalRaised
    totalVolume
    type
    useWhitelisting
    listingType
    actualRaised
    publicStartTime
    contributors(where: $where_contributor, first: 1) {
      claimed
      contribution
      id
      address
      purchased
      tier
      whitelisted
    }
`;
  }, []);

  const query = useMemo(() => {
    let where_contributor: {
      id?: string;
      address?: string;
    } = {};
    console.log("forContributor", forContributor);
    if (account && !forContributor) {
      where_contributor = {
        address: account?.toLowerCase() || "",
      };
    }
    let whereQuery: {
      type_in?: string[];
      id_in?: string[];
      poolState_in?: string[];
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
    if (forContributor) {
      whereQuery["contributors_"] = {
        address: account?.toLowerCase() || "",
      };
    }
    if (checkedHC && checkedHC.length > 0) {
      whereQuery["type_in"] = checkedHC;
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
      query: `query PoolsData($first: Int, $skip: Int, $orderBy: Pool_orderBy, $orderDirection: OrderDirection, $where: Pool_filter) {
  pools(
    first: $first
    skip: $skip
    orderBy: $orderBy
    orderDirection: $orderDirection
    where: $where
  ) {
    ${commonQuery}
  }
}`,
      variables: {
        first: FIRST,
        skip: skip,
        orderBy: orderBy,
        orderDirection: orderDirection,
        where: whereQuery,
        where_contributor,
      },
    };
    //   return `{
    //   pools ( first: ${FIRST} , skip: ${skip},orderBy: ${orderBy}, orderDirection: ${orderDirection})
    //   ${commonQuery}
    // }`;
  }, [
    forContributor,
    checkedHC,
    searchValue,
    checkedKyc,
    checkedProgress,
    skip,
    orderBy,
    orderDirection,
    commonQuery,
    verifiedIds,
  ]);

  const {
    stats: launchpadList,
    error,
    isLoading: isValidating,
  } = usePools(query.variables);

  const { data: kycData } = useSWR(
    `/api/v1/presales?filter[id]=${launchpadList
      ?.map((pool) => pool.id)
      ?.join(",")}`,
    fetcher
  );
  const loading = isValidating;

  const tableHeader = [
    {
      title: "Name",
      icon: MdOutlineSearch,
      isDropdown: true,
      isSearch: true,
      widthClass: "min-w-[8rem]",
    },
    {
      title: "HC",
      icon: IoIosArrowDown,
      isDropdown: true,
      options: HCOptions,
      checkedItems: checkedHC,
      setCheckedItems: setCheckedHC,
      widthClass: "min-w-[3rem]",
    },
    {
      title: "Liquidity%",
      icon: MdSwitchLeft,
      widthClass: "min-w-[6rem]",
      sorting: "liquidity",
    },
    {
      title: "Chain",
      widthClass: "min-w-[5rem]",
    },
    {
      title: "Symbol",
      widthClass: "min-w-[5rem]",
    },
    {
      title: "Progress",
      icon: IoIosArrowDown,
      isDropdown: true,
      options: ProgressOptions,
      checkedItems: checkedProgress,
      setCheckedItems: setCheckedProgress,
      isSingleSelect: true,
      widthClass: "min-w-[5rem]",
    },
    {
      title: "KYC/Audit",
      icon: IoIosArrowDown,
      isDropdown: true,
      options: KycOptions,
      checkedItems: checkedKyc,
      setCheckedItems: setCheckedKyc,
      widthClass: "min-w-[5.6rem]",
    },
    {
      title: "Countdown",
      icon: MdSwitchLeft,
      widthClass: "min-w-[6rem]",
      sorting: "countdown",
    },
  ];

  const setSortingParams = (value: string) => {
    const sortType =
      value === "liquidity" ? sortingLiquidity : sortingCountdown;
    const sortSetType =
      value === "liquidity" ? setSortingLiquidity : setSortingCountdown;
    if (sortType === "" || sortType === "down") {
      sortSetType("up");
    } else {
      sortSetType("down");
    }
  };

  const activeIcon = (value: string) => {
    const sortType =
      value === "liquidity" ? sortingLiquidity : sortingCountdown;
    if (sortType === "up") {
      return "icon-up";
    }
    if (sortType === "down") {
      return "icon-down";
    }
  };

  useEffect(() => {
    if (sortingLiquidity === "up") {
      setOrderBy(orderby.liquidityPercent);
      setorderDirection(orderdirection.desc);
    } else {
      setOrderBy(orderby.liquidityPercent);
      setorderDirection(orderdirection.asc);
    }
  }, [orderdirection.asc, orderdirection.desc, sortingLiquidity]);

  useEffect(() => {
    if (sortingCountdown === "up") {
      setOrderBy(orderby.startTime);
      setorderDirection(orderdirection.desc);
    } else {
      setOrderBy(orderby.startTime);
      setorderDirection(orderdirection.asc);
    }
  }, [orderdirection.asc, orderdirection.desc, sortingCountdown]);

  const SingleRow = (singleData: IPoolData, key: number) => {
    const poolDetails = singleData.poolDetails;

    const tagsData = useMemo(() => {
      return kycData?.data?.find((d: any) => d.id == singleData.id);
    }, [singleData.id, kycData]);

    const tagsList = useMemo(
      () => tagsData?.attributes?.tags?.filter((a: any) => a.name !== ""),
      [tagsData]
    );
    const project_status = useMemo(
      () => getProjectStatus(singleData),
      [singleData]
    );
    const countDownTime = useMemo(() => {
      if (project_status == "upcoming")
        return moment(getProjectStartEndTime(singleData).startTime).unix();
      return moment(getProjectStartEndTime(singleData).startTime).unix();
    }, [singleData, project_status]);
    console.log("countDownTime", countDownTime, singleData.id);
    const subKyc = (type: string, color: string) => {
      const id = type + "-" + singleData?.id.substring(0, 5);

      if (
        tagsList?.find(
          (e: { name: string }) => e.name.toLowerCase() === type.toLowerCase()
        )
      ) {
        return (
          <>
            <BiCheckCircle size={18} color={color} id={id} />
            <ReactTooltip anchorId={id} place="top" content={type} />
          </>
        );
      } else {
        return <BiXCircle size={18} color="#cdcfce" />;
      }
    };

    const renderKycAudit = () => {
      return (
        <>
          <div className="flex gap-1 items-center">
            {subKyc("KYC", "rgb(16, 185, 129)")}
            {subKyc("Audit", "rgb(63, 129, 207)")}
            {subKyc("Trusted", "rgb(223, 95, 248) ")}
          </div>
        </>
      );
    };

    const poolLink = getProjectLink(singleData?.id, singleData?.type, chainId);
    const symbol =
      singleData?.type === "Private"
        ? "Private Sale"
        : singleData?.token?.symbol;

    const hardCap =
      singleData?.type === "Fairlaunch" ? (
        <p className="text-[#28B81B] text-sm">{"Fairlaunch"}</p>
      ) : (
        <p className="text-[#ff8a00]">{singleData?.hardCap}</p>
      );

    return (
      <tr className="border-b border-bordergraylight">
        <td className="text-[15px] font-medium flex items-center p-4 cursor-pointer">
          <Link href={`/${poolLink}`}>
            <div className="flex items-center">
              <div className="flex shrink-0">
                <img
                  src={singleData?.logo}
                  alt={""}
                  className="w-8 h-8 rounded-old-full mr-2 bg-[#ccc] object-cover"
                />
              </div>
              <span className="w-[7.6rem] truncate">
                {poolDetails?.title ?? "---"}
              </span>
            </div>
          </Link>
        </td>
        <td className="text-[15px] font-semibold p-4">{hardCap ?? "---"}</td>
        <td className="text-[15px] font-medium p-4">
          {singleData.liquidityPercent === null
            ? "Manual"
            : singleData.liquidityPercent + "%"}
        </td>
        <td className="text-[15px] font-medium p-4">
          {supportNetwork[chainId || "default"]?.symbol ?? "---"}
        </td>
        <td className="text-[15px] font-medium p-4">{symbol ?? "---"}</td>
        <td className="text-[15px] font-medium p-4">
          {title(project_status) ?? "---"}
        </td>
        <td className="text-[15px] font-medium p-4">
          {/* {singleData.Audit ? singleData.Audit : "---"} */}
          {renderKycAudit()}
        </td>
        <td className="text-[15px] font-medium p-4">
          <CountdownTimer
            date={String(countDownTime)}
            variant={"inBox"}
            className={"justify-start"}
            isTimeUnix
          />
        </td>
        <td>
          <span className=" px-3 py-[6px] cursor-pointer bg-gray2 text-white hover:bg-white hover:outline hover:outline-1 hover:outline-gray2 hover:text-gray2  text-[15px] font-medium ">
            <Link href={`/${poolLink}`}>view</Link>
          </span>
        </td>
      </tr>
    );
  };

  return (
    <div className="mt-10">
      <>
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead className="border-b border-[#DFDADA] bg-white">
              <tr className="">
                {tableHeader.map((head, index) => {
                  return (
                    <th
                      key={index}
                      className="bg-white capitalize text-[15px] font-semibold p-4 py-2">
                      {head.isDropdown ? (
                        <CheckBoxDropdown
                          checkedItems={head.checkedItems}
                          setCheckedItems={head.setCheckedItems}
                          title={head.title}
                          options={head.options}
                          Icon={head.icon}
                          isSearch={head.isSearch}
                          widthClass={head.widthClass}
                          isSingleSelect={head.isSingleSelect}
                          getSearchValue={(search: string) =>
                            setSearchValue(search)
                          }
                        />
                      ) : (
                        <div
                          className={`flex justify-between text-[15px] font-semibold  items-center w-full ${head.widthClass} `}>
                          {head.title}
                          {head.icon && head.sorting && (
                            <div
                              className="sorting-icon cursor-pointer"
                              onClick={() => setSortingParams(head.sorting)}>
                              <BsFillCaretUpFill
                                size="12"
                                className={`icon-color ${
                                  activeIcon(head.sorting) === "icon-up" &&
                                  "active"
                                }`}
                              />
                              <BsFillCaretDownFill
                                size="12"
                                className={`icon-color  ${
                                  activeIcon(head.sorting) === "icon-down" &&
                                  "active"
                                }`}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </th>
                  );
                })}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-6">
                    <Loader />
                  </td>
                </tr>
              ) : (
                <></>
              )}

              {launchpadList?.filter((singleData: any) => {
                const tagsData = kycData?.data?.find(
                  (d: any) => d.id == singleData.id
                );
                return !tagsData?.attributes?.hidden;
              }).length === 0 ? (
                <>
                  <tr>
                    <td colSpan={9} className="text-center py-6">
                      No Data Found{" "}
                    </td>
                  </tr>
                </>
              ) : (
                launchpadList
                  ?.filter((singleData: any) => {
                    const tagsData = kycData?.data?.find(
                      (d: any) => d.id == singleData.id.toLowerCase()
                    );
                    return !tagsData?.attributes?.hidden;
                  })
                  ?.map((singleData, index: number) => (
                    <SingleRow {...singleData} key={index} />
                  ))
              )}
              <tr>
                <td colSpan={9} className="text-center h-24"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-center items-center gap-8">
          <button
            onClick={() => {
              if (skip > 0) {
                setSkip(skip - FIRST);
              }
            }}
            type="button"
            disabled={skip === 0}
            className="bg-[#F6F6F6] h-10 w-10 rounded-old-full flex justify-center items-center disabled:text-gray-300">
            <MdOutlineKeyboardArrowLeft size={30} />
          </button>
          <button
            onClick={() => {
              setSkip(skip + FIRST);
            }}
            disabled={(launchpadList?.length || 0) < FIRST}
            type="button"
            className="bg-[#F6F6F6] h-10 w-10 rounded-old-full flex justify-center items-center disabled:text-gray-300">
            <MdOutlineKeyboardArrowRight size={30} />
          </button>
        </div>
      </>
    </div>
  );
};
export default LaunchPadAdvanceMode;
