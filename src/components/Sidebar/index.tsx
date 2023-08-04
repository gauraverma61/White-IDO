import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import airbaloonIcon from "@public/icons/svgs/sidebar/airdrop.svg";
import crownIcon from "@public/icons/svgs/crownicon.svg";
import lockIcon from "@public/icons/svgs/sidebar/lock.svg";
import shieldIcon from "@public/icons/svgs/sidebar/shield.svg";
import spaceshipIcon from "@public/icons/svgs/sidebar/launchpad.svg";
import usersIcon from "@public/icons/svgs/sidebar/kyc.svg";
import createIcon from "@public/icons/svgs/create.svg";
import Accordian from "@molecules/Accordian";
import useAuth from "@hooks/useAuth";
import { walletNameTrimmer } from "@helpers/walletNameTrimmer";
import { useRouter } from "next/router";
import useWidth from "@hooks/useWidth";
import { toast } from "react-toastify";
import { Popover, Transition } from "@headlessui/react";
import {
  BiListCheck,
  BiListPlus,
  BiLock,
  BiLockOpen,
  BiLockOpenAlt,
  BiPlusCircle,
  BiRocket,
} from "react-icons/bi";
import { DEFAULT_CHAIN_ID } from "@providers/UseWalletProvider";
import { BsFacebook, BsTwitter, BsGlobe, BsDiscord } from "react-icons/bs";
import { GiAirBalloon } from "react-icons/gi";
import { IconType } from "react-icons/lib";
import {
  FaGithub,
  FaInstagram,
  FaReddit,
  FaTelegramPlane,
} from "react-icons/fa";
import { supportNetwork } from "@constants/network";
import { IoWalletOutline } from "react-icons/io5";
import { SiGitbook } from "react-icons/si";

interface IProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

const sideBarMenu = (chain_id?: number) => {
  const chainId = chain_id || DEFAULT_CHAIN_ID;
  return [
    {
      title: "Launchpad",
      haveSubmenu: true,
      submenu: [
        {
          title: "Launch Token",
          icon: <BiRocket size={18} className="mr-3" />,
          link: `/launchpad/create?blockchain=${chainId}`,
        },
        {
          title: "Browse ParioPad",
          icon: <BiListCheck size={18} className="mr-3" />,
          link: `/launchpad/list?blockchain=${chainId}`,
        },
      ],
    },
    {
      title: "Pario Lock",
      haveSubmenu: true,
      submenu: [
        {
          title: "Lock Token",
          icon: <BiLock size={18} className="mr-3" />,
          link: `/pario-lock/lock?blockchain=${chainId}`,
        },
        {
          title: "Unlock Tokens",
          icon: <BiLockOpenAlt size={18} className="mr-3" />,
          link: `/pario-lock/unlock?blockchain=${chainId}`,
        },
      ],
    },
    {
      title: "Airdrop",
      haveSubmenu: true,
      submenu: [
        {
          title: "Create Airdrop",
          icon: <GiAirBalloon size={18} className="mr-3" />,
          link: `/airdrop/create?blockchain=${chainId}`,
        },
        {
          title: "Browse Airdrop",
          icon: <BiListCheck size={18} className="mr-3" />,
          link: `/airdrop/list?blockchain=${chainId}`,
        },
      ],
    },
    {
      title: "Dashboard",
      icon: crownIcon,
      link: `/dashboard?blockchain=${chainId}`,
    },
    {
      title: "Multisender",
      icon: crownIcon,
      link: `/bulk-sender?blockchain=${chainId}`,
    },
    {
      title: "Docs",
      link: "https://pario.gitbook.io/pario/",
      icon: SiGitbook,
    },
  ];
};

interface ISubmenu {
  title: string;
  link?: string;
  haveNestedMenu?: boolean;
  icon?: any;
  nestedMenus?: { title: string; link: string }[];
}
interface ISideBarListComp {
  title: string;
  icon?: any;
  haveSubmenu?: boolean;
  submenu?: ISubmenu[];
  link?: string;
  handleDrawer: (value: boolean) => void;
  selectedTab: string;
  setSelectedTab: (value: string) => void;
}

const SocialMediaItems = [
  // {
  //   title: "Website",
  //   link: "/",
  //   icon: BsGlobe,
  // },
  // {
  //   title: "Reddit",
  //   link: "/",
  //   icon: FaReddit,
  // },
  {
    title: "Twitter",
    link: "/",
    icon: BsTwitter,
  },
  // {
  //   title: "Instagram",
  //   link: "/",
  //   icon: FaInstagram,
  // },
  // {
  //   title: "Github",
  //   link: "/",
  //   icon: FaGithub,
  // },
  // {
  //   title: "Facebook",
  //   link: "/",
  //   icon: BsFacebook,
  // },
  {
    title: "Discord",
    link: "/",
    icon: BsDiscord,
  },
  {
    title: "Telegram",
    link: "/",
    icon: FaTelegramPlane,
  },
];

