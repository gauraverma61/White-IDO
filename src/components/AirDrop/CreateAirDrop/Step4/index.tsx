import React, { useEffect } from "react";
import { ICreateAirdrop } from "..";
import { ethers } from "ethers";
import { isValidAddress } from "@walletconnect/utils";
import CSVUploader from "@components/MultiSender/NewMultisender/CSVUploader";
import TextArea from "@atoms/TextAreaV2";
import { BsUpload } from "react-icons/bs";

export type tokenAddressError = {
  address: string;
  line: number;
  amount: string;
  type?: string;
};

export type addressArray = { address: string; amount: string }[];

const Step4: React.FC<ICreateAirdrop> = (props) => {
  const { formik } = props;
  console.log(formik.values);

  const [type, setType] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [showDetail, setShowDetail] = React.useState(false);
  const [showExampleModal, setShowExampleModal] = React.useState(false);
  const [tokenAddress, setTokenAddress] = React.useState("");
  const [CSVData, setCSVData] = React.useState<[]>([]);
  const [manualData, setManualData] = React.useState<string[]>([]);
  const [addressArray, setAddressArray] = React.useState<addressArray>([]);
  const [amountMethod, setAmountMethod] = React.useState("Exact amount");
  const [tokenAddressError, setTokenAddressError] = React.useState<
    tokenAddressError[]
  >([]);
  const [tokenAddressDuplicateError, setTokenAddressDuplicateError] =
    React.useState<tokenAddressError[]>([]);

  useEffect(() => {
    if (addressArray.length > 0) {
      formik.setFieldValue("allocationsData", addressArray);
    } else {
      formik.setFieldValue("allocationsData", []);
    }
  }, [addressArray]);

  const csvFormater = React.useCallback(() => {
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

  const manualFormater = React.useCallback(() => {
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

  const textSample = React.useMemo(() => {
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
        } else if (isNaN(Number(item.amount)) || item.amount == "0") {
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

  useEffect(() => {
    if (formik.values.allocationsData) {
      let arr: string[] = [];
      formik.values.allocationsData.forEach((e: any, i) => {
        let str = e.address + "," + String(e.amount);
        arr.push(str);
      });
      setManualData(arr);
    }
  }, []);

  return (
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
              onChange={(e) => setManualData(e.target.value.split(/\r?\n/))}
              placeholder="Insert Allocation: separate with breaks line. By format: address,amount or address amount"
            />
          </div>
        )}

        <div className="flex justify-between items-center text-sm font-medium  text-primary-green mt-4">
          <div
            onClick={() => setShowExampleModal(!showExampleModal)}
            className="text-secondary-green font-medium flex self-start cursor-pointer text-xs capitalize mt-2 hover:underline">
            {`${showExampleModal ? "Hide" : "Show"} example`}
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
            <div className=" text-primary-green text-lg mb-3">Example</div>
            <div className=" hidden md:block text-white text-base">
              0xC32cC068bf56C14DF74CB5hdhkaBDbEe42663F1a,45
            </div>
            <div className=" md:hidden text-white text-base">
              0xC32c...63F1a,45
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
  );
};

export default Step4;
