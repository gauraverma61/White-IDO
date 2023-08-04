import React from "react";
import { NextPage } from "next/types";
import PrivateSaleDetails from "@components/PrivateSale/Details";
import { useRouter } from "next/router";

const DetailsPage: NextPage = () => {
  return <PrivateSaleDetails />;
};

export default DetailsPage;
