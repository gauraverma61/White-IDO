import React, {
  createContext,
  memo,
  useContext,
  useEffect,
  useState,
} from "react";

export interface IPrivateSaleData {
  title: string;
  currencyType: string;
  wishlist: string;
  softcap: string;
  hardcap: string;
  minimumBuy: string;
  maximumBuy: string;
  startTime: string;
  endTime: string;
  firstFundPer: string;
  fundVestingDays: string;
  fundReleasePer: string;
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

const InitialData = {
  title: "",
  currencyType: "",
  wishlist: "",
  softcap: "",
  hardcap: "",
  minimumBuy: "",
  maximumBuy: "",
  startTime: "",
  endTime: "",
  firstFundPer: "",
  fundVestingDays: "",
  fundReleasePer: "",
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

const PrivateSaleDataContext = createContext<{
  privateSaleData: IPrivateSaleData;
  getPrivateSaleData: (data: any) => void;
  saleImage: string;
  setSaleImage: (value: string) => void;
  saleCoverImage: string;
  setSaleCoverImage: (value: string) => void;
}>({
  privateSaleData: InitialData,
  getPrivateSaleData: () => {},
  saleImage: "",
  setSaleImage: () => {},
  saleCoverImage: "",
  setSaleCoverImage: () => {},
});

const PrivateSaleDataProvider = ({ children }: any) => {
  const [privateSaleData, setPrivateSaleData] =
    useState<IPrivateSaleData>(InitialData);
  const [saleImage, setSaleImage] = useState<string>("");
  const [saleCoverImage, setSaleCoverImage] = useState<string>("");
  const getPrivateSaleData = (data: any) => {
    setPrivateSaleData((prev) => ({ ...prev, ...data }));
  };

  return (
    <PrivateSaleDataContext.Provider
      value={{
        privateSaleData,
        getPrivateSaleData,
        saleImage,
        setSaleImage,
        saleCoverImage,
        setSaleCoverImage,
      }}>
      {children}
    </PrivateSaleDataContext.Provider>
  );
};

const usePrivateSaleData = () => {
  const {
    privateSaleData,
    getPrivateSaleData,
    saleImage,
    setSaleImage,
    saleCoverImage,
    setSaleCoverImage,
  } = useContext(PrivateSaleDataContext);
  return {
    privateSaleData,
    getPrivateSaleData,
    saleImage,
    setSaleImage,
    saleCoverImage,
    setSaleCoverImage,
  };
};

export default memo(PrivateSaleDataProvider);
export { usePrivateSaleData };
