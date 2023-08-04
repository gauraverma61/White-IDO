import React from "react";
import CopyAddress from "@components/Details/CopyAddress";

interface Iprops {
  title: string;
  value: string | number;
  fullWidth?: boolean;
  specialClass?: string;
  gridClass?: string;
  type?: "socials" | "address" | "tx" | string;
  index?: any;
}

const InfoTab = (props: Iprops) => {
  const { title, value, specialClass, type, fullWidth, gridClass, index } =
    props;
  if (type === "address" || type === "tx") {
    return (
      <div
        className={`flex justify-between w-full text-white ${
          index === 0
            ? ""
            : "border-b last:border-none border-secondary-green text-base font-medium"
        } py-3`}>
        <div className="text-sm font-normal capitalize">{title}</div>
        <CopyAddress
          containerClass={`text-sm text-red-text font-medium text-right capitalize ${specialClass}`}
          type={type}
          iconSize={18}
          address={value as string}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex justify-between w-full text-white ${
        index === 0
          ? ""
          : "border-b last:border-none border-secondary-green text-base font-medium"
      } py-3`}>
      <div className="text-sm  font-normal capitalize">{title}</div>
      <div
        className={`text-sm font-medium capitalize text-right text-primary-green ${specialClass}`}>
        {value}
      </div>
    </div>
  );
};

export interface IInfoListProps {
  data: Iprops[];
  specialPosition?: number[];
  specialClass?: string;
  gridClass?: string;
  index?: any;
}

const InfoList = (props: IInfoListProps) => {
  const { data, specialClass, specialPosition, gridClass } = props;
  return (
    <>
      <div className={`  mb-6 h-fit`}>
        <h2 className="text-primary-green text-3xl font-semibold mb-6 mt-2">
          Details
        </h2>
        {data
          .filter(
            (data) => data?.type !== "socials" && data?.title !== "Description"
          )
          .map((data, index) => {
            if (specialPosition?.includes(index)) {
              return (
                <InfoTab
                  specialClass={specialClass}
                  index={index}
                  key={index}
                  {...data}
                />
              );
            }
            return <InfoTab gridClass={gridClass} key={index} {...data} />;
          })}
      </div>
    </>
  );
};

export default InfoList;
