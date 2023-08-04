import React from "react";
import { IconType } from "react-icons/lib";

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  Icon?: IconType;
  error?: any;
}

const SearchInput: React.FC<IInputProps> = ({
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
      <div className={`flex items-center border px-3 rounded-old-full`}>
        {label && (
          <label
            htmlFor={label}
            className={`block capitalize text-base font-semibold text-gray-900`}>
            {label}
          </label>
        )}
        {Icon && <Icon size={24} color="" className="flex-shrink-0" />}
        <input
          type={type}
          id={label}
          {...rest}
          className={`placeholder:text-gray-300 text-base font-normal block w-full p-2 outline-none rounded-old-full`}
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
export default SearchInput;
