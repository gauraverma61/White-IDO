import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Dialog, Transition } from "@headlessui/react";
import TextArea from "@atoms/TextArea";
import { IAllocationDetail } from "@components/Details/Allocations";
import Button from "@atoms/Button";
import CSVUploader from "@components/MultiSender/CSVUploader";
import { ethers } from "ethers";
import { useRouter } from "next/dist/client/router";
import { isValidAddress } from "@walletconnect/utils";

interface Props {
  showModal: boolean;
  setShowModal: Function;
  setAllocations: Function;
  name?: string;
  submitName?: string;
  allocationsData?: IAllocationDetail[];
  loading?: boolean;
}

export type tokenAddressError = {
  address: string;
  line: number;
  amount: string;
  type?: string;
};

export type addressArray = { address: string; amount: string }[];

const SetAllocationModal: React.FC<Props> = ({
  showModal,
  setShowModal,
  setAllocations,
  name,
  submitName,
  allocationsData,
  loading,
}) => {
  const cancelButtonRef = useRef(null);
  const [manualData, setManualData] = useState<string[]>([]);

  const [type, setType] = useState(false);
  const [CSVData, setCSVData] = useState<[]>([]);
  const [addressArray, setAddressArray] = useState<addressArray>([]);

  const [tokenAddressError, setTokenAddressError] = useState<
    tokenAddressError[]
  >([]);
  const [tokenAddressDuplicateError, setTokenAddressDuplicateError] = useState<
    tokenAddressError[]
  >([]);

  const formatAllocationsData = () => {
    const currentData = allocationsData;
    const newArr = currentData?.map((item) => `${item.address},${item.amount}`);
    return newArr?.join("\r\n");
  };

  // useEffect(() => {
  //   if (allocationsData) {
  //     setManualData(allocationsData); manualData.join("\n")
  //   }
  // }, []);

  const handleTypeChange = () => {
    if (type) {
      setType(false);
    } else {
      setAddressArray([]);
      setType(true);
    }
  };

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

  console.log("manualData", manualData);

  useEffect(() => {
    if (textSample.length > 0 && type) {
      setManualData(textSample);
      setType(false);
    }
  }, [textSample]);

  const csvFormater = useCallback(() => {
    if (CSVData) {
      const array: any = [];
      CSVData.forEach((data: any, index) => {
        //if (ethers.utils.isAddress(data[0]) && parseFloat(data[1]) > 0) {
        array.push({ address: data[0].trim(), amount: data[1].trim() });
        //}
      });
      setAddressArray(array);
    }
  }, [CSVData]);

  const manualFormater = useCallback(() => {
    if (manualData) {
      const array: any = [];
      manualData.forEach((data: any, index) => {
        const upgradeArray = data.split(",");
        array.push({
          address: upgradeArray[0]?.trim(),
          amount: upgradeArray[1]?.trim(),
        });
      });
      setAddressArray(array);
      console.log(array);
    }
  }, [manualData]);

  useEffect(() => {
    if (type) {
      csvFormater();
    } else {
      manualFormater();
    }
  }, [manualData, CSVData]);

  const getAddressError = () => {
    if (addressArray.length > 0) {
      const tokenAddressErrorArr: tokenAddressError[] = [];
      const tokenAddressArr = addressArray.filter((item, index) => {
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
    const upgradeArray = manualData[0]?.split(",") ?? "";
    upgradeArray[1] = totalAddAmount.toString();
    setManualData([upgradeArray.join(",")]);
  };

  const duplicateKeepOneLine = () => {
    setManualData([manualData[0]]);
  };

  const router = useRouter();

  return (
    <Transition.Root show={showModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-5 0"
        initialFocus={cancelButtonRef}
        onClose={() => setShowModal(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-90 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto dark">
          <div className="flex min-h-full justify-center p-4 text-center items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <Dialog.Panel className="relative transform overflow-hidden  bg-black border border-primary-green text-left shadow-xl transition-all sm:my-8 max-w-[560px] w-full">
                <div className=" px-7 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-medium leading-6 text-primary-green text-center">
                      <span className="border-b border-[#000]">
                        {name || "Set Allocation"}
                      </span>
                    </Dialog.Title>
                    {/* <div className="mt-7">
                      <label className="label font-normal text-base">
                        Users allocation
                      </label>
                      <TextArea
                        label=""
                        placeholder="0jnjdnvnln 4c6c56v5dvbNBk13000v"
                        className="textarea textarea-bordered h-40"
                        defaultValue={formatAllocationsData()}
                        textAreaHeight="h-40"
                        onChange={(e) => {
                          const _allocations = e.target.value?.split(/\r?\n/);
                          setManualData(
                            _allocations
                              ?.map((v) => {
                                const t = v.split(",");
                                if (!isValidAddress(t[0]) || !t[1])
                                  return {
                                    address: "",
                                    amount: "",
                                  };
                                return {
                                  address: t[0],
                                  amount: t[1],
                                };
                              })
                              ?.filter((v) => v.address !== "") || []
                          );
                        }}
                      />
                    </div> */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between my-3">
                        <p className="text-base font-semibold text-white">
                          Allocations
                        </p>
                        <div
                          className="text-sm font-medium cursor-pointer text-primary-green"
                          onClick={handleTypeChange}>
                          {type ? "Insert Manually" : "Upload CSV"}
                        </div>
                      </div>
                      {type ? (
                        <CSVUploader setCSVData={setCSVData} />
                      ) : (
                        <TextArea
                          label=""
                          className="textarea textarea-bordered h-40 "
                          defaultValue={formatAllocationsData()}
                          textAreaHeight="h-40"
                          value={manualData.join("\n")}
                          onChange={(e) =>
                            setManualData(e.target.value.split(/\r?\n/))
                          }
                          placeholder="Insert Allocation: separate with breaks line. By format: address,amount"
                        />
                      )}
                      <div className="text-white text-sm mt-3">
                        {type
                          ? "Sample CSV file"
                          : "Recipients allocation is required"}
                      </div>
                    </div>
                    {tokenAddressError &&
                      tokenAddressError.length > 0 &&
                      addressArray.length > 0 && (
                        <div className="mt-5">
                          <div className="flex justify-between text-red-500">
                            The below addresses cannot be processed{" "}
                            <span
                              className="underline cursor-pointer"
                              onClick={deleteErrorToken}>
                              Delete them
                            </span>
                          </div>
                          <div className="border border-red-500 p-5 mt-3">
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
                          <div className="justify-between text-red-500">
                            <div>Duplicated addresses</div>
                            <div className="flex justify-end">
                              <span
                                className="underline cursor-pointer mr-4"
                                onClick={duplicateKeepOneLine}>
                                Keep the first one
                              </span>
                              <span
                                className="underline cursor-pointer mr-4"
                                onClick={duplicateCombineBalance}>
                                Combine balances
                              </span>
                              <span
                                className="underline cursor-pointer"
                                onClick={ignoreDuplicateError}>
                                Ignore
                              </span>
                            </div>
                          </div>
                          <div className="border bg-white p-5 mt-3">
                            <ul className="text-xs">
                              {tokenAddressDuplicateError.map((item, index) => {
                                return (
                                  <li
                                    className="text-red-500 break-all"
                                    key={index}>
                                    Line {item.line}: duplicate address{" "}
                                    {item.address}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
                <div className="w-full mb-5 mt-5 flex justify-center">
                  {tokenAddressError.length === 0 &&
                  tokenAddressDuplicateError.length === 0 ? (
                    <Button
                      loading={loading}
                      onClick={() => {
                        if (router.pathname === "/airdrop/create") {
                          setShowModal();
                        }
                        setAllocations(addressArray);
                      }}>
                      {submitName || "Add Allocations"}
                    </Button>
                  ) : (
                    <Button
                      className="opacity-50"
                      disabled
                      onClick={() => {
                        if (router.pathname === "/airdrop/create") {
                          setShowModal();
                        }
                        setAllocations(addressArray);
                      }}>
                      {submitName || "Add Allocations"}
                    </Button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default SetAllocationModal;
