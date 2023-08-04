import React from "react";

interface IProps {
  infoTitle: string;
  infoValue: string;
  addressColorClass?: string;
  firstColumnClass?: string;
  secondColumnClass?: string;
  withoutBorder?: boolean;
  typeAddress?: boolean;
}

const DataList = (props: IProps) => {
  const {
    infoTitle,
    infoValue,
    addressColorClass,
    firstColumnClass,
    secondColumnClass,
    withoutBorder,
    typeAddress,
  } = props;
  return (
    <div
      className={`h-16 md:h-[50px] flex ${
        typeAddress ? "flex-nowrap gap-6" : "flex-wrap"
      } justify-between items-center text-base ${
        !withoutBorder ? "border-b border-bordergraylight" : ""
      } `}>
      <div className={`font-medium ${firstColumnClass}`}>{infoTitle}</div>
      <div
        className={`${
          infoTitle == "Token Address" &&
          addressColorClass &&
          `${addressColorClass}`
        } font-medium ${secondColumnClass}`}>
        {infoValue}
      </div>
    </div>
  );
};

export default DataList;
