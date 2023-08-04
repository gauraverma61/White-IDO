import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { HiOutlineExternalLink, HiUpload } from "react-icons/hi";
import { GoPrimitiveDot } from "react-icons/go";
import { FaCheckCircle, FaCircle } from "react-icons/fa";
import SaleDetailsCard from "./SaleDetailsCard";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import {
  IoCheckmarkSharp,
  IoClose,
  IoSearchOutline,
  IoShieldCheckmarkOutline,
  IoShieldHalfOutline,
} from "react-icons/io5";
import { RiLockLine, RiRegisteredLine, RiSpyLine } from "react-icons/ri";
import {
  BsDiscord,
  BsFacebook,
  BsGlobe,
  BsTelegram,
  BsTwitter,
} from "react-icons/bs";
import { FaGithub, FaInstagram } from "react-icons/fa";
import AddressComp from "./AddressComp";
import SocialIcon from "./SocialIcon";
import InfoGrid from "@molecules/InfoGrid";
import Actions from "./Actions";
import AllocationDetail from "./Allocations";
import {
  FacebookShareButton,
  InstapaperShareButton,
  TelegramShareButton,
  TwitterShareButton,
} from "react-share";
import {
  IPoolDetails,
  useWhitelistStats,
} from "@components/LaunchPad/Details/hooks/useStats";
import moment from "moment";
import { confirmation2MultiSenderData } from "@constants/multisenderData";
import { useAllocationStats } from "@components/AirDrop/Details/hooks/useStats";
import Footer from "@components/Footer";
import InfoList from "./InfoList";
import { useDetailsStats } from "@components/Locker/Token/hooks/useStats";
import LockerInfo from "./LockerDetails";
import { capital, upper } from "case";
import { FcReddit } from "react-icons/fc";
import Link from "next/link";
import WhitelistDetail from "@components/Details/Whitelists";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { supportNetwork } from "@constants/network";
import useAuth from "@hooks/useAuth";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import UploadImage from "@components/Common/UploadImage";
import TimerPreview from "@molecules/TimerPreview";
import CopyAddress from "./CopyAddress";
import { IPoolData } from "@components/LaunchPad/Details/hooks/usePool";
import OwnerZone from "./OwnerZone";
import { AiOutlineSafety } from "react-icons/ai";

const EditerMarkdown = dynamic(
  () =>
    import("@uiw/react-md-editor").then((mod) => {
      return mod.default.Markdown;
    }),
  { ssr: false }
);

export interface IInfoList {
  title: string;
  value: string | number;
  type?: "socials" | "address" | "txn";
}
interface IAddressList {
  addressType: string;
  address: string;
}
export type DetailsType =
  | "presale"
  | "fairlaunch"
  | "airdrop"
  | "privatesale"
  | "leaderboard";

export interface IPoolDetailsData {
  status: string;
  logo: string;
  banner: string;
  title: string;
  native_symbol?: string;
  token: {
    name: string;
    symbol: string;
    decimals: number;
    supply: number;
    address?: string;
  };
  liquidity?: {
    liquidityListingRate: number;
    liquidityLockDays: number;
    liquidityPercent: number;
    liquidityUnlockTime: number;
  };
  fees?: number;
  myClaim?: number;
  myContribution?: number;
  total_sold: number;
  soft_cap: number;
  hard_cap?: number;
  start_time: number;
  end_time: number;
  min_buy: number;
  max_buy: number;
  description: string;
  sale_type: string;
  pool_address: string;
  tokenAvailable?: number;
  poolOwner: string;
  poolState?: string;
  userWhitelisted?: boolean;
  userTier?: number;
  publicStartTime?: number;
  tier1?: {
    start_time: number;
    end_time: number;
  };
  tier2?: {
    start_time: number;
    end_time: number;
  };
  tagsList?: any;
  poolData?: IPoolData;
}

interface IDetails {
  infoList: IInfoList[];
  type: DetailsType;
  data: IPoolDetailsData;
  addresses?: any[];
}

