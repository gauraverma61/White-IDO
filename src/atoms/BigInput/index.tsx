import React from "react";

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  description?: string;
  error?: any;
  variant?: "primary" | "bright" | "warning";
}

const BigInput: React.FC<IInputProps> = ({
  className,
  error,
  label,
  description,
  placeholder,
  variant = "primary",
  ...rest
}) => {
  const returnInputClass = () => {
    switch (variant) {
      case "primary":
        return "border border-primary-green bg-secondary-dark placeholder:text-dull-green text-white";
      case "bright":
        return "border border-primary-green bg-secondary-green placeholder:text-primary-green text-primary-green";
      case "warning":
        return "border border-primary-red bg-secondary-red placeholder:text-red-text text-red-text";
    }
  };

  return (
    <div className="w-full mb-6">
      <div
        className={` ${
          variant == "primary"
            ? "text-white"
            : variant == "bright"
            ? "text-primary-green"
            : "text-red-text"
        } text-xl`}>
        {label}
      </div>
      <div
        className={`mt-4 mb-2 w-full h-[62px] border  px-4 py-2.5 flex items-center ${returnInputClass()}`}>
        <input
          className={`w-full h-[80%] outline-none border-none ${
            variant == "primary"
              ? "text-white placeholder:text-dull-green"
              : variant == "bright"
              ? "text-primary-green greenAutoFill"
              : "text-red-text placeholder:text-red-text redAutoFill"
          }  ${className}`}
          type="text"
          {...rest}
        />
      </div>
      {description && (
        <p className="text-white text-xs font-medium leading-5">
          {description}
        </p>
      )}
      {error && (
        <p className="text-xs text-red-text capitalize font-medium leading-5">
          {error}
        </p>
      )}
    </div>
  );
};

export default BigInput;
