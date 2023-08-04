import { trimAddress } from "@constants/constant";
import { getExplorerLink } from "@helpers/getExplorerLink";
import useAuth from "@hooks/useAuth";
import React from "react";
import { AiOutlineCopy } from "react-icons/ai";
import { toast } from "react-toastify";
import CopyIcon from "@public/icons/CopyIcon.svg";
import Image from "next/image";

interface ICopyAddress {
  containerClass?: string;
  addressClass?: string;
  iconSize?: number;
  address: string;
  scale?: boolean;
  type?: "address" | "tx";
}

const CopyAddress: React.FC<ICopyAddress> = ({
  containerClass,
  addressClass,
  iconSize,
  address,
  type,
  scale = true,
}) => {
  const { chainId } = useAuth();
  const addressCopyHandler = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success(`Address Copied`);
  };
  return (
    <div className={`flex items-center ${containerClass}`}>
      <a
        className="mr-2.5"
        target="_blank"
        href={getExplorerLink(address, chainId, type)}
        rel="noopener noreferrer">
        <span
          className={`hover:underline w-full ${addressClass} text-primary-green`}>
          {trimAddress(address)}
        </span>
      </a>
      <span
        style={{ height: `${iconSize}px` }}
        onClick={() => addressCopyHandler(address)}
        className="relative">
        <Image
          height={iconSize}
          src={CopyIcon}
          className={`${
            scale ? "hover:scale-110" : "hover:text-primary-green"
          } cursor-pointer `}
        />
      </span>
      {/* <AiOutlineCopy
        onClick={() => addressCopyHandler(address)}
        size={iconSize ? iconSize : 22}
        className={`ml-2 cursor-pointer ${
          scale ? "hover:scale-110" : "hover:text-primary-green"
        } transform duration-100 text-white`}
      /> */}
    </div>
  );
};

export default CopyAddress;
