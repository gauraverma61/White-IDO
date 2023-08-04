import React, { useMemo, useState } from "react";
import PadCard from "@molecules/PadCard";
import { usePools } from "../Details/hooks/usePool";
import useAuth from "@hooks/useAuth";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IChildProps, MYCONTRIBUTION_LIMIT } from ".";
import Loader from "@components/Loader";
import AllLaunchpads from "./AllLaunchpads";

const MyContribution = ({
  searchValue,
  type,
  Props,
}: {
  searchValue: string;
  type: "Private" | "Fairlaunch" | "Presale" | undefined;
  Props: IChildProps;
}) => {
  return (
    <AllLaunchpads
      searchValue={searchValue}
      type={type}
      Props={Props}
      forContributor={true}
    />
  );
};

export default MyContribution;
