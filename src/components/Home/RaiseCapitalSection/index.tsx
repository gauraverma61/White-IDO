import Image from "next/image";
import React from "react";
import Marquee from "react-fast-marquee";
import eth from "@public/icons/svgs/chains/eth.svg";
import polygon from "@public/icons/svgs/chains/polygon.svg";
import celo from "@public/icons/svgs/chains/celo.svg";
import solana from "@public/icons/svgs/chains/solana.svg";
import tether from "@public/icons/svgs/chains/tether.svg";
import avalanche from "@public/icons/svgs/chains/avalanche.svg";
import bnc from "@public/icons/bnc.png";
import doge from "@public/icons/dogecoin.png";
import ethClassic from "@public/icons/eth-classic.png";
import moonRiver from "@public/icons/mrn.png";
import harmony from "@public/icons/harmony-net.png";
import cronos from "@public/icons/cronos-network.png";

const RaiseCapitalSection = () => {
  return (
    <div className="my-28 lg:mt-[200px] ">
      <p className="text-center uppercase px-4 text-2xl leading-relaxed sm:text-3xl font-fonde font-semibold mb-7">
        Raise capital across all main blockchain networks. Get in touch if you
        want us to add your network
      </p>
      <div className="p-4">
        <Marquee gradient={false} speed={70} direction="left">
          <div className="flex gap-16 md:gap-20 mr-16 md:mr-20 items-center lg:justify-around w-full">
            <Image width={40} height={40} src={bnc} alt="bnc" />
            <Image src={polygon} className="" alt="matic" />
            <Image src={eth} className="" alt="eth" />
            <Image width={80} height={45} src={ethClassic} alt="eth-classic" />
            <Image width={100} height={48} src={doge} alt="doge" />
            <Image width={110} height={40} src={cronos} alt="cronos" />
            <Image src={celo} className="" alt="celo" />
            <Image width={150} height={50} src={moonRiver} alt="moon-river" />
            <Image width={100} height={24} src={harmony} alt="harmony" />
            <Image src={tether} className="" alt="tether" />
            <Image src={avalanche} className="" alt="avax" />
            <Image src={solana} className="" alt="sol" />
          </div>
        </Marquee>
      </div>
    </div>
  );
};

export default RaiseCapitalSection;
