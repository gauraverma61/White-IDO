/* eslint-disable react/jsx-key */
import React, { useEffect, useMemo, useState } from "react";
import Step2 from "./Step2";
import Step1 from "./Step1";
import Step3 from "./Step3";
import { useRouter } from "next/router";
import { FormikValues, useFormik } from "formik";

import { useAirdropData } from "src/Contexts/AirDropContext";
import { usePoolFees } from "@components/CreateAirDrop/hooks/useStats";
import useAuth from "@hooks/useAuth";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { FormikContextType } from "formik/dist/types";
import Button from "@atoms/Button";
import { MediaLibrary } from "@spatie/media-library-pro-core/dist/types";
import { getWeb3 } from "@constants/connectors";
import { contract } from "@constants/constant";
import moment from "moment";
import { getContract } from "@constants/contractHelper";
import poolFactoryAbi from "../../../ABIs/AirdropFactory/AirdropFactory.json";
import { parseEther } from "ethers/lib/utils";
import tokenAbi from "../../../ABIs/ERC20/ERC20ABI.json";
import { IAllocationDetail } from "@components/Details/Allocations";
import airdropAbi from "../../../ABIs/AirdropMaster/AirdropMaster.json";
import poolAbi from "../../../ABIs/PresalePool/PresalePool.json";
import { parseUnits } from "@ethersproject/units";
import { AirdropStepData } from "@components/AirDrop/Constant";
import StepperWrapper from "@components/Layouts/StepperWrapper";
import BannerImage from "@public/images/create-airdrop.png";
import Image from "next/image";
import { CountdownTimer } from "@atoms/CountdownTimer";

import UploadImage from "@components/Common/UploadImage";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Step6 from "./Step6";

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
  startTime: moment().add(10, "m").toISOString(),
  website: "",
  facebook: "",
  twitter: "",
  instagram: "",
  github: "",
  telegram: "",
  discord: "",
  reddit: "",
  description: "",
  step: 1,
  tge: "",
  cyclePercent: "",
  cycleSecond: "",
  allocationsData: [],
};

export type ICreateAirdropFormData = typeof INITIAL_VALUES;

export interface ICreateAirdrop {
  commonStats: {
    poolPrice: number;
    auditPrice: number;
    kycPrice: number;
  };
  formik: FormikContextType<ICreateAirdropFormData>;
  data: Partial<FormikValues>;
  prev: () => void;
  next: () => void;
  airdropImage?: string;
  setAirdropImage?: (value: string) => void;
  airdropBannerImage?: string;
  setAirdropBannerImage?: (value: string) => void;
}

