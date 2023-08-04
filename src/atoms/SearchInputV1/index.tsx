import React from "react";
import { IconType } from "react-icons/lib";

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  Icon?: IconType;
  error?: any;
}

const SearchInputV1: React.FC<IInputProps> = ({
  label,
  className,
  type,
  placeholder,
  error,
  Icon,
  ...rest
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div
        className={`flex items-center border px-3 rounded-old-full shadow-md w-full`}>
        <input
          type={type}
          id={label}
          {...rest}
          className={`placeholder:text-[#CFCFCF] text-base font-normal block w-full p-2 outline-none rounded-old-full`}
        />
        {Icon && <Icon size={20} color="#CFCFCF" className="flex-shrink-0" />}
      </div>
      {error && (
        <p className="text-xs text-red-text capitalize font-medium leading-5">
          {error}
        </p>
      )}
    </div>
  );
};
export default SearchInputV1;
