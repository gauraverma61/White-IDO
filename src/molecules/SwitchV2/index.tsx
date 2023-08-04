import React from "react";

interface Iprops {
  label: string;
  options: string[];
  setSelectedOption: (value: string) => void;
  selectedOption: string;
  backGroundClass: string;
  className?: string;
}

const CustomSwitch = (props: Iprops) => {
  const {
    label,
    options,
    selectedOption,
    setSelectedOption,
    backGroundClass,
    className,
  } = props;
  return (
    <div className={`${className} w-fit`}>
      <div className="text-xl text-white my-3">{label}</div>
      <div className="flex items-center justify-between">
        {options.map((c, i) => (
          <div
            key={c}
            onClick={() => setSelectedOption(c)}
            className={`max-w-[240px] text-lg flex justify-center items-center font-normal cursor-pointer ${
              i === 0 ? "rounded-old-l-lg" : "rounded-old-r-lg"
            } truncate px-4 py-3 ${
              selectedOption == c
                ? `text-primary-green border border-primary-green bg-secondary-green`
                : "bg-blur-background2 border border-dull-green text-secondary-green"
            }`}>
            {c === "1" ? "Tier 1" : c === "2" ? "Tier 2" : c}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomSwitch;
