import React from "react";

export interface IStep {
  stepTitle: string;
  subTitle: string;
  bgImg: string;
  shape?: "rounded" | "circle";
  topRight?: boolean;
}

interface IStepsInfo {
  title: string;
  steps: IStep[];
  className?: string;
}

const SingleStep: React.FC<IStep> = (props) => {
  const { stepTitle, subTitle, bgImg, shape = "rounded", topRight } = props;
  return (
    <div
      style={{ backgroundImage: `url(${bgImg})` }}
      className={` bg-no-repeat bg-cover bg-center rounded-old-full ${
        shape === "circle"
          ? "md:h-auto md:max-w-[400px] aspect-video w-full md:aspect-square"
          : "aspect-video w-full "
      }`}>
      <div
        className={`h-full text-center rounded-old-full w-full flex flex-col items-center justify-center bg-black/60 text-white px-4`}>
        <p className="text-2xl font-semibold">{stepTitle}</p>
        <p className="text-sm sm:text-base font-normal">{subTitle}</p>
      </div>
    </div>
  );
};
// sm:flex-[0.58]

const StepsInfo: React.FC<IStepsInfo> = ({ title, steps, className }) => {
  return (
    <div className="px-6 md:px-8 lg:px-10 py-12">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-6">
        <p className="font-fonde text-4xl md:text-5xl lg:text-7xl xl:text-[5rem]">
          {title}
        </p>
        <SingleStep {...steps[0]} />
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        {steps.slice(1, steps.length).map((st, index) => (
          <SingleStep key={index} {...st} />
        ))}
      </div>
    </div>
  );
};

export default StepsInfo;
