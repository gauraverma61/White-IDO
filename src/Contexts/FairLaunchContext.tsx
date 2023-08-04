import React, { createContext, memo, useContext, useState } from "react";

export interface IFairLaunchData {
  tokenAddress: string;
  title: string;
  name: string;
  symbol: string;
  decimals: string;
  totalSupply: string;
  currency: string;
  feeOptions: string;
  listingOptions: string;
  presaleRate: string;
  saleMethod: string;
  softcap: string;
  hardcap: string;
  minimumBuy: string;
  maximumBuy: string;
  refundType: string;
  router: string;
  liquidity: string;
  listingRate: string;
  startTime: string;
  endTime: string;
  liquidityLockupDays: string;
  website?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  github?: string;
  telegram?: string;
  discord?: string;
  reddit?: string;
  description?: string;
  image?: string;
  coverImage?: string;
}

const INITIAL_VALUES = {
  tokenAddress: "",
  title: "",
  name: "",
  symbol: "",
  decimals: "",
  totalSupply: "",
  currency: "",
  feeOptions: "",
  listingOptions: "",
  presaleRate: "",
  saleMethod: "",
  softcap: "",
  hardcap: "",
  minimumBuy: "",
  maximumBuy: "",
  refundType: "",
  router: "",
  liquidity: "",
  listingRate: "",
  startTime: "",
  endTime: "",
  liquidityLockupDays: "",
  website: "",
  facebook: "",
  twitter: "",
  instagram: "",
  github: "",
  telegram: "",
  discord: "",
  reddit: "",
  description: "",
  image: "",
  coverImage: "",
};

const FairLaunchDataContext = createContext<{
  fairlaunchData: IFairLaunchData;
  getFairLaunchData: (data: Partial<IFairLaunchData>) => void;
  fairLaunchImage: string;
  setFairLaunchImage: (value: string) => void;
  fairLaunchCoverImage: string;
  setFairLaunchCoverImage: (value: string) => void;
}>({
  fairlaunchData: INITIAL_VALUES,
  getFairLaunchData: () => {},
  fairLaunchImage: "",
  setFairLaunchImage: () => {},
  fairLaunchCoverImage: "",
  setFairLaunchCoverImage: () => {},
});

const FairLaunchDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [fairlaunchData, setFairLaunchData] =
    useState<IFairLaunchData>(INITIAL_VALUES);
  const [fairLaunchImage, setFairLaunchImage] = useState<string>("");
  const [fairLaunchCoverImage, setFairLaunchCoverImage] = useState<string>("");
  const getFairLaunchData = (data: Partial<IFairLaunchData>) => {
    setFairLaunchData((prev) => ({ ...prev, ...data }));
  };

  return (
    <FairLaunchDataContext.Provider
      value={{
        fairlaunchData,
        getFairLaunchData,
        fairLaunchImage,
        setFairLaunchImage,
        fairLaunchCoverImage,
        setFairLaunchCoverImage,
      }}>
      {children}
    </FairLaunchDataContext.Provider>
  );
};

const useFairLaunchData = () => {
  const {
    fairlaunchData,
    getFairLaunchData,
    fairLaunchImage,
    setFairLaunchImage,
    fairLaunchCoverImage,
    setFairLaunchCoverImage,
  } = useContext(FairLaunchDataContext);

  return {
    fairlaunchData,
    getFairLaunchData,
    fairLaunchImage,
    setFairLaunchImage,
    fairLaunchCoverImage,
    setFairLaunchCoverImage,
  };
};

export default memo(FairLaunchDataProvider);
export { useFairLaunchData };
