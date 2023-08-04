import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import Button from "@atoms/Button";
import ERC20ABI from "../../../ABIs/ERC20/ERC20ABI.json";
import erc20abi from "../../../ABIs/ERC20/ERC20ABI.json";
import LockerABI from "../../../ABIs/Locker/lockerABI.json";
import useAuth from "@hooks/useAuth";
import { toast } from "react-toastify";
import { getWeb3 } from "@constants/connectors";
import { contract } from "@constants/constant";
import { getContract, mulDecimal } from "@constants/contractHelper";
import { parseUnits } from "@ethersproject/units";
import { isAddress } from "@ethersproject/address";
import { ethers } from "ethers";
import useTokenInfo from "@hooks/useTokenInfo";
import { formatUnits } from "ethers/lib/utils";
import { useRouter } from "next/router";
import Input2 from "@atoms/Input2";
import SmallSwitch from "@atoms/CustomSmallSwitch";
import BannerImage from "@public/images/lockerBannerImage.png";
import DateTimePicker from "@atoms/DateTimeInput";
import moment from "moment";
import BigInput from "@atoms/BigInput";
import { walletNameTrimmer } from "@helpers/walletNameTrimmer";
import { TIME_FORMAT } from "@constants/timeFormats";

interface IFormValues {
  tokenOrLPTokenAddress: string;
  title: string;
  useAnotherOwner: boolean;
  ownerAddress: string;
  amount: string;
  lockUntil: string;
  TGEDate: string;
  TGEPercentage?: number;
  CycleTime?: number;
  CycleReleasePercent?: number;
  isvesting: boolean;
  islp: boolean;
}

