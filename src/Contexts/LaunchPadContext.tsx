import React, { createContext, memo, useContext, useState } from "react";

export interface ILaunchpadData {
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

const LaunchpadDataContext = createContext<{
  launchpadData: ILaunchpadData;
  getLaunchPadData: (data: Partial<ILaunchpadData>) => void;
  launchpadImage: string;
  setLaunchpadImage: (value: string) => void;
  launchpadCoverImage: string;
  setLaunchpadCoverImage: (value: string) => void;
}>({
  launchpadData: INITIAL_VALUES,
  getLaunchPadData: () => {},
  launchpadImage: "",
  setLaunchpadImage: () => {},
  launchpadCoverImage: "",
  setLaunchpadCoverImage: () => {},
});

const LaunchpadDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [launchpadData, setLaunchpadData] =
    useState<ILaunchpadData>(INITIAL_VALUES);
  const [launchpadImage, setLaunchpadImage] = useState<string>("");
  const [launchpadCoverImage, setLaunchpadCoverImage] = useState<string>("");
  const getLaunchPadData = (data: Partial<ILaunchpadData>) => {
    setLaunchpadData((prev) => ({ ...prev, ...data }));
  };

  return (
    <LaunchpadDataContext.Provider
      value={{
        launchpadData,
        getLaunchPadData,
        launchpadImage,
        setLaunchpadImage,
        launchpadCoverImage,
        setLaunchpadCoverImage,
      }}>
      {children}
    </LaunchpadDataContext.Provider>
  );
};

const useLaunchpadData = () => {
  const {
    launchpadData,
    getLaunchPadData,
    launchpadImage,
    setLaunchpadImage,
    launchpadCoverImage,
    setLaunchpadCoverImage,
  } = useContext(LaunchpadDataContext);

  return {
    launchpadData,
    getLaunchPadData,
    launchpadImage,
    setLaunchpadImage,
    launchpadCoverImage,
    setLaunchpadCoverImage,
  };
};

export default memo(LaunchpadDataProvider);
export { useLaunchpadData };
