import { useEffect, useMemo } from "react";
import CreateWrapper from "@components/Layouts/CreateWrapper";
import { Formik, Form, FormikValues, useFormik } from "formik";
import * as Yup from "yup";
import Input from "@atoms/Input";
import { MdCloudUpload } from "react-icons/md";
import { ICreateFairLaunch } from "..";
import Dropdown from "@atoms/Dropdown";
import Button from "@atoms/Button";
import useAuth from "@hooks/useAuth";
import useTokenInfo from "@hooks/useTokenInfo";
import UploadImage from "@components/Common/UploadImage";
import { formatUnits } from "ethers/lib/utils";
import { supportNetwork } from "@constants/network";
import Input2 from "@atoms/Input2";
import Dropdown3 from "@atoms/Dropdown3";
import DateTimePicker from "@atoms/DateTimeInput";
import moment from "moment";
import SocialLinkInput from "@atoms/SocialLinkInput";
import TextArea from "@atoms/TextAreaV2";
import { PaymentCurrencies } from "@constants/currencies";
import { IPool } from "@components/LaunchPad/List/hooks/useStats";

type ICreateStepOne = Omit<ICreateFairLaunch, "prev">;

interface Iprops extends ICreateStepOne {
  ongoingPools: IPool[];
}

const Step1: React.FC<Iprops> = (props) => {
  const {
    formik,
    commonStats,
    setLaunchpadBannerImage,
    setLaunchpadImage,
    ongoingPools,
  } = props;

  const { ethereum, account, chainId, library } = useAuth();
  const selectedPaymentCurrency = useMemo(
    () =>
      PaymentCurrencies[chainId || "default"]?.find(
        (c) => c.symbol.toLowerCase() === formik.values.currency.toLowerCase()
      )?.symbol,
    [chainId, formik.values.currency]
  );
  const currencySymbol = useMemo(
    () => supportNetwork[chainId || "default"]?.symbol,
    [chainId]
  );

  const ListingOptions = ["Auto", "Manual"];
  // const CurrencyList = [currencySymbol];
  const CurrencyList = useMemo(
    () => PaymentCurrencies[chainId || "default"]?.map((c) => c.symbol),
    [chainId]
  );
  const FeeOptions = [
    `3% ${selectedPaymentCurrency || currencySymbol} sold`,
    `2% ${selectedPaymentCurrency || currencySymbol} sold + 1% token sold`,
  ];
  const {
    tokenName: name,
    tokenSymbol: symbol,
    tokenBalance,
    decimals,
    totalSupply,
    fetchTokenError,
    fetchtokenDetail,
    fetchTokenBalance,
  } = useTokenInfo({
    tokenAddress: formik.values.tokenAddress || "",
    ethereum,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="my-6">
        <h3
          className={`text-xl font-medium ${
            formik.touched.tokenAddress && formik.errors.tokenAddress
              ? "text-primary-red"
              : formik.values.tokenAddress
              ? "text-primary-green"
              : "text-white"
          } `}>
          Token Address
        </h3>
        <div
          className={`flex justify-between border ${
            formik.touched.tokenAddress && formik.errors.tokenAddress
              ? "border-primary-red bg-secondary-red placeholder:text-red-text text-red-text"
              : formik.values.tokenAddress
              ? "border-primary-green bg-secondary-green placeholder:text-primary-green text-primary-green"
              : "bg-secondary-dark text-secondary-green placeholder-secondary-green border-primary-green"
          } px-3  shadow-sm mt-4`}>
          <input
            type="text"
            className={`outline-none w-full text-inherit placeholder:text-inherit ${
              formik.touched.tokenAddress && formik.errors.tokenAddress
                ? "redAutoFill"
                : formik.values.tokenAddress
                ? "greenAutoFill"
                : ""
            }`}
            name="tokenAddress"
            onBlur={formik.handleBlur}
            value={formik.values.tokenAddress}
            onChange={formik.handleChange}
          />
        </div>
        {!formik.errors.tokenAddress && ongoingPools?.length > 0 && (
          <p className="text-xs text-red-text capitalize font-medium leading-5 mt-2">
            Presale/Fairlaunch already exists for this token.
          </p>
        )}
        {formik.touched.tokenAddress && formik.errors.tokenAddress ? (
          <p className="text-xs text-red-text capitalize font-medium leading-5">
            {formik.errors.tokenAddress as string}
          </p>
        ) : null}
        {fetchTokenError && formik.values.tokenAddress && (
          <div className="text-sm text-red-text4 font-normal">
            {fetchTokenError}
          </div>
        )}
        {commonStats.poolPrice > 0 && (
          <p className="text-right text-xs font-normal">
            Pool creation fee: {commonStats.poolPrice} {currencySymbol}
          </p>
        )}
      </div>
      <div className="flex flex-wrap justify-between items-end my-10">
        <div>
          <Dropdown3
            selectedOption={formik.values.currency}
            setSelectedOption={(v) => {
              formik.setFieldValue("currency", v);
            }}
            dropdownList={CurrencyList}
            label={"Currency"}
            className="w-full selects"
          />
          {formik.touched.currency && formik.errors.currency ? (
            <p className="text-xs text-red-text capitalize font-medium leading-5">
              {formik.errors.currency as string}
            </p>
          ) : null}
        </div>
        <div>
          <Dropdown3
            selectedOption={FeeOptions[Number(formik.values.feeOptions)]}
            setSelectedOption={(v) => {
              const value = String(v).includes("2%") ? "1" : "0";
              formik.setFieldValue("feeOptions", value);
            }}
            dropdownList={FeeOptions}
            label={"Fee Options"}
            className="w-full selects"
          />
          {formik.touched.feeOptions && formik.errors.feeOptions ? (
            <p className="text-xs text-red-text capitalize font-medium leading-5">
              {formik.errors.feeOptions as string}
            </p>
          ) : null}
        </div>
      </div>
      <div>
        <label className="text-white pb-8 text-xl font-medium">
          Connect your social media
        </label>
        <SocialLinkInput formik={formik} />
      </div>
      <div className="my-10">
        <TextArea
          label={`Description`}
          name="description"
          type={"textarea"}
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.description && formik.errors.description}
        />
      </div>
    </form>
  );
};

export default Step1;
