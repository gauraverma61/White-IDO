import React from "react";

interface Iprops {
  label: string;
  options: string[];
  setSelectedOption: (value: string) => void;
  selectedOption: string;
  backGroundClass: string;
}

const CustomSwitch = (props: Iprops) => {
  const { label, options, selectedOption, setSelectedOption, backGroundClass } =
    props;
  return (
    <div className="w-full text-[#64748B]">
      <div className="text-base font-semibold mb-2.5">{label}</div>
      <div className="flex rounded-old-[50px] border border-[#CBD5E1] overflow-hidden">
        {options.map((c) => (
          <div
            key={c}
            onClick={() => setSelectedOption(c)}
            className={`w-1/2 flex justify-center items-center py-3 font-normal cursor-pointer ${
              selectedOption == c
                ? `${backGroundClass} text-white`
                : "bg-[#FBF8F8]"
            }`}>
            {c}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomSwitch;
