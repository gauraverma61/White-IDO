import React from "react";
import Link from "next/link";
import { BsFacebook, BsTwitter, BsGlobe, BsDiscord } from "react-icons/bs";
import useWidth from "@hooks/useWidth";
import {
  FaGithub,
  FaInstagram,
  FaReddit,
  FaTelegramPlane,
} from "react-icons/fa";
import { IconType } from "react-icons/lib";

const FooterLinks = {
  company: [
    {
      title: "Careers",
      link: "/",
    },
    {
      title: "About Us",
      link: "/",
    },
    {
      title: "Blogs",
      link: "/",
    },
    {
      title: "Press Kit",
      link: "/",
    },
  ],
  help: [
    {
      title: "Support",
      link: "/",
    },
    {
      title: "Terms & Condition",
      link: "/",
    },
    {
      title: "Privacy Policy",
      link: "/",
    },
  ],
  developers: [
    {
      title: "Documentation",
      link: "/",
    },
  ],
  information: [
    {
      title: "Apply for IDO",
      link: "/",
    },
    {
      title: "Forum",
      link: "/",
    },
    {
      title: "Calendar",
      link: "/",
    },
  ],
  products: [
    {
      title: "Pario",
      link: "/",
    },
  ],
  resources: [
    {
      title: "Projects",
      link: "/",
    },
    {
      title: "Portfolio",
      link: "/",
    },
    {
      title: "Dashboard",
      link: "/",
    },
  ],
};

const SocialMediaItems = [
  {
    title: "Website",
    link: "/",
    icon: BsGlobe,
  },
  {
    title: "Reddit",
    link: "/",
    icon: FaReddit,
  },
  {
    title: "Twitter",
    link: "/",
    icon: BsTwitter,
  },
  {
    title: "Instagram",
    link: "/",
    icon: FaInstagram,
  },
  {
    title: "Github",
    link: "/",
    icon: FaGithub,
  },
  {
    title: "Facebook",
    link: "/",
    icon: BsFacebook,
  },
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
        size={28}
        color="#fff"
      />
    </a>
  );
};

const Footer = ({ className }: { className?: string }) => {
  const width = useWidth();
  return (
    <div className="pt-16 pb-14 border-t border-primary-green mt-20 bg-secondary-dark">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex flex-col lg:flex-row gap-8">
          <Link href={"/"} className="cursor-pointer">
            <p className="text-white font-semibold text-4xl cursor-pointer lg:w-[480px]">
              Pario
            </p>
          </Link>
          <div
            className={` w-full grid ${
              width < 420 ? "grid-cols-1" : "grid-cols-2"
            } md:grid-cols-4 gap-8`}>
            <div className="flex flex-col gap-4">
              <p className="text-white font-semibold text-xl">Company</p>
              {FooterLinks.company.map((c, i) => (
                <Link key={i} href={`${c.link}`}>
                  <p
                    key={i}
                    className="text-tertiary-green font-medium text-lg capitalize hover:underline cursor-pointer">
                    {c.title}
                  </p>
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-white font-semibold text-xl">Help</p>
              {FooterLinks.help.map((c, i) => (
                <Link key={i} href={`${c.link}`}>
                  <p
                    key={i}
                    className="text-tertiary-green font-medium text-lg capitalize hover:underline cursor-pointer">
                    {c.title}
                  </p>
                </Link>
              ))}
              <p className="text-white font-semibold text-xl">Developers</p>
              {FooterLinks.developers.map((c, i) => (
                <Link key={i} href={`${c.link}`}>
                  <p
                    key={i}
                    className="text-tertiary-green font-medium text-lg capitalize hover:underline cursor-pointer">
                    {c.title}
                  </p>
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-white font-semibold text-xl">Information</p>
              {FooterLinks.information.map((c, i) => (
                <Link key={i} href={`${c.link}`}>
                  <p
                    key={i}
                    className="text-tertiary-green font-medium text-lg capitalize hover:underline cursor-pointer">
                    {c.title}
                  </p>
                </Link>
              ))}
              {/*<p className="text-white font-semibold text-xl">Products</p>*/}
              {/*{FooterLinks.products.map((c, i) => (*/}
              {/*  <Link key={i} href={`${c.link}`}>*/}
              {/*    <p*/}
              {/*      key={i}*/}
              {/*      className="text-tertiary-green font-medium text-lg capitalize hover:underline cursor-pointer">*/}
              {/*      {c.title}*/}
              {/*    </p>*/}
              {/*  </Link>*/}
              {/*))}*/}
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-white font-semibold text-xl">Resources</p>
              {FooterLinks.resources.map((c, i) => (
                <Link key={i} href={`${c.link}`}>
                  <p
                    key={i}
                    className="text-tertiary-green font-medium text-lg capitalize hover:underline cursor-pointer">
                    {c.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-10 mt-32">
          {SocialMediaItems.map((sm, i) => (
            <SocialIcon key={i} {...sm} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Footer;