const LockerCreateComp = () => {
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lockLoading, setLockLoading] = useState(false);
  const [tokenAddress, setTokenAddress] = useState<any>("");
  const router = useRouter();
  const { account, chainId, ethereum, library } = useAuth();

  const LockSchema = Yup.object().shape({
    tokenOrLPTokenAddress: Yup.string()
      .label("Token Address")
      .required("Address Required")
      .test("valid-address", "Invalid Address", (address, context) =>
        isAddress(address || "")
      ),

    title: Yup.string().required("Lock Name is required"),
    useAnotherOwner: Yup.boolean(),
    ownerAddress: Yup.string().when("useAnotherOwner", {
      is: true,
      then: Yup.string()
        .required("Address Required")
        .test("valid-address", "Invalid Address", (address, context) =>
          isAddress(address || "")
        ),
    }),
    amount: Yup.string()
      .required("Amount Required")
      .test("valid-amount", "Please Enter Valid Amount!", (value) => {
        const inputValue = value || "";
        const reg = new RegExp(/^[+-]?\d+(\.\d+)?$/);
        if (!reg.test(inputValue) || parseFloat(inputValue) <= 0) {
          return false;
        } else if (parseFloat(inputValue) > 0) {
          return true;
        }
        return true;
      }),
    lockUntil: Yup.date()
      .label("Lock time")
      .when("isvesting", {
        is: false,
        then: Yup.date()
          .test(
            "LockTime",
            "Lock time should be atleast 15 minutes in future",
            (value) => !value || value >= moment.utc().add(15, "m").toDate()
          )
          .required("Lock Untill Date Required"),
      }),
    TGEDate: Yup.date()
      .label("Vesting Unlock date")
      .when("isvesting", {
        is: true,
        then: Yup.date()
          .test(
            "TGEDate",
            "Time should be atleast 15 minutes in future",
            (value) => !value || value >= moment.utc().add(15, "m").toDate()
          )
          .required("TGE Date Required"),
      }),
    TGEPercentage: Yup.number()
      .label("TGE Percentage")
      .when("isvesting", {
        is: true,
        then: Yup.number()
          .max(99)
          .moreThan(0)
          .required("TGE Percentage Required"),
      }),
    CycleTime: Yup.number()
      .label("Vesting cycle")
      .when("isvesting", {
        is: true,
        then: Yup.number().moreThan(0).required("Vesting cycle time Required"),
      }),
    CycleReleasePercent: Yup.number()
      .label("Vesting cycle release percent")
      .when("isvesting", {
        is: true,
        then: Yup.number()
          .max(99)
          .moreThan(0)
          .required("Vesting cycle release percent Required"),
      }),
  });

  const initialValues: IFormValues = {
    tokenOrLPTokenAddress: "",
    title: "",
    ownerAddress: "",
    amount: "",
    lockUntil: "",
    TGEDate: "",
    TGEPercentage: undefined,
    CycleTime: undefined,
    CycleReleasePercent: undefined,
    useAnotherOwner: false,
    isvesting: false,
    islp: false,
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: LockSchema,
    onSubmit: async (values) => {
      await handleSubmitLock(values);
    },
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    isSubmitting,
    validateForm,
    isValidating,
  } = formik;

  console.log("values", values);

  const {
    tokenName: name,
    tokenSymbol: symbol,
    tokenBalance,
    decimals,
    totalSupply,
    fetchTokenError,
    fetchtokenDetail,
    fetchTokenBalance,
    fetchLPTokenDetail,
    isLPToken,
    pair,
  } = useTokenInfo({
    tokenAddress: values.tokenOrLPTokenAddress || "",
    ethereum,
  });

  useEffect(() => {
    if (formik.values.tokenOrLPTokenAddress && account) {
      fetchtokenDetail();
      fetchTokenBalance();
      fetchLPTokenDetail();
    }
  }, [formik.values.tokenOrLPTokenAddress, account]);

  useEffect(() => {
    if (name) {
      formik.setFieldValue("title", name);
    }
  }, [name]);

  const handleApprove = async (
    value: IFormValues,
    decimals: number
  ): Promise<boolean> => {
    let success = false;
    if (account && chainId && library) {
      try {
        if (value.tokenOrLPTokenAddress) {
          setLoading(true);
          const lockAddress = contract[chainId]
            ? contract[chainId].lockAddress
            : contract["default"].lockAddress;
          const tokenContract = getContract(
            ERC20ABI,
            value.tokenOrLPTokenAddress,
            library
          );
          // @ts-ignore
          const allowance = await tokenContract.allowance(account, lockAddress);
          console.log("allowance", allowance);
          let amount = parseUnits(value.amount, decimals).toString();
          if (allowance.gte(amount)) return true;
          // @ts-ignore
          let tx = await tokenContract.approve(lockAddress, amount, {
            from: account,
          });

          await toast.promise(tx.wait, {
            pending: "Confirming Transaction...",
          });
          const web3 = getWeb3(chainId);
          const response = await web3.eth.getTransactionReceipt(tx.hash);
          if (response != null) {
            if (response.status) {
              success = true;
              toast.success("Transaction confirmed!");
              setLoading(false);
            } else if (!response.status) {
              toast.error("Transaction failed!");
              setLoading(false);
            } else {
              toast.error("Something went wrong!");
              setLoading(false);
            }
          }
        } else {
          toast.error("Invalid address provided");
          setLoading(false);
        }
      } catch (err: any) {
        console.error("WHILE APPROVE", err);
        toast.error(err?.reason || "");
        setLoading(false);
      }
    } else {
      toast.error("Please connect your wallet");
      setLoading(false);
    }
    return success;
  };

  const handleSubmitLock = async (values: IFormValues) => {
    console.log(values);
    const erc20 = new ethers.Contract(
      values.tokenOrLPTokenAddress,
      erc20abi,
      library
    );
    const decimals = await erc20.decimals();
    const approved = await handleApprove(values, decimals);
    if (approved) {
      if (chainId && account && library) {
        try {
          let web3 = getWeb3(chainId);
          setLockLoading(true);
          let lockAddress = contract[chainId]
            ? contract[chainId].lockAddress
            : contract["default"].lockAddress;
          let lockContract = getContract(LockerABI, lockAddress, library);
          if (values.isvesting) {
            // @ts-ignore
            let tx = await lockContract.vestingLock(
              values.useAnotherOwner ? values.ownerAddress : account,
              values.tokenOrLPTokenAddress,
              values.islp,
              mulDecimal(values.amount, decimals),
              moment.utc(values.TGEDate).unix(),
              (values?.TGEPercentage || 0) * 100,
              (values?.CycleTime || 0) * 60 * 60 * 24,
              (values?.CycleReleasePercent || 0) * 100,
              values.title,
              { from: account }
            );
            await toast.promise(tx.wait, {
              pending: "Confirming Transaction...",
            });
            const response = await web3.eth.getTransactionReceipt(tx.hash);
            if (response != null) {
              if (response.status) {
                toast.success("Transaction confirmed!");
                setLockLoading(false);
                await router.push(`/pario-lock/unlock?blockchain=${chainId}`);
              } else if (!response.status) {
                toast.error("Transaction failed!");
                setLockLoading(false);
              } else {
                toast.error("Something went wrong!");
                setLockLoading(false);
              }
            }
          } else {
            // @ts-ignore
            let tx = await lockContract.lock(
              values.useAnotherOwner ? values.ownerAddress : account,
              values.tokenOrLPTokenAddress,
              values.islp,
              mulDecimal(values.amount, decimals),
              web3.utils.toHex(moment.utc(values.lockUntil).unix()),
              values.title,
              { from: account }
            );
            await toast.promise(tx.wait, {
              pending: "Confirming Transaction...",
            });
            const response = await web3.eth.getTransactionReceipt(tx.hash);
            if (response != null) {
              console.log("response", response);
              if (response.status) {
                toast.success("Transaction confirmed!");
                setLockLoading(false);
                await router.push(`/pario-lock/unlock?blockchain=${chainId}`);
              } else if (!response.status) {
                toast.error("Transaction failed!");
                setLockLoading(false);
              } else {
                toast.error("Something went wrong!");
                setLockLoading(false);
              }
            }
          }
        } catch (err: any) {
          console.log(err, "here");
          toast.error(err.reason ? err.reason : err.message);
          setLockLoading(false);
        }
      }
    }
  };

  const Details = React.useMemo(() => {
    let arr;
    arr = [
      {
        title: "Token or LP Token address",
        value:
          `${
            values.tokenOrLPTokenAddress
              ? walletNameTrimmer(values.tokenOrLPTokenAddress)
              : ""
          }` || "-",
      },
      {
        title: "Lock Name",
        value: `${values.title}` || "-",
      },
      {
        title: "Token Name",
        value: `${name}` || "-",
      },
      {
        title: "Token Symbol",
        value: `${symbol}` || "-",
      },
      {
        title: "Decimals",
        value: `${decimals}` || "-",
      },
      {
        title: "Total supply",
        value: !isNaN(parseFloat(totalSupply))
          ? `${Math.round(
              parseFloat(totalSupply) / 10 ** parseFloat(decimals)
            )}`
          : "-",
      },
      {
        title: "Balance",
        value: !isNaN(parseFloat(tokenBalance))
          ? `${Math.round(
              parseFloat(tokenBalance) / 10 ** parseFloat(decimals)
            )}`
          : "-",
      },
      {
        title: "Amount",
        value: `${values.amount}` || "-",
      },
      {
        title: "Lock Until (UTC)",
        value:
          `${
            values.lockUntil
              ? moment.utc(values.lockUntil).format(TIME_FORMAT)
              : ""
          }` || "-",
      },
    ];
    if (values.useAnotherOwner) {
      arr = [
        ...arr,
        {
          title: "Receiver Address",
          value:
            `${
              values.ownerAddress ? walletNameTrimmer(values.ownerAddress) : ""
            }` || "-",
        },
      ];
    }
    if (values.islp) {
      arr = [
        ...arr,
        {
          title: "Pair",
          value: `${pair}` || "-",
        },
      ];
    }
    if (values.isvesting) {
      arr = [
        ...arr,
        {
          title: "Vesting Unlock date (UTC)",
          value:
            `${
              values.TGEDate
                ? moment.utc(values.TGEDate).format(TIME_FORMAT)
                : ""
            }` || "-",
        },
        {
          title: "First release %",
          value: `${values.TGEPercentage ? values.TGEPercentage : ""}` || "-",
        },
        {
          title: "Vesting cycle (Days)",
          value: `${values.CycleTime ? values.CycleTime : ""}` || "-",
        },
        {
          title: "Vesting cycle release percent",
          value:
            `${values.CycleReleasePercent ? values.CycleReleasePercent : ""}` ||
            "-",
        },
      ];
    }
    return arr;
  }, [values, name, tokenBalance]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="container mx-auto pt-20 lg:pt-32 ">
        <div className="gap-16 my-8 lg:my-20">
          {!preview ? (
            <div className="border border-primary-green  p-8 md:p-10 w-full">
              <BigInput
                label="Token or LP Token address*"
                name="tokenOrLPTokenAddress"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.tokenOrLPTokenAddress}
                error={
                  touched.tokenOrLPTokenAddress && errors.tokenOrLPTokenAddress
                }
                variant={
                  touched.tokenOrLPTokenAddress && errors.tokenOrLPTokenAddress
                    ? "warning"
                    : values.tokenOrLPTokenAddress
                    ? "bright"
                    : "primary"
                }
              />
              <div className="mb-6">
                <SmallSwitch
                  label="Lock for someone else?"
                  enableColor="bg-[#EB6D65]"
                  className="mt-4"
                  enabled={values.useAnotherOwner}
                  setEnabled={(value) => {
                    setFieldValue("useAnotherOwner", value);
                  }}
                />
              </div>
              {values.useAnotherOwner && (
                <BigInput
                  className=""
                  label="Receiver Address"
                  name="ownerAddress"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.ownerAddress}
                  error={touched.ownerAddress && errors.ownerAddress}
                  variant={
                    touched.ownerAddress && errors.ownerAddress
                      ? "warning"
                      : values.ownerAddress
                      ? "bright"
                      : "primary"
                  }
                  description="The address you input here will be receive the tokens once
                  they are unlocked."
                />
              )}
              <BigInput
                label="Lock Name"
                name="title"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.title}
                error={touched.title && errors.title}
                variant={
                  touched.title && errors.title
                    ? "warning"
                    : values.title
                    ? "bright"
                    : "primary"
                }
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-10 my-8">
                <Input2
                  label="Lock Amount*"
                  name="amount"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.amount}
                  error={touched.amount && errors.amount}
                  variant={
                    touched.amount && errors.amount
                      ? "warning"
                      : values.amount
                      ? "bright"
                      : "primary"
                  }
                />
                <DateTimePicker
                  label="Lock Until (UTC)*"
                  name="lockUntil"
                  onChange={(v: any) => setFieldValue("lockUntil", v)}
                  onBlur={handleBlur}
                  value={values.lockUntil}
                  error={errors.lockUntil}
                />
              </div>
              <div>
                <SmallSwitch
                  label="Use vesting?"
                  enableColor="bg-[#EB6D65]"
                  className="mt-4"
                  enabled={values.isvesting}
                  setEnabled={(value) => {
                    setFieldValue("isvesting", value);
                  }}
                />
              </div>
              {values.isvesting && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-10 mt-10">
                    <DateTimePicker
                      label="Vesting Unlock date (UTC)*"
                      name="TGEDate"
                      onBlur={handleBlur}
                      onChange={(v: any) => setFieldValue("TGEDate", v)}
                      value={values.TGEDate}
                      error={errors.TGEDate}
                    />
                    <Input2
                      label="First release %*"
                      type="number"
                      name="TGEPercentage"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.TGEPercentage}
                      error={touched.TGEPercentage && errors.TGEPercentage}
                      variant={
                        touched.TGEPercentage && errors.TGEPercentage
                          ? "warning"
                          : values.TGEPercentage
                          ? "bright"
                          : "primary"
                      }
                    />
                    <Input2
                      label="Vesting cycle (Days)*"
                      type="number"
                      name="CycleTime"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.CycleTime}
                      error={touched.CycleTime && errors.CycleTime}
                      variant={
                        touched.CycleTime && errors.CycleTime
                          ? "warning"
                          : values.CycleTime
                          ? "bright"
                          : "primary"
                      }
                    />
                    <Input2
                      label="Vesting cycle release percent*"
                      type="number"
                      name="CycleReleasePercent"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.CycleReleasePercent}
                      error={
                        touched.CycleReleasePercent &&
                        errors.CycleReleasePercent
                      }
                      variant={
                        touched.CycleReleasePercent &&
                        errors.CycleReleasePercent
                          ? "warning"
                          : values.CycleReleasePercent
                          ? "bright"
                          : "primary"
                      }
                    />
                  </div>
                </>
              )}
              <div className="flex justify-center sm:justify-end items-center mt-6 ">
                <Button
                  loading={isSubmitting || isValidating}
                  className="w-full sm:w-auto"
                  disabled={
                    isSubmitting ||
                    isValidating ||
                    Object.keys(errors).length > 0
                  }
                  onClick={() => {
                    validateForm(values).then((e) => {
                      if (Object.keys(e).length <= 0) {
                        setPreview(true);
                      }
                    });
                  }}>
                  Preview
                </Button>
              </div>
            </div>
          ) : (
            <div className=" border border-primary-green  p-10 w-full">
              <div className="text-3xl text-primary-green">Details</div>
              <div className="mt-14">
                {Details.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3 border-b border-dull-border ">
                      <div className="text-white">{item.title}</div>
                      <div className="text-primary-green ">{item.value}</div>
                    </div>
                  );
                })}
              </div>
              <div>
                <div className="flex flex-col-reverse sm:flex-row justify-between items-center mt-10 gap-8 ">
                  <Button
                    // loading={isSubmitting}
                    variant="outline"
                    className="w-full sm:w-auto"
                    disabled={isSubmitting}
                    onClick={() => setPreview(false)}>
                    Back
                  </Button>
                  <Button
                    loading={isSubmitting}
                    className="w-full sm:w-auto"
                    // variant="accent-2"
                    // className="text-black md:max-w-[250px] "
                    disabled={isSubmitting || Object.keys(errors).length > 0}
                    type="submit">
                    Lock
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default LockerCreateComp;
