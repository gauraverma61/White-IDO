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
  launchpadBannerImage?: string;
  setLaunchpadBannerImage?: (value: string) => void;
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
  console.log("commonStats", commonStats.poolPrice);
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
                value.tier2EndTime ? moment.utc(value.tier2EndTime).unix() : 0
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
    if (currentStep === 0) {
      if (ongoingPools?.length > 0) {
        toast.error("Presale/Fairlaunch already exists for this token.");
        return;
      }
      if (!image || !banner) {
        toast.error("Please select banner & logo!");
        return;
      }
    }

    setCurrentStep((prev) => prev + 1);
  };

  console.log("currentStep", currentStep);

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
          // website: Yup.string().url().required("Website Url Required"),
          // facebook: Yup.string()
          //   .url()
          //   .matches(
          //     /(?:http:\/\/)?(?:www\.)?facebook\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/,
          //     "This URL is not valid"
          //   ),
          // twitter: Yup.string()
          //   .url()
          //   .matches(
          //     /(?:http:\/\/)?(?:www\.)?twitter\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/,
          //     "This URL is not valid"
          //   ),
          // instagram: Yup.string()
          //   .url()
          //   .matches(
          //     /(?:http:\/\/)?(?:www\.)?instagram\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/,
          //     "This URL is not valid"
          //   ),
          // github: Yup.string()
          //   .url()
          //   .matches(
          //     /^(http(s?):\/\/)?(www\.)?github\.([a-z])+\/([A-Za-z0-9]{1,})+\/?$/i,
          //     "This URL is not valid"
          //   ),
          // telegram: Yup.string()
          //   .url()
          //   .required("Telegram Url Required")
          //   .matches(
          //     /(https?:\/\/)?(www[.])?(telegram|t)\.me\/([a-zA-Z0-9_-]*)\/?$/,
          //     "This URL is not valid"
          //   ),
          // discord: Yup.string()
          //   .url()
          //   .matches(
          //     /(https:\/\/)?(www\.)?(((discord(app)?)?\.com\/invite)|((discord(app)?)?\.gg))\/(?<invite>.+)/gm,
          //     "This URL is not valid"
          //   ),
          // reddit: Yup.string()
          //   .url()
          //   .matches(
          //     /(?:http:\/\/)?(?:www\.)?reddit\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/,
          //     "This URL is not valid"
          //   ),
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
              /(https:\/\/)?(www\.)?(((discordapp(app)?)?\.com\/users)|((discord(app)?)?\.com\/invite)|((discord(app)?)?\.gg))\/(?<invite>.+)/gm,
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
  const formik = useFormik<ICreateLaunchpadFormData>({
    initialValues: formData,
    validationSchema: currentValidationSchema,
    onSubmit: async (values, actions) => {
      console.log("values", values);
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
      launchpadBannerImage={banner}
      setLaunchpadBannerImage={setBanner}
      data={formData}
      next={handleNextStep}
      prev={handlePreviousStep}
      commonStats={commonStats}
    />,
    <Step3
      formik={formik}
      data={formData}
      commonStats={commonStats}
      next={handleNextStep}
      prev={handlePreviousStep}
    />,
    <Step4
      bannerImage={banner}
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

  const DetailsStepOne = [
    {
      name: "Token Address",
      value: formik.values.tokenAddress || "-",
      error: formik.touched.tokenAddress && formik.errors.tokenAddress,
    },
    {
      name: "Name",
      value: formik.values.name || "-",
      error: formik.touched.name && formik.errors.name,
    },
    {
      name: "Symbol",
      value: formik.values.symbol || "-",
      error: formik.touched.symbol && formik.errors.symbol,
    },
    {
      name: "Decimals",
      value: formik.values.decimals || "-",
      error: formik.touched.decimals && formik.errors.decimals,
    },
    {
      name: "Total Supply",
      value: formik.values.totalSupply || "-",
      error: formik.touched.totalSupply && formik.errors.totalSupply,
    },
    {
      name: "Payment Currency",
      value: formik.values.currency || "-",
      error: formik.touched.currency && formik.errors.currency,
    },
    {
      name: "Select Fees",
      value: FeeOptions[Number(formik.values.feeOptions)] || "-",
      error: formik.touched.feeOptions && formik.errors.feeOptions,
    },
    {
      name: "Listing Mode",
      value: formik.values.listingOptions || "-",
      error: formik.touched.listingOptions && formik.errors.listingOptions,
    },
    {
      name: "Website",
      value: formik.values.website || "-",
      error: formik.touched.website && formik.errors.website,
    },
    {
      name: "Reddit",
      value: formik.values.reddit || "-",
      error: formik.touched.reddit && formik.errors.reddit,
    },
    {
      name: "Twitter",
      value: formik.values.twitter || "-",
      error: formik.touched.twitter && formik.errors.twitter,
    },
    {
      name: "Facebook",
      value: formik.values.facebook || "-",
      error: formik.touched.facebook && formik.errors.facebook,
    },
    {
      name: "Github",
      value: formik.values.github || "-",
      error: formik.touched.github && formik.errors.github,
    },
    {
      name: "Instagram",
      value: formik.values.instagram || "-",
      error: formik.touched.instagram && formik.errors.instagram,
    },
    {
      name: "Telegram",
      value: formik.values.telegram || "-",
      error: formik.touched.telegram && formik.errors.telegram,
    },
    {
      name: "Discord",
      value: formik.values.discord || "-",
      error: formik.touched.discord && formik.errors.discord,
    },
    {
      name: "Description",
      value: formik.values.description || "-",
      error: formik.touched.description && formik.errors.description,
    },
  ];

  const DetailsStepTwo = [
    {
      name: "Presale Rate",
      value: formik.values.presaleRate || "-",
      error: formik.touched.presaleRate && formik.errors.presaleRate,
    },
    {
      name: "Whitelist",
      value: formik.values.saleMethod === "Whitelist" ? "Yes" : "No",
    },
    {
      name: "Softcap (BNB)*",
      value: formik.values.softcap || "-",
      error: formik.touched.softcap && formik.errors.softcap,
    },
    {
      name: "Hardcap (BNB)*",
      value: formik.values.hardcap || "-",
      error: formik.touched.hardcap && formik.errors.hardcap,
    },
    {
      name: "Minimum Buy (BNB)*",
      value: formik.values.minimumBuy || "-",
      error: formik.touched.minimumBuy && formik.errors.minimumBuy,
    },
    {
      name: "Maximum Buy (BNB)*",
      value: formik.values.maximumBuy || "-",
      error: formik.touched.maximumBuy && formik.errors.maximumBuy,
    },
    {
      name: "Refund Type",
      value: formik.values.refundType || "-",
      error: formik.touched.refundType && formik.errors.refundType,
    },
    {
      name: "Liquidity (%)*",
      value: formik.values.liquidity || "-",
      error: formik.touched.liquidity && formik.errors.liquidity,
    },
    {
      name: "Listing Rate*",
      value: formik.values.listingRate || "-",
      error: formik.touched.listingRate && formik.errors.listingRate,
    },
    {
      name: "Start Time (UTC)*",
      time: `${moment(utcToLocalDate(formik.values.startTime)).format(
        "DD/MM/yyyy hh:mm a"
      )}`,
      error: formik.touched.startTime && formik.errors.startTime,
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
      error:
        formik.touched.liquidityLockupDays && formik.errors.liquidityLockupDays,
    },
    {
      name: "TGE percent*",
      value: formik.values.TGEPercentage || "-",
      error: formik.touched.TGEPercentage && formik.errors.TGEPercentage,
      dontShow: !formik.values.isvesting,
    },
    {
      name: "Cycle*",
      value: formik.values.CycleTime || "-",
      error: formik.touched.CycleTime && formik.errors.CycleTime,
      dontShow: !formik.values.isvesting,
    },
    {
      name: "Cycle Release Percent*",
      value: formik.values.CycleReleasePercent || "-",
      error:
        formik.touched.CycleReleasePercent && formik.errors.CycleReleasePercent,
      dontShow: !formik.values.isvesting,
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
          {/* <div className="absolute w-full h-1/2"></div> */}
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
                    <div className="min-w-fit truncate ">-Launchpad</div>
                  </div>
                ) : (
                  "Create a Launchpad"
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
            data={LaunchPadStepData}
            activeStep={currentStep}>
            <>
              {steps[currentStep]}
              <div
                className={`flex flex-col sm:flex-row  gap-y-6 gap-x-10 w-full ${
                  currentStep === 0
                    ? "justify-center sm:justify-end"
                    : "justify-between"
                } items-center  mt-10 sm:mt-14`}>
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

export default CreateLaunchPad;
