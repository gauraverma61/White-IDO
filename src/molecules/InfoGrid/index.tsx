import React, { useMemo } from "react";
import styles from "./infogrid.module.scss";
import {
  BsFacebook,
  BsTwitter,
  BsTelegram,
  BsDiscord,
  BsGlobe,
} from "react-icons/bs";
import { FaGithub, FaInstagram } from "react-icons/fa";
import SocialIcon from "@components/Details/SocialIcon";
import CopyAddress from "@components/Details/CopyAddress";
import { FcReddit } from "react-icons/fc";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const EditerMarkdown = dynamic(
  () =>
    import("@uiw/react-md-editor").then((mod) => {
      return mod.default.Markdown;
    }),
  { ssr: false }
);

interface Iprops {
  title: string;
  value: string | number;
  fullWidth?: boolean;
  specialClass?: string;
  gridClass?: string;
  type?: "socials" | "address" | "tx" | string;
}

const GridInfoTab = (props: Iprops) => {
  const { title, value, specialClass, type, fullWidth, gridClass } = props;
  if (type === "socials") {
    let icon = BsGlobe;
    switch (title.toLowerCase()) {
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
        Icon={icon}
        IconColor={"#fff"}
        Wrapper={({ children }: any) => (
          <a target={"_blank"} href={value.toString()} rel="noreferrer">
            {children}
          </a>
        )}
      />
    );
  }
  if (type === "address" || type === "tx") {
    return (
      <div
        className={`${
          fullWidth ? "" : ""
        } flex items-center justify-between border-b border-[#042B04] py-4 last:border-none`}>
        <div className="text-base text-white font-medium capitalize">
          {title}
        </div>

        <CopyAddress
          containerClass={`text-base text-primary-green ${specialClass}`}
          type={type}
          address={value as string}
        />
      </div>
    );
  }

  return (
    <div
      className={`${gridClass} ${
        fullWidth ? "" : ""
      } flex items-center justify-between border-b border-[#042B04] py-4 last:border-none`}>
      <div className="text-base text-white font-medium capitalize">{title}</div>
      <div className={`text-base text-primary-green ${specialClass}`}>
        {value}
      </div>
    </div>
  );
};

export interface IInfoGridProps {
  data: Iprops[];
  specialPosition?: number[];
  specialClass?: string;
  gridClass?: string;
}

const InfoGrid = (props: IInfoGridProps) => {
  const { data, specialClass, specialPosition, gridClass } = props;
  const socials = useMemo(
    () => data.filter((data) => data?.type === "socials"),
    [data]
  );
  const description = useMemo(
    () => data.filter((data) => data?.title === "Description")[0],
    [data]
  );
  return (
    <>
      <div className={`px-4 py-3 `}>
        {data
          .filter(
            (data) => data?.type !== "socials" && data?.title !== "Description"
          )
          .map((data, index) => {
            if (specialPosition?.includes(index)) {
              return (
                <GridInfoTab
                  specialClass={specialClass}
                  key={index}
                  {...data}
                />
              );
            }
            return <GridInfoTab gridClass={gridClass} key={index} {...data} />;
          })}
      </div>

      {description ? (
        <div
          className={`my-4 border border-primary-green  py-10 px-8 bg-primary-dark mb-6 h-fit`}>
          <p className="">
            <EditerMarkdown
              source={description.value.toString()}
              style={{
                whiteSpace: "pre-wrap",
                color: "#fff",
                background: "transparent",
              }}
            />
          </p>
        </div>
      ) : null}

      {socials.length > 0 && (
        <div
          className={`flex flex-wrap gap-4 my-8 items-center shadow-boxShadow6 px-4 py-3 `}>
          {data
            .filter((data) => data?.type === "socials")
            .map((data, index) => {
              if (specialPosition?.includes(index)) {
                return (
                  <GridInfoTab
                    specialClass={specialClass}
                    key={index}
                    {...data}
                  />
                );
              }
              return (
                <GridInfoTab gridClass={gridClass} key={index} {...data} />
              );
            })}
        </div>
      )}
    </>
  );
};

export default InfoGrid;
