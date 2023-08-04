import Input2 from "@atoms/Input2";
import { feesSetting, ICreateLaunchpad, ICreateLaunchpadFormData } from "..";
import { useMemo } from "react";
import InfoGrid, { IInfoGridProps } from "@molecules/InfoGrid";
import { title } from "case";
import moment from "moment";
import { supportNetwork } from "@constants/network";
import useAuth from "@hooks/useAuth";
import HoverImage from "@components/Common/HoverImage";
import { TIME_FORMAT } from "@constants/timeFormats";
import { PaymentCurrencies } from "@constants/currencies";
import { FeesSetting } from "@components/FairLaunch/Create";
import { CountdownTimer } from "@atoms/CountdownTimer";
import { walletNameTrimmer } from "@helpers/walletNameTrimmer";

const Step7: React.FC<ICreateLaunchpad> = (props) => {
  const { formik } = props;

  const { values: data, handleSubmit } = formik;

  const {
    connect,
    isLoggedIn,
    account,
    loading: connecting,
    balance_formatted,
    chainId,
  } = useAuth();

  const getKeyValue =
    <U extends keyof T, T extends object>(key: U) =>
    (obj: T): string =>
      String(obj[key]);

  const launchPadDetails = useMemo<IInfoGridProps["data"]>(() => {
    const map = Object.keys(data)
      ?.filter(
        (k: any) =>
          getKeyValue<keyof ICreateLaunchpadFormData, ICreateLaunchpadFormData>(
            k
          )(data) !== ""
      )
      ?.filter((key) => !["isvesting", "step", "description"].includes(key))
      ?.map((key: any) => {
        const selectedPaymentCurrency = PaymentCurrencies[
          chainId || "default"
        ]?.find(
          (c) => c.symbol.toLowerCase() === formik.values.currency.toLowerCase()
        )?.symbol;
        const currencySymbol = supportNetwork[chainId || "default"]?.symbol;
        const paymentCurrencySymbol = selectedPaymentCurrency || currencySymbol;
        const value = getKeyValue<
          keyof ICreateLaunchpadFormData,
          ICreateLaunchpadFormData
        >(key)(data);
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
        if (["CycleReleasePercent"].includes(key)) {
          return {
            title: "Cycle Release Percent",
            value: `${value}%`,
          };
        }
        if (["TGEPercentage"].includes(key)) {
          return {
            title: "Vesting Percentage",
            value: `${value}%`,
          };
        }
        if (["liquidity"].includes(key)) {
          return {
            title: title(key),
            value: `${value}%`,
          };
        }
        if (["CycleTime"].includes(key)) {
          return {
            title: "Cycle Time (Days)",
            value: `${value}`,
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
            title: "Whitelist End Date" + " " + "(UTC)",
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
        if (["listingRate", "presaleRate"].includes(key) && chainId) {
          return {
            title: title(key),
            value: `1 ${paymentCurrencySymbol} = ${value} ${formik.values.symbol}`,
          };
        }
        if (["feeOptions"].includes(key) && chainId) {
          const FeeOptions = [
            `3% ${paymentCurrencySymbol} sold`,
            `2% ${paymentCurrencySymbol} sold + 1% token sold`,
          ];
          return {
            title: title(key),
            value: FeeOptions[Number(value)],
          };
        }
        // if (
        //   [
        //     "website",
        //     "facebook",
        //     "twitter",
        //     "instagram",
        //     "github",
        //     "telegram",
        //     "discord",
        //     "reddit",
        //   ].includes(key)
        // ) {
        //   return {
        //     title: title(key),
        //     type: "socials",
        //     value: value,
        //   };
        // }
        return {
          title: title(key),
          fullWidth: ["description"].includes(key.toLowerCase()),
          value: String(value),
        };
      });

    const fees = FeesSetting[data.feeOptions].token;
    const listingPercent =
      data.listingOptions === "Auto"
        ? (parseFloat(data.listingRate) *
            parseFloat(data.hardcap) *
            parseFloat(data.liquidity)) /
          100
        : 0;
    const percent = parseFloat(data.presaleRate) * parseFloat(data.hardcap);
    const feesValue = (percent * fees) / 100;

    const requiredTokens = percent + listingPercent + feesValue;
    !isNaN(requiredTokens)
      ? map.push({
          title: "Required Tokens",
          value: `${requiredTokens.toString()} ${data.symbol}`,
        })
      : "";
    return map || [];
  }, [data]);

  console.log("launchPadDetails", launchPadDetails);

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

export default Step7;
