/* eslint-disable react/jsx-key */
import React, { useEffect, useMemo, useState } from "react";
import Step2 from "./Step2";
import Step4 from "./Step4";
import Step1 from "./Step1";
import Step3 from "./Step3";
import { useRouter } from "next/router";
import { FormikValues, useFormik } from "formik";
import { useLaunchpadData } from "src/Contexts/LaunchPadContext";
import { usePoolFees } from "@components/LaunchPad/hooks/useStats";
import useAuth from "@hooks/useAuth";
import { getWeb3 } from "@constants/connectors";
import { contract } from "@constants/constant";
import { getContract, mulDecimal } from "@constants/contractHelper";
import { formatUnits, isAddress, parseEther } from "ethers/lib/utils";
import { toast } from "react-toastify";
import tokenAbi from "../../../ABIs/ERC20/ERC20ABI.json";
import * as Yup from "yup";
import { FormikContextType } from "formik/dist/types";
import Button from "@atoms/Button";
import { supportNetwork } from "@constants/network";
import StepperWrapper from "@components/Layouts/StepperWrapper";
import { LaunchPadStepData } from "../Constant";
import Image from "next/image";
import BannerImage from "@public/images/bannerImage.png";
import TimerPreview from "@molecules/TimerPreview";
import UploadImage from "@components/Common/UploadImage";
import moment from "moment";
import { LibPresale } from "../../../blockchain-types/contracts/launchpad/PoolFactory.sol/ParioPoolFactory";
import { ParioPoolFactory__factory } from "../../../blockchain-types";
import axios from "axios";
import { MediaLibrary } from "@spatie/media-library-pro-core/dist/types";
import useTokenInfo from "@hooks/useTokenInfo";
import { PaymentCurrencies } from "@constants/currencies";
import { BsPersonPlusFill } from "react-icons/bs";
import { HiPlusSm } from "react-icons/hi";
import { IPool } from "../List/hooks/useStats";
import useSWR from "swr";
import Step5 from "./Step5";
import Step6 from "./Step6";
import Step7 from "./Step7";

