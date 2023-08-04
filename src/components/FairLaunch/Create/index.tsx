/* eslint-disable react/jsx-key */
import React, { useState, useEffect, useMemo } from "react";
import Step2 from "./Step2";
import Step4 from "./Step4";
import Step1 from "./Step1";
import Step3 from "./Step3";
import { useRouter } from "next/router";
import { FormikValues, useFormik } from "formik";
import { FormikContextType } from "formik/dist/types";
import {
  feesSetting,
  ICreateLaunchpadFormData,
} from "@components/LaunchPad/Create";
import { usePoolFees } from "@components/LaunchPad/hooks/useStats";
import useAuth from "@hooks/useAuth";
import { toast } from "react-toastify";
import * as Yup from "yup";
import CreateWrapper from "@components/Layouts/CreateWrapper";
import Button from "@atoms/Button";
import { contract } from "@constants/constant";
import {
  approveTokens,
  getContract,
  mulDecimal,
} from "@constants/contractHelper";
import tokenAbi from "../../../ABIs/ERC20/ERC20ABI.json";
import { formatUnits, isAddress, parseEther } from "ethers/lib/utils";
import { getWeb3 } from "@constants/connectors";
import poolFactoryAbi from "../../../ABIs/PoolFactory/PoolFactory.json";
import { supportNetwork } from "@constants/network";
import StepsInfo from "@components/StepsInfo";
import { stepsInfoList } from "@constants/launchPadsStepsInfo";
import { FairLaunchStepData } from "@components/FairLaunch/Constant";
import StepperWrapper from "@components/Layouts/StepperWrapper";
import BannerImage from "@public/images/fairlaunchBanner.png";
import Image from "next/image";
import TimerPreview from "@molecules/TimerPreview";
import UploadImage from "@components/Common/UploadImage";
import moment from "moment";
import axios from "axios";
import { MediaLibrary } from "@spatie/media-library-pro-core/dist/types";
import { ParioPoolFactory__factory, IPool } from "../../../blockchain-types";
import { LibPresale } from "../../../blockchain-types/contracts/launchpad/PoolFactory.sol/ParioPoolFactory";
import { PaymentCurrencies } from "@constants/currencies";
import useTokenInfo from "@hooks/useTokenInfo";
import useSWR from "swr";

export const FeesSetting: Record<
  string,
  {
    token: number;
    bnb: number;
    extra: number;
  }
> = {
  "0": {
    token: 0,
    bnb: 5,
    extra: 0,
  },
  "1": {
    token: 2,
    bnb: 2,
    extra: 0,
  },
};

const INITIAL_VALUES = {
  tokenAddress: "",
  title: "",
  name: "",
  symbol: "",
  decimals: "",
  balance: "",
  totalSupply: "",
  currency: "MATIC",
  feeOptions: "0",
  listingOptions: "Auto",
  presaleRate: "",
  saleMethod: "Public",
  softcap: "",
  hardcap: "",
  minimumBuy: "",
  maximumBuy: "",
  refundType: "Refund",
  router: "",
  liquidity: "",
  listingRate: "51",
  startTime: moment().utc().add(30, "m").toISOString(),
  endTime: moment().utc().add(30, "m").toISOString(),
  publicStartTime: "",
  tier1EndTime: "",
  tier2EndTime: "",
  liquidityLockupDays: "",
  totalAmount: "",
  website: "",
  facebook: "",
  twitter: "",
  instagram: "",
  github: "",
  telegram: "",
  discord: "",
  reddit: "",
  description: "",
  TGEPercentage: "",
  CycleTime: "",
  CycleReleasePercent: "",
  isvesting: false,
  step: 1,
};

export type ICreateFairLaunchpadFormData = typeof INITIAL_VALUES;

export interface ICreateFairLaunch {
  commonStats: {
    poolPrice: number;
    auditPrice: number;
    kycPrice: number;
  };
  formik: FormikContextType<ICreateFairLaunchpadFormData>;
  prev: () => void;
  next: () => void;
  launchpadImage?: string;
  setLaunchpadImage?: (value: string) => void;
  launchpadBannerImage?: string;
  setLaunchpadBannerImage?: (value: string) => void;
}

