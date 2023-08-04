import React from "react";
import { IconType } from "react-icons/lib";

type IVariant = "primary" | "icon" | "icon-type2";
interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  variant?: IVariant;
  Icon?: IconType;
  error?: any;
}

const Input: React.FC<IInputProps> = ({
  label,
  className,
  type,
  placeholder,
  variant = "primary",
  error,
  Icon,
  ...rest
}) => {
  const returnVariant = (variant: IVariant) => {
    switch (variant) {
      case "primary":
        return "";
      case "icon":
      case "icon-type2":
        return "flex items-center";
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className={`${returnVariant(variant)}`}>
        {label && (
          <label
            htmlFor={label}
            className={`block capitalize text-base font-semibold text-gray-900`}>
            {label}
          </label>
        )}
        {variant === "icon" && Icon && (
          <div className="bg-black flex items-center justify-center p-2.5 h-full w-12 rounded-old-l-3xl">
            <Icon size={25} color="white" className="flex-shrink-0" />
          </div>
        )}
        {variant === "icon-type2" && Icon && (
          <div className="flex items-center border border-r-0 justify-center p-2.5 h-full w-12 rounded-old-l-3xl">
            <Icon size={24} color="" className="flex-shrink-0" />
          </div>
        )}
        <input
          type={type}
          id={label}
          placeholder={placeholder || label}
          {...rest}
          className={`placeholder:text-gray-300 text-base font-normal bg-transparent disabled:bg-slate-100 disabled:bg-opacity-40 block w-full p-2.5 outline-none ${
            variant === "icon" || variant === "icon-type2"
              ? " flex-1 h-full border border-l-0 rounded-old-r-3xl "
              : "pl-1 pb-1 border-b"
          }`}
        />
      </div>
      {error && (
        <p className="text-xs text-red-text capitalize font-medium leading-5">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
