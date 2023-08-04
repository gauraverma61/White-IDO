import React from "react";
// import Stepper from "./Stepper";

export type Stepper = {
  title: string;
  description: string;
}[];

interface IProps {
  children: React.ReactNode;
  data?: Stepper;
  activeStep?: number;
  themeColor?: string;
}

const StepperWrapper = (props: IProps) => {
  const { children, data, activeStep, themeColor } = props;
  return (
    <div className="">
      <div className="flex flex-col lg:flex-row">
        {/* <Stepper
          themeColor={themeColor}
          stepData={data}
          activeStep={activeStep}
        /> */}
        <div className="px-2 sm:px-8 pt-8 pb-10 container mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default StepperWrapper;
