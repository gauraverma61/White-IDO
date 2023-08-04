import Button from "@atoms/Button";
import RadioButtonGroup from "@atoms/RadioButtonGroup";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import AddUserPopUp from "../AddUserPopUp";
import RemoveUserModal from "../RemoveUserModal";
import useAuth from "@hooks/useAuth";
import { getContract } from "@constants/contractHelper";
import poolAbi from "../../../ABIs/PresalePool/PresalePool.json";
import privateAbi from "../../../ABIs/PrivatePool/PrivatePool.json";
import airdropAbi from "../../../ABIs/AirdropMaster/AirdropMaster.json";
import { toast } from "react-toastify";
import { getWeb3 } from "@constants/connectors";
import { isValidAddress } from "@walletconnect/utils";
import { DetailsType, IPoolDetailsData } from "@components/Details";
import SetAllocationModal from "@components/CreateAirDrop/setAllocationModal";
import { IAllocationDetail } from "@components/Details/Allocations";
import { parseUnits } from "@ethersproject/units";
import moment from "moment";
import tokenAbi from "../../../ABIs/ERC20/ERC20ABI.json";
import { parseEther } from "ethers/lib/utils";
import { useRouter } from "next/router";
import SetTime from "@components/Details/SetTime";
import Router from "next/dist/shared/lib/router/router";
import MultiValueInput from "@atoms/MultiValueInput";
import CustomSwitch from "@molecules/SwitchV2";
import DateTimePicker from "@atoms/DateTimeInput";
import * as Yup from "yup";
import { useFormik } from "formik";
import { BsUpload } from "react-icons/bs";
import UploadFile from "../UploadFile";

const saleMethods = [
  {
    label: "Public",
    name: "sale-methods",
  },
  {
    label: "Whitelist",
    name: "sale-methods",
  },
];
const handleTx = async (
  callable: () => Promise<any>,
  chainId?: string | number,
  account?: string | null,
  reload?: Router["reload"]
) => {
  try {
    if (account && chainId) {
      if (chainId) {
        const tx = await callable();
        await toast.promise(tx.wait, {
          pending: "Confirming Transaction...",
        });

        let web3 = getWeb3(chainId);
        var response = await web3.eth.getTransactionReceipt(tx.hash);
        if (response != null) {
          if (response.status) {
            toast.success("Transaction confirmed!");
            reload && reload();
          } else if (!response.status) {
            toast.error("Transaction failed!");
          } else {
            toast.error("Something went wrong!");
          }
        }
      } else {
        toast.error("Please connect your wallet");
      }
    } else {
      toast.error("Please connect your wallet");
    }
  } catch (err: any) {
    toast.error(err.reason);
  }
};

