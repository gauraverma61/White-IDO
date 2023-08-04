import React from "react";
import styles from "./rangeinput.module.scss";

interface Iprops {
  label: string;
  value: string;
  setValue: (value: string) => void;
  min: string;
  max: string;
  step: string;
  colorVariant?: "violet" | "red";
}

const RangeInput = (props: Iprops) => {
  const { value, setValue, min, max, step, label, colorVariant } = props;

  const classNameReturner = (variant?: string) => {
    switch (variant) {
      case "red":
        return styles.red;
      case "violet":
        return styles.violet;
      default:
        return styles.red;
    }
  };

  return (
    <div className={`${classNameReturner(colorVariant)}`}>
      <div className="text-base font-semibold text-[#64748B] mb-3">{label}</div>
      <input
        type="range"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        min={min}
        max={max}
        step={step}
      />
      <div className="flex items-center justify-between">
        <div>{`Min. ${min}%`}</div>
        <div>{`Max. ${max}%`}</div>
      </div>
    </div>
  );
};

export default RangeInput;
