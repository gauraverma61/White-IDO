import React, { useEffect, useMemo, useState } from "react";
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
import SmallSwitch from "@atoms/CustomSmallSwitch";
import { useRouter } from "next/router";
import { DEFAULT_CHAIN_ID } from "@providers/UseWalletProvider";

type ICreateStepOne = Omit<ICreatePrivateSale, "prev">;

const PrivateSaleCreateStep1 = (props: ICreateStepOne) => {
  const { formik, commonStats, setLaunchpadBannerImage, setLaunchpadImage } =
    props;

  const { setFieldValue, values } = formik;

  const { chainId: chainId_ } = useAuth();
  const chainId = chainId_ || DEFAULT_CHAIN_ID;
  const currencySymbol = useMemo(
    () => supportNetwork[chainId || "default"]?.symbol,
    [chainId]
  );

  const CurrencyList = useMemo(
    () => PaymentCurrencies[chainId || "default"]?.map((c) => c.symbol),
    [chainId]
  );

  const router = useRouter();
  const [presaleType, setPresaleType] = useState<string | undefined>(
    "Private Sale"
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
        <Dropdown3
          selectedOption={presaleType}
          setSelectedOption={setPresaleType}
          dropdownList={["Presale", "Fairlaunch", "Private Sale"]}
          label={"Presale list"}
          className="w-full selects"
        />
        <div className="hidden md:block"></div>

        <div className="">
          {/*<h3 className="text-4xl font-medium">Title</h3>*/}
          {/* <div className="flex justify-between"> */}

          <Input2
            label={`Title`}
            name="title"
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
          <SmallSwitch
            className="w-full"
            label="Whitelist"
            enabled={values.saleMethod === "Whitelist"}
            setEnabled={(value) => {
              setFieldValue("saleMethod", value ? "Whitelist" : "");
            }}
          />
          <div className=" text-white text-lg max-w-[75%]">
            Enable whitelist to allow only whitelisted users to contribute in
            your presale
          </div>
        </div>
        <div className="hidden md:block"></div>
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
        {formik.values.saleMethod === "Whitelist" && (
          <>
            <DateTimePicker
              label={"Whitelist End Time (UTC)*"}
              name="tier1EndTime"
              value={formik.values.tier1EndTime}
              onChange={(v: any) => formik.setFieldValue("tier1EndTime", v)}
              onBlur={formik.handleBlur}
              error={formik.touched.tier1EndTime && formik.errors.tier1EndTime}
            />
            {/* <DateTimePicker
              label={"Tier 2 End Time (UTC)*"}
              
              name="tier2EndTime"
              value={formik.values.tier2EndTime}
              onChange={(v: any) => formik.setFieldValue("tier2EndTime", v)}
              onBlur={formik.handleBlur}
              error={formik.touched.tier2EndTime && formik.errors.tier2EndTime}
            /> */}
            <DateTimePicker
              label={"Public Start Time (UTC)*"}
              name="publicStartTime"
              value={formik.values.publicStartTime}
              onChange={(v: any) => formik.setFieldValue("publicStartTime", v)}
              onBlur={formik.handleBlur}
              error={
                formik.touched.publicStartTime && formik.errors.publicStartTime
              }
            />
          </>
        )}
      </div>
    </form>
  );
};

export default PrivateSaleCreateStep1;
