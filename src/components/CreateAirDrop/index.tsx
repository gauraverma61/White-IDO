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

import { getWeb3 } from "@constants/connectors";
import { contract } from "@constants/constant";
import moment from "moment";
import { getContract } from "@constants/contractHelper";
import poolFactoryAbi from "../../ABIs/AirdropFactory/AirdropFactory.json";
import { parseEther } from "ethers/lib/utils";
import tokenAbi from "../../ABIs/ERC20/ERC20ABI.json";
import { IAllocationDetail } from "@components/Details/Allocations";
import airdropAbi from "../../ABIs/AirdropMaster/AirdropMaster.json";
import poolAbi from "../../ABIs/PresalePool/PresalePool.json";
import { parseUnits } from "@ethersproject/units";
import { AirdropStepData } from "@components/AirDrop/Constant";
import StepperWrapper from "@components/Layouts/StepperWrapper";
import BannerImage from "@public/images/create-airdrop.png";
import Image from "next/image";
import { CountdownTimer } from "@atoms/CountdownTimer";

import UploadImage from "@components/Common/UploadImage";

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
  const [banner, setBanner] = useState<string>("");
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

  useEffect(() => {
    if (image) {
      setAirdropImage(image);
    }
  }, [image]);

  const handleNextStep = () => {
    if (currentStep === 0) {
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
      case 1:
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
          ...timeValidation,
        });
      case 2:
        return Yup.object().shape({
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
      if (currentStep === 2) {
        if (values.allocationsData.length === 0) {
          toast.error("Please set allocation!.");
          return;
        }
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
      data={formData}
      next={handleNextStep}
      prev={handlePreviousStep}
      commonStats={commonStats}
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
  ];

  return (
    <>
      <div
        style={{ backgroundImage: `url(${banner})` }}
        className={` bg-no-repeat bg-cover bg-center md:h-[350px] lg:h-[400px] bg-[#64748B]`}>
        <div
          className={`${
            banner ? "bg-black/40 backdrop-blur-sm" : ""
          } flex justify-center h-full`}>
          <div
            className={`flex flex-col-reverse md:flex-row md:items-center justify-center mx-auto container px-6 pt-6 pb-16 md:pb-6 relative`}>
            <div
              className={`flex-1 max-w-full ${
                image || banner ? "" : "create-head"
              }`}>
              <div className="h-36 w-36 bg-gray8 p-2.5 rounded-old-full mb-6 profile-pic-upload">
                {image && (
                  <Image
                    src={image}
                    className="rounded-old-full"
                    alt="detail-img"
                    height={140}
                    width={140}
                    objectFit="cover"
                  />
                )}
                <UploadImage
                  setImageValue={setImage}
                  classTags="upload-bgImage-sec border border-dashed"
                />
              </div>
              <h1 className="mb-4 text-3xl md:text-4xl 2xl:text-6xl font-argue text-white">
                {formik.values.title ? (
                  <div className="flex lg:max-w-[90%]">
                    <div className="truncate">{formik.values.title}</div>
                    <div className="min-w-fit ">-Airdrop</div>
                  </div>
                ) : (
                  "Create Airdrop"
                )}
              </h1>
              {image &&
                formik.values.startTime &&
                (moment(formik.values.startTime).isAfter(moment()) ? (
                  <div className="flex flex-col justify-center text-white">
                    <p className="text-base font-normal">Starts In</p>
                    {formik.values.startTime && (
                      <CountdownTimer
                        variant={"inBox"}
                        date={formik.values.startTime}
                        className="font-semibold text-3xl sm:text-4xl"
                      />
                    )}
                  </div>
                ) : (
                  <p className="text-xl sm:text-2xl font-normal text-white">
                    Airdrop has been started
                  </p>
                ))}
            </div>
            {image || banner ? (
              <></>
            ) : (
              <img
                className="w-[80%] md:w-[300px] lg:w-[450px] hidden md:block"
                src={BannerImage.src}
                alt=""
              />
            )}
            <div className="profile-cover-pic bg-white rounded-old-3xl items-center flex">
              <UploadImage
                setImageValue={setBanner}
                classTags="upload-bgImage-sec border border-dashed"
              />
              <p className="absolute left-9 text-sm">
                {banner ? "Edit" : "Upload"} Cover Image
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-[36px]">
        <div className="border border-[#EFF0F7] shadow-boxShadow6 ">
          <StepperWrapper
            themeColor="gray"
            data={AirdropStepData}
            activeStep={currentStep}>
            <>
              {steps[currentStep]}
              <div
                className={`flex w-full ${
                  currentStep === 0
                    ? "justify-center sm:justify-end"
                    : "justify-between"
                } items-center gap-4 sm:gap-6 mt-6`}>
                {currentStep > 0 ? (
                  <Button
                    variant="accent-1"
                    className="outline outline-2 outline-[#64748B]"
                    disabled={formik.isSubmitting}
                    onClick={() => handlePreviousStep()}>
                    {"Back"}
                  </Button>
                ) : (
                  <div></div>
                )}
                <Button
                  variant="accent-2"
                  className={` ${
                    Object.keys(formik.errors).length != 0 || !image || !banner
                      ? "bg-[#64748B]/60"
                      : "bg-[#64748B]"
                  } disabled:bg-[#64748B]/60 text-white`}
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
                  {currentStep > 1
                    ? formik.isSubmitting
                      ? "Submitting..."
                      : "Submit"
                    : "Next"}
                </Button>
              </div>
            </>
          </StepperWrapper>
        </div>
      </div>
    </>
  );
};

export default CreateAirDrop;
