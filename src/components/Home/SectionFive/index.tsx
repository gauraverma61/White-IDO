import React from "react";

import Pic1 from "@public/images/img1.jpg";
import Pic2 from "@public/images/img2.jpg";

const SectionFive = () => {
  return (
    <div className="flex flex-col text-center xl:text-left xl:flex-row gap-8 items-center mx-6 md:mx-10  lg:mx-14 my-28 xl:my-36">
      <div className="flex w-[300px] sm:w-[420px] lg:flex-[0.4] relative">
        {/* <Image src={Img1} alt={"img-1"} className="absolute" /> */}
        <img
          src={Pic1.src}
          alt={"suite-img"}
          className="w-[70%] max-w-[330px] relative z-10 h-[350px] sm:h-[435px] rounded-old-[160px]"
        />
        <img
          src={Pic2.src}
          alt={"suite-img"}
          className="absolute max-w-[330px] right-0 z-0 w-[70%] h-[350px] sm:h-[435px] rounded-old-[160px]"
        />
      </div>

      <div className="flex flex-[0.6] flex-col">
        <h4 className="font-fonde  text-4xl md:text-6xl 2xl:text-7xl">
          Our Services
        </h4>
        <p className="text-xl md:text-2xl  md:leading-9 px-3">
          ParioPad offers a bunch of tools to assist you in launch. Providing
          contract devs, audit, KYC, private-sale support, token lockers,
          pre-sales & ICO. We also got utilities like vesting locker, airdrop
          manager, bulk-sender and support for migration.
        </p>
      </div>
    </div>
  );
};

export default SectionFive;
