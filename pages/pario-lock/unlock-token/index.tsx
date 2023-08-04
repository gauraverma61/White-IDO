import React from "react";
import type { NextPage } from "next";
import UnlockTokenComp from "@components/Locker/UnlockToken";

const TokenInfoPage: NextPage = () => {
  return (
    <div>
      <UnlockTokenComp />
    </div>
  );
};

export default TokenInfoPage;
