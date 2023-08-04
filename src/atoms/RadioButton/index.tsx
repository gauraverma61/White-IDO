import React, { InputHTMLAttributes } from "react";

interface IRadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: boolean;
  disabled?: boolean;
}

const RadioButton: React.FC<IRadioProps> = ({
  label,
  className,
  id,
  disabled,
  ...rest
}) => {
  return (
    <div className={`flex  items-center  ${className}`}>
      <input
        id={id}
        type="radio"
        value=""
        {...rest}
        disabled={disabled}
        className="w-4 h-4 flex-shrink-0 cursor-pointer text-gray-800 bg-gray-100 border-gray-300 accent-slate-800"
      />
      <label
        htmlFor={id}
        className="ml-2 text-sm font-medium text-text3 cursor-pointer w-full">
        {label}
      </label>
    </div>
  );
};

export default RadioButton;