export const feesSetting = {
  "1": {
    token: 0,
    bnb: 5,
    extra: 0,
  },
  "2": {
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
  currency: "Matic",
  feeOptions: "0",
  listingOptions: "Auto",
  presaleRate: "",
  saleMethod: "Public",
  softcap: "",
  hardcap: "",
  minimumBuy: "",
  maximumBuy: "",
  refundType: "Refund",
  router: "Router",
  liquidity: "",
  listingRate: "",
  startTime: moment().utc().add(30, "m").toISOString(),
  endTime: moment().utc().add(30, "m").toISOString(),
  publicStartTime: "",
  tier1EndTime: "",
  // tier2EndTime: "",
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

export type ICreateLaunchpadFormData = typeof INITIAL_VALUES;

export interface ICreateLaunchpad {
  commonStats: {
    poolPrice: number;
    auditPrice: number;
    kycPrice: number;
  };
  formik: FormikContextType<ICreateLaunchpadFormData>;
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

const CreateLaunchPad = () => {
  const router = useRouter();
  const { getLaunchPadData, setLaunchpadImage } = useLaunchpadData();
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
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] =
    useState<ICreateLaunchpadFormData>(INITIAL_VALUES);
  const [currentStep, setCurrentStep] = useState(0);
  const commonStats = usePoolFees({});
  const { account, chainId, library, ethereum } = useAuth();

  const handleApprove = async (
    value: ICreateLaunchpadFormData
  ): Promise<boolean> => {
    let success = false;
    if (account) {
      if (chainId) {
        try {
          const decimals = parseInt(value.decimals);
          if (value.tokenAddress && decimals > 0) {
            let poolfactoryAddress = contract[chainId]
              ? contract[chainId].poolfactory
              : contract["default"].poolfactory;
            let tokenContract = getContract(
              tokenAbi,
              value.tokenAddress,
              library
            );

            let amount = parseEther("1000000000000000000000000000").toString();
            // @ts-ignore
            const allowance = await tokenContract.allowance(
              account,
              poolfactoryAddress
            );
            if (allowance.gte(amount)) return true;
            // @ts-ignore
            let tx = await tokenContract.approve(poolfactoryAddress, amount, {
              from: account,
            });
            await toast.promise(tx.wait, {
              pending: "Confirming Transaction...",
            });
            let web3 = getWeb3(chainId);
            const response = await web3.eth.getTransactionReceipt(tx.hash);
            if (response != null) {
              if (response.status) {
                success = true;
                toast.success("Transaction confirmed!");
              } else if (!response.status) {
                toast.error("Transaction failed!");
              } else {
                toast.error("Something went wrong!");
              }
            }
          } else {
            toast.error("Invalid address provided");
          }
        } catch (err: any) {
          toast.error(err.reason);
        }
      } else {
        toast.error("Please connect your wallet");
      }
    } else {
      toast.error("Please connect your wallet");
    }
    return success;
  };

  const handleCreateSale = async (value: ICreateLaunchpadFormData) => {
    try {
      setLoading(true);
      if (account) {
        if (chainId) {
          let web3 = getWeb3(chainId);

          let poolfactoryAddress = contract[chainId]
            ? contract[chainId].poolfactory
            : contract["default"].poolfactory;

          const ParioPoolFactory = new ParioPoolFactory__factory(
            await library?.getSigner()
          );

          let factoryContract = ParioPoolFactory.attach(poolfactoryAddress);

          let feesCal = commonStats.poolPrice;
          console.log(
            "fee",
            feesCal,
            parseEther(feesCal.toFixed(8).toString()).toString()
          );

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
          const params: LibPresale.PresaleStruct = {
            publicStartTime: String(
              value.publicStartTime
                ? moment.utc(value.publicStartTime).unix()
                : 0
            ),
            useWhitelist: value.saleMethod === "Whitelist",
            listingType: value.listingOptions === "Auto" ? 0 : 1,
            tier1: {
              endTime: String(
                value.tier1EndTime ? moment.utc(value.tier1EndTime).unix() : 0
              ),
            },
            tier2: {
              endTime: String(
                value.tier1EndTime ? moment.utc(value.tier1EndTime).unix() : 0
              ),
            },
            token: value.tokenAddress,
            router: contract[chainId]
              ? contract[chainId].routeraddress
              : contract["default"].routeraddress,
            governance: account,
            payment_currency:
              paymentCurrency?.address ||
              "0x0000000000000000000000000000000000000000",
            rate: mulDecimal(
              value.presaleRate,
              parseInt(value.decimals)
            ).toString(),
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
            feeIndex: value.feeOptions,
            liquidityListingRate:
              value.listingOptions == "Auto"
                ? mulDecimal(
                    value.listingRate,
                    parseInt(value.decimals)
                  ).toString()
                : "0",
            liquidityUnlockTime: "0",
            liquidityLockDays:
              value.listingOptions == "Auto"
                ? (
                    parseInt(value.liquidityLockupDays) *
                    60 *
                    60 *
                    24
                  ).toString()
                : "0",
            liquidityPercent:
              value.listingOptions == "Auto" ? value.liquidity : "0",
            refundType: value.refundType === "Refund" ? "0" : "1",
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
          console.log("PARAMS", params);
          let tx = await factoryContract.createSale(params, {
            from: account,
            value: parseEther(feesCal.toFixed(8).toString()).toString(),
          });

          await toast.promise(tx.wait, {
            pending: "Confirming Transaction...",
            error: "Something went wrong",
            success: "Presale has been created",
          });
          const response = await web3.eth.getTransactionReceipt(tx.hash);
          console.log("response", response);

          if (response != null) {
            if (response.status) {
              toast.success("Transaction confirmed!");
              setLoading(false);
              if (typeof response.logs[2] !== "undefined") {
                await router.push(
                  `/launchpad/details/${response.logs[2].address}?blockchain=${chainId}`
                );
              } else {
                toast.error("something went wrong !");
              }
            } else if (!response.status) {
              toast.error("Transaction failed!");
              setLoading(false);
            } else {
              toast.error("Something went wrong!");
              setLoading(false);
            }
          }
        } else {
          toast.error("wrong network selected !");
          setLoading(false);
        }
      } else {
        toast.error("Please connect your wallet");
        setLoading(false);
      }
    } catch (err: any) {
      console.log(err);
      toast.error(err.reason ? err.reason : err.message);
      setLoading(false);
    }
  };

  const submitForm = async (data: ICreateLaunchpadFormData) => {
    console.log("Launchpad_Details>>", data, commonStats);
    const approved = await handleApprove(data);
    if (approved) await handleCreateSale(data);
  };

  useEffect(() => {
    if (image) {
      setLaunchpadImage(image);
    }
  }, [image]);

  const handleNextStep = () => {
    if (currentStep === 1) {
      // if (ongoingPools?.length > 0) {
      //   toast.error("Presale/Fairlaunch already exists for this token.");
      //   return;
      // }
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
            "End time should be equal or after Whitelist end time",
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
              /(https:\/\/)?(www\.)?(((discordapp(app)?)?\.com\/users)|((discord(app)?)?\.com\/invite)|((discord(app)?)?\.gg))\/(?<invite>.+)/gm,
              "This URL is not valid"
            ),
          reddit: Yup.string()
            .url()
            .matches(
              /(?:http:\/\/)?(?:www\.)?reddit\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/,
              "This URL is not valid"
            ),
          description: Yup.string().max(500),
        });
      case 3:
        return Yup.object().shape({
          currency: Yup.string().required("Currency Required"),
          feeOptions: Yup.string()
            .label("Fee options")
            .required("Fee Options Required"),
          listingOptions: Yup.string()
            .label("Listing options")
            .required("Listing Required"),
        });
      case 4:
        return Yup.object().shape({
          presaleRate: Yup.number()
            .label("Presale rate")
            .moreThan(0)
            .typeError("Presale Rate Must be number")
            .required("Presale Rate Required"),
          saleMethod: Yup.string().label("Sale method"),
          softcap: Yup.number()
            .typeError("Must be number")
            .required("Softcap Required")
            .test(
              "moreThan",
              "softcap should be aleast 50% of hardcap",
              (value, context) =>
                !value || value >= parseFloat(context.parent.hardcap) / 2
            ),
          hardcap: Yup.number()
            .positive("Must be Positive")
            .min(
              Yup.ref("softcap"),
              "Hardcap must be greater than or equal to softcap."
            )
            .typeError("Must be number")
            .required("Hardcap Required"),
          minimumBuy: Yup.number()
            .label("Minimum buy")
            .typeError("Must be number")
            .max(
              Yup.ref("maximumBuy"),
              "Minimum buy must be less than or equal to maximum buy"
            )
            .moreThan(0)
            .required("Minimum Buy Required"),
          maximumBuy: Yup.number()
            .label("Maximum buy")
            .typeError("Must be number")
            .max(
              Yup.ref("hardcap"),
              "Maximum buy must be less than or equal to hardcap"
            )
            // .moreThan(Yup.ref("minimumBuy"))
            .required("Maximum Buy Required"),
          refundType: Yup.string().label("Refund type"),
          // router: Yup.string().required("Router Required"),
          liquidity: Yup.number().when("listingOptions", {
            is: (listingOptions: any) => listingOptions == "Auto",
            then: Yup.number()
              .moreThan(50)
              .typeError("Must be number")
              .required("Liquidity Required"),
          }),
          listingRate: Yup.number()
            .label("Listing rate")
            .when("listingOptions", {
              is: (listingOptions: any) => listingOptions == "Auto",
              then: Yup.number()
                .moreThan(0)
                .typeError("Must be number")
                .required("Listing Rate Required"),
            }),
          liquidityLockupDays: Yup.number()
            .label("Liquidity lockup time")
            .when("listingOptions", {
              is: (listingOptions: any) => listingOptions == "Auto",
              then: Yup.number()
                .min(30, "Lockup Time should be more than 30")
                .required("Lockup Time Required"),
            }),

          ...timeValidations,
        });
      case 5:
        return Yup.object().shape({
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
        });
      case 6:
        return;
      default:
        return Yup.object().shape({
          tokenAddress: Yup.string()
            .label("Token address")
            .required("Address Required"),
          name: Yup.string().required("Token name Required"),
          // title: Yup.string().required("Title Required"),
          symbol: Yup.string().required("Symbol Required"),
          decimals: Yup.number()
            .typeError("Must be a number")
            .required("Decimals Required"),
          balance: Yup.number()
            .typeError("Must be a number")
            .required("Decimals Required"),
        });
    }
  }, [currentStep]);

  const formik = useFormik<ICreateLaunchpadFormData>({
    initialValues: formData,
    validationSchema: currentValidationSchema,
    onSubmit: async (values, actions) => {
      console.log("values", values);
      if (currentStep === 0) {
        if (ongoingPools?.length > 0) {
          toast.error("Presale/Fairlaunch already exists for this token.");
          return;
        }
      }
      if (currentStep === 6) {
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
      let arra = data.pools?.filter((e: IPool) => {
        return e.poolState != "Cancelled";
      });
      return arra;
    }
  }, [data]);

  useEffect(() => {
    if (name && symbol && decimals && formik && totalSupply && tokenBalance) {
      formik.setValues({
        ...formik.values,
        name: name,
        symbol: symbol,
        decimals: decimals,
        totalSupply: formatUnits(totalSupply, decimals),
        title: name,
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
  }, [name]);

  useEffect(() => {
    formik.setFieldValue(
      "currency",
      supportNetwork[chainId || "default"]?.symbol
    );
  }, [chainId]);

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

  const steps = [
    <Step1
      formik={formik}
      launchpadImage={image}
      setLaunchpadImage={setImage}
      launchpadBannerImage={banner}
      setLaunchpadBannerImage={setBanner}
      data={formData}
      next={handleNextStep}
      commonStats={commonStats}
      logoImage={image}
      setLogoImage={setImage}
      bannerImage={banner}
      setBannerImage={setBanner}
      ongoingPools={ongoingPools}
    />,
    <Step2
      formik={formik}
      launchpadImage={image}
      setLaunchpadImage={setImage}
      setLaunchpadImages={setImages}
      setImageUploaded={setImageUploaded}
      setBannerUploaded={setBannerUploaded}
      launchpadBannerImage={banner}
      setLaunchpadBannerImage={setBanner}
      setLaunchpadBannerImages={setBanners}
    />,
    <Step3
      formik={formik}
      data={formData}
      commonStats={commonStats}
      next={handleNextStep}
      prev={handlePreviousStep}
    />,
    <Step4
      formik={formik}
      launchpadImage={image}
      setLaunchpadImage={setImage}
      launchpadBannerImage={banner}
      setLaunchpadBannerImage={setBanner}
      data={formData}
      next={handleNextStep}
      prev={handlePreviousStep}
      commonStats={commonStats}
    />,
    <Step5
      formik={formik}
      launchpadImage={image}
      setLaunchpadImage={setImage}
      launchpadBannerImage={banner}
      setLaunchpadBannerImage={setBanner}
      data={formData}
      next={handleNextStep}
      prev={handlePreviousStep}
      commonStats={commonStats}
    />,
    <Step6
      formik={formik}
      launchpadImage={image}
      setLaunchpadImage={setImage}
      launchpadBannerImage={banner}
      setLaunchpadBannerImage={setBanner}
      data={formData}
      next={handleNextStep}
      prev={handlePreviousStep}
      commonStats={commonStats}
    />,
    <Step7
      formik={formik}
      launchpadImage={image}
      setLaunchpadImage={setImage}
      launchpadBannerImage={banner}
      setLaunchpadBannerImage={setBanner}
      data={formData}
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

  const upperTabs: string[] = [
    "Token Address",
    "Upload",
    "Social Media",
    "Fees",
    "Liquidity",
    "Vesting",
    "Details",
  ];

  console.log("error", formik.errors);
  console.log("currentStep", currentStep);
  console.log("currentValidationSchema", currentValidationSchema);

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
      <div className="  border border-primary-green px-8 lg:px-16 pt-14 pb-20 bg-dull-black ">
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
            {currentStep > 5
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

export default CreateLaunchPad;
