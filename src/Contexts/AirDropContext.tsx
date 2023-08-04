import React, { createContext, memo, useContext, useState } from "react";

export interface IAirdropData {
  tokenAddress: string;
  title: string;
  name: string;
  symbol: string;
  decimals: string;
  startTime: string;
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
  startTime: "",
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

const AirdropDataContext = createContext<{
  airdropData: IAirdropData;
  getAirDropData: (data: Partial<IAirdropData>) => void;
  airdropImage: string;
  setAirdropImage: (value: string) => void;
  airdropCoverImage: string;
  setAirdropCoverImage: (value: string) => void;
}>({
  airdropData: INITIAL_VALUES,
  getAirDropData: () => {},
  airdropImage: "",
  setAirdropImage: () => {},
  airdropCoverImage: "",
  setAirdropCoverImage: () => {},
});

const AirdropDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [airdropData, setAirdropData] = useState<IAirdropData>(INITIAL_VALUES);
  const [airdropImage, setAirdropImage] = useState<string>("");
  const [airdropCoverImage, setAirdropCoverImage] = useState<string>("");
  const getAirDropData = (data: Partial<IAirdropData>) => {
    setAirdropData((prev) => ({ ...prev, ...data }));
  };

  return (
    <AirdropDataContext.Provider
      value={{
        airdropData,
        getAirDropData,
        airdropImage,
        setAirdropImage,
        airdropCoverImage,
        setAirdropCoverImage,
      }}>
      {children}
    </AirdropDataContext.Provider>
  );
};

const useAirdropData = () => {
  const {
    airdropData,
    getAirDropData,
    airdropImage,
    setAirdropImage,
    airdropCoverImage,
    setAirdropCoverImage,
  } = useContext(AirdropDataContext);

  return {
    airdropData,
    getAirDropData,
    airdropImage,
    setAirdropImage,
    airdropCoverImage,
    setAirdropCoverImage,
  };
};

export default memo(AirdropDataProvider);
export { useAirdropData };
