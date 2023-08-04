import React, { useMemo } from "react";
import DetailsPageComponent from "@components/Details";
import { useRouter } from "next/router";
import { useCommonStats } from "@components/AirDrop/Details/hooks/useStats";
import { title } from "case";
import moment from "moment";
import useAuth from "@hooks/useAuth";
import { TIME_FORMAT } from "@constants/timeFormats";
import { string } from "yup/lib/locale";

const AirDropDetails = () => {
  const router = useRouter();
  const routerSlug = router?.query?.slug;
  const { account } = useAuth();
  const data = useCommonStats(
    {
      address: Array.isArray(routerSlug) ? routerSlug[0] : routerSlug || "",
    },
    true,
    3
  );
  console.log("data", data);
  const project_status = useMemo(() => {
    return data?.poolState === "0"
      ? moment.unix(Number(data?.startTime)).isAfter(moment())
        ? "upcoming"
        : moment.unix(Number(data?.startTime)).isBefore(moment())
        ? "airdrop live"
        : "airdrop ended"
      : "airdrop ended";
  }, [data?.poolState, data?.startTime]);

  const totalCycles = useMemo(() => {
    try {
      if (data.cycleBps <= 0 || data.tgeBps <= 0) return 0;
      return Number(
        Math.round((100 - (data.tgeBps || 0) / 100) / (data.cycleBps / 100))
      );
    } catch (e) {
      return 0;
    }
  }, [data.cycleBps, data.tgeBps]);

  const currentCycle = useMemo(() => {
    try {
      const cycle = Math.floor(
        moment().diff(moment.unix(Number(data.startTime)), "days") /
          ((data.cycle || 0) / 60 / 60 / 24)
      );
      if (cycle > totalCycles) {
        return Number(totalCycles);
      }
      return cycle;
    } catch (e) {
      return 0;
    }
  }, [data.cycle, data.startTime, totalCycles]);

  return (
    <DetailsPageComponent
      infoList={[
        {
          title: "Sale Type",
          value: `Airdrop`,
        },
        {
          title: "Airdrop Address",
          value: data.poolAddress,
          type: "address",
        },
        {
          title: "Token Address",
          value: data.token.address || "",
          type: "address",
        },
        {
          title: "Name",
          value: data.token.name,
        },
        {
          title: "Symbol",
          value: data.token.symbol,
        },
        {
          title: "Decimal",
          value: data.token.decimals,
        },
        {
          title: "TGE Percent",
          value: `${(data.tgeBps || 0) / 100}%`,
        },
        {
          title: "Cycle Percent",
          value: `${(data.cycleBps || 0) / 100}%`,
        },
        {
          title: "Cycle Days",
          value: `${(data.cycle || 0) / 60 / 60 / 24}`,
        },
        {
          title: "Current Cycle",
          value: `${currentCycle}/${totalCycles}`,
        },
        {
          title: "Next Airdrop Time (UTC)",
          value:
            totalCycles >= currentCycle + 1
              ? moment
                  .unix(Number(data.startTime))
                  .add(
                    ((currentCycle + 1) * (data.cycle || 0)) / 60 / 60 / 24,
                    "days"
                  )
                  .utc()
                  .format(TIME_FORMAT)
              : "-",
        },
        {
          title: "Last Airdrop Time (UTC)",
          value:
            currentCycle >= 1
              ? moment
                  .unix(Number(data.startTime))
                  .add(
                    currentCycle * ((data.cycle || 0) / 60 / 60 / 24),
                    "days"
                  )
                  .utc()
                  .format(TIME_FORMAT)
              : moment.unix(Number(data.startTime)).utc().format(TIME_FORMAT),
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
      ]}
      type={"airdrop"}
      data={{
        description: data.poolDetails.description,
        status: project_status,
        start_time: Number(data.startTime),
        soft_cap: 0,
        min_buy: 0,
        sale_type: "Whitelist",
        pool_address: data.poolAddress,
        max_buy: 0,
        hard_cap: parseFloat(data.totalCost) / 10 ** data.token.decimals,
        total_sold: data.totalClaimed / 10 ** data.token.decimals,
        banner: data.poolDetails.banner,
        end_time: 0,
        logo: data.poolDetails.logo,
        myClaim:
          data.whitelistedUsers
            ?.filter((a) => a.address === account)
            ?.map((a) => parseFloat(a.amount) / 10 ** data.token.decimals)[0] ||
          0,
        title: `${
          data.poolDetails.title ? `${data.poolDetails.title}-Airdrop` : ""
        }`,
        token: {
          symbol: data.token.symbol,
          address: data.token.address,
          name: data.token.name,
          decimals: data.token.decimals,
          supply: parseFloat(data.token.supply),
        },
        poolOwner: String(data.governance),
      }}
    />
  );
};

export default AirDropDetails;
