import React from "react";
import styles from "./rangeinput.module.scss";

interface Iprops {
  value: number;
  className?: string;
  setValue: (value: number) => void;
  min: number;
  max: number;
  step: number;
}

const RangeInput = (props: Iprops) => {
  const { value, setValue, min, max, step, className } = props;

  const SliderStopper = ({
    percentage,
    positionClass,
  }: {
    percentage: number;
    positionClass: string;
  }) => {
    const setPercentAmount = (percentage: number) => {
      let amt = min + (max - min) * (percentage / 100);
      setValue(amt);
    };
    return (
      <div
        onClick={() => setPercentAmount(percentage)}
        className={`cursor-pointer h-2.5 w-2.5 hover:scale-90 z-10 bg-black top-[35%] ${positionClass} border border-primary-green rounded-full `}></div>
    );
  };

  return (
    <div className={`${styles.green} ${className} relative h-[73px]`}>
      <input
        type="range"
        value={value}
        onChange={(e) => {
          let amt = e.target.value;
          setValue(Number(amt));
        }}
        min={min}
        max={max}
        step={step}
      />
      <div className=" flex justify-between items-center absolute w-full top-1/2 -mt-[5px]">
        <SliderStopper percentage={0} positionClass={"left-0"} />
        <SliderStopper percentage={25} positionClass={"left-1/4"} />
        <SliderStopper percentage={50} positionClass={"left-1/2"} />
        <SliderStopper percentage={75} positionClass={"right-1/4"} />
        <SliderStopper percentage={100} positionClass={"right-0"} />
      </div>
    </div>
  );
};

export default RangeInput;
