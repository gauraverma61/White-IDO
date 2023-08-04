import Button from "@atoms/Button";
import useWidth from "@hooks/useWidth";
import React, { useEffect, useMemo, useState } from "react";
import { Line } from "rc-progress";
import { CountdownTimer } from "@atoms/CountdownTimer";
import { DetailsType, IPoolDetailsData } from "@components/Details";
import { getWeb3 } from "@constants/connectors";
import {
  approveTokens,
  getContract,
  mulDecimal,
} from "@constants/contractHelper";
import { supportNetwork } from "@constants/network";
import useAuth from "@hooks/useAuth";
import { parseEther } from "ethers/lib/utils";
import { toast } from "react-toastify";
import presalePoolAbi from "../../../ABIs/PresalePool/PresalePool.json";
import { useRouter } from "next/router";
import moment from "moment";
import useTokenInfo from "@hooks/useTokenInfo";
import RangeInput from "@atoms/RangeInputV2";

interface ISaleDetail {
  isSaleLive?: boolean;
  className?: string;
  status?: string;
  totalToken: number;
  tokenSymbol: string;
  tokenSold: number;
  startTime: string;
  endTime: string;
  type: DetailsType;
  data: IPoolDetailsData;
}

interface ITimeComp {
  value: number | string;
  unit: string;
}

const TimerComp: React.FC<ITimeComp> = ({ value, unit }) => {
  return (
    <div className="flex flex-col text-base font-medium">
      <span className="font-medium text-xl sm:text-2xl">{value}</span>
      <span className="text-gray9 text-sm">{unit}</span>
    </div>
  );
};

