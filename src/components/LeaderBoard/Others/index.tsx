import React, { useMemo } from "react";
import moment from "moment";
import useAuth from "@hooks/useAuth";
import Image from "next/image";
import DateSelector from "../DataSelector";
import getProjectLink from "@helpers/getProjectLink";
import Link from "next/link";
import Loader from "@components/Loader";
import { supportNetwork } from "@constants/network";
import useSWR from "swr";

export interface IWeekType {
  weekNumber: number;
  weekYear: number;
  startDate: string;
  endDate: string;
}

const Others = () => {
  const [currentTab, setCurrentTab] = React.useState(0);
  const [startDate, setStartDate] = React.useState("1668998336");
  const [endDate, setEndDate] = React.useState("1669516736");
  const [totalWeek, setTotalWeek] = React.useState<IWeekType[]>([]);

  const { chainId } = useAuth();

  const { data, error, isValidating } = useSWR(
    `{
      pools(orderBy: totalRaised, orderDirection: desc, where: {startTime_gte: ${startDate}, endTime_lte: ${endDate}}) {
        id
        logo
        banner
        token
        startTime
        totalRaised
        type
        poolDetails
    payment_currency {
      decimals
      id
      name
      symbol
      totalSupply
    }
      }
    }`
  );

  const getWeeksYear = () => {
    const startDate = "Nov 01 2022";
    const startWeek = moment(startDate).startOf("isoWeek").toDate();
    const diffStartDateWeek = moment(startDate).diff(moment(startWeek), "days");

    const currentDate = [
      moment(new Date()).year(),
      moment(new Date()).month(),
      moment(new Date()).date(),
    ];
    const endWeek = moment(currentDate).endOf("isoWeek").toDate();
    const diffEndDateWeek = moment(endWeek).diff(moment(currentDate), "days");
    const gapBetweenCurrent =
      moment(currentDate).diff(moment(startDate), "days") +
      diffStartDateWeek +
      diffEndDateWeek +
      1;

    const numberOfWeeks = gapBetweenCurrent / 7;

    let totalWeekArr: any = [];
    for (let i = 0; i < numberOfWeeks; i++) {
      if (i == 0) {
        const currentWeekNo = moment(
          moment(startDate).startOf("isoWeek").toDate()
        ).isoWeeks();
        const currentWeekYear = moment(startDate).year();
        const cuurentWeekStartDate = moment(
          moment(startDate).startOf("isoWeek").toDate()
        ).format("M/D/Y");
        const cuurentWeekEndDate = moment(
          moment(startDate).endOf("isoWeek").toDate()
        ).format("M/D/Y");
        totalWeekArr.push({
          weekNumber: currentWeekNo,
          weekYear: currentWeekYear,
          startDate: cuurentWeekStartDate,
          endDate: cuurentWeekEndDate,
        });
      } else {
        const currentWeekStartDate = moment
          .unix(
            moment(totalWeekArr[i - 1].endDate)
              .utc()
              .unix() + 86400
          )
          .format("M/D/Y");
        const currentWeekNo = moment(
          moment(currentWeekStartDate).startOf("isoWeek").toDate()
        ).isoWeeks();
        const currentWeekYear = moment(currentWeekStartDate).year();
        const cuurentWeekEndDate = moment(
          moment(currentWeekStartDate).endOf("isoWeek").toDate()
        ).format("M/D/Y");
        totalWeekArr.push({
          weekNumber: currentWeekNo,
          weekYear: currentWeekYear,
          startDate: currentWeekStartDate,
          endDate: cuurentWeekEndDate,
        });
      }
    }
    return setTotalWeek(totalWeekArr.reverse());
  };

  React.useEffect(() => {
    getWeeksYear();
    const startDateOfWeek = moment(moment().startOf("isoWeek").toDate())
      .utc()
      .unix();
    const endDateOfWeek = moment(moment().endOf("isoWeek").toDate())
      .utc()
      .unix();
    setStartDate(startDateOfWeek.toString());
    setEndDate(endDateOfWeek.toString());
    setCurrentTab(0);
  }, []);

  const getCurrentTab = (index: number, data: IWeekType) => {
    setCurrentTab(index);
    const startDateOfWeek = moment(
      moment(data.startDate).startOf("isoWeek").toDate()
    ).unix();
    const endDateOfWeek = moment(
      moment(data.endDate).endOf("isoWeek").toDate()
    ).unix();
    setStartDate(startDateOfWeek.toString());
    setEndDate(endDateOfWeek.toString());
  };
  return (
    <div className="">
      <div className=" border border-primary-green  pb-20 mb-10 relative">
        <div className="overflow-x-auto overflow-hidden  ">
          <table className=" w-full text-white">
            <thead className="">
              <tr>
                <th className="p-4 pt-10 w-1/4 text-left pl-8 lg:pl-32">
                  Name
                </th>
                <th className="p-4 pt-10 w-1/4 text-left">Balance</th>
                <th className="p-4 pt-10 w-1/4 text-left">
                  Listing Time (UTC)
                </th>
                <th className="p-4 pt-10 w-1/5 text-end pr-4 lg:pr-14">
                  <div className="flex justify-end items-center gap-3">
                    <div>
                      {totalWeek
                        ? `Week ${totalWeek[currentTab]?.weekNumber}/${totalWeek[currentTab]?.weekYear}`
                        : "-"}
                    </div>
                    <div>
                      {" "}
                      <DateSelector
                        totalWeek={totalWeek}
                        getCurrentTab={getCurrentTab}
                        currentTab={currentTab}
                      />
                    </div>
                  </div>{" "}
                </th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.pools &&
                data.pools.map((data: any, index: number) => {
                  return (
                    <tr
                      key={index}
                      className="hover border-b border-dull-border last:border-0 ">
                      <td className="text-base font-normal text-left py-4 md:p-4 pl-8 lg:pl-16">
                        <div className="flex items-center justify-left gap-6">
                          <div className="relative w-8 h-8 border border-primary-green rounded-old-md overflow-hidden ">
                            <Image
                              src={data.logo}
                              layout="fill"
                              objectFit="cover"
                            />
                          </div>
                          <div className="truncate max-w-[200px]">
                            {JSON.parse(data.poolDetails).title
                              ? JSON.parse(data.poolDetails).title
                              : "Unknown"}
                          </div>
                        </div>
                      </td>
                      <td className="text-base font-medium text-left p-4">
                        {parseFloat(data.totalRaised) /
                          10 **
                            ((data.payment_currency?.decimals || 18) > 0
                              ? data.payment_currency?.decimals || 18
                              : 18)}{" "}
                        <span className="">
                          {supportNetwork[chainId || "default"]?.symbol}
                        </span>
                      </td>
                      <td className="p-4 text-left">
                        {moment
                          .unix(Number(data.startTime))
                          .utc()
                          .format("YYYY.MM.DD - HH:mm A")}
                      </td>
                      <td className="text-end pr-4 lg:pr-14">
                        <Link
                          href={getProjectLink(data.id, data.type, chainId)}>
                          <div className=" cursor-pointer text-primary-green ">
                            View Pool
                          </div>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          {isValidating && (
            <div className="flex justify-center items-center">
              <Loader />
            </div>
          )}
          {!isValidating && data && data.pools.length === 0 && (
            <div className="flex justify-center items-center">
              <p className="text-center text-white mt-20">No Data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Others;
