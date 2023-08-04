/* eslint-disable react/jsx-key */
import React, { useEffect, useMemo, useState } from "react";
import Step2 from "@components/LaunchPad/NewCreate/Step2";
import Step4 from "./Step4";
import Step1 from "./Step1";
import Step3 from "./Step3";
import Step5 from "./Step5";
import Step6 from "./Step6";
import { useRouter } from "next/router";
import { FormikValues, useFormik } from "formik";
import { FormikContextType } from "formik/dist/types";
import { feesSetting } from "@components/LaunchPad/Create";
import { usePoolFees } from "@components/LaunchPad/hooks/useStats";
import useAuth from "@hooks/useAuth";
import { toast } from "react-toastify";
import * as Yup from "yup";
import Button from "@atoms/Button";
import { contract } from "@constants/constant";
import { approveTokens, mulDecimal } from "@constants/contractHelper";
import { formatUnits, isAddress, parseEther } from "ethers/lib/utils";
import { getWeb3 } from "@constants/connectors";
import { supportNetwork } from "@constants/network";
import moment from "moment";
import axios from "axios";
import { MediaLibrary } from "@spatie/media-library-pro-core/dist/types";
import { ParioPoolFactory__factory } from "../../../blockchain-types";
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
  data: Partial<FormikValues>;
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
          totalAmount: Yup.number()
            .label("Total amount")
            .moreThan(0)
            .typeError("Total amount Must be number")
            .required("Total amount Required"),
          softcap: Yup.number()
            .typeError("Must be number")
            .moreThan(0)
            .required("Softcap Required"),
          // refundType: Yup.string().label("Refund type").required(),
          liquidity: Yup.number()
            .moreThan(50)
            .typeError("Must be number")
            .required("Liquidity Required"),
          // listingRate: Yup.number()
          //   .label("Listing rate")
          //   .moreThan(0)
          //   .typeError("Must be number")
          //   .required("Listing Rate Required"),

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
      default:
        return Yup.object().shape({
          tokenAddress: Yup.string()
            .label("Token address")
            .required("Address Required")
            .test("valid-address", "Invalid Address", (address, context) =>
              isAddress(address || "")
            ),
          name: Yup.string().required("Token name Required"),
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
  const formik = useFormik<ICreateFairLaunchpadFormData>({
    initialValues: formData,
    validationSchema: currentValidationSchema,
    onSubmit: async (values, actions) => {
      if (currentStep === 0) {
        if (ongoingPools?.length > 0) {
          toast.error("Presale/Fairlaunch already exists for this token.");
          return;
        }
      }
      if (currentStep === 5) {
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
      return data.pools?.filter((e: any) => {
        return e.poolState != "Cancelled";
      });
    }
  }, [data]);

  useEffect(() => {
    formik.setFieldValue(
      "currency",
      supportNetwork[chainId || "default"]?.symbol
    );
  }, [chainId]);

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
  ];

  const upperTabs: string[] = [
    "Token Address",
    "Upload",
    "Social Media",
    "Fees",
    "Offering",
    "Details",
  ];

  return (
    <div className="container mx-auto pb-20 pt-32 md:py-40 2xl:px-16">
      <div className="hidden lg:flex gap-16 mb-[70px]">
        {upperTabs.map((tab, index) => (
          <span
            className={` ${
              currentStep == index ? "text-primary-green" : "text-white"
            } text-xl font-medium cursor-not-allowed`}
            key={index}>
            {tab}
          </span>
        ))}
      </div>
      <div className="border border-primary-green px-8 lg:px-16 pt-14 pb-20 bg-dull-black">
        {steps[currentStep]}
        <div className="flex flex-col-reverse md:flex-row justify-between mt-20 gap-8">
          <div>
            {currentStep > 0 && (
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setCurrentStep((prev) => prev - 1)}>
                Back
              </Button>
            )}
          </div>
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
            {currentStep > 4
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

export default CreateFairLaunch;
