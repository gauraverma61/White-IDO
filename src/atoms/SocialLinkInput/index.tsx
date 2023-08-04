import useWidth from "@hooks/useWidth";
import React, { useState } from "react";
import {
  BsFacebook,
  BsTelegram,
  BsTwitter,
  BsGlobe,
  BsDiscord,
  BsInstagram,
  BsGithub,
} from "react-icons/bs";
import { FaReddit } from "react-icons/fa";

interface SocialLinks {
  website: string;
  reddit: string;
  twitter: string;
  instagram: string;
  github: string;
  facebook: string;
  discord: string;
  telegram: string;
}

const SocialLinkInput: React.FC<any> = (props) => {
  const { formik }: any = props;
  const [selectedSocial, setSelectedSocial] =
    useState<keyof SocialLinks>("twitter");

  const handleSocialSelection = (e: any) => {
    setSelectedSocial(e.currentTarget.value as keyof SocialLinks);
  };

  const handleSocialLinkChange = (e: any) => {
    const newSocialLinks = {
      ...formik.values,
      [selectedSocial]: e.target.value,
    };
    formik.setFormikState((state: any) => ({
      ...state,
      values: Object.assign({}, state.values, newSocialLinks),
    }));
  };

  const width = useWidth();

  const socialMedias = {
    website: {
      name: "website",
      icon: <BsGlobe size={width > 1280 ? 24 : 19} />,
    },
    reddit: {
      name: "reddit",
      icon: <FaReddit size={width > 1280 ? 24 : 19} />,
    },
    twitter: {
      name: "twitter",
      icon: <BsTwitter size={width > 1280 ? 24 : 19} />,
    },
    instagram: {
      name: "instagram",
      icon: <BsInstagram size={width > 1280 ? 24 : 19} />,
    },
    github: {
      name: "github",
      icon: <BsGithub size={width > 1280 ? 24 : 19} />,
    },
    facebook: {
      name: "facebook",
      icon: <BsFacebook size={width > 1280 ? 24 : 19} />,
    },
    discord: {
      name: "linkedin",
      icon: <BsDiscord size={width > 1280 ? 24 : 19} />,
    },
    telegram: {
      name: "pinterest",
      icon: <BsTelegram size={width > 1280 ? 24 : 19} />,
    },
    // ...
  };

  return (
    <>
      <div className="relative rounded-old-md shadow-sm">
        <div className="flex justify-between">
          {Object.entries(socialMedias).map(([socialName, { name, icon }]) => (
            <button
              type="button"
              key={socialName}
              className={`relative z-10 inline-flex items-center px-1 sm:px-4 py-2 text-xl leading-5 font-medium focus:outline-none active:text-primary-green 
            ${
              selectedSocial === socialName
                ? formik.touched[selectedSocial] &&
                  formik.errors[selectedSocial]
                  ? "text-red-text"
                  : "text-dull-green"
                : formik.values[socialName] == ""
                ? formik.touched[socialName] && formik.errors[socialName]
                  ? "text-red-text"
                  : "text-white"
                : formik.touched[socialName] && formik.errors[socialName]
                ? "text-red-text"
                : "text-primary-green"
            }`}
              onClick={handleSocialSelection}
              value={socialName}>
              {icon}
            </button>
          ))}
        </div>
        <input
          className={`form-input py-3 px-4 block w-full leading-5 rounded-old-md transition duration-150 ease-in-out sm:text-sm sm:leading-5 
        ${
          formik.touched[selectedSocial] && formik.errors[selectedSocial]
            ? "border-primary-red bg-secondary-red placeholder:text-red-text text-red-text redAutoFill"
            : formik.values[selectedSocial]
            ? "border-primary-green bg-secondary-green placeholder:text-primary-green text-primary-green greenAutoFill"
            : "bg-secondary-dark text-secondary-green placeholder-secondary-green border-primary-green"
        } outline-none border my-4 pl-14`}
          type="text"
          name={selectedSocial}
          onBlur={formik.handleBlur}
          onChange={handleSocialLinkChange}
          value={formik.values[selectedSocial]}
        />
        <div
          className={`absolute inset-y-0 left-0 top-1/2 px-3 m-1 flex items-center border-r ${
            formik.touched[selectedSocial] && formik.errors[selectedSocial]
              ? "border-primary-red text-red-text"
              : formik.values[selectedSocial]
              ? "border-primary-green text-primary-green"
              : "border-primary-green text-primary-green"
          }`}>
          {socialMedias[selectedSocial].icon}
        </div>
      </div>
      {formik.errors[selectedSocial] && formik.touched[selectedSocial] && (
        <p className="text-xs text-red-text capitalize font-medium leading-5">
          {formik.errors[selectedSocial]}
        </p>
      )}
    </>
  );
};

export default SocialLinkInput;