const SocialIcon = ({
  title,
  link,
  icon,
}: {
  title: string;
  link: string;
  icon: IconType;
}) => {
  const Icon = icon;
  return (
    <a href={link} key={title}>
      <Icon
        className="hover:scale-125 transform transition duration-500"
        size={18}
        color="#fff"
      />
    </a>
  );
};

const SideBarListComp = (props: ISideBarListComp) => {
  const router = useRouter();
  const width = useWidth();

  const {
    title,
    icon,
    haveSubmenu,
    submenu,
    link,
    handleDrawer,
    selectedTab,
    setSelectedTab,
  } = props;

  const linkHandler = (link: string, menutitle: string) => {
    router.push(link);
    handleDrawer(false);
    setSelectedTab(link);
  };
  return (
    <>
      {haveSubmenu ? (
        <Accordian
          title={title}
          icon={icon}
          defaultOpen={true}
          // defaultOpen={[...(submenu?.map((s) => s.link) ?? [])].includes(
          //   selectedTab
          // )}
        >
          <ul>
            {submenu?.map((menu, index) => {
              if (menu.link) {
                return (
                  <div
                    key={index}
                    className={`flex items-center text-sm font-medium py-3 px-10 cursor-pointer  ${
                      selectedTab === menu.link
                        ? "text-primary-green"
                        : " text-white"
                    }`}
                    onClick={() =>
                      menu.link && linkHandler(menu.link, menu.title)
                    }>
                    {menu.icon ? (
                      menu.icon
                    ) : (
                      <BiPlusCircle size={18} className="mr-3" />
                    )}
                    <p className={`truncate`}>{menu.title}</p>
                  </div>
                );
              } else {
                return (
                  <div key={index} className="ml-4 text-xs">
                    <Accordian defaultOpen={true} title={menu.title}>
                      <ul>
                        {menu.nestedMenus?.map((nm, i) => (
                          <div
                            key={i}
                            className={`flex items-center text-sm font-medium py-3 px-10 cursor-pointer  ${
                              selectedTab === nm.link
                                ? "text-primary-green"
                                : " text-white"
                            }`}
                            onClick={() =>
                              nm.link && linkHandler(nm.link, nm.title)
                            }>
                            <BiPlusCircle size={18} className="mr-3" />
                            <p className={` truncate`}>{nm.title}</p>
                          </div>
                        ))}
                      </ul>
                    </Accordian>
                  </div>
                );
              }
            })}
          </ul>
        </Accordian>
      ) : (
        <>
          {link && (
            <div
              onClick={() => linkHandler(link, title)}
              className={`flex items-center text-base font-medium px-6  py-3 cursor-pointer    ${
                selectedTab === link ? "text-primary-green" : "text-white"
              }`}>
              <p className={` truncate`}>{title}</p>
            </div>
          )}
        </>
      )}
    </>
  );
};

const SidebarComp = (props: IProps) => {
  const { setIsDrawerOpen, isDrawerOpen } = props;
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(router.pathname);
  const width = useWidth();
  const {
    connect,
    isLoggedIn,
    account,
    balance_formatted,
    chainId,
    loading,
    ethereum,
    disconnect,
  } = useAuth();
  const [isMount, setIsMount] = useState(false);

  useEffect(() => {
    setIsMount(true);
  });

  const walletconnectHandler = () => {
    if (window.ethereum) {
      connect();
    } else {
      if (width > 1000) {
        toast.error("Install Metamask");
      } else {
        router.push("https://metamask.io/download");
      }
    }
  };

  const ref = React.useRef<any>(null);

  const handleClickOutside = (event: any) => {
    if (ref.current && !ref.current?.contains(event.target)) {
      setIsDrawerOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transform transition-all duration-300 ease-linear fixed top-[5.06rem] z-[99999] left-0 border-tertiary-green-border custom-scrollbar w-full h-full sm:h-auto sm:w-auto bg-gray10 ${
        isMount ? "translate-y-0 opacity-100" : "-translate-y-1/4 opacity-10"
      }`}>
      <div className="h-[calc(100%_-_100px)] overflow-y-auto sm:h-full w-full sm:max-w-[250px] bg-gray10">
        <div className="bg-gray10">
          <div className="md:hidden flex items-center justify-center py-3">
            {!isLoggedIn || !account ? (
              <button
                className="flex justify-center items-center bg-primary-green w-max rounded-old-full py-2 px-2.5 text-sm"
                disabled={loading}
                onClick={walletconnectHandler}>
                {"Connect Wallet"}
              </button>
            ) : (
              <Popover className="relative">
                {({ open }) => (
                  <div>
                    <Popover.Button
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
                      <Popover.Panel className="z-10 min-h-max absolute bottom-16 bg-card-green-bg-color py-1  border border-tertiary-green-border min-w-fit">
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
          <div className="">
            {sideBarMenu(chainId).map((menu, index) => {
              return (
                <SideBarListComp
                  selectedTab={selectedTab}
                  setSelectedTab={setSelectedTab}
                  key={index}
                  {...menu}
                  handleDrawer={setIsDrawerOpen}
                />
              );
            })}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 my-4 md:my-8 px-6">
            {SocialMediaItems.map((sm, i) => (
              <SocialIcon key={i} {...sm} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarComp;
