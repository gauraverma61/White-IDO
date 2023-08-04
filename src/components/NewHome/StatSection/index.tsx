import React from "react";
import useSWR from "swr";
import Image from "next/image";
import net from "@public/images/net.png";
import home1 from "@public/images/homeIcon/home1.png";
import home2 from "@public/images/homeIcon/home2.png";
import home3 from "@public/images/homeIcon/home3.png";

const StatSection = () => {
  const { data, error } = useSWR(
    `{
      poolFactories {
      poolsCount
      totalRaised
      totalParticipants
    }
  }`
  );

  const loading = !error && !data;

  return (
    <div className="relative z-10 pt-32 pb-8 md:pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
        <div className="relative border border-primary-green-border bg-primary-dark rounded-old-3xl p-4 mb-14">
          <div className="w-full h-full relative text-center z-20">
            <div
              className="h-20 w-20  bg-no-repeat  bg-center mx-auto"
              style={{
                backgroundImage: `url(${home1.src})`,
              }}></div>
            <div className="text-center text-primary-green text-4xl md:text-xl lg:text-3xl 2xl:text-5xl">
              {loading
                ? 0
                : (data?.poolFactories[0]?.totalRaised &&
                    parseFloat(data?.poolFactories[0]?.totalRaised) /
                      10 ** 18) ??
                  0}
            </div>
            <div className="text-center text-primary-text md:text-base lg:text-base uppercase">
              FUNDS RAISED
            </div>
          </div>
        </div>
        <div className="relative border border-primary-green-border bg-primary-dark rounded-old-3xl p-4 mb-14">
          <div className="w-full h-full relative text-center z-20">
            <div
              className="h-20 w-20  bg-no-repeat bg-center mx-auto"
              style={{
                backgroundImage: `url(${home2.src})`,
              }}></div>
            <div className="text-center text-primary-green text-4xl md:text-xl lg:text-3xl 2xl:text-5xl">
              {loading ? 0 : data?.poolFactories[0]?.poolsCount ?? 0}
            </div>
            <div className="text-center text-primary-text md:text-base lg:text-base uppercase">
              Funded Projects
            </div>
          </div>
        </div>
        <div className="relative border border-primary-green-border bg-primary-dark rounded-old-3xl p-4 mb-14">
          <div className="w-full h-full relative text-center z-20">
            <div
              className="h-20 w-20  bg-no-repeat bg-center mx-auto"
              style={{
                backgroundImage: `url(${home3.src})`,
              }}></div>
            <div className="text-center text-primary-green text-4xl md:text-xl lg:text-3xl 2xl:text-5xl">
              {loading ? 0 : data?.poolFactories[0]?.totalParticipants ?? 0}
            </div>
            <div className="text-center text-primary-text md:text-base lg:text-base uppercase">
              TOTAL INVESTORS
            </div>
          </div>
        </div>
      </div>
      {/*<div className="p-8 border border-primary-green-border  mb-14 bg-card-green-bg-color">*/}
      {/*  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 text-center">*/}
      {/*    <div className="flex flex-col justify-center items-center md:border-r border-secondary-green-border w-full">*/}
      {/*      <div className="text-3xl md:text-4xl text-primary-green ">*/}
      {/*        {loading*/}
      {/*          ? 0*/}
      {/*          : (data?.poolFactories[0]?.totalRaised &&*/}
      {/*              parseFloat(data?.poolFactories[0]?.totalRaised) /*/}
      {/*                10 ** 18) ??*/}
      {/*            0}*/}
      {/*      </div>*/}
      {/*      <div className="text-base md:text-lg text-primary-text ">*/}
      {/*        FUNDS RAISED*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*    <div className="flex flex-col justify-center items-center lg:border-r border-secondary-green-border w-full">*/}
      {/*      <div className="text-3xl md:text-4xl text-primary-green ">*/}
      {/*        {loading ? 0 : data?.poolFactories[0]?.poolsCount ?? 0}*/}
      {/*      </div>*/}
      {/*      <div className="text-base md:text-lg text-primary-text ">*/}
      {/*        IDEAS FUNDED*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*    <div className="flex flex-col justify-center items-center md:border-r border-secondary-green-border w-full">*/}
      {/*      <div className="text-3xl md:text-4xl text-primary-green ">*/}
      {/*        $400M*/}
      {/*      </div>*/}
      {/*      <div className="text-base md:text-lg text-primary-text ">*/}
      {/*        PROJECTS MKT CAP*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*    <div className="flex flex-col justify-center items-center w-full">*/}
      {/*      <div className="text-3xl md:text-4xl text-primary-green ">*/}
      {/*        {loading ? 0 : data?.poolFactories[0]?.totalParticipants ?? 0}*/}
      {/*      </div>*/}
      {/*      <div className="text-base md:text-lg text-primary-text ">*/}
      {/*        UNIQUE PARTICIPANTS*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
};

export default StatSection;
