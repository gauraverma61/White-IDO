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
const Actions = ({
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
  const [waddloading, setWaddloading] = useState(false);
  const [finalizeLoading, setFinalLoading] = useState(false);
  const [wcLoading, setWcLoading] = useState(false);
  const [whitelistLoading, setWhitelistLoading] = useState(false);
  const [ewcLoading, setEWcLoading] = useState(false);
  const [claimLoading, setCtLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [allocationsData, setAllocationsData] = useState<IAllocationDetail[]>(
    []
  );
  const [whitelistedUsers, setWhitelistedUsers] = useState("");
  const [tier, setTire] = useState("1");
  const [showRemoveUser, setShowRemoveUser] = useState(false);
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
  };
  const handleTierChange = async (
    _endTime1: number,
    _endTime2: number,
    _publicStartTime: number
  ) => {
    try {
      if (account && chainId) {
        if (chainId) {
          if (_endTime1 == 0 && _endTime2 == 0) {
            await _handleTierChange(0, 0, 0);
          } else {
            await _handleTierChange(_endTime1, _endTime2, _publicStartTime);
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
            tx = await poolContract.addWhitelistedUsers(waddress, tier, {
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
      console.error("emergencyWithdrawContribution error", err);
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
          variant="accent-1"
          className="outline outline-2 outline-primary-green">
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
          variant="accent-2">
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
          variant="accent-1"
          className="outline outline-2 outline-primary-green">
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
      {["presale", "fairlaunch", "privatesale"].includes(type) && (
        <div className="mb-8 shadow-boxShadow6  py-8  text-white">
          <p className=" text-primary-green text-xl font-medium mb-6 border-b border-secondary-green pb-2">
            Actions
          </p>
          <div className="flex flex-col gap-4">{renderContribution}</div>
        </div>
      )}
      {["airdrop"].includes(type) && (
        <div className="mb-8 shadow-boxShadow6  py-8  text-white">
          <p className="text-primary-green text-xl font-medium mb-6 border-b border-secondary-green pb-2">
            Actions
          </p>
          <div className="flex flex-col gap-4 mx-4">
            {(data?.myClaim || 0) > 0 ? (
              <Button
                onClick={() => {
                  handleClaimToken();
                }}
                disabled={claimLoading}
                loading={claimLoading}
                variant="accent-1"
                className="outline outline-2 outline-primary-green">
                Claim Token
              </Button>
            ) : (
              <p>No pool actions to show </p>
            )}
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
    </>
  );
};

export default Actions;
