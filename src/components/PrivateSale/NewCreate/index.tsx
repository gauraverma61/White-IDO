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
import PrivateSaleCreateStep5 from "./Step5";

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
  setLaunchpadImages?: Function;
  launchpadBannerImage?: string;
  setLaunchpadBannerImage?: (value: string) => void;
  setLaunchpadBannerImages?: Function;
  setImageUploaded?: Function;
  setBannerUploaded?: Function;
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
    if (currentStep === 1) {
      if (!image || !banner) {
        toast.error("Please select banner & logo!");
        return;
      }
    }
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
            "Start time should be before Whitelist end time",
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
        "Public start time should be greater than or equal to Whitelist end time",
        (value, context) => !value || context.parent.tier1EndTime <= value
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
          .required("Whitelist End Time Required")
          .test(
            "endTime",
            "End time should be after Whitelist end time",
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
        "Presale Start time must be before Whitelist end time",
        (value, context) => !value || context.parent.startTime < value
      )
      .when("saleMethod", {
        is: "Whitelist",
        then: Yup.date().required("Whitelist End Time Required"),
      }),

    // tier2EndTime: Yup.date()
    //   .nullable()
    //   .label("Tier 2 end time")
    //   .test(
    //     "tier2EndTime",
    //     "Presale Start time must be before Tier 2 end time",
    //     (value, context) => !value || context.parent.startTime < value
    //   )
    //   .test(
    //     "tier2EndTime",
    //     "Tier 1 end time must be before Tier 2 end time",
    //     (value, context) => !value || context.parent.tier1EndTime < value
    //   )
    //   .when("saleMethod", {
    //     is: "Whitelist",
    //     then: Yup.date().required("Tier 2 End Time Required"),
    //   }),
  };

  const currentValidationSchema = useMemo(() => {
    switch (currentStep) {
      case 3:
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
          website: Yup.string().url(),
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
          description: Yup.string().max(500),
          // ...timeValidations,
        });
      case 4:
        return Yup.object().shape({ ...timeValidations });
      default:
        return Yup.object().shape({
          title: Yup.string().required("Title Required"),
          currency: Yup.string().required("Currency Required"),
          ...timeValidations,
        });
    }
  }, [currentStep]);
  const formik = useFormik<ICreatePrivateSaleFormData>({
    initialValues: formData,
    validationSchema: currentValidationSchema,
    onSubmit: async (values, actions) => {
      console.log("values", values);
      // if (!image || !banner) {
      //   toast.error("Please select banner & logo!");
      //   return;
      // }
      if (currentStep === 4) {
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
      setLaunchpadImages={setImages}
      setImageUploaded={setImageUploaded}
      setBannerUploaded={setBannerUploaded}
      launchpadBannerImage={banner}
      setLaunchpadBannerImage={setBanner}
      setLaunchpadBannerImages={setBanners}
      key={1}
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
    <PrivateSaleCreateStep5
      formik={formik}
      launchpadImage={image}
      setLaunchpadImage={setImage}
      launchpadBannerImage={banner}
      setLaunchpadBannerImage={setBanner}
      data={formData}
      next={handleNextStep}
      prev={handlePreviousStep}
      key={4}
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

  const upperTabs: string[] = [
    "Info",
    "Upload",
    "Social Media",
    "Liquidity",
    "Details",
  ];

  return (
    <div className="container mx-auto pb-20 pt-32 md:py-40 2xl:px-16">
      <div className="hidden lg:flex gap-16 mb-[70px]">
        {upperTabs.map((tab, index) => (
          <span
            className={` ${
              currentStep == index ? "text-primary-green" : "text-white"
            } text-xl font-medium  cursor-not-allowed`}
            key={index}>
            {tab}
          </span>
        ))}
      </div>
      <div className=" rounded-old-[36px] border border-primary-green px-8 lg:px-16 pt-14 pb-20 bg-dull-black ">
        {steps[currentStep]}
        <div className="flex flex-col-reverse md:flex-row justify-between mt-20 gap-8">
          {currentStep > 0 ? (
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setCurrentStep((prev) => prev - 1)}>
              Back
            </Button>
          ) : (
            <div className="hidden md:block"></div>
          )}
          <Button
            disabled={formik.isSubmitting}
            className="w-full sm:w-auto"
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
            {currentStep > 3
              ? formik.isSubmitting
                ? "Submitting..."
                : "Submit"
              : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrivateSaleCreateComp;
