import React from "react";
import { Stepper } from "..";
import style from "./stepper.module.scss";
import { MdArrowForwardIos } from "react-icons/md";

interface IProps {
  title: string;
  description: string;
  activeStep: number;
  index: number;
  noOFStep: number;
}

const roundedFlexClass = "rounded-old-full flex justify-center items-center";

const Step = (props: IProps) => {
  const { title, description, activeStep, index, noOFStep } = props;

  const bigCircleClass = () => {
    if (index == activeStep) {
      return style.activeBigcircle;
    } else if (index > activeStep) {
      return style.unActive;
    } else {
      return style.ended;
    }
  };

  const smallCircleClass = () => {
    {
      if (index == activeStep) {
        return style.activeSmallcircle;
      } else if (index > activeStep) {
        return "bg-white";
      } else {
        return "bg-white";
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-start relative">
      {noOFStep - 1 > index && (
        <div
          className={`hidden lg:flex absolute -z-10 w-2 -ml-1 h-full ${
            index < activeStep
              ? style.endLine
              : index == activeStep
              ? style.lineGradient
              : "border border-[#F9F9F9]"
          } top-0 left-7`}></div>
      )}
      <div
        className={`h-10 w-10 md:h-14 md:w-14 ${roundedFlexClass} ${bigCircleClass()}`}>
        <div
          className={`h-8 w-8 md:h-10 md:w-10 text-base font-semibold ${roundedFlexClass} ${smallCircleClass()}`}>
          {index + 1}
        </div>
      </div>
      <div className="ml-5 hidden lg:block">
        <div
          className={`text-sm font-bold ${
            index == activeStep ? `${style.shape} p-4 pr-8` : ""
          } `}>
          {title}
        </div>
        <div className="mb-12 text-xs font-medium mt-1 max-w-[160px]">
          {description}
        </div>
      </div>
    </div>
  );
};

const Stepper = ({
  stepData,
  activeStep,
  themeColor,
}: {
  stepData: Stepper;
  activeStep: number;
  themeColor: string;
}) => {
  const theme = (theme: string) => {
    switch (theme) {
      case "red":
        return style.red;
      case "violet":
        return style.violet;
      case "violet2":
        return style.violet2;
      case "gray":
        return style.gray;
    }
  };
  return (
    <div
      className={`${theme(
        themeColor
      )} pt-8 md:px-20 lg:px-3 2xl:px-8  flex items-center lg:items-start justify-between lg:justify-start flex-row lg:flex-col lg:pt-14 p-5 w-full lg:w-3/12 border-r`}>
      {stepData.map((data, index) => {
        const formatData = {
          ...data,
          activeStep: activeStep,
          index: index,
          noOFStep: stepData.length,
        };
        return (
          <>
            <Step key={index} {...formatData} />
            {stepData.length - 1 > index && (
              <MdArrowForwardIos className="lg:hidden" />
            )}
          </>
        );
      })}
    </div>
  );
};

export default Stepper;