const BuySection = ({ data }: { data: IPoolDetailsData }) => {
  const {
    chainId,
    balance_formatted,
    balance,
    account,
    library,
    connect,
    ethereum,
  } = useAuth();
  const [amount, setAmount] = useState(0);
  const [btndisabled, setBtndisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error_msg, setError_msg] = useState("");
  const router = useRouter();

  const {
    tokenSymbol: paymentCurrencySymbol,
    tokenBalance,
    decimals,
    fetchTokenError,
    fetchtokenDetail,
    fetchTokenBalance,
  } = useTokenInfo({
    tokenAddress: data?.poolData?.payment_currency?.id || "",
    ethereum,
  });

  useEffect(() => {
    if (
      data?.poolData?.payment_currency?.id &&
      data?.poolData?.payment_currency?.id !==
        "0x0000000000000000000000000000000000000000"
    ) {
      fetchtokenDetail();
      fetchTokenBalance();
    }
  }, [data?.poolData?.payment_currency?.id, account]);
  const handleChangeAmount = (e: any) => {
    setAmount(e.target.value);

    if (isNaN(e.target.value)) {
      setError_msg("please enter valid amount");
      setBtndisabled(true);
    } else if (parseFloat(e.target.value) === 0 || e.target.value === "") {
      setError_msg("amount must be greater than zero");
      setBtndisabled(true);
    } else if (
      parseFloat(e.target.value) < data.min_buy ||
      parseFloat(e.target.value) > data.max_buy
    ) {
      setError_msg(
        `amount must be between ${data.min_buy} and ${data.max_buy}`
      );
      setBtndisabled(true);
    } else {
      setError_msg("");
      setBtndisabled(false);
    }
    return;
  };

  const handleMaxAmount = () => {
    let maxamount = balance_formatted;
    if (maxamount < data.min_buy) {
      setError_msg(
        `amount must be between ${data.min_buy} and ${data.max_buy}`
      );
      setBtndisabled(true);
    }
    if (maxamount > data.max_buy) maxamount = data.max_buy;
    setAmount(parseFloat(maxamount.toFixed(4).toString()));
  };

  const handleSubmitContribution = async () => {
    setLoading(true);

    try {
      if (amount > 0 && amount < data.min_buy) {
        toast.error("Minimum buy is not valid");
        setLoading(false);
        return;
      } else if (amount > 0 && amount > data.max_buy) {
        toast.error("Maximum buy is not valid");
        setLoading(false);
        return;
      }
      if (amount > 0 && (data.max_buy > amount || data.min_buy < amount)) {
        if (account) {
          if (chainId) {
            if (balance_formatted >= amount) {
              let poolContract = getContract(
                presalePoolAbi,
                data.pool_address,
                library
              );
              const finalAmount = mulDecimal(
                amount,
                data?.poolData?.payment_currency?.decimals || 18
              ).toString();
              let nativeAmount = mulDecimal(
                amount,
                data?.poolData?.payment_currency?.decimals || 18
              ).toString();

              if (
                data?.poolData?.payment_currency?.id &&
                data?.poolData?.payment_currency?.id !==
                  "0x0000000000000000000000000000000000000000"
              ) {
                nativeAmount = "0";
                const approved = await approveTokens({
                  token: data?.poolData?.payment_currency?.id || "",
                  library,
                  account,
                  chainId,
                  amount: finalAmount,
                  spender: data.pool_address,
                });
                if (!approved) {
                  setLoading(false);
                  return;
                }
              }

              // @ts-ignore
              let tx = await poolContract.contribute(finalAmount, {
                from: account,
                value: nativeAmount,
              });
              await toast.promise(tx.wait, {
                pending: "Confirming Transaction...",
              });

              let web3 = getWeb3(chainId);
              var response = await web3.eth.getTransactionReceipt(tx.hash);
              if (response != null) {
                if (response.status) {
                  toast.success("Transaction confirmed!");
                  setLoading(false);
                  router.reload();
                } else if (!response.status) {
                  toast.error("Transaction failed!");
                  setLoading(false);
                } else {
                  toast.error("Something went wrong!");
                  setLoading(false);
                }
              }
            } else {
              toast.error("you don't have enough balance !");
              setLoading(false);
            }
          } else {
            toast.error("Please connect your wallet");
            setLoading(false);
          }
        } else {
          toast.error("Please connect your wallet");
          setLoading(false);
        }
      } else {
        toast.error("Please Enter Valid Amount !");
        setLoading(false);
      }
    } catch (err: any) {
      toast.error(err.reason);
      setLoading(false);
    }
  };
  return (
    <>
      <div className="flex justify-between w-full  border border-primary-green bg-secondary-dark mt-4 h-[73px] py-2.5">
        <input
          value={amount}
          onChange={handleChangeAmount}
          type="number"
          className="pl-6 outline-none pr-0  w-full text-primary-green placeholder:text-primary-green h-auto"
        />
        <div className="px-3 flex items-center border-l border-dull-border flex-shrink-0">
          <p
            className="cursor-pointer font-semibold uppercase text-quaternary-green"
            onClick={handleMaxAmount}>
            MAX
          </p>
          {/*<Image src={ETHIcon} className={"flex-shrink-0"} alt={"icon"} />*/}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row text-[#035703] justify-between text-lg mt-1 ">
        <p className=" ">{"Your Balance"}</p>
        {data.poolData?.payment_currency?.id &&
        data.poolData?.payment_currency?.id !==
          "0x0000000000000000000000000000000000000000" ? (
          <span>
            {(
              parseFloat(String(tokenBalance || 0)) /
              10 ** Number(data?.poolData?.payment_currency?.decimals || 18)
            ).toString()}{" "}
            {paymentCurrencySymbol}
          </span>
        ) : (
          <span>
            {balance_formatted} {supportNetwork[chainId || "default"]?.symbol}
          </span>
        )}
      </div>
      <RangeInput
        className="mt-8"
        value={amount}
        setValue={setAmount}
        min={data.min_buy}
        max={data.max_buy}
        step={(data.max_buy - data.min_buy) / 100}
      />
      {account ? (
        <Button
          variant="accent-2"
          disabled={
            loading ||
            (data.sale_type === "Whitelist" &&
              !data.userWhitelisted &&
              moment.unix(Number(data.publicStartTime)).isAfter(moment().utc()))
          }
          loading={loading}
          className="w-full mt-8"
          onClick={() => {
            handleSubmitContribution();
          }}>
          Buy Now
        </Button>
      ) : (
        <Button
          variant="accent-2"
          className="w-full mt-8"
          onClick={() => {
            connect();
          }}>
          Connect Wallet
        </Button>
      )}
    </>
  );
};

const SaleDetailsCard: React.FC<ISaleDetail> = ({
  isSaleLive,
  status,
  className,
  tokenSold,
  totalToken,
  startTime,
  endTime,
  tokenSymbol,
  data,
  type,
}) => {
  const router = useRouter();
  const width = useWidth();
  // const percent = (tokenSold / totalToken) * 100;
  const { account } = useAuth();
  const percent = useMemo(() => {
    let percent;
    if (type == "fairlaunch") {
      if (tokenSold > totalToken) {
        percent = (totalToken / tokenSold) * 100;
      } else {
        percent = (tokenSold / totalToken) * 100;
      }
    } else {
      percent = (tokenSold / totalToken) * 100;
    }
    return percent;
  }, [type, tokenSold, totalToken]);

  const PickTime = useMemo(() => {
    let starttime, endtime;
    if (data.tier1 || data.tier2) {
      if (data.userWhitelisted) {
        if (data.userTier == 2 && data.tier2) {
          starttime = data.tier2.start_time
            ? moment.unix(Number(data.tier2.start_time)).toString()
            : startTime;
          endtime = data.tier2.end_time
            ? moment.unix(Number(data.tier2.end_time)).toString()
            : endTime;
        } else {
          starttime = data.tier1?.start_time
            ? moment.unix(Number(data.tier1?.start_time)).toString()
            : startTime;
          endtime = data.tier2
            ? moment.unix(Number(data.tier2.end_time)).toString()
            : endTime;
        }
        if (
          data.tier2 &&
          moment(moment.unix(Number(data?.tier2.end_time)).toString()).isBefore(
            moment().utc()
          )
        ) {
          starttime = moment.unix(Number(data.publicStartTime)).toString();
          endtime = endTime;
        }
      } else {
        starttime = data.publicStartTime
          ? moment.unix(Number(data.publicStartTime)).toString()
          : startTime;
        endtime = endTime;
      }
    } else {
      starttime = startTime;
      endtime = endTime;
    }

    if (moment(starttime).isAfter(moment().utc())) {
      return starttime;
    } else {
      return endtime;
    }
  }, [endTime, startTime, data]);

  return (
    <>
      {type === "airdrop" && (
        <div
          className={`grid gap-4 shadow-boxShadow6 text-white h-max ${
            status === "airdrop live"
              ? "sm:grid-cols-2 sm:divide-x divide-greenV3  border-2"
              : ""
          } border text-white border-greenV3   rounded-old-3xl px-4 py-6 sm:p-6 ${className}`}>
          {status !== "upcoming" ? (
            <div className={`flex flex-col justify-between`}>
              <h1 className="font-medium text-primary-green text-3xl sm:text-4xl">{`${tokenSold} ${tokenSymbol}`}</h1>
              {tokenSold === 0 ? (
                <div className="w-full bg-[#032E20] rounded-old-full h-2" />
              ) : (
                <Line
                  percent={percent}
                  strokeWidth={2}
                  strokeColor="var(--primary-green)"
                  trailWidth={2}
                  trailColor={"#032E20"}
                />
              )}
              <div className="flex justify-between mt-2">
                <span className="text-sm font-medium ">{`${tokenSold} ${tokenSymbol}`}</span>
                <span className="text-sm font-medium  text-right">{`${totalToken} ${tokenSymbol}`}</span>
              </div>
            </div>
          ) : (
            <></>
          )}
          {status === "upcoming" ? (
            <>
              <p className="text-center text-base sm:text-lg font-semibold">
                {"Airdrop starts in"}
              </p>
              <CountdownTimer
                className="justify-center"
                variant={"new-box"}
                date={PickTime}
                callback={() => {
                  router.reload();
                }}
              />
            </>
          ) : status === "airdrop live" ? (
            <div className={"flex items-center sm:pl-5"}>
              <p className="text-base sm:text-lg font-semibold">
                {"Airdrop has been started"}
              </p>
            </div>
          ) : (
            <div className={"flex items-center sm:pl-5"}>
              <p className="text-base sm:text-lg font-semibold">
                {"Airdrop has been ended"}
              </p>
            </div>
          )}
        </div>
      )}
      {type !== "airdrop" && (
        <div
          className={`flex flex-col shadow-boxShadow6 h-max ${
            status === "sale live" ? "sm:grid-cols-2" : ""
          }  border text-white border-greenV3   px-4 py-6 sm:p-8  bg-[#000E00] ${className}`}>
          {status !== "sale ended" ? (
            <div className={`${status === "upcoming" ? "" : ""} mb-8`}>
              {status === "upcoming" ? (
                <>
                  <p className="text-lg sm:text-2xl text-center text-primary-green font-regular mb-4 pt-6">
                    {"Presale starts in"}
                  </p>
                  <CountdownTimer
                    className="w-full justify-center"
                    variant={"new-box"}
                    date={PickTime}
                    callback={() => {
                      router.reload();
                    }}
                  />
                </>
              ) : (
                <>
                  <p className="text-lg md:text-3xl font-regular text-primary-green mb-4 text-center">
                    {"Presale ends in"}
                  </p>
                  <CountdownTimer
                    className="w-full"
                    variant={"new-box"}
                    date={PickTime}
                  />
                </>
              )}
            </div>
          ) : (
            <></>
          )}
          {status !== "upcoming" ? (
            <div className={`flex flex-col justify-start gap-2`}>
              {status === "sale ended" && (
                <h1 className="font-medium text-primary-green mb-2 text-3xl sm:text-4xl">{`${tokenSold} ${tokenSymbol}`}</h1>
              )}
              <div className="flex justify-between">
                <span className="text-sm font-medium">{`${tokenSold} ${tokenSymbol}`}</span>
                <span className="text-sm font-medium text-right">{`${totalToken} ${tokenSymbol}`}</span>
              </div>
              {tokenSold === 0 ? (
                <div className="w-full bg-[#032E20] rounded-old-full h-2" />
              ) : (
                <Line
                  percent={percent}
                  strokeWidth={2}
                  strokeColor="var(--primary-green)"
                  trailWidth={2}
                  trailColor={"#032E20"}
                />
              )}
            </div>
          ) : (
            <></>
          )}
          {type == "fairlaunch"
            ? status === "sale live" && (
                <div className="sm:col-span-2 mt-4">
                  <BuySection data={data} />
                </div>
              )
            : status === "sale live" &&
              data.hard_cap &&
              data.hard_cap > data.total_sold && (
                <div className="sm:col-span-2 mt-4">
                  <BuySection data={data} />
                </div>
              )}
          {type !== "fairlaunch" &&
            status == "sale live" &&
            data.poolOwner == account?.toLowerCase() &&
            data.hard_cap &&
            data.hard_cap <= data.total_sold && (
              <div className="flex col-span-2 justify-center text-center items-center my-3 alert alert-success py-2 text-white">
                {
                  "Your Presale is successful, please click on 'Finalize' in the pool action to Finalize the pool."
                }
              </div>
            )}
          {data.sale_type === "Whitelist" &&
            !data.userWhitelisted &&
            account &&
            moment
              .unix(Number(data.publicStartTime))
              .isAfter(moment().utc()) && (
              <div className="flex  justify-center text-center items-center my-3 alert alert-error p-2 border border-primary-red text-white bg-secondary-red">
                {"You're not whitelisted, You can not purchase the tokens!"}
              </div>
            )}
          {data.sale_type === "Whitelist" && data.userWhitelisted && (
            <div className="flex  justify-center text-center items-center my-3 alert alert-success p-2 bg-primary-green text-black">
              {"You're Whitelisted, You can purchase the tokens"}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SaleDetailsCard;
