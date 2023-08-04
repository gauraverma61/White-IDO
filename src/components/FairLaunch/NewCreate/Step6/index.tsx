import React, { useMemo } from "react";
import { ICreateFairLaunch } from "@components/FairLaunch/NewCreate";
import useAuth from "@hooks/useAuth";
import InfoGrid, { IInfoGridProps } from "@molecules/InfoGrid";
import {
  FeesSetting,
  ICreateFairLaunchpadFormData,
} from "@components/FairLaunch/Create";
import { PaymentCurrencies } from "@constants/currencies";
import { supportNetwork } from "@constants/network";
import { title } from "case";
import moment from "moment/moment";
import { TIME_FORMAT } from "@constants/timeFormats";
import HoverImage from "@components/Common/HoverImage";
import { CountdownTimer } from "@atoms/CountdownTimer";

const Step6: React.FC<ICreateFairLaunch> = (props) => {
  const { formik, launchpadBannerImage } = props;

  const { values: data, handleSubmit } = formik;

  const getKeyValue =
    <U extends keyof T, T extends object>(key: U) =>
    (obj: T): string =>
      String(obj[key]);

  const { chainId } = useAuth();

  const details = useMemo<IInfoGridProps["data"]>(() => {
    const map = Object.keys(data)
      ?.filter(
        (k: any) =>
          getKeyValue<
            keyof ICreateFairLaunchpadFormData,
            ICreateFairLaunchpadFormData
          >(k)(data) !== ""
      )
      ?.filter((key) => !["isvesting", "step"].includes(key))
      ?.map((key: any) => {
        const value = getKeyValue<
          keyof ICreateFairLaunchpadFormData,
          ICreateFairLaunchpadFormData
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
        if (["liquidityLockupDays"].includes(key)) {
          return {
            title: "Liquidity Unlock Date (UTC)",
            value: `${moment(data.endTime)
              .utc()
              .add(value, "days")
              .format(TIME_FORMAT)}`,
          };
        }
        if (["liquidity"].includes(key)) {
          return {
            title: title(key),
            value: `${value}%`,
          };
        }
        if (["startTime", "endTime", "TGEDate"].includes(key)) {
          return {
            title: title(key) + " " + "(UTC)",
            value: moment(value).utc().format(TIME_FORMAT),
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
        if (["listingRate"].includes(key) && chainId) {
          return {
            title: title(key),
            value: `1 ${paymentCurrencySymbol} = ${value} ${formik.values.symbol}`,
          };
        }
        if (["feeOptions"].includes(key) && chainId) {
          const selectedPaymentCurrency = PaymentCurrencies[
            chainId || "default"
          ]?.find(
            (c) =>
              c.symbol.toLowerCase() === formik.values.currency.toLowerCase()
          )?.symbol;
          const currencySymbol = supportNetwork[chainId || "default"]?.symbol;
          const FeeOptions = [
            `3% ${selectedPaymentCurrency || currencySymbol} sold`,
            `2% ${
              selectedPaymentCurrency || currencySymbol
            } sold + 1% token sold`,
          ];
          return {
            title: title(key),
            value: FeeOptions[Number(value)],
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
    const fees = FeesSetting[data.feeOptions].token;
    const percent =
      (parseFloat(data.liquidity) * parseFloat(data.totalAmount)) / 100;
    const feesValue = (parseFloat(data.totalAmount) * fees) / 100;
    const requiredTokens = parseFloat(data.totalAmount) + percent + feesValue;
    map.push({
      title: "Required Tokens",
      value: `${requiredTokens.toString()} ${data.symbol}`,
    });
    return map || [];
  }, [chainId, data]);
  return (
    <form onSubmit={formik.handleSubmit}>
      <p className=" text-primary-green text-2xl font-medium mb-6">Details</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <InfoGrid data={details} />
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

export default Step6;
