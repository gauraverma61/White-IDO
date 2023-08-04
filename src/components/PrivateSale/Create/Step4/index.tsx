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

interface Iprops extends ICreatePrivateSale {
  banner: string;
}

const PrivateSaleCreateStep4: React.FC<Iprops> = (props) => {
  const { formik, banner } = props;

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
            "tier1EndTime",
            "tier2StartTime",
            "tier2EndTime",
          ].includes(key)
        ) {
          return {
            title: title(key) + " " + "(UTC)",
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
    <form onSubmit={handleSubmit}>
      <p className="text-xl font-semibold">Details</p>
      <InfoGrid data={launchPadDetails} />
      <div className="flex justify-center mt-4">
        <HoverImage
          type="staticImageWithHover"
          borderRadius="rounded-old-full"
          classTag="rounded-old-[120px] w-[318px] h-[318px] object-cover"
          src={banner}
          title={formik.values.title}
          time={formik.values.startTime}
        />
      </div>
    </form>
  );
};

export default PrivateSaleCreateStep4;
