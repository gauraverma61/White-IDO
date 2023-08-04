import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Dialog, Transition } from "@headlessui/react";
import TextArea from "@atoms/TextArea";
import Button from "@atoms/Button";
import CustomSwitch from "@molecules/Switch";
import CSVUploader from "@components/MultiSender/CSVUploader";
import { ethers } from "ethers";
import { isValidAddress } from "@walletconnect/utils";

interface Props {
  showModal: boolean;
  setShowModal: Function;
  setUsers: Function;
  setTire: Function;
  tier: string;
  handleSubmit: Function;
  loading: boolean;
  users: string;
}

export type tokenAddressError = {
  address: string;
  line: number;
  type?: string;
};

const AddUserPopUp: React.FC<Props> = ({
  showModal,
  setShowModal,
  setUsers,
  handleSubmit,
  users,
  tier,
  setTire,
  loading,
}) => {
  const cancelButtonRef = useRef(null);

  const [type, setType] = useState(false);
  const [CSVData, setCSVData] = useState<[]>([]);
  const [manualData, setManualData] = useState<string[]>([]);
  const [addressArray, setAddressArray] = useState<string[]>([]);

  const [tokenAddressError, setTokenAddressError] = useState<
    tokenAddressError[]
  >([]);
  const [tokenAddressDuplicateError, setTokenAddressDuplicateError] = useState<
    tokenAddressError[]
  >([]);

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
        array.push(item);
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

  const csvFormater = useCallback(() => {
    if (CSVData) {
      const array: any = [];
      CSVData.forEach((data: any, index) => {
        array.push(data[0]);
      });
      setAddressArray(array);
    }
  }, [CSVData]);

  const manualFormater = useCallback(() => {
    if (manualData) {
      const array: any = [];
      manualData.forEach((data: any, index) => {
        array.push(data);
      });
      setAddressArray(array);
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
        if (!ethers.utils.isAddress(item)) {
          const errorObj = {
            line: index + 1,
            address: item,
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
        const isDuplicate = uniqueIds.has(element);
        uniqueIds.add(element);
        if (isDuplicate && isValidAddress(element)) {
          tokenAddressDuplicateErrorArr.push({
            address: element,
            line: index + 1,
          });
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
      tokenAddressError && tokenAddressError.map((item) => item.address);
    if (newTokenErrorAdd) {
      const myArray = manualData.filter(
        (el: any) => !newTokenErrorAdd.includes(el)
      );
      setManualData(myArray);
      setTokenAddressError([]);
    }
  };

  const ignoreDuplicateError = () => {
    setTokenAddressDuplicateError([]);
  };

  const duplicateKeepOneLine = () => {
    setManualData([manualData[0]]);
  };

  useEffect(() => {
    if (addressArray) {
      const adduser = addressArray.join("\r\n");
      setUsers(adduser);
    }
  }, [addressArray]);

  const handleAddUserSubmit = () => {
    handleSubmit();
  };

  useEffect(() => {
    if (users.length > 0) {
      const addUserManual = users.split(/\r?\n/);
      setManualData(addUserManual);
    }
  }, []);

  return (
    <Transition.Root show={showModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-70"
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
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            aria-hidden="true"
          />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full justify-center p-4 text-center items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <Dialog.Panel className="relative transform overflow-hidden  bg-white text-left shadow-xl transition-all sm:my-8 max-w-[520px] w-full">
                <div className="bg-white px-5 sm:px-7 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-gray-900 text-center">
                      <span className="border-b border-[#000]">
                        Add Users to whitelist
                      </span>
                    </Dialog.Title>
                    {/* <div className="mt-7">
                      <label className="label font-bold text-base">Users</label>
                      <TextArea
                        label=""
                        className="textarea textarea-bordered h-40"
                        textAreaHeight="h-40"
                        value={users}
                        onChange={(e) => setUsers(e.target.value)}
                      />
                    </div> */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between my-3">
                        <p className="text-base font-semibold text-text3">
                          Users
                        </p>
                        <div
                          className="text-sm font-medium cursor-pointer text-text3"
                          onClick={handleTypeChange}>
                          {type ? "Insert Manually" : "Upload CSV"}
                        </div>
                      </div>
                      {type ? (
                        <CSVUploader setCSVData={setCSVData} />
                      ) : (
                        <TextArea
                          label=""
                          className="textarea textarea-bordered h-40"
                          textAreaHeight="h-40"
                          value={manualData.join("\n")}
                          onChange={(e) =>
                            setManualData(e.target.value.split(/\r?\n/))
                          }
                          placeholder="Insert Allocation: separate with breaks line. By format: address"
                        />
                      )}
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
                          <div className="border bg-white p-5 mt-3">
                            <ul className="text-xs">
                              {tokenAddressError.map((item, index) => {
                                return (
                                  <li className="text-red-500" key={index}>
                                    Line {item.line}:{" "}
                                    {`${item.address} is a invalid wallet address`}
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
                    <div className="mt-7">
                      <label className="label font-bold text-base">Tier</label>
                      <CustomSwitch
                        backGroundClass="bg-[#EB6D65]"
                        label=""
                        options={["1", "2"]}
                        selectedOption={tier}
                        setSelectedOption={(v) => {
                          setTire(v);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full mb-5 mt-5 flex px-5 sm:px-7  justify-center">
                  {addressArray &&
                  addressArray.length > 0 &&
                  tokenAddressError.length === 0 &&
                  tokenAddressDuplicateError.length === 0 ? (
                    <Button
                      loading={loading}
                      onClick={handleAddUserSubmit}
                      className="w-full sm:w-56">
                      {" "}
                      Add Users
                    </Button>
                  ) : (
                    <Button
                      disabled
                      loading={loading}
                      className="w-full opacity-50 sm:w-56">
                      {" "}
                      Add Users
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

export default AddUserPopUp;