const CreateFairLaunch = () => {
  const router = useRouter();
  const [image, setImage] = useState<string>("");
  const [imageUploaded, setImageUploaded] = useState<string>("");
  const [images, setImages] = useState<{
    name: string;
    media: {
      [uuid: string]: MediaLibrary.MediaAttributes;
    };
  }>({
    name: "",
    media: {},
  });
  const [bannerUploaded, setBannerUploaded] = useState<string>("");
  const [banner, setBanner] = useState<string>("");
  const [banners, setBanners] = useState<{
    name: string;
    media: {
      [uuid: string]: MediaLibrary.MediaAttributes;
    };
  }>({
    name: "",
    media: {},
  });

  const commonStats = usePoolFees({});

  const [formData, setFormData] = useState(INITIAL_VALUES);
  const [currentStep, setCurrentStep] = useState(0);

  const { account, chainId, library, ethereum } = useAuth();

  const handleApprove = async (
    value: ICreateFairLaunchpadFormData
  ): Promise<boolean> => {
    let poolfactoryAddress: string = contract[chainId || "default"].poolfactory;
    return approveTokens({
      library,
      account,
      chainId,
      token: value.tokenAddress,
      spender: poolfactoryAddress,
      amount: parseEther("1000000000000000000000000000").toString(),
    });
  };

  const handleCreateSale = async (value: ICreateFairLaunchpadFormData) => {
    try {
      if (account) {
        if (chainId) {
          let logo = imageUploaded,
            bannerImage = bannerUploaded;
          if (logo === "") {
            const { data: logoUpload } = await axios.post(
              `/upload/main`,
              images
            );
            if (logoUpload?.success) {
              logo = logoUpload.image_url;
              setImageUploaded(logo);
            }
          }
          if (bannerImage === "") {
            const { data: bannerUpload } = await axios.post(
              `/upload/cover`,
              banners
            );
            if (bannerUpload?.success) {
              bannerImage = bannerUpload.image_url;
              setBannerUploaded(bannerImage);
            }
          }
          if (!bannerImage || !logo) {
            toast.error("Image Upload Failed");
            return;
          }

          let para = [
            [
              value.tokenAddress,
              contract[chainId]
                ? contract[chainId].routeraddress
                : contract["default"].routeraddress,
              account,
            ], // 1
            [
              mulDecimal(value.softcap, 18).toString(),
              mulDecimal(
                value.totalAmount,
                parseFloat(value.decimals)
              ).toString(),
            ], //2
            [
              Math.floor(new Date(value.startTime).getTime() / 1000.0),
              Math.floor(new Date(value.endTime).getTime() / 1000.0),
              parseInt(value.liquidityLockupDays) * 60 * 60 * 24,
            ], //3
            [
              feesSetting[
                value.feeOptions ===
                `3% ${supportNetwork[chainId || "default"].symbol} sold`
                  ? "1"
                  : "2"
              ].token,
              feesSetting[
                value.feeOptions ===
                `3% ${supportNetwork[chainId || "default"].symbol} sold`
                  ? "1"
                  : "2"
              ].bnb,
            ], //4
            "2", // 5
            "2", //6
            [value.liquidity, value.refundType === "Refund" ? "0" : "1"], //7
            JSON.stringify({
              logo: logo,
              banner: bannerImage,
              title: value.title,
              description: value.description,
              socials: {
                website: value.website,
                facebook: value.facebook,
                twitter: value.twitter,
                instagram: value.instagram,
                github: value.github,
                telegram: value.telegram,
                discord: value.discord,
                reddit: value.reddit,
              },
            }),
            ["", "", ""],
          ];

          let poolfactoryAddress = contract[chainId]
            ? contract[chainId].poolfactory
            : contract["default"].poolfactory;

          const ParioPoolFactory = new ParioPoolFactory__factory(
            await library?.getSigner()
          );

          let factoryContract = ParioPoolFactory.attach(poolfactoryAddress);

          const paymentCurrency = PaymentCurrencies[chainId || "default"].find(
            (pc) => pc.symbol.toLowerCase() === value.currency.toLowerCase()
          );

          let feesCal = commonStats.poolPrice;
          const params: LibPresale.FairLaunchStruct = {
            totalToken: mulDecimal(
              value.totalAmount,
              parseFloat(value.decimals)
            ).toString(),
            token: value.tokenAddress,
            router: contract[chainId]
              ? contract[chainId].routeraddress
              : contract["default"].routeraddress,
            governance: account,
            payment_currency:
              paymentCurrency?.address ||
              "0x0000000000000000000000000000000000000000",
            softCap: mulDecimal(
              value.softcap,
              paymentCurrency?.decimals || 18
            ).toString(),
            startTime: String(moment.utc(value.startTime).unix()),
            endTime: String(moment.utc(value.endTime).unix()),
            feeIndex: value.feeOptions,
            liquidityLockDays: (
              parseInt(value.liquidityLockupDays) *
              60 *
              60 *
              24
            ).toString(),
            liquidityPercent: value.liquidity,
            refundType: "0",
            poolDetails: JSON.stringify({
              logo: logo,
              banner: bannerImage,
              title: value.title,
              description: value.description,
              socials: {
                website: value.website,
                facebook: value.facebook,
                twitter: value.twitter,
                instagram: value.instagram,
                github: value.github,
                telegram: value.telegram,
                discord: value.discord,
                reddit: value.reddit,
              },
            }),
          };
          let tx = await factoryContract.createFairSale(params, {
            from: account,
            value: parseEther(feesCal.toFixed(8).toString()),
          });

          await toast.promise(tx.wait, {
            pending: "Confirming Transaction...",
          });
          let web3 = getWeb3(chainId);
          var response = await web3.eth.getTransactionReceipt(tx.hash);
          if (response != null) {
            if (response.status) {
              toast.success("Transaction confirmed!");
              if (typeof response.logs[2] !== "undefined") {
                await router.push(
                  `/fair-launch/details/${response.logs[2].address}?blockchain=${chainId}`
                );
              } else {
                toast.error("something went wrong !");
              }
            } else if (!response.status) {
              toast.error("Transaction failed!");
            } else {
              toast.error("Something went wrong!");
            }
          }
        } else {
          toast.error("wrong network selected !");
        }
      } else {
        toast.error("Please connect your wallet");
      }
    } catch (err: any) {
      toast.error(err.reason ? err.reason : err.message);
    }
  };
  const submitForm = async (data: ICreateFairLaunchpadFormData) => {
    console.log("FairLaunch_Details>>", data);
    const approved = await handleApprove(data);
    if (approved) await handleCreateSale(data);
    // router.push(`/fair-launch/details/${tempAddress}`);
    // getFairLaunchData(data);
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };
  const handlePreviousStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const timeValidations = {
    startTime: Yup.date()
      .label("Start time")
      .test(
        "startTime",
        "Start time should be at least 10 minutes in future",
        (value) => !value || value >= moment.utc().add(10, "m").toDate()
      )
      .required("Start Time Required"),
    endTime: Yup.date()
      .label("End time")
      .test(
        "endTime",
        "End time should be greater than start time",
        (value, context) => !value || value > context.parent.startTime
      )
      .required("End Time Required"),
  };

  const currentValidationSchema = useMemo(() => {
    switch (currentStep) {
      case 1:
        return Yup.object().shape({
          totalAmount: Yup.number()
            .label("Total amount")
            .moreThan(0)
            .typeError("Total amount Must be number")
            .required("Total amount Required"),
          softcap: Yup.number()
            .typeError("Must be number")
            .moreThan(0)
            .required("Softcap Required"),
          refundType: Yup.string().label("Refund type").required(),
          liquidity: Yup.number()
            .moreThan(50)
            .typeError("Must be number")
            .required("Liquidity Required"),
          listingRate: Yup.number()
            .label("Listing rate")
            .moreThan(0)
            .typeError("Must be number")
            .required("Listing Rate Required"),

          liquidityLockupDays: Yup.number()
            .label("Liquidity lockup time")
            .min(30, "Lockup Time should be more than 30")
            .required("Lockup Time Required"),
          TGEPercentage: Yup.number()
            .label("Vesting percentage")
            .moreThan(0)
            .when("isvesting", {
              is: true,
              then: Yup.number().required("Vesting Percentage Required"),
            }),
          CycleTime: Yup.number()
            .label("Cycle Time")
            .moreThan(0)
            .when("isvesting", {
              is: true,
              then: Yup.number().required("Cycle Time Required"),
            }),
          CycleReleasePercent: Yup.number()
            .label("Cycle release percentage")
            .moreThan(0)
            .when("isvesting", {
              is: true,
              then: Yup.number().required("Cycle Release Percentage Required"),
            }),
          ...timeValidations,
        });
      case 2:
        return Yup.object({
          website: Yup.string().url().required("Website Url Required"),
          facebook: Yup.string()
            .url()
            .matches(
              /(?:http:\/\/)?(?:www\.)?facebook\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/,
              "This URL is not valid"
            ),
          twitter: Yup.string()
            .url()
            .matches(
              /(?:http:\/\/)?(?:www\.)?twitter\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/,
              "This URL is not valid"
            ),
          instagram: Yup.string()
            .url()
            .matches(
              /(?:http:\/\/)?(?:www\.)?instagram\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/,
              "This URL is not valid"
            ),
          github: Yup.string()
            .url()
            .matches(
              /^(http(s?):\/\/)?(www\.)?github\.([a-z])+\/([A-Za-z0-9]{1,})+\/?$/i,
              "This URL is not valid"
            ),
          telegram: Yup.string()
            .url()
            .required("Telegram Url Required")
            .matches(
              /(https?:\/\/)?(www[.])?(telegram|t)\.me\/([a-zA-Z0-9_-]*)\/?$/,
              "This URL is not valid"
            ),
          discord: Yup.string()
            .url()
            .matches(
              /(https:\/\/)?(www\.)?(((discord(app)?)?\.com\/invite)|((discord(app)?)?\.gg))\/(?<invite>.+)/gm,
              "This URL is not valid"
            ),
          reddit: Yup.string()
            .url()
            .matches(
              /(?:http:\/\/)?(?:www\.)?reddit\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/,
              "This URL is not valid"
            ),
          description: Yup.string().min(10).max(500),
          ...timeValidations,
        });
      case 3:
        return Yup.object().shape({
          ...timeValidations,
        });
      default:
        return Yup.object().shape({
          tokenAddress: Yup.string()
            .label("Token address")
            .required("Address Required")
            .test("valid-address", "Invalid Address", (address, context) =>
              isAddress(address || "")
            ),
          // name: Yup.string().required("Token name Required"),
          // title: Yup.string().required("Title Required"),
          // symbol: Yup.string().required("Symbol Required"),
          // decimals: Yup.number()
          //   .typeError("Must be a number")
          //   .required("Decimals Required"),
          // balance: Yup.number()
          //   .typeError("Must be a number")
          //   .required("Decimals Required"),
          // totalSupply: Yup.number()
          //   .label("Total supply")
          //   .typeError("Must be a number")
          //   .required("Total Supply Required"),
          website: Yup.string().url().required("Website Url Required"),
          facebook: Yup.string()
            .url()
            .matches(
              /(?:http:\/\/)?(?:www\.)?facebook\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/,
              "This URL is not valid"
            ),
          twitter: Yup.string()
            .url()
            .matches(
              /(?:http:\/\/)?(?:www\.)?twitter\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/,
              "This URL is not valid"
            ),
          instagram: Yup.string()
            .url()
            .matches(
              /(?:http:\/\/)?(?:www\.)?instagram\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/,
              "This URL is not valid"
            ),
          github: Yup.string()
            .url()
            .matches(
              /^(http(s?):\/\/)?(www\.)?github\.([a-z])+\/([A-Za-z0-9]{1,})+\/?$/i,
              "This URL is not valid"
            ),
          telegram: Yup.string()
            .url()
            .required("Telegram Url Required")
            .matches(
              /(https?:\/\/)?(www[.])?(telegram|t)\.me\/([a-zA-Z0-9_-]*)\/?$/,
              "This URL is not valid"
            ),
          discord: Yup.string()
            .url()
            .matches(
              /(https:\/\/)?(www\.)?(((discord(app)?)?\.com\/invite)|((discord(app)?)?\.gg))\/(?<invite>.+)/gm,
              "This URL is not valid"
            ),
          reddit: Yup.string()
            .url()
            .matches(
              /(?:http:\/\/)?(?:www\.)?reddit\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/,
              "This URL is not valid"
            ),
          currency: Yup.string().required("Currency Required"),
          feeOptions: Yup.string()
            .label("Fee options")
            .required("Fee Options Required"),
          listingOptions: Yup.string()
            .label("Listing options")
            .required("Listing Required"),
          description: Yup.string()
            .required("Description is required")
            .min(150)
            .max(500),
        });
    }
  }, [currentStep]);
  const formik = useFormik<ICreateFairLaunchpadFormData>({
    initialValues: formData,
    validationSchema: currentValidationSchema,
    onSubmit: async (values, actions) => {
      console.log("values", values);
      if (!image || !banner) {
        toast.error("Please select banner & logo!");
        return;
      }
      if (currentStep === 0) {
        if (ongoingPools?.length > 0) {
          toast.error("Presale/Fairlaunch already exists for this token.");
          return;
        }
      }
      if (currentStep === 1) {
        await submitForm(values);
        actions.setSubmitting(false);
      } else {
        handleNextStep();
        actions.setTouched({});
        actions.setSubmitting(false);
      }
    },
  });

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

  useEffect(() => {
    if (formik.values.tokenAddress) {
      fetchtokenDetail();
      fetchTokenBalance();
    }
  }, [formik.values.tokenAddress, account]);
  useEffect(() => {
    if (name && tokenBalance && totalSupply && decimals && symbol) {
      formik.setValues({
        ...formik.values,
        name: name,
        symbol: symbol,
        decimals: decimals,
        title: name,
        totalSupply: formatUnits(totalSupply, decimals),
        balance: (
          parseFloat(tokenBalance) /
          10 ** parseFloat(decimals)
        ).toString(),
      });
    } else {
      formik.setFieldValue("name", "");
      formik.setFieldValue("symbol", "");
      formik.setFieldValue("decimals", "");
      formik.setFieldValue("totalSupply", "");
      formik.setFieldValue("title", "");
      formik.setFieldValue("balance", "");
    }
  }, [decimals, name, symbol, tokenBalance, totalSupply, account]);

  const { data, error, isValidating } = useSWR(
    `{
      pools(where: {token_: {id: "${formik.values.tokenAddress.toLowerCase()}"}}) {
        id
        poolState
      }
    }`
  );

  const ongoingPools = useMemo(() => {
    if (data?.pools.length > 0) {
      let arra = data.pools?.filter((e: any) => {
        return e.poolState != "Cancelled";
      });
      return arra;
    }
  }, [data]);

  useEffect(() => {
    formik.setFieldValue(
      "currency",
      supportNetwork[chainId || "default"]?.symbol
    );
  }, [chainId]);
  const steps = [
    <Step1
      formik={formik}
      next={handleNextStep}
      commonStats={commonStats}
      launchpadImage={image}
      launchpadBannerImage={banner}
      setLaunchpadBannerImage={setBanner}
      setLaunchpadImage={setImage}
      ongoingPools={ongoingPools}
    />,
    <Step2
      formik={formik}
      next={handleNextStep}
      prev={handlePreviousStep}
      commonStats={commonStats}
    />,
    <Step3
      formik={formik}
      next={handleNextStep}
      prev={handlePreviousStep}
      commonStats={commonStats}
    />,
    <Step4
      banner={banner}
      formik={formik}
      next={handleNextStep}
      prev={handlePreviousStep}
      commonStats={commonStats}
    />,
  ];

  const FeeOptions = [
    `3% ${supportNetwork[chainId || "default"]?.symbol || "MATIC"} sold`,
    `2% ${
      supportNetwork[chainId || "default"]?.symbol || "MATIC"
    } sold + 1% token sold`,
  ];

  function utcToLocalDate(date: any) {
    if (!date) {
      return date;
    }
    date = new Date(date);
    date = new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds()
    );
    return date;
  }

  const DetailsStepOne = [
    {
      name: "Token Address",
      value: formik.values.tokenAddress || "-",
    },
    {
      name: "Name",
      value: formik.values.name || "-",
    },
    {
      name: "Symbol",
      value: formik.values.symbol || "-",
    },
    {
      name: "Decimals",
      value: formik.values.decimals || "-",
    },
    {
      name: "Total Supply",
      value: formik.values.totalSupply || "-",
    },
    {
      name: "Payment Currency",
      value: formik.values.currency || "-",
    },
    {
      name: "Select Fees",
      value: FeeOptions[Number(formik.values.feeOptions)] || "-",
      error: formik.touched.feeOptions && formik.errors.feeOptions,
    },
    {
      name: "Website",
      value: formik.values.website || "-",
    },
    {
      name: "Reddit",
      value: formik.values.reddit || "-",
    },
    {
      name: "Twitter",
      value: formik.values.twitter || "-",
    },
    {
      name: "Facebook",
      value: formik.values.facebook || "-",
    },
    {
      name: "Github",
      value: formik.values.github || "-",
    },
    {
      name: "Instagram",
      value: formik.values.instagram || "-",
    },
    {
      name: "Telegram",
      value: formik.values.telegram || "-",
    },
    {
      name: "Discord",
      value: formik.values.discord || "-",
    },
    {
      name: "Description",
      value: formik.values.description || "-",
    },
  ];

  const DetailsStepTwo = [
    {
      name: "Total Selling Amount",
      value: formik.values.totalAmount || "-",
    },
    {
      name: "Softcap (BNB)*",
      value: formik.values.softcap || "-",
    },
    {
      name: "Liquidity (%)*",
      value: formik.values.liquidity || "-",
    },
    {
      name: "Start Time (UTC)*",
      time: `${moment(utcToLocalDate(formik.values.startTime)).format(
        "DD/MM/yyyy hh:mm a"
      )}`,
      error: formik.touched.startTime && formik.errors.startTime,
    },
    {
      name: "End Time (UTC)*",
      time: `${moment(utcToLocalDate(formik.values.endTime)).format(
        "DD/MM/yyyy hh:mm a"
      )}`,
      error: formik.touched.endTime && formik.errors.endTime,
    },
    {
      name: "Liquidity Lockup (Days)*",
      value: formik.values.liquidityLockupDays || "-",
    },
  ];

  const DetailsData = currentStep > 0 ? DetailsStepTwo : DetailsStepOne;

  return (
    <div className="py-8 xl:py-20 pt-20 mt-10">
      <div
        className={`bg-no-repeat bg-cover bg-center md:h-[300px] lg:h-[21rem] ${
          !banner && "bg-hero-forms"
        } rounded-old-[3rem] border border-primary-green overflow-hidden`}
        style={{ backgroundImage: `url(${banner})` }}>
        <div
          className={`${
            banner ? "bg-black/40 backdrop-blur-sm" : ""
          } flex justify-center h-full bg-gradient-to-t from-black to-black/10 relative`}>
          <div
            className={`flex flex-col-reverse md:flex-row md:items-center justify-between mx-auto container px-4 sm:px-6 md:px-6 xl:px-14 pt-6 relative`}>
            <div
              className={`flex justify-between md:self-end pb-10 w-full ${
                image || banner ? "" : "create-head"
              }`}>
              <h1 className="text-2xl truncate sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-[5rem] leading-[6rem] text-primary-green mt-4">
                {formik.values.title ? (
                  <div className="flex lg:max-w-[90%] truncate">
                    <div className="truncate">{formik.values.title}</div>
                    <div className="min-w-fit  truncate">-Fairlaunch</div>
                  </div>
                ) : (
                  "Create a Fairlaunch"
                )}
              </h1>
              {/* {image && formik.values.startTime && formik.values.endTime && (
                <TimerPreview
                  startTime={formik.values.startTime}
                  endTime={formik.values.endTime}
                  tier1StartTime={formik.values.startTime}
                  tier1EndTime={formik.values.tier1EndTime}
                  tier2StartTime={formik.values.startTime}
                  tier2EndTime={formik.values.tier2EndTime}
                />
              )} */}
            </div>
            {/* {image || banner ? (
              <></>
            ) : (
              <img
                className="w-[80%] md:w-[300px] lg:w-[450px] hidden md:block"
                src={BannerImage.src}
                alt=""
              />
            )} */}
            <div className="flex flex-col md:self-end pb-10">
              <div className="h-20 w-20 bg-gray8 mb-6  border border-primary-green profile-pic-upload md:self-end">
                {image && (
                  <Image
                    src={image}
                    className="w-full p-0 m-0"
                    alt="detail-img"
                    height={160}
                    width={160}
                    // objectFit="cover"
                  />
                )}
                <UploadImage
                  setImageValue={(v: string) => {
                    setImage(v);
                    setImageUploaded("");
                  }}
                  setImagesValue={setImages}
                  classTags="upload-bgImage-sec border border-dashed icon-change"
                />
              </div>
              <div className="profile-cover-pic text-white rounded-old-3xl items-center flex flex-row-reverse md:flex-row justify-end md:justify-start">
                <p className="text-lg whitespace-nowrap font-semibold mr-2">
                  {banner ? "Edit" : "Add"} Cover Photo
                </p>
                <div className="relative">
                  <UploadImage
                    setImageValue={(v: string) => {
                      setBanner(v);
                      setBannerUploaded("");
                    }}
                    setImagesValue={setBanners}
                    classTags="upload-bgImage-sec border border-dashed icon-change"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 lg:mt-14 flex flex-col-reverse lg:flex-row w-full justify-between">
        <div className="border border-primary-green shadow-boxShadow6  lg:w-1/2 lg:mr-20 bg-primary-dark h-fit">
          <StepperWrapper
            themeColor="red"
            data={FairLaunchStepData}
            activeStep={currentStep}>
            <>
              {steps[currentStep]}
              <div
                className={`flex flex-col sm:flex-row gap-y-6 gap-x-10 w-full ${
                  currentStep === 0
                    ? "justify-center sm:justify-end"
                    : "justify-between"
                } items-center mt-10 sm:mt-14`}>
                {currentStep > 0 ? (
                  <Button
                    disabled={formik.isSubmitting}
                    onClick={() => handlePreviousStep()}
                    variant="bigOutline"
                    className="text-primary-green">
                    {"Back"}
                  </Button>
                ) : (
                  <></>
                )}
                <Button
                  variant="bigGreen"
                  className="bg-primary-green outline outline-2 outline-primary-green disabled:bg-[#457457]/60 text-secondary-dark"
                  disabled={formik.isSubmitting}
                  onClick={() => {
                    if (Object.keys(formik.errors).length > 0) {
                      Object.keys(formik.errors).map((fieldName) =>
                        //@ts-ignore
                        toast.error(formik.errors[fieldName])
                      );
                    } else {
                      formik.handleSubmit();
                    }
                  }}>
                  {currentStep > 0
                    ? formik.isSubmitting
                      ? "Submitting..."
                      : "Submit"
                    : "Next"}
                </Button>
              </div>
            </>
          </StepperWrapper>
        </div>
        <div className="border border-primary-green lg:w-1/2  p-2 sm:p-10 bg-primary-dark mb-6 lg:mb-0 h-fit">
          <h2 className="text-primary-green text-4xl font-semibold my-6">
            Details
          </h2>
          {/* <div className="flex justify-between w-full text-white mb-2">
            <p>Token Address</p>
            <p className="text-primary-green">
              {formik.values.tokenAddress || "-"}
            </p>
          </div> */}
          {DetailsData.map(
            (element: { value?: string; name: string; time?: any }, index) => (
              <div
                key={index}
                className={`flex justify-between w-full text-white ${
                  index === 0
                    ? ""
                    : "border-t border-secondary-green text-base font-medium"
                } py-3.5 px-2`}>
                <p className="mb-0">{element?.name}</p>
                <p className="mb-0 text-primary-green">
                  {element.value
                    ? element?.value?.length > 14
                      ? element?.value?.slice(0, 14) + ".."
                      : element?.value
                    : element?.time}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateFairLaunch;
