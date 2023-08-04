import React, { useCallback, useEffect, useMemo } from "react";
import Button from "@atoms/Button";
import useTokenInfo from "@hooks/useTokenInfo";
import CSVUploader from "./CSVUploader";
import useAuth from "@hooks/useAuth";
import { ethers } from "ethers";
import erc20abi from "../../ABIs/ERC20/ERC20ABI.json";
import multisenderABI from "../../ABIs/Multisender/multisenderABI.json";
import { toast } from "react-toastify";
import TextArea from "@atoms/TextAreaV2";
import CustomSwitch from "@molecules/SwitchV2";
import { contract } from "@constants/constant";
import { BsUpload } from "react-icons/bs";
import ExampleModal from "./ExampleModal";
import { isValidAddress } from "@walletconnect/utils";

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

  useEffect(() => {
    if (addressArray) {
      setDetailGridData([
        {
          name: "Token Address",
          value: tokenAddress ? tokenAddress : "-",
        },
        { name: "Name", value: tokenName ? tokenName : "-" },
        { name: "Symbol", value: tokenSymbol ? tokenSymbol : "-" },
        { name: "Decimals", value: tokenSymbol ? tokenSymbol : "-" },
        {
          name: "Total Supply",
          value:
            totalSupply && decimals
              ? (
                  parseFloat(totalSupply) /
                  10 ** parseFloat(decimals)
                ).toString()
              : "-",
        },
        {
          name: "Total Amount to Send",
          value: totalAmmount > 0 ? totalAmmount.toString() : "-",
        },
        {
          name: "No. of transaction",
          value: addressArray.length > 0 ? addressArray.length.toString() : "-",
        },
        {
          name: "Your token balance",
          value:
            tokenBalance && decimals
              ? (
                  parseFloat(tokenBalance) /
                  10 ** parseFloat(decimals)
                ).toString()
              : "-",
        },
      ]);
    }
  }, [
    addressArray,
    tokenBalance,
    tokenName,
    totalSupply,
    tokenAddress,
    tokenSymbol,
    totalAmmount,
  ]);

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

  return (
    <>
      <div className="py-8 xl:py-20 px-4 sm:px-10 xl:px-32 wallet-wrapper mt-10">
        <div
          className={`bg-no-repeat bg-cover bg-center md:h-[300px] lg:h-[350px] bg-hero-forms   border border-primary-green overflow-hidden`}>
          <div
            className={`flex justify-center h-full bg-gradient-to-t from-black to-black/10 relative`}>
            <div
              className={`flex flex-col-reverse md:flex-row md:items-center justify-between mx-auto container px-10 pt-6 relative`}>
              <div className={`flex justify-between self-end pb-10 w-fit `}>
                <h1 className="text-4xl md:text-6xl 2xl:text-7xl text-primary-green mt-4">
                  Multisender
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 lg:mt-14 flex flex-col-reverse lg:flex-row w-full justify-between">
          <div className="border border-primary-green shadow-boxShadow6  lg:w-1/2 lg:mr-20 bg-primary-dark h-fit">
            <div className="px-2 sm:px-8 pt-8 pb-10 w-full">
              <div className="">
                <div className="flex flex-col md:flex-row gap-4 md:gap-8 lg:gap-10">
                  <div className="flex-1">
                    <h3 className="text-xl capitalize font-medium text-white">
                      Token address
                    </h3>
                    <div className="flex justify-between border border-primary-green px-4  shadow-sm mt-4 mb-3 bg-secondary-dark">
                      <input
                        type="text"
                        className="outline-none w-full bg-secondary-dark text-primary-green placeholder-secondary-green"
                        placeholder="Enter token address"
                        onChange={(e) => setTokenAddress(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-gray11 text-xs">
                  Multi-sender allows you to send ERC20 token in batch by
                  easiest way.
                </div>
                {fetchTokenError && (
                  <div className="text-sm text-red-text4 font-normal">
                    {fetchTokenError}
                  </div>
                )}
              </div>
              <div className="mt-16">
                <div className="flex items-center justify-between mt-3">
                  <h3 className="text-xl capitalize font-medium text-white">
                    Allocations
                  </h3>
                </div>
                {type ? (
                  <CSVUploader className="mt-3" setCSVData={setCSVData} />
                ) : (
                  <div className="w-full flex flex-col">
                    <div
                      onClick={() => setManualData([])}
                      className="text-secondary-green font-medium cursor-pointer text-xs capitalize flex self-end hover:underline">
                      Remove all Allocations
                    </div>
                    <TextArea
                      className="text-primary-green mt-2"
                      value={manualData.join("\n")}
                      onChange={(e) =>
                        setManualData(e.target.value.split(/\r?\n/))
                      }
                      placeholder="Insert Allocation: separate with breaks line. By format: address,amount or address amount"
                    />
                    <div
                      onClick={() => setShowExampleModal(!showExampleModal)}
                      className="text-secondary-green font-medium flex self-start cursor-pointer text-xs capitalize mt-2 hover:underline">
                      Show examples
                    </div>
                  </div>
                )}

                <div className="flex justify-end text-sm font-medium  text-primary-green">
                  {type ? (
                    <p
                      className="cursor-pointer mt-6"
                      onClick={handleTypeChange}>
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
              <div className="">
                <CustomSwitch
                  className="mt-16"
                  backGroundClass="bg-[#C6CED6] !text-black"
                  label="Amount to Approve"
                  options={["Exact amount", "Unlimited amount"]}
                  selectedOption={amountMethod}
                  setSelectedOption={setAmountMethod}
                />
              </div>
              {tokenAddress &&
                !tokenAddressDuplicateError.length &&
                !tokenAddressError.length &&
                !fetchTokenError &&
                addressArray.length > 0 && (
                  <>
                    <div className="mt-10 flex justify-center sm:justify-end">
                      <Button
                        variant="accent-2"
                        className="bg-primary-green disabled:bg-[#457457]/60 text-secondary-dark sm:px-40"
                        loading={loading}
                        onClick={async (e) => {
                          e.preventDefault();
                          try {
                            setLoading(true);
                            if (ethereum) {
                              const provider =
                                new ethers.providers.Web3Provider(ethereum);
                              const signer = provider.getSigner();
                              const erc20 = new ethers.Contract(
                                tokenAddress,
                                erc20abi,
                                signer
                              );
                              const multisenderAddress =
                                contract[chainId || "default"]
                                  .multiSenderAddress;
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
          <div className="border border-primary-green lg:w-1/2  p-2 sm:p-10 bg-primary-dark mb-6 lg:mb-0 h-fit">
            <h2 className="text-primary-green text-3xl font-semibold mb-6">
              Details
            </h2>
            {detailGridData.map((element, index) => (
              <div
                key={index}
                className={`flex justify-between w-full text-white ${
                  index === 0
                    ? ""
                    : "border-t border-secondary-green pt-3 text-base font-medium"
                } mb-4`}>
                <p className="mb-0">{element.name}</p>
                <p className={`mb-0 text-primary-green`}>
                  {element?.value?.length > 14
                    ? element?.value?.slice(0, 14) + ".."
                    : element?.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ExampleModal
        showModal={showExampleModal}
        setShowModal={setShowExampleModal}
      />
    </>
  );
};

export default MultiSenderComp;
