import React from "react";
import { addressArray } from "..";
import AddressModal from "../AddressModal";
import styles from "./infogrid.module.scss";

interface Iprops {
  title: string;
  value: string;
  showAddress?: boolean;
  showAddressText?: string;
  showAddressHandler: (value: boolean) => void;
}

const GridInfoTab = (props: Iprops) => {
  return (
    <div className={`${styles.tab} text-left relative`}>
      {props.showAddress && (
        <div
          onClick={() => props.showAddressHandler(true)}
          className="absolute top-1.5 right-1.5 text-xs font-normal cursor-pointer text-red-text4">
          {props.showAddressText}
        </div>
      )}
      <div className="text-base text-text1 font-semibold capitalize">
        {props.value}
      </div>
      <div className="text-sm font-normal text-text2 capitalize">
        {props.title}
      </div>
    </div>
  );
};

interface IpropsGridData {
  title: string;
  value: string;
  showAddress?: boolean;
  showAddressText?: string;
}

const InfoGrid = ({
  gridData,
  addressData,
}: {
  gridData: IpropsGridData[];
  addressData: addressArray;
}) => {
  const [showAddressModal, setShowAddressModal] = React.useState(false);

  return (
    <>
      <div className={`${styles.container} shadow-boxShadow6 px-4 py-3 `}>
        {gridData.map((data, index) => {
          return (
            <GridInfoTab
              key={index}
              {...data}
              showAddressHandler={setShowAddressModal}
            />
          );
        })}
      </div>
      <AddressModal
        showModal={showAddressModal}
        setShowModal={setShowAddressModal}
        data={addressData}
      />
    </>
  );
};

export default InfoGrid;