const CreateAirDrop = () => {
  const router = useRouter();
  const { getAirDropData, setAirdropImage } = useAirdropData();
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
    useState<ICreateAirdropFormData>(INITIAL_VALUES);
  const [currentStep, setCurrentStep] = useState(0);
  const commonStats = usePoolFees({});
  const { account, chainId, library } = useAuth();

  const submitForm = async (data: ICreateAirdropFormData) => {
    console.log("Airdrop_Details>>", data, commonStats);
    await handleCreateSale(data);
  };

  const handleCreateSale = async (value: ICreateAirdropFormData) => {
    console.log("VALUES", value);
    try {
      if (account) {
        if (chainId) {
          let web3 = getWeb3(chainId);

          let para = [
            [
              value.tokenAddress,
              contract[chainId]
                ? contract[chainId].routeraddress
                : contract["default"].routeraddress,
              account,
            ], // 1

            [String(moment(value.startTime).utc().unix())],
            JSON.stringify({
              logo: image,
              banner: banner,
              description: value.description,
              title: value.title,
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
            }), //9
            [
              value.tge ? String(parseFloat(value.tge) * 100) : "0",
              value.cycleSecond
                ? String(parseFloat(value.cycleSecond) * 60 * 60 * 24)
                : "0",
              value.cyclePercent
                ? String(parseFloat(value.cyclePercent) * 100)
                : "0",
            ],
            ["", "", ""],
          ];
          let poolfactoryAddress = contract[chainId]
            ? contract[chainId].airdropfactory
            : contract["default"].airdropfactory;
          let factoryContract = getContract(
            poolFactoryAbi,
            poolfactoryAddress,
            library
          );

          let feesCal = commonStats.poolPrice;
          console.log(
            "para",
            para,
            feesCal,
            parseEther(feesCal.toFixed(8).toString()).toString()
          );

          // @ts-ignore
          let tx = await factoryContract.createSale(
            para[0],
            para[1],
            para[2],
            para[3],
            {
              from: account,
              value: parseEther(feesCal.toFixed(8).toString()).toString(),
            }
          );

          await toast.promise(tx.wait, {
            pending: "Confirming Transaction...",
            error: "Something went wrong",
            success: "Airdrop has been created",
          });
          const response = await web3.eth.getTransactionReceipt(tx.hash);
          if (response != null) {
            if (response.status) {
              toast.success("Transaction confirmed!");
              console.log("ADDRESS", response.logs);
              if (typeof response.logs[2] !== "undefined") {
                await handleSetWhitelist({
                  address: response.logs[2].address,
                  allocations: value.allocationsData,
                  value,
                });
                await router.push(
                  `/airdrop/details/${response.logs[2].address}?blockchain=${chainId}`
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
      console.log(err);
      toast.error(err.reason ? err.reason : err.message);
    }
  };

  const handleApprove = async (
    value: ICreateAirdropFormData,
    address: string
  ): Promise<boolean> => {
    let success = false;
    if (account) {
      if (chainId) {
        try {
          if (value.tokenAddress) {
            let poolfactoryAddress = address;
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

  const handleSetWhitelist = async ({
    value: data,
    address,
    allocations,
  }: {
    allocations: IAllocationDetail[];
    value: ICreateAirdropFormData;
    address: string;
  }) => {
    try {
      let waddress: IAllocationDetail[] = [];
      if (allocations) {
        waddress = allocations;
      } else {
        waddress = [];
      }
      if (waddress.length > 0) {
        if (account && chainId) {
          let poolContract = getContract(
            allocations ? airdropAbi : poolAbi,
            address,
            library
          );

          let tx;
          if (allocations.length > 0) {
            const success = await handleApprove(data, address);
            if (!success) {
              toast.error("Failed to check allowance");
              return;
            }
            // @ts-ignore
            tx = await poolContract.addWhitelistedUsers(
              allocations.map((v) => v.address),
              allocations.map((v) => parseUnits(v.amount, data.decimals)),
              {
                from: account,
              }
            );
          } else {
            // @ts-ignore
            tx = await poolContract.addWhitelistedUsers(waddress, {
              from: account,
            });
          }

          await toast.promise(tx.wait, {
            pending: "Confirming Transaction...",
          });

          let web3 = getWeb3(chainId);
          var response = await web3.eth.getTransactionReceipt(tx.hash);
          if (response != null) {
            if (response.status) {
              toast.success("Transaction confirmed!");
            } else if (!response.status) {
              toast.error("Transaction failed!");
            } else {
              toast.error("Something went wrong!");
            }
          } else {
          }
        } else {
          toast.error("Please Connect to wallet !");
        }
      } else {
        toast.error("Please Enter Valid Addess !");
      }
    } catch (err: any) {
      toast.error(err.reason ? err.reason : err.message);
    }
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

  const timeValidation = {
    startTime: Yup.date()
      .label("Start time")
      .test(
        "startTime",
        "Start time should be atleast 5 minutes in future",
        (value) => !value || value >= moment.utc().add(5, "m").toDate()
      )
      .required("Start Time Required"),
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
          ...timeValidation,
        });
      case 2:
        return Yup.object().shape({
          ...timeValidation,
        });
      case 4:
        return Yup.object().shape({
          tge: Yup.number().required("First Release Precentage Required"),
          cycleSecond: Yup.number().required("Cycle Days Required"),
          cyclePercent: Yup.number().required("Cycle percentage Required"),
          ...timeValidation,
        });
      default:
        return Yup.object().shape({
          tokenAddress: Yup.string()
            .label("Token address")
            .required("Address Required"),
          name: Yup.string().required("Token name Required"),
          title: Yup.string().required("Title Required"),
          symbol: Yup.string().required("Symbol Required"),
          decimals: Yup.number()
            .typeError("Must be a number")
            .required("Decimals Required"),
          balance: Yup.number()
            .typeError("Must be a number")
            .required("Decimals Required"),
          ...timeValidation,
        });
    }
  }, [currentStep]);
  const formik = useFormik<ICreateAirdropFormData>({
    initialValues: formData,
    validationSchema: currentValidationSchema,
    onSubmit: async (values, actions) => {
      console.log("values", values);
      if (currentStep === 0 && values.balance == "0") {
        toast.error("Your token balance is Zero");
        return;
      }
      if (currentStep === 3 && values.allocationsData.length === 0) {
        toast.error("Please set allocation!.");
        return;
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

  const steps = [
    <Step1
      formik={formik}
      airdropImage={image}
      setAirdropImage={setImage}
      airdropBannerImage={banner}
      setAirdropBannerImage={setBanner}
      data={formData}
      next={handleNextStep}
      commonStats={commonStats}
    />,
    <Step2
      formik={formik}
      airdropImage={image}
      setAirdropImage={setImage}
      setAirdropImages={setImages}
      airdropBannerImage={banner}
      setAirdropBannerImage={setBanner}
      setAirdropBannerImages={setBanners}
      setImageUploaded={setImageUploaded}
      setBannerUploaded={setBannerUploaded}
    />,
    <Step3
      formik={formik}
      airdropImage={image}
      setAirdropImage={setImage}
      airdropBannerImage={banner}
      setAirdropBannerImage={setBanner}
      data={formData}
      next={handleNextStep}
      prev={handlePreviousStep}
      commonStats={commonStats}
    />,
    <Step4
      formik={formik}
      airdropImage={image}
      setAirdropImage={setImage}
      airdropBannerImage={banner}
      setAirdropBannerImage={setBanner}
      data={formData}
      next={handleNextStep}
      prev={handlePreviousStep}
      commonStats={commonStats}
    />,
    <Step5
      formik={formik}
      airdropImage={image}
      setAirdropImage={setImage}
      airdropBannerImage={banner}
      setAirdropBannerImage={setBanner}
      data={formData}
      next={handleNextStep}
      prev={handlePreviousStep}
      commonStats={commonStats}
    />,
    <Step6
      formik={formik}
      airdropImage={image}
      setAirdropImage={setImage}
      airdropBannerImage={banner}
      setAirdropBannerImage={setBanner}
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
    "Allocations",
    "Vesting",
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
            }}
            // onClick={() => setCurrentStep((prev) => prev + 1)}
          >
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

export default CreateAirDrop;
