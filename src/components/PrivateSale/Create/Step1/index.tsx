import React, { useEffect, useMemo } from "react";
import { ICreatePrivateSale } from "..";
import useAuth from "@hooks/useAuth";
import useTokenInfo from "@hooks/useTokenInfo";
import { formatUnits } from "ethers/lib/utils";
import { supportNetwork } from "@constants/network";
import DateTimePicker from "@atoms/DateTimeInput";
import Input2 from "@atoms/Input2";
import Dropdown3 from "@atoms/Dropdown3";
import CustomSwitch from "@molecules/Switch";
import { PaymentCurrencies } from "@constants/currencies";
import SocialLinkInput from "@atoms/SocialLinkInput";
import TextArea from "@atoms/TextAreaV2";

type ICreateStepOne = Omit<ICreatePrivateSale, "prev">;

const PrivateSaleCreateStep1 = (props: ICreateStepOne) => {
  const { formik, commonStats, setLaunchpadBannerImage, setLaunchpadImage } =
    props;

  const { ethereum, account, chainId, library } = useAuth();
  const currencySymbol = useMemo(
    () => supportNetwork[chainId || "default"]?.symbol,
    [chainId]
  );

  const CurrencyList = useMemo(
    () => PaymentCurrencies[chainId || "default"]?.map((c) => c.symbol),
    [chainId]
  );

  // const {
  //   tokenName: name,
  //   tokenSymbol: symbol,
  //   decimals,
  //   totalSupply,
  //   fetchTokenError,
  //   fetchtokenDetail,
  //   fetchTokenBalance,
  // } = useTokenInfo({
  //   tokenAddress: formik.values.tokenAddress || "",
  //   ethereum,
  // });

  // useEffect(() => {
  //   if (formik.values.tokenAddress) {
  //     fetchtokenDetail();
  //     fetchTokenBalance();
  //   }
  // }, [formik.values.tokenAddress]);

  // useEffect(() => {
  //   if (name) {
  //     formik.setValues({
  //       ...formik.values,
  //       name: name,
  //       symbol: symbol,
  //       decimals: decimals,
  //       totalSupply: formatUnits(totalSupply, decimals)
  //     })

  //   } else {
  //     formik.setFieldValue("name", "");
  //     formik.setFieldValue("symbol", "");
  //     formik.setFieldValue("decimals", "");
  //     formik.setFieldValue("totalSupply", "");
  //   }
  // }, [name]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="mb-6">
        {/*<h3 className="text-4xl font-medium">Title</h3>*/}
        {/* <div className="flex justify-between"> */}
        <Input2
          label={`Title`}
          name="title"
          variant={
            formik.touched.title && formik.errors.title
              ? "warning"
              : formik.values.title
              ? "bright"
              : "primary"
          }
          titleText="Privatesale"
          className="outline-none w-full"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.title && formik.errors.title}
        />
        {/* </div> */}
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
      {/* <div className="mb-10 flex flex-1 flex-col md:flex-row gap-10">
        <CustomSwitch
          backGroundClass="bg-privateSale"
          label="Sale Method"
          options={["Public", "Whitelist"]}
          selectedOption={formik.values.saleMethod}
          setSelectedOption={(v) => {
            formik.setFieldValue("saleMethod", v);
          }}
        />
        <div className="w-full hidden md:block"></div>
      </div>
      {formik.values.saleMethod === "Whitelist" && (
        <>
          <div className="mb-10 flex flex-1 flex-col md:flex-row gap-10">
            <DateTimePicker
              label={`Tier 1 End Time (UTC)*`}
              
              name="tier1EndTime"
              value={formik.values.tier1EndTime}
              onChange={(v: any) => formik.setFieldValue("tier1EndTime", v)}
              onBlur={formik.handleBlur}
              error={formik.touched.tier1EndTime && formik.errors.tier1EndTime}
            />
            <DateTimePicker
              label={`Tier 2 End Time (UTC)*`}
              
              name="tier2EndTime"
              value={formik.values.tier2EndTime}
              onChange={(v: any) => formik.setFieldValue("tier2EndTime", v)}
              onBlur={formik.handleBlur}
              error={formik.touched.tier2EndTime && formik.errors.tier2EndTime}
            />
            <DateTimePicker
              label={`Public Start Time (UTC)*`}
              
              name="publicStartTime"
              value={formik.values.publicStartTime}
              onChange={(v: any) => formik.setFieldValue("publicStartTime", v)}
              onBlur={formik.handleBlur}
              error={
                formik.touched.publicStartTime && formik.errors.publicStartTime
              }
            />
          </div>
        </>
      )}
      <div className="mb-6 flex flex-1 flex-col md:flex-row gap-10">
        <DateTimePicker
          label={`Start Time (UTC)*`}
          
          name="startTime"
          value={formik.values.startTime}
          onChange={(v: any) => formik.setFieldValue("startTime", v)}
          onBlur={formik.handleBlur}
          error={formik.touched.startTime && formik.errors.startTime}
        />
        <DateTimePicker
          label={`End Time (UTC)*`}
          
          name="endTime"
          value={formik.values.endTime}
          onChange={(v: any) => formik.setFieldValue("endTime", v)}
          onBlur={formik.handleBlur}
          error={formik.touched.endTime && formik.errors.endTime}
        />
        <div className="w-full undefined">
          <label className="block capitalize text-base font-semibold text-[#64748B] mb-3">
            Currency
          </label>
          <Dropdown3
            selectedOption={formik.values.currency}
            setSelectedOption={(v) => {
              formik.setFieldValue("currency", v);
            }}
            dropdownList={CurrencyList}
            label={"Currency"}
            className="w-full"
          />
          {formik.touched.currency && formik.errors.currency ? (
            <p className="text-xs text-red-text capitalize font-medium leading-5">
              {formik.errors.currency as string}
            </p>
          ) : null}
        </div>
      </div> */}
    </form>
  );
};

export default PrivateSaleCreateStep1;