const useSendTransaction = (callback: () => Promise<any>) => {
  const [loading, setLoading] = useState(false);
  const { chainId, library, account } = useAuth();
  const { reload } = useRouter();
  const execute = useCallback(async () => {
    try {
      setLoading(true);
      await handleTx(callback, chainId, account, reload);
      setLoading(false);
    } catch (e) {
      setLoading(true);
      toast.error("Something went wrong");
    }
  }, [account, callback, chainId, reload]);

  return {
    loading,
    setLoading,
    execute,
  };
};
const OwnerZone = ({
  data,
  type,
}: {
  data: IPoolDetailsData;
  type: DetailsType;
}) => {
  const { reload } = useRouter();
  const { account, chainId, library } = useAuth();
  const [showTime, setShowTime] = useState(false);
  const [addUser, setaddUser] = useState(false);
  const [selectFilePopup, setSelectFilePopup] = useState(false);
  const [waddloading, setWaddloading] = useState(false);
  const [finalizeLoading, setFinalLoading] = useState(false);
  const [wcLoading, setWcLoading] = useState(false);
  const [whitelistLoading, setWhitelistLoading] = useState(false);
  const [ewcLoading, setEWcLoading] = useState(false);
  const [claimLoading, setCtLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [tierChangeLoading, setTierChangeLoading] = useState(false);
  const [CSVData, setCSVData] = useState<[]>([]);
  const [addressArray, setAddressArray] = useState<string[]>([]);
  const [allocationsData, setAllocationsData] = useState<IAllocationDetail[]>(
    []
  );
  const [whitelistedUsers, setWhitelistedUsers] = useState("");
  const [tier, setTire] = useState("1");
  const [deleteMode, setDeleteMode] = useState(false);
  const [EnableWhitelist, setEnableWhitelist] = useState(false);
  const [showRemoveUser, setShowRemoveUser] = useState(false);
  const [PushThisCSV, setPushThisCSV] = useState<any>([]);
  const WithdrawLiquidityCallback = useCallback(async () => {
    let poolContract = getContract(poolAbi, data.pool_address, library);
    // @ts-ignore
    return await poolContract.withdrawLiquidity({
      from: account,
    });
  }, [account, data.pool_address, library]);
  const {
    loading: withdrawLiquidityLoading,
    execute: executeWithdrawLiquidity,
  } = useSendTransaction(WithdrawLiquidityCallback);
  const setModal = () => {
    setaddUser(true);
  };
  const closeModal = () => {
    return setaddUser(false);
  };
  const saleRadioHandler = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const confirmed = confirm(
      "You are about to change the Sale Access, Are you sure?"
    );
    if (confirmed) {
      if (event.target.value != data.sale_type) setShowTime(true);
      // if (event.target.value != data.sale_type)
      //   await handleWhitelistStatus(event.target.value);
    }
  };

  const csvFormater = useCallback(() => {
    if (CSVData) {
      const array: any = [];
      CSVData.forEach((data: any, index) => {
        array.push(data[0]);
      });
      // setAddressArray(array);
      setPushThisCSV(CSVData);
    }
  }, [CSVData]);

  useEffect(() => {
    csvFormater();
  }, [CSVData]);

  const handleWhitelistStatus = async (_saleMethod: string) => {
    setWhitelistLoading(true);
    try {
      if (account && chainId) {
        if (chainId) {
          let whitelist_status = _saleMethod === "Whitelist";

          let poolContract = getContract(poolAbi, data.pool_address, library);

          let tx;
          if (whitelist_status || data.start_time > moment().utc().unix()) {
            // @ts-ignore
            tx = await poolContract.changeWhitelist(whitelist_status, {
              from: account,
            });
          } else {
            // @ts-ignore
            tx = await poolContract.startPublicSaleNow({
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
              reload();
            } else if (!response.status) {
              toast.error("Transaction failed!");
            } else {
              toast.error("Something went wrong!");
            }
          }
        } else {
          toast.error("Please connect your wallet");
        }
      } else {
        toast.error("Please connect your wallet");
      }
    } catch (err: any) {
      toast.error(err.reason);
    }
    setWhitelistLoading(false);
  };

  const _handleTierChange = async (
    _endTime1: number,
    _endTime2: number,
    _publicStartTime: number
  ) => {
    setTierChangeLoading(true);
    try {
      if (account && chainId) {
        if (chainId) {
          let whitelist_status = _endTime1 === 0;
          if (whitelist_status) {
            await handleWhitelistStatus("Public");
            return;
          }
          let poolContract = getContract(poolAbi, data.pool_address, library);

          let tx;
          // @ts-ignore
          tx = await poolContract.changeTierDates(
            String(_endTime1),
            String(_endTime2),
            String(_publicStartTime),
            {
              from: account,
            }
          );
          await toast.promise(tx.wait, {
            pending: "Confirming Transaction...",
          });

          let web3 = getWeb3(chainId);
          var response = await web3.eth.getTransactionReceipt(tx.hash);
          if (response != null) {
            if (response.status) {
              setTierChangeLoading(false);
              toast.success("Transaction confirmed!");
              reload();
            } else if (!response.status) {
              setTierChangeLoading(false);
              toast.error("Transaction failed!");
            } else {
              setTierChangeLoading(false);
              toast.error("Something went wrong!");
            }
          }
        } else {
          setTierChangeLoading(false);
          toast.error("Please connect your wallet");
        }
      } else {
        setTierChangeLoading(false);
        toast.error("Please connect your wallet");
      }
    } catch (err: any) {
      setTierChangeLoading(false);
      toast.error(err.reason);
    }
  };
  const handleTierChange = async (
    _endTime1: number,
    _endTime2: number,
    _publicStartTime: number
  ) => {
    setTierChangeLoading(true);
    try {
      if (account && chainId) {
        if (chainId) {
          if (_endTime1 == 0 && _endTime2 == 0) {
            await _handleTierChange(0, 0, 0);
          } else {
            await _handleTierChange(_endTime1, _endTime2, _publicStartTime);
          }
        } else {
          setTierChangeLoading(false);
          toast.error("Please connect your wallet");
        }
      } else {
        setTierChangeLoading(false);
        toast.error("Please connect your wallet");
      }
    } catch (err: any) {
      setTierChangeLoading(false);
      toast.error(err.reason);
    }
  };

  const handleApprove = async ({
    data,
    allocations,
  }: {
    allocations?: IAllocationDetail[];
    data: IPoolDetailsData;
  }): Promise<boolean> => {
    let success = false;
    if (account) {
      if (chainId) {
        try {
          const decimals = data.token.decimals;
          if (data.token.address && decimals > 0) {
            let poolfactoryAddress = data.pool_address;
            let tokenContract = getContract(
              tokenAbi,
              data.token.address,
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
    allocations,
  }: {
    allocations?: IAllocationDetail[];
  }) => {
    setWaddloading(true);
    try {
      let waddress = [];
      if (allocations) {
        waddress = allocations;
      } else {
        waddress = whitelistedUsers
          .split(/\r?\n/)
          .filter((address) => isValidAddress(address));
      }
      if (waddress.length > 0) {
        if (account && chainId) {
          let poolContract = getContract(
            allocations ? airdropAbi : type == "presale" ? poolAbi : privateAbi,
            data.pool_address,
            library
          );

          let tx;
          if (allocations && allocations.length > 0) {
            const success = await handleApprove({ data, allocations });
            if (!success) {
              toast.error("Failed to check allowance");
              setWaddloading(false);
              return;
            }
            // @ts-ignore
            tx = await poolContract.addWhitelistedUsers(
              allocations.map((v) => v.address),
              allocations.map((v) => parseUnits(v.amount, data.token.decimals)),
              {
                from: account,
              }
            );
          } else {
            // @ts-ignore
            tx = await poolContract.addWhitelistedUsers(waddress, "1", {
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
              reload();
              setWaddloading(false);
            } else if (!response.status) {
              toast.error("Transaction failed!");
              setWaddloading(false);
            } else {
              toast.error("Something went wrong!");
              setWaddloading(false);
            }
          } else {
          }
        } else {
          toast.error("Please Connect to wallet !");
          setWaddloading(false);
        }
      } else {
        toast.error("Please Enter Valid Addess !");
        setWaddloading(false);
      }
      setWaddloading(false);
    } catch (err: any) {
      toast.error(err.reason ? err.reason : err.message);
      setWaddloading(false);
    }
  };

  const handleRemoveWhitelist = async () => {
    setWaddloading(true);
    try {
      const waddress = whitelistedUsers
        .split(/\r?\n/)
        .filter((address) => isValidAddress(address));
      if (waddress.length > 0) {
        if (account && chainId) {
          let poolContract = getContract(poolAbi, data.pool_address, library);

          // @ts-ignore
          let tx = await poolContract.removeWhitelistedUsers(waddress, {
            from: account,
          });

          await toast.promise(tx.wait, {
            pending: "Confirming Transaction...",
          });

          let web3 = getWeb3(chainId);
          var response = await web3.eth.getTransactionReceipt(tx.hash);
          if (response != null) {
            if (response.status) {
              toast.success("Transaction confirmed!");
              setWaddloading(false);
              reload();
            } else if (!response.status) {
              toast.error("Transaction failed!");
              setWaddloading(false);
            } else {
              toast.error("Something went wrong!");
              setWaddloading(false);
            }
          }
        } else {
          toast.error("Please Connect to wallet !");
          setWaddloading(false);
        }
      } else {
        toast.error("Please Enter Valid Addess !");
        setWaddloading(false);
      }
      setWaddloading(false);
    } catch (err: any) {
      toast.error(err.reason ? err.reason : err.message);
      setWaddloading(false);
    }
  };
  const handleFinalize = async () => {
    setFinalLoading(true);
    try {
      if (account && chainId) {
        let poolContract = getContract(poolAbi, data.pool_address, library);

        // @ts-ignore
        let tx = await poolContract.finalize({
          from: account,
        });

        await toast.promise(tx.wait, {
          pending: "Confirming Transaction...",
        });

        let web3 = getWeb3(chainId);
        var response = await web3.eth.getTransactionReceipt(tx.hash);
        if (response != null) {
          if (response.status) {
            toast.success("Transaction confirmed!");
            setFinalLoading(false);
            reload();
          } else if (!response.status) {
            toast.error("Transaction failed!");
            setFinalLoading(false);
          } else {
            toast.error("Something went wrong!");
            setFinalLoading(false);
          }
        }
      } else {
        toast.error("Please Connect to wallet !");
        setFinalLoading(false);
      }
    } catch (err: any) {
      toast.error(err.reason ? err.reason : err.message);
      setFinalLoading(false);
    }
  };

  const handleWithdrawContribution = async () => {
    setWcLoading(true);
    try {
      if (account && chainId) {
        let poolContract = getContract(poolAbi, data.pool_address, library);

        // @ts-ignore
        let tx = await poolContract.withdrawContribution({
          from: account,
        });

        await toast.promise(tx.wait, {
          pending: "Confirming Transaction...",
        });

        let web3 = getWeb3(chainId);
        var response = await web3.eth.getTransactionReceipt(tx.hash);
        if (response != null) {
          if (response.status) {
            toast.success("Transaction confirmed!");
            setWcLoading(false);
            reload();
          } else if (!response.status) {
            toast.error("Transaction failed!");
            setWcLoading(false);
          } else {
            toast.error("Something went wrong!");
            setWcLoading(false);
          }
        }
      } else {
        toast.error("Please Connect to wallet !");
        setWcLoading(false);
      }
    } catch (err: any) {
      toast.error(err.reason ? err.reason : err.message);
      setWcLoading(false);
    }
  };
  const handleEmergencyWithdrawContribution = async () => {
    setEWcLoading(true);
    try {
      if (account && chainId) {
        let poolContract = getContract(poolAbi, data.pool_address, library);

        // @ts-ignore
        let tx = await poolContract.emergencyWithdrawContribution({
          from: account,
        });

        await toast.promise(tx.wait, {
          pending: "Confirming Transaction...",
        });

        let web3 = getWeb3(chainId);
        var response = await web3.eth.getTransactionReceipt(tx.hash);
        if (response != null) {
          if (response.status) {
            toast.success("Transaction confirmed!");
            setEWcLoading(false);
            reload();
          } else if (!response.status) {
            toast.error("Transaction failed!");
            setEWcLoading(false);
          } else {
            toast.error("Something went wrong!");
            setEWcLoading(false);
          }
        }
      } else {
        toast.error("Please Connect to wallet !");
        setEWcLoading(false);
      }
    } catch (err: any) {
      toast.error(err.reason ? err.reason : err.message);
      setEWcLoading(false);
    }
  };

  const handleClaimToken = async () => {
    setCtLoading(true);
    try {
      if (account && chainId) {
        let poolContract = getContract(poolAbi, data.pool_address, library);

        // @ts-ignore
        let tx = await poolContract.claim({
          from: account,
        });

        await toast.promise(tx.wait, {
          pending: "Confirming Transaction...",
        });

        let web3 = getWeb3(chainId);
        var response = await web3.eth.getTransactionReceipt(tx.hash);
        if (response != null) {
          if (response.status) {
            toast.success("Transaction confirmed!");
            setCtLoading(false);
            reload();
          } else if (!response.status) {
            toast.error("Transaction failed!");
            setCtLoading(false);
          } else {
            toast.error("Something went wrong!");
            setCtLoading(false);
          }
        }
      } else {
        toast.error("Please Connect to wallet !");
        setCtLoading(false);
      }
    } catch (err: any) {
      toast.error(err.reason ? err.reason : err.message);
      setCtLoading(false);
    }
  };

  const handleCancel = async () => {
    setCancelLoading(true);
    try {
      if (account && chainId) {
        let poolContract = getContract(poolAbi, data.pool_address, library);

        // @ts-ignore
        let tx = await poolContract.cancel({
          from: account,
        });

        await toast.promise(tx.wait, {
          pending: "Confirming Transaction...",
        });

        let web3 = getWeb3(chainId);
        var response = await web3.eth.getTransactionReceipt(tx.hash);
        if (response != null) {
          if (response.status) {
            toast.success("Transaction confirmed!");
            setCancelLoading(false);
            reload();
          } else if (!response.status) {
            toast.error("Transaction failed!");
            setCancelLoading(false);
          } else {
            toast.error("Something went wrong!");
            setCancelLoading(false);
          }
        }
      } else {
        toast.error("Please Connect to wallet !");
        setCancelLoading(false);
      }
    } catch (err: any) {
      toast.error(err.reason ? err.reason : err.message);
      setCancelLoading(false);
    }
  };

  const validations = Yup.object().shape({
    // saleMethod: Yup.string().label("Sale method"),
    tier1EndTime: Yup.date()
      .required("Tier 1 End Time Required")
      .label("Tier 1 end time")
      .test(
        "tier1EndTime",
        "Tier 1 end time should be greater than start time",
        (value, context) =>
          !value ||
          parseInt((value.getTime() / 1000).toFixed(0)) >= data.start_time
      ),
    // tier2EndTime: Yup.date()
    //   .required("Tier 2 End Time Required")
    //   .nullable()
    //   .label("Tier 2 end time")
    //   .test(
    //     "tier2EndTime",
    //     "Tier 2 end time should be greater than tier 1 end time and not more than presale end time",
    //     (value, context) =>
    //       !value ||
    //       (value > context.parent.tier1EndTime &&
    //         parseInt((value.getTime() / 1000).toFixed(0)) <= data.end_time)
    //   ),
    publicStartTime: Yup.date()
      .required("Public End Time Required")
      .nullable()
      .label("Public Start TIme")
      .test(
        "publicStartTime",
        "Public start time should be greater than or equal Whitlist end time & Less than or equal to End time.",
        (value, context) =>
          !value ||
          (value >= context.parent.tier1EndTime &&
            parseInt((value.getTime() / 1000).toFixed(0)) <= data.end_time)
      ),
  });

  const formik = useFormik({
    initialValues: {
      saleMethod: "Whitelist",
      tier1EndTime: "",
      tier2EndTime: "",
      publicStartTime: "",
    },
    validationSchema: validations,
    onSubmit: async (values, actions) => {
      // handleSubmit(values.)
      if (values.saleMethod === "Whitelist") {
        await handleTierChange(
          moment(values.tier1EndTime).utc().unix(),
          moment(values.tier1EndTime).utc().unix() + 1,
          moment(values.publicStartTime).utc().unix()
        );
      } else {
        await handleTierChange(0, 0, 0);
      }
    },
  });

  const { values, setFieldValue } = formik;

  const renderContribution = useMemo(() => {
    const buttons = [];
    if (
      (data.myContribution || 0) > 0 &&
      moment.unix(parseFloat(String(data.end_time))).isAfter(moment()) &&
      data.poolState === "0"
    ) {
      buttons.push(
        <Button
          onClick={() => {
            handleEmergencyWithdrawContribution();
          }}
          disabled={ewcLoading}
          loading={ewcLoading}
          variant="orange">
          Emergency Withdraw Contribution
        </Button>
      );
    }
    if (
      (moment.unix(parseFloat(String(data.end_time))).isBefore(moment()) &&
        (data.myContribution || 0) > 0 &&
        parseFloat(String(data.total_sold)) <
          parseFloat(String(data.soft_cap))) ||
      (String(data.poolState) == "2" && (data.myContribution || 0) > 0)
    ) {
      buttons.push(
        <Button
          onClick={() => {
            handleWithdrawContribution();
          }}
          disabled={wcLoading}
          loading={wcLoading}
          variant="orange">
          Withdraw Contribution
        </Button>
      );
    }
    if (
      (account?.toLowerCase() === data.poolOwner.toLowerCase() &&
        data.poolState === "1" &&
        (data.myClaim || 0) > 0 &&
        type === "privatesale") ||
      (type !== "privatesale" &&
        data.poolState === "1" &&
        (data.myClaim || 0) > 0)
    ) {
      buttons.push(
        <Button
          onClick={() => {
            handleClaimToken();
          }}
          disabled={claimLoading}
          loading={claimLoading}
          variant="success">
          Claim Token
        </Button>
      );
    }
    if (buttons.length > 0) {
      return (
        <>
          {buttons.map((component, index) => (
            <React.Fragment key={index}>{component}</React.Fragment>
          ))}
        </>
      );
    }
    return <p>No pool actions to show </p>;
  }, [
    account,
    claimLoading,
    data.end_time,
    data.myClaim,
    data.myContribution,
    data.poolOwner,
    data.poolState,
    data.soft_cap,
    data.total_sold,
    ewcLoading,
    handleClaimToken,
    handleEmergencyWithdrawContribution,
    handleWithdrawContribution,
    type,
    wcLoading,
  ]);

  return (
    <>
      {["presale", "fairlaunch", "privatesale"].includes(type) &&
        account?.toLowerCase() === data.poolOwner.toLowerCase() && (
          <div className="mb-8 shadow-boxShadow6  py-12  text-white">
            <p className="text-xl text-primary-green font-medium mb-6 border-b border-secondary-green pb-3">
              Pool Action
            </p>
            <div className="flex flex-col gap-5">
              {data.poolState === "0" && (
                <div className="flex flex-col gap-5">
                  <Button
                    variant="bigGreen"
                    onClick={handleFinalize}
                    loading={finalizeLoading}
                    disabled={finalizeLoading}>
                    Finalize
                  </Button>
                  <Button
                    onClick={handleCancel}
                    disabled={cancelLoading}
                    loading={cancelLoading}
                    variant="bigOutline">
                    Cancel Pool
                  </Button>
                </div>
              )}
              {data.poolData?.liquidityLockDays &&
              data.poolData?.liquidityLockDays > 0 &&
              type !== "privatesale" &&
              moment
                .unix(data.poolData?.endTime)
                .add(data.poolData?.liquidityLockDays, "days")
                .isBefore(moment()) ? (
                <>
                  <Button
                    variant="bigOutline"
                    disabled={withdrawLiquidityLoading}
                    loading={withdrawLiquidityLoading}
                    onClick={() => {
                      executeWithdrawLiquidity();
                    }}>
                    Withdraw Liquidity
                  </Button>
                </>
              ) : (
                <></>
              )}
              {/*<Button variant="orange">Disable whitelist</Button>*/}
            </div>
            <p className="text-xl text-primary-green font-medium mb-6 border-b border-secondary-green pb-3 mt-20">
              Manage Pool
            </p>
            <div className="">
              {type !== "fairlaunch" && data.poolState === "0" && (
                <>
                  {/* <RadioButtonGroup
                    label={"Sale Method"}
                    options={saleMethods}
                    onChange={saleRadioHandler}
                    className="mb-10 "
                    labelAlign="row"
                    selected={data.sale_type.toString()}
                  /> */}
                  {data.sale_type !== "Public" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                      <Button
                        loading={whitelistLoading}
                        onClick={() => handleTierChange(0, 0, 0)}
                        variant="green2">
                        Disable whitelist
                      </Button>
                      {data.publicStartTime &&
                      data.publicStartTime > 0 &&
                      data.poolState === "0" &&
                      moment.unix(data.publicStartTime).isAfter(moment()) &&
                      moment.unix(data.start_time).isBefore(moment()) ? (
                        <>
                          <Button
                            variant="green2"
                            disabled={whitelistLoading}
                            loading={whitelistLoading}
                            onClick={() => {
                              handleWhitelistStatus("Public");
                            }}>
                            Go public
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="green2"
                            className="invisible"
                            disabled={whitelistLoading}
                            loading={whitelistLoading}
                            onClick={() => {
                              handleWhitelistStatus("Public");
                            }}>
                            Go public
                          </Button>
                        </>
                      )}
                      <Button
                        variant={`${deleteMode ? "green2" : "green1"}`}
                        onClick={() => {
                          setDeleteMode(false);
                        }}>
                        Add users
                      </Button>
                      <Button
                        variant={`${deleteMode ? "green1" : "green2"}`}
                        onClick={() => setDeleteMode(true)}>
                        Remove users
                      </Button>
                    </div>
                  )}
                  {data.sale_type == "Public" && (
                    <>
                      <div className="flex">
                        <Button
                          className="max-w-[300px] w-1/2 mr-8 mb-6"
                          loading={whitelistLoading}
                          onClick={() => setEnableWhitelist(!EnableWhitelist)}
                          variant={`${EnableWhitelist ? "green1" : "green2"}`}>
                          Enable whitelist
                        </Button>
                        <Button
                          className="max-w-[300px] w-1/2 invisible"
                          loading={whitelistLoading}
                          onClick={() => setEnableWhitelist(!EnableWhitelist)}
                          variant={`${EnableWhitelist ? "green1" : "green2"}`}>
                          Enable whitelist
                        </Button>
                      </div>
                      {EnableWhitelist && (
                        <>
                          <div className="my-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                            <DateTimePicker
                              label={`Whitelist End Time (UTC)*`}
                              name="tier1EndTime"
                              value={formik.values.tier1EndTime}
                              onChange={(v: any) =>
                                formik.setFieldValue("tier1EndTime", v)
                              }
                              onBlur={formik.handleBlur}
                              error={
                                formik.touched.tier1EndTime &&
                                formik.errors.tier1EndTime
                              }
                            />
                            {/* <DateTimePicker
                              label={`Tier 2 End Time (UTC)*`}

                              name="tier2EndTime"
                              value={formik.values.tier2EndTime}
                              onChange={(v: any) =>
                                formik.setFieldValue("tier2EndTime", v)
                              }
                              onBlur={formik.handleBlur}
                              error={
                                formik.touched.tier2EndTime &&
                                formik.errors.tier2EndTime
                              }
                            /> */}
                            <DateTimePicker
                              label={`Public Start Time (UTC)*`}
                              name="publicStartTime"
                              value={formik.values.publicStartTime}
                              onChange={(v: any) =>
                                formik.setFieldValue("publicStartTime", v)
                              }
                              onBlur={formik.handleBlur}
                              error={
                                formik.touched.publicStartTime &&
                                formik.errors.publicStartTime
                              }
                            />
                          </div>

                          <div>
                            <Button
                              variant="bigGreen"
                              // type="submit"
                              loading={formik.isSubmitting}
                              className={`w-full disabled:opacity-50 ${
                                Object.keys(formik.errors).length != 0
                                  ? "opacity-50"
                                  : ""
                              }`}
                              onClick={() => formik.handleSubmit()}>
                              Set Time
                            </Button>
                          </div>
                        </>
                      )}
                    </>
                  )}
                  {data.sale_type !== "Public" && (
                    <>
                      <div className="mt-8">
                        <MultiValueInput
                          addressArray={addressArray}
                          users={whitelistedUsers}
                          setUsers={setWhitelistedUsers}
                          whitelisted={data.pool_address}
                          tier={tier}
                          deleteMode={deleteMode}
                          PushThisCSV={PushThisCSV}
                        />
                      </div>
                      <div className={`mt-8 flex items-end justify-end`}>
                        {/* {!deleteMode && (
                          <CustomSwitch
                            backGroundClass="bg-[#EB6D65]"
                            label=""
                            options={["1", "2"]}
                            selectedOption={tier}
                            setSelectedOption={(v) => {
                              setTire(v);
                            }}
                          />
                        )} */}
                        <div
                          className={`flex items-end gap-2 text-primary-green cursor-pointer ${
                            deleteMode ? "" : ""
                          }`}
                          onClick={() => setSelectFilePopup(true)}>
                          <p className="text-sm">Upload file</p>
                          <BsUpload size={24} />
                        </div>
                      </div>
                      <div className="mt-8">
                        <Button
                          className=""
                          variant="bigGreen"
                          loading={waddloading}
                          onClick={
                            !deleteMode
                              ? () => handleSetWhitelist({})
                              : handleRemoveWhitelist
                          }>
                          {deleteMode ? "Delete Users" : "Update Whitelist "}
                        </Button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      {/* {["launchpad"].includes(type) && ( */}
      {["airdrop"].includes(type) &&
        account?.toLowerCase() === data.poolOwner.toLowerCase() && (
          <div className="mb-8 shadow-boxShadow6  p-12 border border-primary-green text-white">
            <p className=" text-primary-green text-xl font-medium mb-6 border-b border-secondary-green pb-3">
              Owner zone
            </p>
            <div className="flex flex-col gap-4">
              <Button variant="bigGreen" onClick={setModal}>
                Set Allocations
              </Button>
              <Button
                onClick={() => setShowRemoveUser((prev) => !prev)}
                variant="bigOutline">
                Delete users from whitelist
              </Button>
              <Button
                onClick={() => {
                  handleCancel();
                }}
                disabled={cancelLoading}
                loading={cancelLoading}
                variant="bigOutline">
                Cancel
              </Button>
              {/*<Button>Setting time to public</Button>*/}
              {/*<Button variant="orange">Disable whitelist</Button>*/}
            </div>
          </div>
        )}
      {addUser && ["presale", "privatesale"].includes(type) && (
        <AddUserPopUp
          users={whitelistedUsers}
          setUsers={setWhitelistedUsers}
          setTire={setTire}
          tier={tier}
          handleSubmit={() => handleSetWhitelist({})}
          showModal={addUser}
          setShowModal={closeModal}
          loading={waddloading}
        />
      )}
      {addUser && ["airdrop"].includes(type) && (
        <SetAllocationModal
          showModal={addUser}
          setShowModal={closeModal}
          setAllocations={(AllocationsData: IAllocationDetail[]) =>
            handleSetWhitelist({ allocations: AllocationsData })
          }
          loading={waddloading}
        />
      )}

      {showRemoveUser && (
        <RemoveUserModal
          users={whitelistedUsers}
          handleSubmit={handleRemoveWhitelist}
          setUsers={setWhitelistedUsers}
          showModal={showRemoveUser}
          setShowModal={setShowRemoveUser}
          loading={waddloading}
        />
      )}

      {showTime && (
        <SetTime
          type={type}
          handleSubmit={handleTierChange}
          data={data}
          showModal={showTime}
          setShowModal={setShowTime}
        />
      )}
      {selectFilePopup && (
        <UploadFile
          setCSVData={setCSVData}
          showModal={selectFilePopup}
          setShowModal={setSelectFilePopup}
        />
      )}
    </>
  );
};

export default OwnerZone;
