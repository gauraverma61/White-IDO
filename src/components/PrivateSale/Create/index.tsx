import React, { useState, useEffect, useMemo } from "react";
import { useMultistepForm } from "@hooks/useMultiStepForm";
import PrivateSaleCreateStep1 from "./Step1";
import Button from "@atoms/Button";
import PrivateSaleCreateStep2 from "./Step2";
import PrivateSaleCreateStep3 from "./Step3";
import PrivateSaleCreateStep4 from "./Step4";
import { useRouter } from "next/router";
import { FormikValues, useFormik } from "formik";
import { usePrivateSaleData } from "src/Contexts/PrivateSaleContext";
import { FormikContextType } from "formik/dist/types";
import { usePoolFees } from "@components/LaunchPad/hooks/useStats";
import useAuth from "@hooks/useAuth";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { contract } from "@constants/constant";
import { mulDecimal } from "@constants/contractHelper";
import { feesSetting } from "@components/LaunchPad/Create";
import { parseEther } from "ethers/lib/utils";
import { getWeb3 } from "@constants/connectors";
import { supportNetwork } from "@constants/network";
import { PrivateSaleStepData } from "@components/PrivateSale/Constant";
import StepperWrapper from "@components/Layouts/StepperWrapper";
import BannerImage from "@public/images/privatesaleBanner.png";
import Image from "next/image";
import TimerPreview from "@molecules/TimerPreview";

import UploadImage from "@components/Common/UploadImage";
import moment from "moment";
import { MediaLibrary } from "@spatie/media-library-pro-core/dist/types";
import axios from "axios";
import { ParioPoolFactory__factory } from "../../../blockchain-types";
import { LibPresale } from "../../../blockchain-types/contracts/launchpad/PoolFactory.sol/ParioPoolFactory";
import { PaymentCurrencies } from "@constants/currencies";

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
  refundType: "",
  router: "",
  liquidity: "",
  listingRate: "",
  startTime: moment().utc().add(30, "m").toISOString(),
  endTime: moment().utc().add(30, "m").toISOString(),
  publicStartTime: "",
  tier1EndTime: "",
  tier2EndTime: "",
  liquidityLockupDays: "",
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

export type ICreatePrivateSaleFormData = typeof INITIAL_VALUES;

export interface ICreatePrivateSale {
  commonStats: {
    poolPrice: number;
    auditPrice: number;
    kycPrice: number;
  };
  formik: FormikContextType<ICreatePrivateSaleFormData>;
  data: Partial<FormikValues>;
  prev: () => void;
  next: () => void;
  launchpadImage?: string;
  setLaunchpadImage?: (value: string) => void;
  launchpadBannerImage?: string;
  setLaunchpadBannerImage?: (value: string) => void;
}

