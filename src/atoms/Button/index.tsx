import React from "react";
import { AiOutlineLoading } from "react-icons/ai";

type IVariant =
  | "outline"
  | "primary"
  | "primary-sm"
  | "success"
  | "cancel"
  | "orange"
  | "primary-xs"
  | "new-black"
  | "new-outline"
  | "accent-1"
  | "accent-2"
  | "green1"
  | "green2"
  | "bigGreen"
  | "bigOutline";
interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode | string;
  type?: "button" | "submit" | "reset";
  variant?: IVariant;
  disabled?: boolean;
  onClick?: (e: React.FormEvent<HTMLButtonElement>) => void;
  loading?: boolean;
}

const Button: React.FC<IButtonProps> = ({
  className,
  children,
  type = "button",
  disabled,
  variant = "primary",
  onClick,
  loading,
  ...rest
}) => {
  const returnBg = (variant: IVariant) => {
    switch (variant) {
      case "primary":
        return "bg-primary-green text-black px-4 sm:px-6 lg:px-16 py-4 md:min-w-[180px] text-lg sm:text-xl font-semibold ";
      case "primary-sm":
        return "bg-gray2 text-white hover:bg-white hover:outline hover:outline-1 hover:outline-gray2 hover:text-gray2 px-[25px] py-[12px] md:py-[20px]";
      case "primary-xs":
        return "bg-gray2 text-white hover:bg-white hover:outline hover:outline-1 hover:outline-gray2 hover:text-gray2 px-3 ";
      case "outline":
        return "bg-none text-primary-green border border-primary-green px-4 sm:px-6 lg:px-16 py-4 md:min-w-[200px] text-xl font-semibold ";
      case "success":
        return "bg-btn-success text-white rounded-old-full  hover:bg-btn-success/90 px-4 sm:px-6 lg:px-16  py-3 w-full min-w-[180px]";
      case "cancel":
        return "bg-white text-red4 border rounded-old-full  border-red4 hover:bg-gray-100 px-4 sm:px-6 lg:px-16  py-3 min-w-[180px]";
      case "orange":
        return "bg-theme-orange cursor-pointer text-white outline rounded-old-full disabled:opacity-70 hover:outline hover:outline-1 hover:outline-theme-orange hover:bg-white hover:text-theme-orange   px-4 sm:px-6 lg:px-16  py-3 min-w-[180px]";
      case "new-black":
        return "text-xl bg-black  text-white px-8 py-4 my-4";
      case "new-outline":
        return "text-xl bg-white border-black border  text-black px-8 py-4 my-4";
      case "accent-1":
        return `text-lg sm:text-xl md:px-20  text-primary-green py-3 my-4 w-full md:w-auto`;
      case "accent-2":
        return `text-md sm:text-xl md:px-20  bg-primary-green py-3 my-4 w-full text-secondary-dark`;
      case "green1":
        return "text-md text-primary-green sm:text-xl  border border-primary-green w-full bg-green5 py-3 h-fit";
      case "green2":
        return "text-md sm:text-xl  border border-primary-green w-full bg-blur-background2 py-3 h-fit";
      case "bigGreen":
        return "text-md sm:text-xl   w-full text-black bg-primary-green py-3 h-fit";
      case "bigOutline":
        return "text-md sm:text-xl  border border-primary-green w-full bg-black py-3 h-fit";
    }
  };

  return (
    <button
      className={`${returnBg(
        variant
      )}  flex justify-center items-center ${className} ${
        disabled ? "cursor-not-allowed" : ""
      }`}
      type={type}
      onClick={onClick}
      disabled={disabled}
      {...rest}>
      {loading ? (
        <div className="animate-spin inline-flex h-full">
          <AiOutlineLoading className=" font-medium" size={24} />
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
