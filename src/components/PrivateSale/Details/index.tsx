import React, { useMemo } from "react";
import DetailsPageComponent, { IInfoList } from "@components/Details";
import { useRouter } from "next/router";
import { useAccountStats } from "@components/PrivateSale/Details/hooks/useStats";
import moment from "moment";
import { title } from "case";
import { TIME_FORMAT } from "@constants/timeFormats";
import { usePool } from "@components/LaunchPad/Details/hooks/usePool";
import Loader from "@components/Loader";
import useSWR from "swr";

const PrivateSaleDetails = () => {
  const router = useRouter();
  const routerSlug = router?.query?.slug;

  const id = useMemo(() => {
    let a = Array.isArray(routerSlug) ? routerSlug[0] : routerSlug || "";
    return a.toLowerCase();
  }, [routerSlug]);

  const { stats: data, isLoading } = usePool({
    address: id,
  });
  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data: tagData } = useSWR(`/api/v1/presales/${id}`, fetcher);

  const tagsList = useMemo(
    () => tagData?.data?.attributes?.tags?.filter((a: any) => a.name !== ""),
    [tagData]
  );

  const hidden = useMemo(() => {
    if (tagData) {
      return tagData?.data?.attributes?.hidden;
    } else {
      return false;
    }
  }, [tagData]);

  const accountData = useAccountStats({
    address: Array.isArray(routerSlug) ? routerSlug[0] : routerSlug || "",
    data: data,
  });
  console.log("privateSaleData", data);
  console.log("accountData", accountData);

  const details = useMemo<IInfoList[]>(() => {
    if (!data) return [];
    let arr: IInfoList[] = [
      {
        title: "Sale Type",
        value: `Private Sale`,
      },
      {
        title: "Total Raised",
        value: `${
          data.totalRaised
        } ${data.payment_currency?.symbol?.toUpperCase()}`,
      },
      {
        title: "Presale Address",
        value: data.id,
        type: "address",
      },
      {
        title: "Maximum Buy",
        value: `${data.max_payment} ${data.payment_currency?.symbol}`,
      },
      {
        title: "Minimum Buy",
        value: `${data.min_payment} ${data.payment_currency?.symbol}`,
      },
      {
        title: "Sale method",
        value: data.useWhitelisting ? "Whitelist" : "Public",
      },
      {
        title: "First token release after listing",
        value: `${data.tgeBps > 0 ? data.tgeBps / 100 : 100} %`,
      },
      {
        title: "Cycle (days)",
        value: `${data.cycle > 0 ? data.cycle / 60 / 60 / 24 : 0} Days`,
      },
      {
        title: "Tokens release every cycle",
        value: `${data.cycleBps > 0 ? data.cycleBps / 100 : 0} %`,
      },
      {
        title: "Softcap",
        value: `${data.softCap} ${data.payment_currency?.symbol}`,
      },
      {
        title: "Hardcap",
        value: `${data.hardCap} ${data.payment_currency?.symbol}`,
      },
      {
        title: "Start Time (UTC)",
        value: moment.unix(Number(data.startTime)).utc().format(TIME_FORMAT),
      },
      {
        title: "End Time (UTC)",
        value: moment.unix(Number(data.endTime)).utc().format(TIME_FORMAT),
      },
      ...Object.keys(data.poolDetails?.socials)
        // @ts-ignore
        ?.filter((v) => !!data.poolDetails?.socials[v])
        ?.map((social) => ({
          title: title(social),
          // @ts-ignore
          value: data.poolDetails?.socials[social] || "",
          type: "socials" as "socials",
        })),
    ];

    if (data.tier1EndTime && data.tier1EndTime !== 0) {
      arr = [
        ...arr,
        {
          title: "Whitelist Start Time (UTC)",
          value: moment.unix(Number(data?.startTime)).utc().format(TIME_FORMAT),
        },
        {
          title: "Whitelist End Time (UTC)",
          value: moment
            .unix(Number(data?.tier1EndTime))
            .utc()
            .format(TIME_FORMAT),
        },
      ];
    }
    // if (data.tier2EndTime && Number(data.tier2EndTime) !== 0) {
    //   arr = arr.concat([
    //     {
    //       title: "Tier 2 Start Time (UTC)",
    //       value: moment
    //         .unix(Number(data?.tier1EndTime))
    //         .utc()
    //         .format(TIME_FORMAT),
    //     },
    //     {
    //       title: "Tier 2 End Time (UTC)",
    //       value: moment
    //         .unix(Number(data?.tier2EndTime))
    //         .utc()
    //         .format(TIME_FORMAT),
    //     },
    //   ]);
    // }
    if (data.publicStartTime && Number(data.publicStartTime) !== 0) {
      arr = arr.concat([
        {
          title: "Public Start Time (UTC)",
          value: moment
            .unix(Number(data?.publicStartTime))
            .utc()
            .format(TIME_FORMAT),
        },
      ]);
    }
    return arr;
  }, [data]);

  const ProjectStatus = useMemo(() => {
    if (!data) return "Loading...";

    if (data.poolState != "Ongoing") {
      return "sale ended";
    }

    let startTime, endTime;
    if (data.tier2EndTime || data.tier1EndTime) {
      if (data?.myContribution?.whitelisted) {
        if (data?.myContribution?.tier == 2 && data.tier2EndTime) {
          startTime = moment.unix(Number(data.tier1EndTime));
          endTime = moment.unix(Number(data.tier2EndTime));
        } else {
          startTime = moment.unix(Number(data.startTime));
          endTime = moment.unix(Number(data.tier2EndTime));
        }
      } else {
        startTime = moment.unix(Number(data.publicStartTime));
        endTime = moment.unix(Number(data.endTime));
      }
    } else {
      startTime = moment.unix(Number(data.startTime));
      endTime = moment.unix(Number(data.endTime));
    }

    let publicStartTime = moment.unix(Number(data.publicStartTime));
    let realEndTime = moment.unix(Number(data.endTime));

    if (startTime.isAfter(moment().utc())) {
      return "upcoming";
    } else if (
      endTime.isBefore(moment().utc()) &&
      publicStartTime.isAfter(moment().utc())
    ) {
      return "upcoming";
    } else if (
      realEndTime.isAfter(moment().utc()) &&
      publicStartTime.isBefore(moment().utc())
    ) {
      return "sale live";
    } else if (
      startTime.isBefore(moment().utc()) &&
      endTime.isAfter(moment().utc())
    ) {
      return "sale live";
    } else {
      return "sale ended";
    }
  }, [
    data?.endTime,
    data?.startTime,
    data?.tier1EndTime,
    data?.tier2EndTime,
    data?.myContribution?.tier,
    data?.myContribution?.whitelisted,
    data?.poolState,
  ]);

  if (hidden) {
    return (
      <div className={"flex justify-center my-10 align-center"}>
        <h1>No data Found</h1>
      </div>
    );
  }

  if (isLoading && !data) {
    return (
      <>
        <div className="min-h-screen w-full flex justify-center items-center">
          <Loader />
        </div>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <div>
          <div className={`flex justify-center items-center my-10`}>
            No Pool Found, If a new pool has been created please wait for few
            seconds
          </div>
        </div>
      </>
    );
  }

  return (
    <DetailsPageComponent
      infoList={details}
      type={"privatesale"}
      data={{
        myClaim: accountData.userAvailableClaim,
        myContribution: accountData.contributionOf,
        status: ProjectStatus,
        logo: data?.poolDetails?.logo || "",
        banner: data?.poolDetails?.banner || "",
        title: data?.poolDetails?.title || "",
        native_symbol: data?.payment_currency?.symbol,
        liquidity: {
          liquidityPercent: data?.liquidityPercent || 0,
          liquidityListingRate: data?.liquidityListingRate || 0,
          liquidityLockDays: data?.liquidityLockDays || 0,
          liquidityUnlockTime: data?.liquidityUnlockTime || 0,
        },
        fees: data?.feeIndex || 0,
        token: {
          name: data?.token?.name || data?.payment_currency?.name || "",
          symbol: data?.token?.symbol || data?.payment_currency?.symbol || "",
          decimals:
            data?.token?.decimals || data?.payment_currency?.decimals || 0,
          supply: data?.token?.totalSupply || 0,
          address: data?.token?.id,
        },
        total_sold: data?.totalRaised || 0,
        soft_cap: data?.softCap || 0,
        hard_cap: data?.hardCap || 0,
        start_time: data?.startTime || 0,
        end_time: data?.endTime || 0,
        description: data?.poolDetails?.description || "",
        sale_type: data?.useWhitelisting ? "Whitelist" : "Public",
        pool_address: data?.id || "",
        min_buy: data?.min_payment || 0,
        max_buy: data?.max_payment || 0,
        poolOwner: String(data?.governance),
        poolState:
          data?.poolState === "Ongoing"
            ? "0"
            : data?.poolState === "Completed"
            ? "1"
            : "2",
        userWhitelisted: data?.myContribution?.whitelisted,
        publicStartTime: data?.publicStartTime || 0,
        userTier: data?.myContribution?.tier,
        tier2: {
          start_time: data?.tier1EndTime || 0,
          end_time: data?.tier2EndTime || 0,
        },
        tier1: {
          start_time: data?.startTime || 0,
          end_time: data?.tier1EndTime || 0,
        },
        tagsList: tagsList,
        poolData: data,
      }}
    />
  );
};

export default PrivateSaleDetails;
