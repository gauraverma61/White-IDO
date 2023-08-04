import React, { useMemo } from "react";
import DetailsPageComponent from "@components/Details";
import { launchPadDetails } from "@constants/launchPadDetails";
import { useRouter } from "next/router";
import { launchpads } from "@constants/launchpads";

const addressList = [
  {
    addressType: "Presale Address",
    address: "0dfdv5vv66tyu9dg5DgJi62701RhcIh5K487LK",
  },
  {
    addressType: "Token Address",
    address: "0dfdv5vv66tyu9dg5DgJi62701RhcIh5K487LK",
  },
];

const LeaderBoardDetails = () => {
  const router = useRouter();
  const routerSlug = router.query?.slug;
  const data = useMemo(
    () => launchpads?.filter((lp) => lp.Address === routerSlug)[0],
    [routerSlug]
  );
  return (
    <DetailsPageComponent
      infoList={launchPadDetails.slice(0, 15)}
      type={"leaderboard"}
      data={{
        title: "",
        description: "",
        status: "",
        start_time: 0,
        soft_cap: 0,
        min_buy: 0,
        sale_type: "",
        pool_address: "",
        max_buy: 0,
        hard_cap: 0,
        total_sold: 0,
        banner: "",
        end_time: 0,
        logo: "",
        token: {
          symbol: "",
          address: "",
          name: "",
          decimals: 0,
          supply: 0,
        },
        poolOwner: "",
      }}
    />
  );
};

export default LeaderBoardDetails;