const AllocationsWithData = ({
  address,
  token,
}: {
  address: string;
  token: IPoolDetailsData["token"];
}) => {
  const allocations = useAllocationStats({
    address,
    page: 0,
    pageSize: 10,
    loading: false,
  });
  return allocations.length > 0 ? (
    <AllocationDetail details={allocations} token={token} />
  ) : (
    <></>
  );
};
const WhitelistWithData = ({
  address,
  token,
}: {
  address: string;
  token: IPoolDetailsData["token"];
}) => {
  const allocations = useWhitelistStats({
    address,
    page: 0,
    pageSize: 10,
    loading: false,
  });
  return (allocations || [])?.length > 0 ? (
    <WhitelistDetail details={allocations || []} token={token} />
  ) : (
    <></>
  );
};

const renderContent = (type: DetailsType, data: IDetails["data"]) => {
  switch (type) {
    case "fairlaunch":
    case "leaderboard":
      return <Actions type={type} data={data} />;
    case "presale":
    case "privatesale":
      return (
        <>
          <Actions type={type} data={data} />
          {/* <WhitelistWithData address={data.pool_address} token={data.token} /> */}
        </>
      );

    case "airdrop":
      return (
        <>
          <Actions type={type} data={data} />
          <AllocationsWithData address={data.pool_address} token={data.token} />
        </>
      );
  }
};

const renderOwnerContent = (type: DetailsType, data: IDetails["data"]) => {
  switch (type) {
    case "fairlaunch":
    case "leaderboard":
      return <OwnerZone type={type} data={data} />;
    case "presale":
    case "privatesale":
      return (
        <>
          <OwnerZone type={type} data={data} />
          {/* <WhitelistWithData address={data.pool_address} token={data.token} /> */}
        </>
      );

    case "airdrop":
      return (
        <>
          <OwnerZone type={type} data={data} />
          <AllocationsWithData address={data.pool_address} token={data.token} />
        </>
      );
  }
};

