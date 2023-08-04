import React from "react";
import useAuth from "@hooks/useAuth";
import { AiOutlineCopy } from "react-icons/ai";
import Button from "@atoms/Button";
import useWidth from "@hooks/useWidth";
import { walletNameTrimmer } from "@helpers/walletNameTrimmer";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { supportNetwork } from "@constants/network";

const MeComp = () => {
  const { account, disconnect, balance_formatted, chainId } = useAuth();
  const width = useWidth();
  const router = useRouter();

  const addressCopyHandler = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      toast.success("Address Copied");
    }
  };

  const logoutHandler = () => {
    disconnect();
    console.log("logouting");

    router.push("/");
  };

  return (
    <div className="container mx-auto pt-32 py-20 md:px-10 ">
      <div className="w-full border-1 border-bordergraylight rounded-old-md p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center font-normal text-xl ">
          <div className="text-white">Connected as</div>
          <div className="font-medium lg:ml-2 flex text-primary-green">
            {width > 766 ? account : walletNameTrimmer(account)}
            <AiOutlineCopy
              onClick={addressCopyHandler}
              size={30}
              className="ml-2 cursor-pointer"
            />
          </div>
        </div>
        {chainId && (
          <div className="font-normal text-xl text-primary-green">
            {balance_formatted} {supportNetwork[chainId]?.symbol}
          </div>
        )}
        <div className="w-full h-1 border-b border-bordergraylight mx-3 my-10"></div>
        <Button
          variant="accent-2"
          className=" cursor-pointer bg-[#02EEAB] text-black md:max-w-[300px] font-medium"
          onClick={logoutHandler}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default MeComp;