const PrivateSaleCreateComp: React.FC = () => {
  const router = useRouter();
  const { getPrivateSaleData, setSaleImage } = usePrivateSaleData();
  const [formData, setFormData] = useState(INITIAL_VALUES);
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
  const [currentStep, setCurrentStep] = useState(0);
  const commonStats = usePoolFees({});

  const { account, chainId, library } = useAuth();

  const handleCreateSale = async (value: ICreatePrivateSaleFormData) => {
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
          const paymentCurrency = PaymentCurrencies[chainId || "default"].find(
            (pc) => pc.symbol.toLowerCase() === value.currency.toLowerCase()
          );
          let poolfactoryAddress = contract[chainId]
            ? contract[chainId].poolfactory
            : contract["default"].poolfactory;
          const ParioPoolFactory = new ParioPoolFactory__factory(
            await library?.getSigner()
          );

          let factoryContract = ParioPoolFactory.attach(poolfactoryAddress);

          let feesCal = Math.round(commonStats.poolPrice * 1e12) / 1e12;
          console.log(feesCal);
          const params: LibPresale.PrivateSaleStruct = {
            publicStartTime: String(
              value.publicStartTime
                ? moment.utc(value.publicStartTime).unix()
                : 0
            ),
            useWhitelist: value.saleMethod === "Whitelist",
            tier1: {
              endTime: String(
                value.tier1EndTime ? moment.utc(value.tier1EndTime).unix() : 0
              ),
            },
            tier2: {
              endTime: String(
                value.tier2EndTime ? moment.utc(value.tier2EndTime).unix() : 0
              ),
            },
            tokenName: value.title,
            governance: account,
            payment_currency:
              paymentCurrency?.address ||
              "0x0000000000000000000000000000000000000000",
            min_payment: mulDecimal(
              value.minimumBuy,
              paymentCurrency?.decimals || 18
            ).toString(),
            max_payment: mulDecimal(
              value.maximumBuy,
              paymentCurrency?.decimals || 18
            ).toString(),
            softCap: mulDecimal(
              value.softcap,
              paymentCurrency?.decimals || 18
            ).toString(),
            hardCap: mulDecimal(
              value.hardcap,
              paymentCurrency?.decimals || 18
            ).toString(),
            startTime: String(moment.utc(value.startTime).unix()),
            endTime: String(moment.utc(value.endTime).unix()),
            feeIndex: "0",
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
            tgeBps: value.TGEPercentage
              ? String(parseFloat(value.TGEPercentage) * 100)
              : "0",
            cycle: value.CycleTime
              ? String(parseFloat(value.CycleTime) * 60 * 60 * 24)
              : "0",
            cycleBps: value.CycleReleasePercent
              ? String(parseFloat(value.CycleReleasePercent) * 100)
              : "0",
          };
          let tx = await factoryContract.createPrivateSale(
            params,

            { from: account, value: parseEther(feesCal.toString()) }
          );

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
                  `/private-sale/details/${response.logs[2].address}?blockchain=${chainId}`
                );
              } else {
                toast.error("something went wrong !");
                // history.push("/");
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
      console.error("err", err);
      toast.error(err.reason ? err.reason : err.message);
    }
  };

  const submitForm = async (data: ICreatePrivateSaleFormData) => {
    console.log("Launchpad_Details>>", data);
    await handleCreateSale(data);
  };

  useEffect(() => {
    if (image) {
      setSaleImage(image);
    }
  }, [image]);

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
        "Start time should be atleast 15 minutes in future",
        (value) => {
          return !value || value >= moment.utc().add(15, "m").toDate();
        }
      )
      .required("Start Time Required")
      .when("saleMethod", {
        is: "Whitelist",
        then: Yup.date()
          .label("Start time")
          .test(
            "startTime",
            "Start time should be before Tier 1 end time",
            (value, context) => {
              let endTime = context.parent.tier1EndTime;
              if (context.parent.saleMethod === "Public") {
                endTime = 0;
              } else {
                endTime = context.parent.tier1EndTime;
              }
              if (endTime == 0) return true;
              return !value || endTime > context.parent.startTime;
            }
          )
          .test(
            "startTime",
            "Start time should be greater than Tier 2 end time",
            (value, context) => {
              let endTime = context.parent.tier2EndTime || 0;
              if (context.parent.saleMethod === "Public") endTime = 0;
              if (endTime === 0) return true;
              return !value || endTime > context.parent.startTime;
            }
          ),
      }),
    publicStartTime: Yup.date()
      .label("Public Start Time")
      .test(
        "publicStartTime",
        "Public start time should be greater than start time",
        (value, context) => !value || context.parent.startTime < value
      )
      .test(
        "publicStartTime",
        "Public start time should be greater than or equal to Tier 2 end time",
        (value, context) => !value || context.parent.tier2EndTime <= value
      ),
    endTime: Yup.date()
      .label("End time")
      .test(
        "endTime",
        "End time should be greater than start time",
        (value, context) => !value || value > context.parent.startTime
      )
      .required("End Time Required")
      .when("saleMethod", {
        is: "Whitelist",
        then: Yup.date()
          .required("Tier 1 End Time Required")
          .test(
            "endTime",
            "End time should be after Tier 1 end time",
            (value, context) => {
              let endTime = context.parent.tier1EndTime;
              if (context.parent.saleMethod === "Public") endTime = 0;
              return !value || endTime < context.parent.endTime;
            }
          )
          .test(
            "endTime",
            "End time should be equal or after Tier 2 end time",
            (value, context) => {
              let endTime = context.parent.tier2EndTime || 0;
              if (context.parent.saleMethod === "Public") endTime = 0;
              if (endTime === 0) return true;
              return !value || endTime <= context.parent.endTime;
            }
          ),
      }),
    tier1EndTime: Yup.date()
      .label("Tier 1 end time")
      .test(
        "tier1EndTime",
        "Presale Start time must be before Tier 1 end time",
        (value, context) => !value || context.parent.startTime < value
      )
      .when("saleMethod", {
        is: "Whitelist",
        then: Yup.date().required("Tier 1 End Time Required"),
      }),

    tier2EndTime: Yup.date()
      .nullable()
      .label("Tier 2 end time")
      .test(
        "tier2EndTime",
        "Presale Start time must be before Tier 2 end time",
        (value, context) => !value || context.parent.startTime < value
      )
      .test(
        "tier2EndTime",
        "Tier 1 end time must be before Tier 2 end time",
        (value, context) => !value || context.parent.tier1EndTime < value
      )
      .when("saleMethod", {
        is: "Whitelist",
        then: Yup.date().required("Tier 2 End Time Required"),
      }),
  };

  const currentValidationSchema = useMemo(() => {
    switch (currentStep) {
      case 1:
        return Yup.object().shape({
          softcap: Yup.number()
            .typeError("Must be number")
            .positive("Must be Positive")
            .required("Softcap Required")
            .test(
              "moreThan",
              "softcap should aleast 50% of hardcap",
              (value, context) =>
                !value || value >= parseFloat(context.parent.hardcap) / 2
            ),
          hardcap: Yup.number()
            .positive("Must be Positive")
            .moreThan(
              Yup.ref("softcap"),
              "Hardcap must be greater than softcap"
            )
            .typeError("Must be number")
            .required("Hardcap Required"),
          minimumBuy: Yup.number()
            .label("Minimum buy")
            .typeError("Must be number")
            .moreThan(0)
            .max(
              Yup.ref("maximumBuy"),
              "Minimum buy must be less than or equal to maximum buy"
            )
            .required("Minimum Buy Required"),
          maximumBuy: Yup.number()
            .label("Maximum buy")
            .moreThan(0)
            .typeError("Must be number")
            .max(
              Yup.ref("hardcap"),
              "Maximum buy must be less than or equal to hardcap"
            )
            .required("Maximum Buy Required"),
          // refundType: Yup.string()
          //   .required("Refund Type is required")
          //   .label("Refund type"),
          // router: Yup.string().required("Router is Required"),
          // liquidity: Yup.number()
          //   .moreThan(0)
          //   .typeError("Must be number")
          //   .required("Liquidity Required"),
          // listingRate: Yup.number()
          //   .label("Listing rate")
          //   .moreThan(0)
          //   .typeError("Must be number")
          //   .required("Listing Rate Required"),

          // liquidityLockupDays: Yup.number()
          //   .label("Liquidity lockup time")
          //   .min(30, "Lockup Time should be more than 30")
          //   .required("Lockup Time Required"),
          TGEPercentage: Yup.number()
            .required("Vesting Percentage Required")
            .label("Vesting percentage")
            .moreThan(0),
          CycleTime: Yup.number()
            .required("Cycle Time Required")
            .label("Cycle Time")
            .moreThan(0),
          CycleReleasePercent: Yup.number()
            .required("Cycle Release Percentage Required")
            .label("Cycle release percentage")
            .moreThan(0),
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
        return Yup.object().shape({ ...timeValidations });
      default:
        return Yup.object().shape({
          title: Yup.string().required("Title Required"),
          currency: Yup.string().required("Currency Required"),
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
          description: Yup.string()
            .required("Description is required")
            .min(150)
            .max(500),
        });
    }
  }, [currentStep]);
  const formik = useFormik<ICreatePrivateSaleFormData>({
    initialValues: formData,
    validationSchema: currentValidationSchema,
    onSubmit: async (values, actions) => {
      console.log("values", values);
      if (!image || !banner) {
        toast.error("Please select banner & logo!");
        return;
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
  useEffect(() => {
    formik.setFieldValue(
      "currency",
      supportNetwork[chainId || "default"]?.symbol
    );
  }, [chainId]);
  const steps = [
    <PrivateSaleCreateStep1
      formik={formik}
      launchpadImage={image}
      setLaunchpadImage={setImage}
      launchpadBannerImage={banner}
      setLaunchpadBannerImage={setBanner}
      data={formData}
      next={handleNextStep}
      key={0}
      commonStats={commonStats}
    />,
    <PrivateSaleCreateStep2
      formik={formik}
      launchpadImage={image}
      setLaunchpadImage={setImage}
      launchpadBannerImage={banner}
      setLaunchpadBannerImage={setBanner}
      data={formData}
      next={handleNextStep}
      prev={handlePreviousStep}
      key={1}
      commonStats={commonStats}
    />,
    <PrivateSaleCreateStep3
      formik={formik}
      launchpadImage={image}
      setLaunchpadImage={setImage}
      launchpadBannerImage={banner}
      setLaunchpadBannerImage={setBanner}
      data={formData}
      next={handleNextStep}
      prev={handlePreviousStep}
      key={2}
      commonStats={commonStats}
    />,
    <PrivateSaleCreateStep4
      banner={banner}
      formik={formik}
      launchpadImage={image}
      setLaunchpadImage={setImage}
      launchpadBannerImage={banner}
      setLaunchpadBannerImage={setBanner}
      data={formData}
      next={handleNextStep}
      prev={handlePreviousStep}
      key={3}
      commonStats={commonStats}
    />,
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
      name: "Title",
      value: formik.values.title || "-",
    },
    {
      name: "Payment Currency",
      value: formik.values.currency || "-",
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
    // {
    //   name: "Presale Rate",
    //   value: formik.values.presaleRate || "-",
    // },
    {
      name: "Whitelist",
      value: formik.values.saleMethod === "Whitelist" ? "Yes" : "No",
    },
    {
      name: "Softcap (BNB)*",
      value: formik.values.softcap || "-",
    },
    {
      name: "Hardcap (BNB)*",
      value: formik.values.hardcap || "-",
    },
    {
      name: "Minimum Buy (BNB)*",
      value: formik.values.minimumBuy || "-",
    },
    {
      name: "Maximum Buy (BNB)*",
      value: formik.values.maximumBuy || "-",
    },
    {
      name: "First Fund Vesting*",
      value: formik.values.TGEPercentage || "-",
    },
    {
      name: "Fund Vesting (Days)",
      value: formik.values.CycleTime || "-",
    },
    {
      name: "Fund Release (%)*",
      value: formik.values.CycleReleasePercent || "-",
    },
    {
      name: "Liquidity Lockup (Days)*",
      value: formik.values.liquidityLockupDays || "-",
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
      name: "Public Start Time (UTC)*",
      time: `${moment(utcToLocalDate(formik.values.publicStartTime)).format(
        "DD/MM/yyyy hh:mm a"
      )}`,
      error: formik.touched.publicStartTime && formik.errors.publicStartTime,
      dontShow: !(formik.values.saleMethod === "Whitelist"),
    },
    {
      name: "Tier 1 End Time (UTC)*",
      time: `${moment(utcToLocalDate(formik.values.tier1EndTime)).format(
        "DD/MM/yyyy hh:mm a"
      )}`,
      error: formik.touched.tier1EndTime && formik.errors.tier1EndTime,
      dontShow: !(formik.values.saleMethod === "Whitelist"),
    },
    {
      name: "Tier 2 End Time (UTC)*",
      time: `${moment(utcToLocalDate(formik.values.tier2EndTime)).format(
        "DD/MM/yyyy hh:mm a"
      )}`,
      error: formik.touched.tier2EndTime && formik.errors.tier2EndTime,
      dontShow: !(formik.values.saleMethod === "Whitelist"),
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
            banner ? "bg-black/10 backdrop-blur-sm" : ""
          } flex justify-center h-full bg-gradient-to-t from-black to-black/10 relative`}>
          <div
            className={`flex flex-col-reverse md:flex-row md:items-center justify-between mx-auto container px-4 sm:px-6 md:px-6 xl:px-14 pt-6 relative`}>
            <div
              className={`flex justify-between md:self-end pb-10 w-full ${
                image || banner ? "" : "create-head"
              }`}>
              <h1 className="text-2xl truncate sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-[5rem] leading-[6rem] text-primary-green mt-4">
                {formik.values.title ? (
                  <div className="flex max-w-[400px] xl:max-w-[700px] truncate">
                    <div className="truncate">{formik.values.title}</div>
                    <div className="min-w-fit truncate ">-Privatesale</div>
                  </div>
                ) : (
                  "Create Private Sale"
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
            <div className="flex flex-col  md:self-end pb-10">
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
                <div className={`w-full ${image ? "" : "h-full"}`}>
                  <UploadImage
                    setImageValue={(v: string) => {
                      setImage(v);
                      setImageUploaded("");
                    }}
                    setImagesValue={setImages}
                    classTags="upload-bgImage-sec border border-dashed icon-change"
                  />
                </div>
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
            data={PrivateSaleStepData}
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
                  className="bg-primary-green outline outline-2 outline-primary-green disabled:bg-[#457457]/60 text-secondary-dark "
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
            (
              element: {
                value?: string;
                name: string;
                time?: any;
                error?: any;
                dontShow?: any;
              },
              index
            ) => (
              <div
                key={index}
                className={`flex justify-between w-full text-white ${
                  index === 0
                    ? ""
                    : "border-t border-secondary-green text-base font-medium"
                } py-3.5 px-2 ${element?.dontShow ? "hidden" : ""}`}>
                <p className="mb-0">{element?.name}</p>
                <p
                  className={`mb-0 ${
                    element.error ? "text-primary-red" : "text-primary-green"
                  }`}>
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

export default PrivateSaleCreateComp;
