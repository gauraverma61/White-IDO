import Image from "next/image";
import React from "react";
import Marquee from "react-fast-marquee";
import eth from "@public/icons/svgs/chains/eth.svg";
import polygon from "@public/icons/svgs/chains/polygon.svg";
import bitcoin from "@public/icons/svgs/chains/bitcoin.svg";
import celo from "@public/icons/svgs/chains/celo.svg";
import solana from "@public/icons/svgs/chains/solana.svg";
import tether from "@public/icons/svgs/chains/tether.svg";
import avalanche from "@public/icons/svgs/chains/avalanche.svg";

const NetworksSection = () => {
  return (
    <div className="mb-20 mt-10">
      <div className="p-4">
        <Marquee gradient={false} speed={70} direction="left">
          <div className="flex gap-16 md:gap-20 mr-16 md:mr-20 items-center lg:justify-around w-full">
            <Image src={eth} className="" alt="eth" />
            <Image src={tether} className="" alt="tether" />
            <Image src={celo} className="" alt="celo" />
            <Image src={avalanche} className="" alt="avax" />
            <Image src={polygon} className="" alt="matic" />
            <Image src={solana} className="" alt="sol" />
            <Image src={bitcoin} className="" alt="sol" />
          </div>
        </Marquee>
      </div>
    </div>
  );
};

export default NetworksSection;
