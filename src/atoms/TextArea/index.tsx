import React from "react";

interface ITextArea extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  className?: string;
  textAreaHeight?: string;
  error?: any;
}

const TextArea: React.FC<ITextArea> = ({
  label,
  className,
  textAreaHeight,
  error,
  ...rest
}) => {
  return (
    <>
      <div
        className={`flex flex-col border-2 border-primary-green p-3  ${className}`}>
        <label htmlFor={label} className="text-base font-medium capitalize">
          {label}
        </label>
        <textarea
          id={label}
          {...rest}
          className={`${textAreaHeight} outline-none text-primary-green`}></textarea>
      </div>
      {error && (
        <p className="text-xs text-red-text capitalize font-medium leading-5">
          {error}
        </p>
      )}
    </>
  );
};

export default TextArea;
