import React, { useCallback, useEffect, useMemo } from "react";
import Button from "@atoms/Button";
import useTokenInfo from "@hooks/useTokenInfo";
import CSVUploader from "./CSVUploader";
import useAuth from "@hooks/useAuth";
import { ethers } from "ethers";
import erc20abi from "../../../ABIs/ERC20/ERC20ABI.json";
import multisenderABI from "../../../ABIs/Multisender/multisenderABI.json";
import { toast } from "react-toastify";
import TextArea from "@atoms/TextAreaV2";
import CustomSwitch from "@molecules/SwitchV2";
import { contract } from "@constants/constant";
import { BsUpload } from "react-icons/bs";
import { isValidAddress } from "@walletconnect/utils";
import Input2 from "@atoms/Input2";

export type detailGrid = {
  name: string;
  value: string;
  showAddress?: true;
  showAddressText?: "View Address";
}[];

export type tokenAddressError = {
  address: string;
  line: number;
  amount: string;
  type?: string;
};

export type addressArray = { address: string; amount: string }[];

const MultiSenderComp = () => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [type, setType] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [showDetail, setShowDetail] = React.useState(false);
  const [showExampleModal, setShowExampleModal] = React.useState(false);
  const [tokenAddress, setTokenAddress] = React.useState("");
  const [CSVData, setCSVData] = React.useState<[]>([]);
  const [manualData, setManualData] = React.useState<string[]>([]);
  const [addressArray, setAddressArray] = React.useState<addressArray>([]);
  const [detailGridData, setDetailGridData] = React.useState<detailGrid>([]);
  const [amountMethod, setAmountMethod] = React.useState("Exact amount");

  const { ethereum, chainId, account } = useAuth();

  const [tokenAddressError, setTokenAddressError] = React.useState<
    tokenAddressError[]
  >([]);
  const [tokenAddressDuplicateError, setTokenAddressDuplicateError] =
    React.useState<tokenAddressError[]>([]);

  const csvFormater = useCallback(() => {
    if (CSVData) {
      const array: any = [];
      CSVData.forEach((data: any, index) => {
        array.push({ address: data[0].trim(), amount: data[1].trim() });
      });
      setAddressArray(array);
      getAddressError();
      getAddressDuplicateError();
    }
  }, [CSVData]);

  const manualFormater = useCallback(() => {
    if (manualData) {
      const array: any = [];
      manualData.forEach((data: any, index) => {
        const upgradeArray = data.split(",");
        if (
          ethers.utils.isAddress(upgradeArray[0]) &&
          parseFloat(upgradeArray[1]) > 0
        ) {
          array.push({
            address: upgradeArray[0].trim(),
            amount: upgradeArray[1]?.trim(),
          });
        }
      });
      setAddressArray(array);
      console.log(array);
    }
  }, [manualData]);

  const textSample = useMemo(() => {
    let array: any = [];
    if (addressArray) {
      addressArray.forEach((item) => {
        array.push(`${item.address},${item.amount}`);
      });
      let joined = array.join("\n");
      return array;
    } else return [];
  }, [addressArray]);

  useEffect(() => {
    if (textSample.length > 0 && type) {
      setManualData(textSample);
      setType(false);
    }
  }, [textSample]);

  const handleTypeChange = () => {
    if (type) {
      setType(false);
    } else {
      setAddressArray([]);
      setType(true);
    }
  };

  useEffect(() => {
    if (type) {
      csvFormater();
    } else {
      manualFormater();
    }
  }, [manualData, CSVData]);

  const {
    address,
    tokenName,
    fetchTokenError,
    tokenSymbol,
    totalSupply,
    decimals,
    tokenBalance,
    fetchtokenDetail,
    fetchTokenBalance,
  } = useTokenInfo({ tokenAddress: tokenAddress, ethereum });

  useEffect(() => {
    if (tokenAddress) {
      fetchtokenDetail();
      fetchTokenBalance();
    }
  }, [tokenAddress]);

  const totalAmmount = useMemo(() => {
    let count = 0;
    addressArray.forEach((address) => {
      count += parseFloat(address.amount);
    });
    return count;
  }, [addressArray]);

  const getManualDataArr = () => {
    const array: any = [];
    manualData.forEach((data: any, index) => {
      const upgradeArray = data.split(",");
      array.push({ address: upgradeArray[0], amount: upgradeArray[1] });
    });
    return array;
  };

  const getAddressError = () => {
    const newAddressArray: addressArray = getManualDataArr();
    if (newAddressArray.length > 0) {
      const tokenAddressErrorArr: tokenAddressError[] = [];
      const tokenAddressArr = newAddressArray.filter((item, index) => {
        if (!ethers.utils.isAddress(item.address)) {
          const errorObj = {
            line: index + 1,
            address: item.address,
            amount: item.amount,
            type: "address",
          };
          tokenAddressErrorArr.push(errorObj);
        } else if (isNaN(Number(item.amount))) {
          const errorObj = {
            line: index + 1,
            address: item.address,
            amount: item.amount,
            type: "amount",
          };
          tokenAddressErrorArr.push(errorObj);
        }
      });
      return setTokenAddressError(tokenAddressErrorArr);
    }
  };

  const getAddressDuplicateError = () => {
    if (addressArray.length > 0) {
      const tokenAddressDuplicateErrorArr: tokenAddressError[] = [];
      const uniqueIds = new Set();
      const unique = addressArray.filter((element, index) => {
        const isDuplicate = uniqueIds.has(element.address);
        uniqueIds.add(element.address);
        if (isDuplicate && isValidAddress(element?.address)) {
          tokenAddressDuplicateErrorArr.push({ ...element, line: index + 1 });
        }
        return false;
      });
      setTokenAddressDuplicateError(tokenAddressDuplicateErrorArr);
    }
  };

  useEffect(() => {
    getAddressError();
  }, [addressArray]);

  useEffect(() => {
    getAddressDuplicateError();
  }, [manualData, addressArray]);

  const deleteErrorToken = () => {
    const newTokenErrorAdd =
      tokenAddressError &&
      tokenAddressError.map((item) =>
        item.amount ? `${item.address},${item.amount}` : `${item.address}`
      );
    if (newTokenErrorAdd) {
      const myArray = manualData.filter((el) => !newTokenErrorAdd.includes(el));
      setManualData(myArray);
      setTokenAddressError([]);
    }
  };

  const ignoreDuplicateError = () => {
    setTokenAddressDuplicateError([]);
  };

  const duplicateCombineBalance = () => {
    let totalAddAmount: number = 0;
    const totalWalletAmount = addressArray.map((item) => {
      totalAddAmount = totalAddAmount + Number(item.amount);
    });
    const upgradeArray = manualData[0].split(",");
    upgradeArray[1] = totalAddAmount.toString();
    setManualData([upgradeArray.join(",")]);
  };

  const duplicateKeepOneLine = () => {
    setManualData([manualData[0]]);
  };

  console.log("amountMethod", amountMethod);

  const unlimitedAmmount: string = "2 ** 256 - 1";

  const upperTabs: string[] = ["Token Address", "Allocations"];

  return (
    <>
      <div className="container mx-auto py-20 pt-32 md:py-40 2xl:px-16">
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
          {currentStep == 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 md:gap-y-14">
              <Input2
                label="Token Address"
                type="text"
                name="tokenAddress"
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                error={fetchTokenError}
              />
              <Input2 label={`Name*`} name="name" value={tokenName} disabled />
              <Input2
                label={`Symbol*`}
                name="symbol"
                value={tokenSymbol}
                disabled
              />
              <Input2
                label={`Decimals*`}
                name="decimals"
                type={"number"}
                value={decimals}
                disabled
              />
              {/* <Input2*/}
              {/*  label={`Total supply*`}*/}
              {/*
              {/*  name="totalSupply"*/}
              {/* type={"number"} */}
              {/*  value={formik.values.totalSupply}*/}
              {/*  error={formik.touched.totalSupply && formik.errors.totalSupply}*/}
              {/*  disabled*/}
              {/*/> */}
              <Input2
                label={`Balance*`}
                name="balance"
                type={"number"}
                value={parseFloat(tokenBalance) / 10 ** parseFloat(decimals)}
                disabled
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-6 lg:gap-10">
              <div className="">
                <div className="flex items-center justify-between mt-3">
                  <h3 className="text-xl capitalize font-medium text-white">
                    Allocations
                  </h3>
                  <div
                    onClick={() => setManualData([])}
                    className="text-secondary-green font-medium cursor-pointer text-xs capitalize flex self-end hover:underline">
                    Remove all Allocations
                  </div>
                </div>
                {type ? (
                  <CSVUploader className="mt-3" setCSVData={setCSVData} />
                ) : (
                  <div className="w-full flex flex-col">
                    <TextArea
                      className="text-primary-green mt-2"
                      value={manualData.join("\n")}
                      onChange={(e) =>
                        setManualData(e.target.value.split(/\r?\n/))
                      }
                      placeholder="Insert Allocation: separate with breaks line. By format: address,amount or address amount"
                    />
                  </div>
                )}

                <div className="flex justify-between items-center text-sm font-medium  text-primary-green mt-4">
                  <div
                    onClick={() => setShowExampleModal(!showExampleModal)}
                    className="text-secondary-green font-medium flex self-start cursor-pointer text-xs capitalize mt-2 hover:underline">
                    Show examples
                  </div>
                  {type ? (
                    <p className="cursor-pointer" onClick={handleTypeChange}>
                      Insert Manually
                    </p>
                  ) : (
                    <div
                      onClick={handleTypeChange}
                      className="flex gap-3 items-end cursor-pointer">
                      <p>Upload CSV</p>
                      <BsUpload size={22} />
                    </div>
                  )}
                </div>
                {showExampleModal && (
                  <div className=" border border-[#034B03] bg-dull-green-bg py-6 px-9 mt-4">
                    <div className=" text-primary-green text-lg mb-3">
                      Example
                    </div>
                    <div className=" text-white text-base">
                      0xC32cC068bf56C14DF74CB5hdhkaBDbEe42663F1a,45
                    </div>
                  </div>
                )}
              </div>
              {tokenAddressError && tokenAddressError.length > 0 && (
                <div className="mt-5">
                  <div className="flex justify-between text-red5 text-sm">
                    The below addresses cannot be processed{" "}
                    <span
                      className="hover:underline cursor-pointer"
                      onClick={deleteErrorToken}>
                      Delete them
                    </span>
                  </div>
                  <div className="border border-red5  bg-secondary-dark p-5 mt-2 max-h-[150px] overflow-y-auto">
                    <ul className="text-xs">
                      {tokenAddressError.map((item, index) => {
                        return (
                          <li className="text-red-500" key={index}>
                            Line {item.line}:{" "}
                            {item.type === "address"
                              ? `${item.address} is a invalid wallet address`
                              : `${item.amount} is a invalid wallet amount`}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              )}
              {tokenAddressDuplicateError &&
                tokenAddressDuplicateError.length > 0 &&
                tokenAddressError?.length === 0 && (
                  <div className="mt-5">
                    <div className="flex justify-between text-red5 text-sm">
                      Duplicated addresses
                      <div>
                        <span
                          className="hover:underline cursor-pointer mr-4"
                          onClick={duplicateKeepOneLine}>
                          Keep the first one
                        </span>
                        <span
                          className="hover:underline cursor-pointer mr-4"
                          onClick={duplicateCombineBalance}>
                          Combine balances
                        </span>
                        <span
                          className="hover:underline cursor-pointer"
                          onClick={ignoreDuplicateError}>
                          Ignore
                        </span>
                      </div>
                    </div>
                    <div className="border border-red5  bg-secondary-dark p-5 mt-2 max-h-[150px] overflow-y-auto">
                      <ul className="text-xs">
                        {tokenAddressDuplicateError.map((item, index) => {
                          return (
                            <li className="text-red-500" key={index}>
                              Line {item.line}: duplicate address {item.address}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                )}
            </div>
          )}
          <div className="flex flex-col-reverse md:flex-row justify-between mt-20 gap-8">
            {currentStep > 0 ? (
              <Button
                variant="outline"
                onClick={() => setCurrentStep((prev) => prev - 1)}>
                Back
              </Button>
            ) : (
              <div className="hidden md:block"></div>
            )}

            {currentStep == 0 && (
              <Button
                //   disabled={formik.isSubmitting}
                onClick={() =>
                  tokenName
                    ? setCurrentStep((prev) => prev + 1)
                    : toast.error("Add Address of token")
                }>
                {currentStep > 0 ? "Confirm" : "Next"}
              </Button>
            )}
            {currentStep == 1 &&
              tokenAddress &&
              !tokenAddressDuplicateError.length &&
              !tokenAddressError.length &&
              !fetchTokenError &&
              addressArray.length > 0 && (
                <>
                  <div className="flex justify-center sm:justify-end">
                    <Button
                      //   className="bg-primary-green disabled:bg-[#457457]/60 text-secondary-dark sm:px-40"
                      loading={loading}
                      onClick={async (e) => {
                        e.preventDefault();
                        try {
                          setLoading(true);
                          if (ethereum) {
                            const provider = new ethers.providers.Web3Provider(
                              ethereum
                            );
                            const signer = provider.getSigner();
                            const erc20 = new ethers.Contract(
                              tokenAddress,
                              erc20abi,
                              signer
                            );
                            const multisenderAddress =
                              contract[chainId || "default"].multiSenderAddress;
                            const allowance = await erc20.allowance(
                              account,
                              multisenderAddress
                            );
                            const amount = (
                              totalAmmount *
                              10 ** parseFloat(decimals)
                            ).toString();
                            if (allowance.lt(amount)) {
                              const approved = await erc20.approve(
                                multisenderAddress,
                                amountMethod == "Exact amount"
                                  ? (
                                      totalAmmount *
                                      10 ** parseFloat(decimals)
                                    ).toString()
                                  : "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
                              );
                              await approved.wait();
                            }
                            const multiSender = new ethers.Contract(
                              multisenderAddress,
                              multisenderABI,
                              signer
                            );

                            await multiSender.multiSend(
                              tokenAddress,
                              addressArray.map((e) => e.address),
                              addressArray.map((e) =>
                                (
                                  parseFloat(e.amount) *
                                  10 ** parseFloat(decimals)
                                ).toString()
                              ),
                              {
                                value: "300000000000000",
                              }
                            );
                            toast.success("Transfer Successfull");
                            setLoading(false);
                          }
                        } catch (err) {
                          setLoading(false);
                          toast.error("Something Went Wrong");
                          console.error("ERROR", err);
                        }
                      }}>
                      Confirm
                    </Button>
                  </div>
                </>
              )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MultiSenderComp;
