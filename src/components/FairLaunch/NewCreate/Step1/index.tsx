import { useEffect, useMemo, useState } from "react";
import { ICreateFairLaunch } from "..";
import useAuth from "@hooks/useAuth";
import Dropdown3 from "@atoms/Dropdown3";
import TextArea from "@atoms/TextAreaV2";
import SocialLinkInput from "@atoms/SocialLinkInput";
import { PaymentCurrencies } from "@constants/currencies";
import useSWR from "swr";
import { IPool } from "@components/LaunchPad/List/hooks/useStats";
import Input2 from "@atoms/Input2";
import { useRouter } from "next/router";
import { DEFAULT_CHAIN_ID } from "@providers/UseWalletProvider";

const ListingOptions = ["Auto Listing", "Manual listing"];

type ICreateStepOne = Omit<ICreateFairLaunch, "prev">;

interface Iprops extends ICreateStepOne {
  logoImage: string;
  setLogoImage: (value: string) => void;
  bannerImage: string;
  setBannerImage: (value: string) => void;
  ongoingPools: IPool[];
}

const Step1: React.FC<Iprops> = (props) => {
  const {
    formik,
    commonStats,
    bannerImage,
    logoImage,
    setBannerImage,
    setLogoImage,
    ongoingPools,
  } = props;
  const router = useRouter();
  const { chainId: chainId_ } = useAuth();
  const chainId = chainId_ || DEFAULT_CHAIN_ID;
  const [presaleType, setPresaleType] = useState<string | undefined>(
    "Fairlaunch"
  );

  useEffect(() => {
    if (presaleType === "Presale") {
      router.push(`/launchpad/create?blockchain=${chainId}`);
    } else if (presaleType === "Fairlaunch") {
      router.push(`/fair-launch/create?blockchain=${chainId}`);
    } else {
      router.push(`/private-sale/create?blockchain=${chainId}`);
    }
  }, [chainId, presaleType]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 md:gap-y-14">
        <Dropdown3
          selectedOption={presaleType}
          setSelectedOption={setPresaleType}
          dropdownList={["Presale", "Fairlaunch", "Private Sale"]}
          label={"Presale list"}
          className="w-full selects"
        />
        <div>
          <Input2
            label="Token Address"
            type="text"
            name="tokenAddress"
            onBlur={formik.handleBlur}
            value={formik.values.tokenAddress}
            onChange={formik.handleChange}
          />
          {!formik.errors.tokenAddress && ongoingPools?.length > 0 && (
            <p className="text-xs text-red-text capitalize font-medium leading-5 mt-2">
              Presale/Fairlaunch already exists for this token.
            </p>
          )}
          {formik.touched.tokenAddress && formik.errors.tokenAddress ? (
            <p className="text-xs text-red-text capitalize font-medium leading-5 mt-2">
              {formik.errors.tokenAddress as string}
            </p>
          ) : null}
        </div>
        <Input2
          label={`Name*`}
          //
          name="name"
          value={formik.values.name}
          error={formik.touched.name && formik.errors.name}
          disabled
        />
        <Input2
          label={`Symbol*`}
          //
          name="symbol"
          value={formik.values.symbol}
          error={formik.touched.symbol && formik.errors.symbol}
          disabled
        />
        <Input2
          label={`Decimals*`}
          //
          name="decimals"
          type={"number"}
          value={formik.values.decimals}
          error={formik.touched.decimals && formik.errors.decimals}
          disabled
        />
        {/*<Input2*/}
        {/*  label={`Total supply*`}*/}
        {/*
        {/*  name="totalSupply"*/}
        {/*  type={"number"}*/}
        {/*  value={formik.values.totalSupply}*/}
        {/*  error={formik.touched.totalSupply && formik.errors.totalSupply}*/}
        {/*  disabled*/}
        {/*/>*/}
        <Input2
          label={`Balance*`}
          //
          name="balance"
          type={"number"}
          value={formik.values.balance}
          error={formik.touched.balance && formik.errors.balance}
          disabled
        />
      </div>
    </form>
  );
};

export default Step1;
