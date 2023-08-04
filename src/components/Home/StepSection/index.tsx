import Button from "@atoms/Button";
import React from "react";
import style from "./StepSection.module.scss";

interface Iprops {
  title: string;
  description: string;
  styleClass: string;
  index: number;
}

const data = [
  {
    title: "Apply",
    description:
      "Our analysts and council will assess your project application.",
    styleClass: style.first,
  },
  {
    title: "Interview",
    description: "After due diligence, we will hold a team interview.",
    styleClass: style.second,
  },
  {
    title: "Preparation",
    description: "You’re in. Prepare your launch with our experts.",
    styleClass: style.third,
  },
  {
    title: "Launch",
    description: "The big day! Supporters fund your project.",
    styleClass: style.fourth,
  },
  {
    title: "Scale",
    description:
      "Become a master of scale as we continue to support your journey.",
    styleClass: style.fifth,
  },
];

const Step = (props: Iprops) => {
  const { title, description, index, styleClass } = props;
  return (
    <div className="flex flex-col md:flex-row items-start mb-[35px]">
      <div>
        <div
          className={`rounded-old-full h-[40px] md:h-[50px] 2xl:h-[60px] w-[40px] md:w-[50px] 2xl:w-[60px] p-[4px] border flex justify-center items-center ${styleClass}`}>
          <div
            className={` bg-white inner h-[32px] md:h-[42px] 2xl:h-[52px] w-[32px] md:w-[42px] 2xl:w-[52px] rounded-old-full flex justify-center items-center`}>
            {index + 1}
          </div>
        </div>
      </div>
      <div className="md:ml-[30px] lg:ml-[40px]">
        <div className="text-2xl font-normal mb-2.5">{title}</div>
        <div className="text-lg text-[#747474]">{description}</div>
      </div>
    </div>
  );
};

const StepSection = () => {
  return (
    <div className="flex flex-col lg:flex-row mx-5 md:mx-10">
      <div className="w-full flex items-center justify-center lg:w-1/2">
        <div className="px-5">
          <div className={`${style.heading}`}>How to raise on ParioPad</div>
          <div className="flex justify-center lg:justify-start mb-5">
            <Button
              variant="primary-sm"
              className="my-4 md:my-8 lg:my-[40px] 2xl:my-[60px] uppercase text-sm">
              Apply to Raise
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 shadow-boxShadow3 py-[40px] p-[20px] md:p-[30px] lg:p-[50px] rounded-old-[50px] md:rounded-old-[75px] relative">
        <div className="relative">
          {data.map((data, index) => {
            const formatData = { ...data, index: index };
            return <Step key={index} {...formatData} />;
          })}
          <div
            className={`hidden md:flex h-full w-[2px] absolute top-0 md:left-[25px] 2xl:left-[30px] -z-10 ${style.gradientLine} `}></div>
        </div>
      </div>
    </div>
  );
};

export default StepSection;
