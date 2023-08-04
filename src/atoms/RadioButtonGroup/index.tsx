import RadioButton from "@atoms/RadioButton";
import React from "react";

export interface IOption {
  label: string;
  name?: string;
  disabled?: boolean;
}

interface IRadioInputGroup {
  label?: string;
  options: IOption[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className: string;
  labelAlign?: "row" | "column";
  variant?: "horizontal" | "verticle";
  defaultChecked?: number;
  selected?: string;
}

const RadioButtonGroup: React.FC<IRadioInputGroup> = ({
  label,
  options,
  onChange,
  className,
  labelAlign = "column",
  variant = "horizontal",
  defaultChecked = 0,
  selected,
}) => {
  function renderOptions() {
    return options.map(({ label, name, disabled }: IOption, index) => {
      const shortenedOptionLabel = label.replace(/\s+/g, "");
      const optionId = `radio-opt-${shortenedOptionLabel}`;
      return (
        <RadioButton
          value={label}
          label={label}
          key={optionId}
          id={optionId}
          name={name}
          disabled={disabled}
          defaultChecked={index === defaultChecked}
          onChange={onChange}
          checked={selected ? label === selected : undefined}
        />
      );
    });
  }

  return (
    <div
      className={`flex ${
        label && labelAlign === "row"
          ? "flex-col gap-2 sm:flex-row sm:justify-between"
          : "flex-col gap-2 "
      } ${className}`}>
      {label && <p className="text-base font-semibold text-text3">{label}</p>}
      <div
        className={`flex ${
          variant === "verticle" ? "flex-col" : "flex-row"
        }  gap-x-6 gap-y-4`}>
        {renderOptions()}
      </div>
    </div>
  );
};

export default RadioButtonGroup;
