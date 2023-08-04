import React, { useMemo } from "react";
import { ICreatePrivateSale, ICreatePrivateSaleFormData } from "..";
import InfoGrid, { IInfoGridProps } from "@molecules/InfoGrid";
import { title } from "case";
import moment from "moment";
import useAuth from "@hooks/useAuth";
import { supportNetwork } from "@constants/network";
import HoverImage from "@components/Common/HoverImage";
import { TIME_FORMAT } from "@constants/timeFormats";
import { PaymentCurrencies } from "@constants/currencies";
import { CountdownTimer } from "@atoms/CountdownTimer";
import { walletNameTrimmer } from "@helpers/walletNameTrimmer";

const PrivateSaleCreateStep5: React.FC<ICreatePrivateSale> = (props) => {
  const { formik } = props;

  const { values: data, handleSubmit } = formik;
  const { chainId } = useAuth();

  const getKeyValue =
    <U extends keyof T, T extends object>(key: U) =>
    (obj: T): string =>
      String(obj[key]);

  const launchPadDetails = useMemo<IInfoGridProps["data"]>(() => {
    const map = Object.keys(data)
      ?.filter(
        (k: any) =>
          getKeyValue<
            keyof ICreatePrivateSaleFormData,
            ICreatePrivateSaleFormData
          >(k)(data) !== ""
      )
      ?.filter((key) => !["isvesting", "step", "feeOptions"].includes(key))
      ?.map((key: any) => {
        const value = getKeyValue<
          keyof ICreatePrivateSaleFormData,
          ICreatePrivateSaleFormData
        >(key)(data);
        const selectedPaymentCurrency = PaymentCurrencies[
          chainId || "default"
        ]?.find(
          (c) => c.symbol.toLowerCase() === formik.values.currency.toLowerCase()
        )?.symbol;
        const currencySymbol = supportNetwork[chainId || "default"]?.symbol;
        const paymentCurrencySymbol = selectedPaymentCurrency || currencySymbol;
        if (["tokenAddress"].includes(key)) {
          return {
            title: title(key),
            value: value,
            type: "address",
          };
        }
        if (
          [
            "startTime",
            "endTime",
            "TGEDate",
            "tier1StartTime",
            "publicStartTime",
            "tier2StartTime",
            "tier2EndTime",
          ].includes(key)
        ) {
          return {
            title: title(key) + " " + "(UTC)",
            value: moment(value).utc().format(TIME_FORMAT),
          };
        }
        if (["tier1EndTime"].includes(key)) {
          return {
            title: "Whitelist End Time (UTC)",
            value: moment(value).utc().format(TIME_FORMAT),
          };
        }
        if (["TGEPercentage", "CycleReleasePercent"].includes(key)) {
          return {
            title: title(key),
            value: `${value}%`,
          };
        }
        if (["CycleTime"].includes(key)) {
          return {
            title: title(key),
            value: `${value} ${parseInt(value) > 1 ? "days" : "day"}`,
          };
        }
        if (
          ["softcap", "hardcap", "maximumBuy", "minimumBuy"].includes(key) &&
          chainId
        ) {
          return {
            title: title(key),
            value: value + " " + paymentCurrencySymbol,
          };
        }
        if (
          [
            "website",
            "facebook",
            "twitter",
            "instagram",
            "github",
            "telegram",
            "discord",
            "reddit",
          ].includes(key)
        ) {
          return {
            title: title(key),
            type: "socials",
            value: value,
          };
        }
        return {
          title: title(key),
          fullWidth: ["description"].includes(key.toLowerCase()),
          value: String(value),
        };
      });
    return map || [];
  }, [data]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <p className=" text-primary-green text-2xl font-medium mb-6">Details</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <InfoGrid data={launchPadDetails} />
        </div>
        <div>
          <div className="">
            <div className=" text-primary-green text-2xl font-medium mb-6">
              Presale starts in
            </div>
            <CountdownTimer date={data.startTime} variant={"unlock"} />
          </div>
        </div>
      </div>
    </form>
  );
};

export default PrivateSaleCreateStep5;
