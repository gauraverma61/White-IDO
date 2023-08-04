import React from "react";
import { IconType } from "react-icons/lib";

type IVariant =
  | "primary"
  | "icon"
  | "title"
  | "icon-type2"
  | "bright"
  | "warning";
interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  variant?: IVariant;
  Icon?: IconType;
  error?: any;
  titleText?: string;
}

const Input2: React.FC<IInputProps> = ({
  label,
  className,
  type,
  placeholder,
  variant = "primary",
  error,
  Icon,
  titleText,
  value,
  ...rest
}) => {
  const returnVariant = (variant: IVariant) => {
    switch (variant) {
      case "primary":
        return "";
      case "title":
      case "icon":
        return " border border-primary-green flex items-center border  overflow-hidden bg-dull-green-bg py-3.5 h-[73px]";
    }
  };

  const returnInputClass = () => {
    switch (variant) {
      case "primary":
        return "border border-primary-green  bg-dull-green-bg px-8 py-3 placeholder:text-secondary-green text-white";
      case "bright":
        return "border border-primary-green bg-secondary-green  px-4 py-3 placeholder:text-primary-green text-primary-green greenAutoFill";
      case "warning":
        return "border border-primary-red bg-secondary-red  px-4 py-3 placeholder:text-red-text text-red-text redAutoFill";
      case "title":
        return "flex-1 px-4 py-3 border-r";
      case "icon":
        return "flex-1 px-4 py-3 border-l border-primary-green bg-dull-green-bg placeholder:text-secondary-green text-white h-auto";
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {(variant === "icon" || variant === "title") && label ? (
        <label
          htmlFor={label}
          className={`block text-xl font-medium mb-3  text-white`}>
          {label}
        </label>
      ) : null}
      <div className={`${returnVariant(variant)}`}>
        {(variant === "primary" ||
          variant === "bright" ||
          variant === "warning") &&
          label && (
            <label
              htmlFor={label}
              className={`block text-xl font-medium mb-4 text-white`}>
              {label}
            </label>
          )}
        {variant === "icon" && Icon && (
          <div className="flex items-center justify-center h-full px-4">
            <Icon size={24} color="#00ff00" className="flex-shrink-0" />
          </div>
        )}
        <input
          type={type}
          id={label}
          placeholder={placeholder || label}
          value={value}
          {...rest}
          className={`text-base font-normal block w-full outline-none disabled:cursor-pointer greenAutoFill ${returnInputClass()}`}
        />
        {variant === "title" && (
          <p className="hidden sm:block w-max px-3 sm:px-4 text-xs sm:text-sm font-semibold capitalize">{`-${titleText}`}</p>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-text capitalize font-medium leading-5 mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input2;
