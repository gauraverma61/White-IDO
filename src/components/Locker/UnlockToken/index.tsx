import React, { useState } from "react";
import lockAbi from "../../../ABIs/Locker/lockerABI.json";
import { CountdownTimer } from "@atoms/CountdownTimer";
import { useRecordStats } from "@components/Locker/Token/hooks/useStats";
import { useRouter } from "next/router";
import { contract } from "@constants/constant";
import moment from "moment";
import useAuth from "@hooks/useAuth";
import { getContract } from "@constants/contractHelper";
import { toast } from "react-toastify";
import { getWeb3 } from "@constants/connectors";
import Button from "@atoms/Button";
import useWidth from "@hooks/useWidth";
import BannerImage from "@public/images/unlockTokenBanner.png";
import { walletNameTrimmer } from "@helpers/walletNameTrimmer";
import { TIME_FORMAT } from "@constants/timeFormats";

const UnlockTokenComp = () => {
  const router = useRouter();
  const address = router.query.id;
  const stats = useRecordStats({
    lockId: Array.isArray(address) ? address[0] : address,
  });

  console.log("stats", stats);

  type ISpacing = { title: string; value: string }[];

  const { account, library, chainId } = useAuth();
  const [ctLoading, setCtLoading] = useState(false);

  const width = useWidth();

  const handleUnlock = async () => {
    setCtLoading(true);
    try {
      if (account && chainId) {
        let lockAddress = contract[chainId]
          ? contract[chainId].lockAddress
          : contract["default"].lockAddress;
        let lockContract = getContract(lockAbi, lockAddress, library);

        // @ts-ignore
        let tx = await lockContract.unlock(stats.id, {
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

  const tokenInfoData: (
    | {
        title: string;
        value: string;
        type: string;
      }
    | {
        title: string;
        value: string;
        type?: undefined;
      }
  )[] = [
    {
      title: "Token Address",
      value: stats.TokenAddress,
      type: "address",
    },
    { title: "Token Name", value: stats.TokenName },
    // { title: "Token Symbol", value: stats.TokenSymbol },
    // { title: "Token Decimals", value: stats.TokenDecimals },
  ];

  const lockInfoData = [
    { title: "Lock Name", value: stats.description },
    {
      title: "Total Locked",
      value: `${stats.amount} ${stats.TokenSymbol.toUpperCase()}`,
    },
    {
      title: "Receiver Address",
      value: stats.owner,
      type: "address",
    },
    {
      title: "Locked At",
      value: moment.unix(stats.lockDate).utc().format(TIME_FORMAT),
    },
    {
      title: "Lock Until",
      value: moment.unix(stats.tgeDate).utc().format(TIME_FORMAT),
    },
    {
      title: "Total Unlocked",
      value: stats.unlockedAmount.toString(),
    },
  ];

  return (
    <>
      <div className="container mx-auto py-20 lg:pt-24">
        <div className="text-5xl mt-4 text-primary-green font-semibold">
          {stats.description}
        </div>
        <div className="px-0 md:px-14 py-10 md:py-16 w-full">
          <div className="text-center text-3xl text-white mb-10">
            {" "}
            Unlocks In
          </div>
          <div className={"w-full justify-center flex"}>
            <CountdownTimer
              date={String(stats.tgeDate)}
              isTimeUnix
              variant={width > 300 ? "unlock" : "simple"}
            />
          </div>
          {account && account.toLowerCase() === stats.owner.toLowerCase() && (
            <div className="flex justify-center">
              <button
                onClick={handleUnlock}
                className="w-full md:max-w-[450px] bg-primary-green  py-6 text-center text-2xl mx-auto mt-16">
                Unlock
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-col xl:flex-row gap-12 md:gap-20">
          <div className="w-full  border border-primary-green px-8 md:px-14 py-10 md:py-16">
            <div className="mb-16">
              <div className="text-primary-green text-3xl mb-10">
                Token Info
              </div>
              <div>
                {tokenInfoData.map((data, index) => {
                  return (
                    <div
                      key={index}
                      className="flex justify-between py-4 border-b border-dull-border last:border-0  ">
                      <div className="text-white text-base">{data.title}</div>
                      <div className="text-primary-green text-base">
                        {data.value
                          ? data.type == "address"
                            ? walletNameTrimmer(data.value)
                            : data.value
                          : "-"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <div className="text-primary-green text-3xl mb-10">Lock Info</div>
              <div>
                {lockInfoData.map((data, index) => {
                  return (
                    <div
                      key={index}
                      className="flex justify-between py-4 border-b border-dull-border last:border-0  ">
                      <div className="text-white text-base">{data.title}</div>
                      <div className="text-primary-green text-base">
                        {data.value
                          ? data.type == "address"
                            ? walletNameTrimmer(data.value)
                            : data.value
                          : "-"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnlockTokenComp;
