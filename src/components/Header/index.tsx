import React, { Dispatch, SetStateAction } from "react";
import circleIcon from "@public/icons/svgs/circle-logo.svg";
import walletIcon from "@public/icons/svgs/walleticon.svg";
import hamburgerMenuIcon from "@public/icons/svgs/hamburgermenulogo.svg";
import hamburgerOpenIcon from "@public/icons/svgs/hamburger2.svg";
import useAuth from "@hooks/useAuth";
import Button from "@atoms/Button";
import { walletNameTrimmer } from "@helpers/walletNameTrimmer";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { supportNetwork } from "@constants/network";
import useWidth from "@hooks/useWidth";
import { toast } from "react-toastify";
import polygon from "@public/icons/svgs/polygon-matic-logo.svg";
import ether from "@public/icons/svgs/ethereum-mainnet-logo.svg";
import bnb from "@public/icons/bnc.png";
import { SupportedNetworksArray } from "@providers/UseWalletProvider";

interface IProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

const HeaderComp = (props: IProps) => {
  const { setIsDrawerOpen, isDrawerOpen } = props;
  const {
    connect,
    isLoggedIn,
    account,
    loading: connecting,
    balance_formatted,
    chainId,
    ethereum,
  } = useAuth();
  const router = useRouter();
  const width = useWidth();

  const walletconnectHandler = () => {
    if (window.ethereum) {
      connect();
    } else {
      if (width > 1000) {
        toast.error("Install Metamask");
      } else {
        console.log("to download metamask");
        router.push("https://metamask.io/download");
      }
    }
  };
  const networkIcon = () => {
    // @ts-ignore
    switch (supportNetwork[chainId]?.symbol) {
      case "MATIC":
        return polygon;
      case "BNB":
        return bnb;
      case "ETH":
        return ether;
      default:
        return bnb;
    }
  };

  return (
    <div
      className={`sticky top-0 z-[60] bg-white border-b-2 py-2 2xl:py-3 w-full flex items-center justify-between px-6  h-[75px]`}>
      <div className="flex flex-1 items-center justify-between md:justify-start ">
        <div
          className="flex cursor-pointer"
          onClick={() => setIsDrawerOpen((prev: boolean) => !prev)}>
          {isDrawerOpen ? (
            <div className="h-[22px] w-[22px] relative">
              <Image
                layout="fill"
                objectFit="fill"
                src={hamburgerOpenIcon}
                alt=""
              />
            </div>
          ) : (
            <div className="h-[22px] w-[22px] relative">
              <Image
                layout="fill"
                objectFit="fill"
                src={hamburgerMenuIcon}
                alt=""
              />
            </div>
          )}
        </div>
        <Link href={"/"}>
          <div className="h-[22px] w-[22px] relative md:mx-5 lg:mx-9  cursor-pointer">
            <Image layout="fill" objectFit="fill" src={circleIcon} alt="" />
          </div>
        </Link>
      </div>
      <div className="hidden md:flex items-center">
        <div className="flex items-center bg-bordergraylight px-4 py-1 mr-3 rounded-old-full cursor-pointer">
          {chainId && SupportedNetworksArray.includes(chainId) ? (
            <div className="flex items-center py-2 gap-2">
              <div>
                <Image
                  width={25}
                  height={25}
                  src={networkIcon()}
                  alt="network-icon"
                />
              </div>
              <span className="font-bold">
                {supportNetwork[chainId || "default"]?.name}
              </span>
            </div>
          ) : (
            <div className="py-2">Select Network</div>
          )}
        </div>
        {!isLoggedIn || !account ? (
          <Button
            className="rounded-old-full text-base py-2.5 min-w-[140px]"
            variant="primary-xs"
            disabled={connecting}
            onClick={walletconnectHandler}
            loading={connecting}>
            {"Connect"}
          </Button>
        ) : (
          <div
            onClick={() => router.push("/me")}
            className="flex items-center bg-bordergraylight px-4 py-1  rounded-old-full cursor-pointer">
            <div>
              <div className="text-sm font-medium">
                {walletNameTrimmer(account)}
              </div>
              {chainId && (
                <div className="text-sm font-medium text-center ">
                  {balance_formatted.toFixed(6)}{" "}
                  <span className="font-semibold ">
                    {supportNetwork[chainId]?.symbol}
                  </span>
                </div>
              )}
            </div>
            <div className="ml-2 h-[22px] w-[22px] relative">
              <Image layout="fill" objectFit="fill" src={walletIcon} alt="" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderComp;
