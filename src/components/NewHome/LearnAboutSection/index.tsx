import React from "react";
import LearnAbout1Pic from "@public/images/learnAbout1.jpg";
import LearnAbout2Pic from "@public/images/learnAbout2.jpg";
import DotedBGPic from "@public/images/dotedBG.jpg";
import Image, { StaticImageData } from "next/image";
import net from "@public/images/net.png";
import home4 from "@public/images/homeIcon/home4.png";
import home5 from "@public/images/homeIcon/home5.png";
import home6 from "@public/images/homeIcon/home6.png";
import home7 from "@public/images/homeIcon/home7.png";
import home8 from "@public/images/homeIcon/home8.png";
import home9 from "@public/images/homeIcon/home9.png";

interface IProps {
  image: StaticImageData;
  title: string;
  description?: string;
}

const CardSection: React.FC<IProps> = (props: IProps) => {
  return (
    // <div className="aspect-[4/3] relative px-4 sm:px-10 xl:px-20 border border-primary-green-border bg-primary-dark  pb-4 ">
    //   <div className="w-full h-full  relative -top-[60px] md:-top-[70px] text-center md:text-start z-20">
    //     <div className="border border-primary-green-border  w-full aspect-[5/3] relative ">
    //       <Image src={props.image} className="" layout="fill" />
    //     </div>
    //     <div className=" text-primary-green text-lg  md:text-xl lg:text-3xl 2xl:text-5xl mt-6 md:mt-4 lg:mt-8">
    //       {props.title}
    //     </div>
    //     {props.description && (
    //       <div className=" hidden sm:block text-primary-text md:text-base lg:text-base mt-2.5 lg:mt-6">
    //         {props.description}
    //       </div>
    //     )}
    //   </div>
    //   <div className="bg-dot-grad bg-cover bg-no-repeat bg-center absolute bottom-0 right-0 h-[230px] w-[230px]  z-10"></div>
    // </div>
    <div className="relative border border-primary-green-border bg-primary-dark rounded-old-3xl p-4 mb-14">
      <div className="w-full h-full relative text-center z-20">
        <div
          className="h-20 w-20  bg-no-repeat bg-center mx-auto"
          style={{
            backgroundImage: `url(${props.image?.src})`,
          }}></div>
        <div className="text-center text-primary-green text-4xl md:text-xl lg:text-3xl 2xl:text-5xl">
          {props.title}
        </div>
        <div className="text-center text-primary-text md:text-base lg:text-base mt-2">
          {props.description && props.description}
        </div>
      </div>
    </div>
  );
};

const LearnAboutSection = () => {
  return (
    <div className="mb-0 relative z-10">
      <div className=" text-primary-text font-semibold text-3xl lg:text-5xl mb-16 md:mb-32">
        Learn about Pario
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CardSection
          title="Anti-rug badge"
          description="A process to verify that a project is legitimate and has met certain criteria to prevent rug pulls."
          image={home4}
        />
        <CardSection
          title="Live KYC"
          description="A process for projects to complete KYC (Know Your Customer) verification on your launchpad."
          image={home5}
        />
        <CardSection
          title="Doxxed"
          description="It is a process to ensure that a project's team members are doxxed"
          image={home6}
        />
        <CardSection
          title="Audit"
          description="It is a process to verify that a project's code has been audited by a reputable third-party auditing firm."
          image={home7}
        />
        <CardSection
          title="Pool lock"
          description="Locks a percentage of the raised funds (starting from 30% up to 80%)"
          image={home8}
        />
        <CardSection
          title="Safe dev"
          description="Safe dev is a process to ensure that a project's developers are committed to the long-term success of the project."
          image={home9}
        />
      </div>
    </div>
  );
};

export default LearnAboutSection;