const DetailsPageComponent: React.FC<IDetails> = ({
  infoList,
  type,
  data,
  addresses,
}) => {
  const { chainId, account } = useAuth();
  const { asPath } = useRouter();
  const [ActiveTab, setActiveTab] = useState("description");
  const [currentUrl, setCurrentUrl] = useState("");
  const socials = useMemo(
    () => infoList.filter((data) => data?.type === "socials"),
    [infoList]
  );

  console.log("indetail", data);

  const RenderSaleStatus = ({
    isBadge,
    status,
    link,
  }: {
    isBadge?: boolean;
    status: string;
    link?: string;
  }) => {
    const getTagsIcon = () => {
      switch (status?.toLowerCase()) {
        case "anti-rug":
          return <IoShieldHalfOutline size={18} />;
        case "doxxed":
          return <RiSpyLine size={18} />;
        case "registered company":
          return <RiRegisteredLine size={18} />;
        case "pool lock":
          return <RiLockLine size={18} />;
        case "safe dev":
          return <AiOutlineSafety size={18} />;
        case "live kyc":
          return <IoShieldCheckmarkOutline size={18} />;
        case "audit":
          return <IoSearchOutline size={18} />;
        default:
          return <IoCheckmarkSharp size={18} />;
      }
    };

    return (
      <div
        className={`text-black px-2 py-0.5 capitalize text-sm sm:text-base font-medium rounded-old-md ${
          status === "sale ended"
            ? "border border-primary-red text-primary-red bg-secondary-red"
            : " bg-tertiary-green"
        } w-fit flex items-center gap-1`}>
        {isBadge ? (
          <>
            <div className="flex items-center justify-center">
              {getTagsIcon()}
            </div>
            {link ? (
              <Link href={link} passHref>
                <a target="_blank" rel="noopener noreferrer">
                  <span className="capitalize hover:underline cursor-pointer">
                    {status !== "KYC" ? status.toLowerCase() : status}
                  </span>
                </a>
              </Link>
            ) : (
              <span className="">
                {status !== "KYC" ? capital(status) : upper(status)}
              </span>
            )}
          </>
        ) : (
          <>
            {/* <FaCircle size={12} /> */}
            <p className="capitalize">{status}</p>
          </>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (window !== undefined) {
      const url = window.location.href;
      setCurrentUrl(url);
    }
  }, []);

  const shareLinkHandler = () => {
    navigator.clipboard.writeText(currentUrl);
    toast.success("Link Copied");
  };
  return (
    <div className="py-16 md:py-16 xl:py-20 mt-10">
      <div
        className={`bg-no-repeat bg-cover bg-center md:h-[300px] lg:h-[21rem] 3xl:h-[30rem] border border-primary-green ${
          !data?.banner && "bg-hero-forms"
        }`}
        style={{ backgroundImage: `url(${data?.banner})` }}>
        <div
          className={`${
            data?.banner ? "bg-black/40 backdrop-blur-sm" : ""
          } flex justify-center md:self-end h-full`}>
          <div
            className={`flex flex-col-reverse md:flex-row md:items-center justify-between w-full mx-auto container px-4 sm:px-6 md:px-6 xl:px-14 pt-6 relative`}>
            <div
              className={`flex flex-col md:max-w-[90%] justify-between md:self-end pb-10 w-full ${
                data?.banner ? "" : "create-head"
              }`}>
              <h1 className="text-2xl truncate sm:text-3xl md:text-4xl lg:text-5xl leading-[6rem]  text-primary-green mt-4">
                {data.title ? (
                  <div className="flex md:max-w-[90%] truncate">
                    <div className="truncate">{data.title}</div>
                  </div>
                ) : (
                  "Unknown"
                )}
              </h1>
              <div className="flex gap-3 flex-wrap w-full mt-4">
                <RenderSaleStatus status={type} />
                <RenderSaleStatus status={data.status} />
                {data.tagsList?.length > 0 &&
                  data.tagsList?.map(
                    (t: { link: string; name: string }, i: number) => (
                      <RenderSaleStatus
                        key={i}
                        status={t.name}
                        link={t.link}
                        isBadge={true}
                      />
                    )
                  )}
              </div>
              {/* {data.start_time && data.end_time && (
                <TimerPreview
                  startTime={`${data.start_time}`}
                  endTime={`${data.end_time}`}
                  tier1StartTime={formik.values.startTime}
                  tier1EndTime={formik.values.tier1EndTime}
                  tier2StartTime={formik.values.startTime}
                  tier2EndTime={formik.values.tier2EndTime}
                />
              )} */}
            </div>
            {/* {image || banner ? (
              <></>
            ) : (
              <img
                className="w-[80%] md:w-[300px] lg:w-[450px] hidden md:block"
                src={BannerImage.src}
                alt=""
              />
            )} */}
            <div className="flex flex-col md:self-end pb-10">
              <div className="h-20 w-20 bg-gray8 mb-6 profile-pic-upload md:self-end border border-primary-green">
                {data?.logo && (
                  <Image
                    src={data?.logo}
                    className="w-full p-0 m-0"
                    alt="detail-img"
                    objectFit="cover"
                    height={160}
                    width={160}
                    // objectFit="cover"
                  />
                )}
                {/* <UploadImage
                  setImageValue={(v: string) => {
                    // setImage(v);
                    // setImageUploaded("");
                  }}
                  // setImagesValue={setImages}
                  classTags="upload-bgImage-sec border border-dashed"
                /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border border-primary-green px-5 md:px-8 lg:px-16 pt-14 pb-20 bg-dull-black mt-20">
        <div className="border-b border-[#074907] h-fit flex overflow-x-auto gap-8 md:gap-12">
          <div
            onClick={() => setActiveTab("description")}
            className={`pb-3 w-fit cursor-pointer font-medium text-xl ${
              ActiveTab === "description" ? "text-primary-green " : "text-white"
            }`}>
            Details
          </div>
          {data.poolOwner?.toLowerCase() === account?.toLowerCase() && (
            <div
              onClick={() => setActiveTab("owner")}
              className={`pb-3 w-fit  cursor-pointer font-medium text-xl ${
                ActiveTab === "owner" ? "text-primary-green " : "text-white"
              }`}>
              Owner
            </div>
          )}
          <div
            onClick={() => setActiveTab("actions")}
            className={`pb-3 w-fit cursor-pointer font-medium text-xl ${
              ActiveTab === "actions" ? "text-primary-green " : "text-white"
            }`}>
            Actions
          </div>
          {type !== "airdrop" && type !== "privatesale" && (
            <div
              onClick={() => setActiveTab("lockRecord")}
              className={`pb-3 w-fit cursor-pointer font-medium text-xl min-w-fit ${
                ActiveTab === "lockRecord"
                  ? "text-primary-green "
                  : "text-white"
              }`}>
              Vesting
            </div>
          )}
        </div>
        <div className="py-10 grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="w-full ">
            {ActiveTab === "description" ? (
              <div>
                <div className={"my-4 py-10 mb-6 h-fit"}>
                  <div className="text-white">
                    {data?.description ? (
                      <div className={`text-md font-light`}>
                        <div className="">{data?.description}</div>
                      </div>
                    ) : (
                      <div className="text-white text-center mt-4">
                        No Description
                      </div>
                    )}
                  </div>
                </div>
                <div className="border-b border-primary-green border-dashed my-16 h-px"></div>
                <div>
                  <InfoList
                    data={infoList.filter(
                      (info) =>
                        info.title !== "Presale Address" &&
                        info.title !== "Token Address"
                    )}
                  />
                  {/* {type !== "airdrop" && (
                    <LockerInfo
                      tokenAddress={data.token.address}
                      token={data.token}
                      liquidity={data.liquidity}
                      fees={data.fees}
                      hard_cap={data.hard_cap}
                    />
                  )} */}
                  <div className="border-b border-primary-green border-dashed my-16 h-px"></div>
                  <div className="flex flex-col mt-8 pb-6 text-white">
                    {infoList
                      .filter(
                        (info) =>
                          info.title === "Presale Address" ||
                          info.title === "Token Address"
                      )
                      ?.map((address: any, index) => {
                        return (
                          <div
                            key={index}
                            className={`flex justify-between items-end w-full text-white ${
                              index === 0
                                ? ""
                                : "border-t border-secondary-green text-base font-medium"
                            } py-3`}>
                            <div className="text-sm font-normal capitalize">
                              {address.title}
                            </div>
                            <CopyAddress
                              containerClass={`text-sm font-medium text-right capitalize text-primary-green`}
                              type={address.type}
                              iconSize={18}
                              address={address.value as string}
                            />
                          </div>
                        );
                      })}
                    <div className="flex gap-3 items-center mb-2 mt-4">
                      {socials.map((social, index) => {
                        let icon = BsGlobe;
                        switch (social.title.toLowerCase()) {
                          case "facebook":
                            icon = BsFacebook;
                            break;
                          case "twitter":
                            icon = BsTwitter;
                            break;
                          case "instagram":
                            icon = FaInstagram;
                            break;
                          case "github":
                            icon = FaGithub;
                            break;
                          case "reddit":
                            icon = FcReddit;
                            break;
                          case "telegram":
                            icon = BsTelegram;
                            break;
                          case "discord":
                            icon = BsDiscord;
                            break;
                        }
                        return (
                          <SocialIcon
                            key={index}
                            Icon={icon}
                            Wrapper={({ children }: any) => (
                              <a
                                target={"_blank"}
                                href={social.value.toString()}
                                rel="noreferrer">
                                {children}
                              </a>
                            )}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : ActiveTab === "details" ? (
              <></>
            ) : ActiveTab === "owner" ? (
              <div>
                {" "}
                <div className="">{renderOwnerContent(type, data)}</div>
              </div>
            ) : ActiveTab === "lockRecord" ? (
              <LockerInfo
                tokenAddress={data.token.address}
                token={data.token}
                liquidity={data.liquidity}
                fees={data.fees}
                hard_cap={data.hard_cap}
              />
            ) : (
              <div>
                {" "}
                <div className="">{renderContent(type, data)}</div>
              </div>
            )}
          </div>
          <div className="lg:sticky lg:top-24 w-full h-max">
            <div className="flex flex-col bg-[#000E00] p-8  border border-greenV3 mb-10">
              {[{ Status: data.status }, { "Sale Type": data.sale_type }].map(
                (d, i) => (
                  <div
                    key={i}
                    className={`flex justify-between items-center w-full text-white ${
                      i === 0
                        ? "pb-2"
                        : "border-t border-greenV2 py-3 text-base font-medium "
                    } px-1 `}>
                    <div className="text-sm font-normal capitalize">
                      {Object.keys(d)[0]}
                    </div>
                    <div
                      className={`text-sm text-right font-medium capitalize`}>
                      {Object.values(d)[0]}
                    </div>
                  </div>
                )
              )}
              {!["fairlaunch", "airdrop"].includes(type) &&
                [
                  {
                    "Minimum Buy":
                      data.min_buy +
                      " " +
                      (data.native_symbol ?? data.token.symbol),
                  },
                  {
                    "Maximum Buy":
                      data.max_buy +
                      " " +
                      (data.native_symbol ?? data.token.symbol),
                  },
                ].map((d, i) => (
                  <div
                    key={i}
                    className={`flex justify-between items-center w-full text-white border-t border-greenV2 py-3 text-base font-medium px-1 `}>
                    <div className="text-sm font-normal capitalize">
                      {Object.keys(d)[0]}
                    </div>
                    <div
                      className={`text-sm text-right font-medium capitalize`}>
                      {Object.values(d)[0]}
                    </div>
                  </div>
                ))}
              {data.myClaim ? (
                <>
                  <div
                    className={`flex justify-between items-center w-full text-white border-t border-greenV2 text-base font-medium py-3 px-1`}>
                    <div className="text-sm  font-normal capitalize">
                      {"My Available Claim"}
                    </div>
                    <div
                      className={`text-sm text-right font-medium capitalize `}>
                      {data.myClaim} {data.token.symbol.toUpperCase()}
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
              {data.myContribution ? (
                <>
                  <div
                    className={`flex justify-between items-center w-full text-white border-t border-greenV2 text-base font-medium py-3 px-1`}>
                    <div className="text-sm  font-normal capitalize">
                      {"My Contribution"}
                    </div>
                    <div
                      className={`text-sm text-right font-medium capitalize `}>
                      {data.myContribution}{" "}
                      {data?.native_symbol?.toUpperCase() ??
                        supportNetwork[chainId || "default"].symbol}
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>

            <SaleDetailsCard
              data={data}
              type={type}
              tokenSold={data?.total_sold}
              totalToken={data?.hard_cap ?? data?.soft_cap}
              status={data.status}
              className="w-full flex-[0.65]"
              startTime={moment.unix(data?.start_time).toString()}
              endTime={moment.unix(data?.end_time).toString()}
              tokenSymbol={data.native_symbol || data.token.symbol}
            />
          </div>
        </div>
      </div>

      {/* <div className="grid grid-col-1 lg:grid-cols-2 gap-x-12 gap-y-8 mt-16 px-4 sm:px-6 mx-auto container">
        <div className="w-full overflow-hidden">
          {data?.description && (
            <div className={`shadow-boxShadow6  border mb-10 pb-4`}>
              <p className="border-b text-xl font-medium mb-2 pb-1 p-4">
                Description
              </p>
              <div className="p-4">
                <EditerMarkdown
                  source={data?.description}
                  style={{ whiteSpace: "pre-wrap" }}
                />
              </div>
              <p className=" text-justify text-base font-normal mx-4">
                {data?.description}
              </p>
            </div>
          )}
          <div className="">{renderContent(type, data)}</div>

          {type !== "airdrop" && (
            <LockerInfo
              tokenAddress={data.token.address}
              token={data.token}
              liquidity={data.liquidity}
              fees={data.fees}
              hard_cap={data.hard_cap}
            />
          )}
        </div>
        <div className="mb-8">
          <InfoList data={infoList} />
          <div className="flex flex-wrap shadow-boxShadow6  border p-4 gap-4 mt-8">
            <SocialIcon
              Icon={BsFacebook}
              Wrapper={FacebookShareButton}
              title={"ParioPad"}
              url={currentUrl}
            />
            <SocialIcon
              Icon={BsTwitter}
              Wrapper={TwitterShareButton}
              title={"ParioPad"}
              url={currentUrl}
            />
            <SocialIcon
              Icon={BsTelegram}
              Wrapper={TelegramShareButton}
              title={"ParioPad"}
              url={currentUrl}
            />
            <SocialIcon
              Icon={HiUpload}
              name={"share"}
              handleClick={shareLinkHandler}
            />
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default DetailsPageComponent;
