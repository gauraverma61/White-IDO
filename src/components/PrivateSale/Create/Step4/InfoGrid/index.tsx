import React from "react";
import styles from "./infogrid.module.scss";

interface Iprops {
  title: string;
  value: string;
  fullWidth?: boolean;
}

const GridInfoTab = (props: Iprops) => {
  const { title, value, fullWidth } = props;
  if (props.title == "Description" || props.title == "description") {
    return (
      <div
        className={`${styles.tab} text-left relative col-span-2 md:col-span-3 min-h-[150px] overflow-auto `}>
        <div className="text-lg font-semibold">{title}</div>
        <div className="text-sm">{value}</div>
      </div>
    );
  }
  return (
    <div
      className={`${styles.tab} text-left relative overflow-auto ${
        fullWidth ? "col-span-2 md:col-span-3" : ""
      }`}>
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-sm">{title}</div>
    </div>
  );
};

const InfoGrid = ({ data }: { data: Iprops[] }) => {
  return (
    <div className={`${styles.container}`}>
      {data.map((data, index) => {
        if (data.value !== "") {
          return <GridInfoTab key={index} {...data} />;
        }
      })}
    </div>
  );
};

export default InfoGrid;
