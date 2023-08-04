import React, {
  useState,
  useRef,
  Fragment,
  Dispatch,
  SetStateAction,
} from "react";
import Link from "next/link";
import { TbGridDots } from "react-icons/tb";
import { MdArrowDropDown, MdClose } from "react-icons/md";
import useWidth from "@hooks/useWidth";
import { Popover, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import { supportNetwork } from "@constants/network";
import { walletNameTrimmer } from "@helpers/walletNameTrimmer";
import useAuth from "@hooks/useAuth";
import { toast } from "react-toastify";
import Image from "next/image";
import polygon from "@public/icons/svgs/polygon-matic-logo.svg";
import ether from "@public/icons/svgs/ethereum-mainnet-logo.svg";
import bnb from "@public/icons/svgs/bsc.svg";
import Pariologo from "@public/icons/svgs/pario_logo.svg";
import { Tooltip as ReactTooltip } from "react-tooltip";
interface IProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface IMenu {
  title: string;
  link?: string;
  nestedMenus?: { title: string; link: string }[];
}

interface IPopoverProps {
  title: string;
  subMenu: IMenu[];
}

const HPopover = (props: IPopoverProps) => {
  const { title, subMenu } = props;
  const buttonRef1 = useRef<HTMLButtonElement | null>(null);
  const buttonRef2 = useRef<HTMLButtonElement | null>(null);
  const nestedMenuRef1 = useRef<HTMLButtonElement | null>(null);
  const nestedMenuRef2 = useRef<HTMLButtonElement | null>(null);
  const nestedMenuRef3 = useRef<HTMLButtonElement | null>(null);

  const subRefs = [nestedMenuRef1, nestedMenuRef2, nestedMenuRef3];
  const [openState, setOpenState] = useState(false);
  const [openNestedMenu, setOpenNestedMenu] = useState(false);

  const toggleMenu = () => {
    setOpenState((openState) => !openState);
    if (title === "Launchpad") {
      buttonRef1?.current?.click();
    } else {
      buttonRef2?.current?.click();
    }
  };
  const toggleNestedMenu = (index: number) => {
    setOpenNestedMenu((prev) => !prev);
    subRefs[index]?.current?.click();
  };

  return (
    <Popover className="mx-auto">
      {({ open, close: closeParent }) => (
        <div
          onMouseEnter={() => toggleMenu()}
          onMouseLeave={() => toggleMenu()}
          className="flex flex-col">
          <Popover.Button
            ref={title === "Launchpad" ? buttonRef1 : buttonRef2}
            className={"outline-none border-none"}>
            <div
              className={`cursor-pointer capitalize px-3 py-2 rounded-old-sm hover:bg-card-green-bg3-color ${
                open ? "bg-[#1B2332]" : ""
              }`}>
              <span className="capitalize text-white text-base font-semibold">
                {title}
                <MdArrowDropDown
                  size={20}
                  className={classNames(
                    open ? "rotate-180" : "",
                    " inline-block ml-1",
                    "transform transition-all duration-300"
                  )}
                  aria-hidden="true"
                />
              </span>
            </div>
          </Popover.Button>
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1">
            <Popover.Panel
              static
              className="z-10 min-h-max absolute top-16 bg-card-green-bg-color py-3  border border-tertiary-green-border min-w-fit">
              {subMenu.map((menu, index) => {
                if (menu.link) {
                  return (
                    <Link key={index} href={menu.link}>
                      <div
                        onClick={() => closeParent()}
                        className="submenu flex items-center px-5 py-3 cursor-pointer hover:bg-dull-green text-white">
                        <div className="h-2.5 w-2.5 border border-primary-green rotate-45 mr-2.5 boderedIcon"></div>
                        <div className="h-2.5 w-2.5 bg-primary-green rotate-45 mr-2.5 solidIcon"></div>
                        <div className="text-base font-semibold">
                          {menu.title}
                        </div>
                      </div>
                    </Link>
                  );
                } else {
                  return (
                    <Popover key={index}>
                      {({ open, close }) => (
                        <div
                          onMouseEnter={() => toggleNestedMenu(index)}
                          onMouseLeave={() => toggleNestedMenu(index)}
                          className="flex flex-col relative">
                          <Popover.Button
                            ref={subRefs[index]}
                            className="outline-none border-none">
                            <div
                              className={`submenu flex items-center px-5 py-3 cursor-pointer hover:bg-dull-green text-white ${
                                open ? "bg-[#1B2332]" : ""
                              }`}>
                              <div className="h-2.5 w-2.5 border border-primary-green rotate-45 mr-2.5 boderedIcon"></div>
                              <div className="h-2.5 w-2.5 bg-primary-green rotate-45 mr-2.5 solidIcon"></div>
                              <div className="text-base font-semibold">
                                {menu.title}
                              </div>
                              <MdArrowDropDown
                                size={20}
                                className={classNames(
                                  open ? "rotate-0" : "-rotate-90",
                                  "inline-block",
                                  "transform transition-all duration-300",
                                  "ml-auto"
                                )}
                                aria-hidden="true"
                              />
                            </div>
                          </Popover.Button>
                          <Transition
                            show={open}
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1">
                            <Popover.Panel
                              static
                              className="z-10 min-h-max absolute top-2 left-44 bg-card-green-bg-color py-3  border border-tertiary-green-border min-w-fit">
                              {menu.nestedMenus?.map((menu, index) => (
                                <Link key={index} href={menu.link}>
                                  <div
                                    onClick={() => {
                                      close();
                                      closeParent();
                                    }}
                                    className="submenu flex items-center px-5 py-3 cursor-pointer hover:bg-dull-green text-white">
                                    <div className="h-2.5 w-2.5 border border-primary-green rotate-45 mr-2.5 boderedIcon flex-shrink-0"></div>
                                    <div className="h-2.5 w-2.5 bg-primary-green rotate-45 mr-2.5 solidIcon flex-shrink-0"></div>
                                    <div className="text-base font-semibold whitespace-nowrap">
                                      {menu.title}
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </Popover.Panel>
                          </Transition>
                        </div>
                      )}
                    </Popover>
                  );
                }
              })}
            </Popover.Panel>
          </Transition>
        </div>
      )}
    </Popover>
  );
};

const LinKTab = ({ title, link }: { title: string; link: string }) => {
  return (
    <Link href={link}>
      <p className="cursor-pointer capitalize px-3 py-2 rounded-old-sm hover:bg-card-green-bg3-color text-white text-base font-semibold">
        {title}
      </p>
    </Link>
  );
};

const NewHeader = (props: IProps) => {
  const { setIsDrawerOpen, isDrawerOpen } = props;
  const {
    connect,
    isLoggedIn,
    account,
    loading: connecting,
    balance_formatted,
    chainId,
    ethereum,
    disconnect,
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

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const toggleMenu = () => {
    buttonRef?.current?.click();
  };
  // lg:px-16 2xl:px-20
  return (
    <div className="flex justify-between items-center bg-gray10 py-3 px-6 lg:px-12  fixed top-0 w-full z-50 border-b border-tertiary-green-border">
      <div className="flex justify-between gap-4 items-center w-full">
        <div className="flex gap-4 items-center">
          <div
            className="cursor-pointer text-white"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
            {isDrawerOpen ? <MdClose size={32} /> : <TbGridDots size={32} />}
          </div>
          <Link href={"/"}>
            <div className="hidden md:flex gap-2 items-center cursor-pointer">
              <Image src={Pariologo} alt="Pario" />
            </div>
          </Link>
        </div>
        <Link href={"/"}>
          <div className="gap-2 flex md:hidden items-center cursor-pointer">
            <Image src={Pariologo} alt="Pario" />
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center text-sm " id={"network-info"}>
              {chainId ? (
                <div className="flex items-center gap-2 py-2 px-3.5 rounded-old-full bg-green5 text-tertiary-green">
                  <div className="flex items-center">
                    <Image
                      width={20}
                      height={20}
                      src={networkIcon()}
                      alt="network-icon"
                    />
                  </div>
                  <div className="font-normal">
                    {supportNetwork[chainId || "default"]?.name}
                  </div>
                </div>
              ) : (
                <div className="flex items-center font-normal gap-2 py-3 px-2  border border-green5 text-white">
                  Select Network
                </div>
              )}
            </div>
            <ReactTooltip
              anchorId={"network-info"}
              place="bottom"
              className="max-w-sm"
              content={
                "Change the network from Metamask. Supported networks are : Polygon, BSC and Arbitrum."
              }
            />

            {!isLoggedIn || !account ? (
              <button
                className="flex justify-center items-center bg-primary-green w-max rounded-old-full py-2 px-2.5 text-sm"
                disabled={connecting}
                onClick={walletconnectHandler}>
                {"Connect Wallet"}
              </button>
            ) : (
              <Popover className="relative">
                {({ open }) => (
                  <div
                    onMouseEnter={() => toggleMenu()}
                    onMouseLeave={() => toggleMenu()}>
                    <Popover.Button
                      ref={buttonRef}
                      className={`
                ${open ? "" : "text-opacity-90"}
                group inline-flex items-center rounded-old-full text-base font-medium text-white hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}>
                      <div className="flex items-center px-3 py-2 bg-green5 text-tertiary-green  rounded-old-full cursor-pointer">
                        <div>
                          <div className="text-xs font-normal">
                            {walletNameTrimmer(account)}
                          </div>
                          {chainId && (
                            <div className="text-xs font-normal text-center ">
                              {balance_formatted.toFixed(6)}{" "}
                              <span className="">
                                {supportNetwork[chainId]?.symbol}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Popover.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1">
                      <Popover.Panel className="z-10 min-h-max absolute top-16 bg-card-green-bg-color py-1  border border-tertiary-green-border min-w-fit">
                        <div
                          onClick={disconnect}
                          className="submenu flex items-center px-5 py-3 cursor-pointer hover:bg-dull-green text-white">
                          <div className="h-2.5 w-2.5 border border-primary-green rotate-45 mr-2.5 boderedIcon"></div>
                          <div className="h-2.5 w-2.5 bg-primary-green rotate-45 mr-2.5 solidIcon"></div>
                          <div className="text-base font-semibold">Logout</div>
                        </div>
                      </Popover.Panel>
                    </Transition>
                  </div>
                )}
              </Popover>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewHeader;
