import React from "react";
import BannerSection from "./Banner";
import LearnAboutSection from "./LearnAboutSection";
import NetworksSection from "./NetworksSection";
import RecentPadSection from "./RecentPadSection";
import SignUpSection from "./SignUpSection";
import StatSection from "./StatSection";
import UpcomingPadSection from "./UpcomingPad";
import net2 from "@public/images/net2.png";
import Image from "next/image";
import pIcon from "@public/images/p-icon.png";
import seaIcon from "@public/images/sea.png";
import parioBg from "@public/images/pario-bg.png";

const NewHome: React.FC = () => {
  return (
    <>
      {/*<div className="grad-bg h-[400px] w-full sm:w-[400px] -z-10"></div>*/}
      <div className=" relative z-10">
        <div
          style={{
            backgroundImage: `url(${parioBg.src})`,
            backgroundSize: "120%",
          }}
          className="hide-bg-mobile px-6 md:px-12 lg:px-16 pt-20 bg-center md:bg-contain bg-no-repeat lg:pt-40 overflow-hidden banner mx-auto">
          <BannerSection />
          {/*<div className="container mx-auto px-6 md:px-12 lg:px-16">*/}
          {/*  <NetworksSection />*/}
          {/*</div>*/}
        </div>
        <div className="relative">
          <div className="container mx-auto px-6 md:px-12 lg:px-16">
            <StatSection />
            {/*<div className="grad-bg h-[400px] w-full sm:w-[400px] -z-10 right-0"></div>*/}
            {/*<div className="grad-bg h-[400px] w-full sm:w-[400px] -z-10 left-0 top-[88rem]"></div>*/}
            {/* <div className="grad-bg h-[400px] w-full sm:w-[400px] -z-10 right-0 top-[160rem]"></div> */}
            {/* <div className="grad-bg h-[400px] w-full sm:w-[400px] z-0 right-0 "></div> */}
            <UpcomingPadSection />
            <LearnAboutSection />
            {/*<RecentPadSection />*/}
            {/*<SignUpSection />*/}
          </div>
        </div>
      </div>
    </>
  );
};

export default NewHome;
