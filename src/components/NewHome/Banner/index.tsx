import React from "react";
import BannerGraphics from "@public/images/BannerGraphics.svg";
import Link from "next/link";
import { DEFAULT_CHAIN_ID } from "@providers/UseWalletProvider";
import useAuth from "@hooks/useAuth";

const BannerSection = () => {
  const { chainId: chainId_ } = useAuth();
  const chainId = chainId_ || DEFAULT_CHAIN_ID;
  return (
    <div className="flex bannerContainer">
      <div className="pt-8 md:p-16 pb-0 w-full text-center">
        <div className="text-7xl font-semibold">
          <div className="text-2xl text-white md:text-6xl lg:text-[80px] mb-4">
            Never get rugged again with
          </div>
          <div className="text-6xl text-primary-green md:text-8xl lg:text-[120px]">
            ParioPad
          </div>
        </div>
        <div className="text-2xl mt-6 text-primary-text ">
          Create your token sale event today.
        </div>
        <div className="flex flex-col md:flex-row gap-6 container mt-16">
          <Link href={`/launchpad/create?blockchain=${chainId}`}>
            <button className="flex justify-center mx-auto items-center py-4 bg-primary-green w-full md:max-w-[250px] rounded-old-full text-xl font-medium">
              Launch Now
            </button>
          </Link>
          <Link href={`/launchpad/list?blockchain=${chainId}`}>
            <button className="flex justify-center mx-auto items-center py-4 bg-primary-green w-full md:max-w-[250px] rounded-old-full text-xl font-medium">
              Invest Now
            </button>
          </Link>
        </div>
      </div>
      {/*<div className=" hidden xl:flex justify-center items-center relative min-w-[55%]">*/}
      {/*  <div*/}
      {/*    className="absolute w-[160%] h-[190%] -left-[200px] "*/}
      {/*    style={{*/}
      {/*      backgroundImage: `url(${BannerGraphics.src})`,*/}
      {/*      backgroundPosition: "center",*/}
      {/*      backgroundSize: "cover",*/}
      {/*      backgroundRepeat: "no-repeat",*/}
      {/*    }}></div>*/}
      {/*</div>*/}
    </div>
  );
};

export default BannerSection;
