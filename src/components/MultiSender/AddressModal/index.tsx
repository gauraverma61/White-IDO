import DataList from "@molecules/DataList";
import Modal from "@molecules/Modal";
import React, { Dispatch, SetStateAction } from "react";
import Button from "@atoms/Button";

interface Iprops {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  data: { address: string; amount: string }[];
}

const AddressModal = (props: Iprops) => {
  const { showModal, setShowModal, data } = props;
  return (
    <Modal
      isOpen={showModal}
      setIsOpen={setShowModal}
      className=" md:mx-2.5 mx-auto pt-9 pb-8  shadow-lg bg-white">
      <div className="p-3 md:p-8 w-full md:w-[688px]">
        <div className="flex items-center justify-between mb-10 pb-6 bt-10 border-b border-bordergraydark ">
          <div>Address</div>
          <div>Amount</div>
        </div>
        {data &&
          data.map((data, index) => {
            return (
              <DataList
                key={index}
                typeAddress
                infoTitle={data.address}
                infoValue={data.amount}
                firstColumnClass={
                  "w-[170px] sm:w-auto overflow-x-scroll sm:overflow-x-auto "
                }
              />
            );
          })}
        <div className="flex justify-center w-full mt-10">
          <Button
            className="w-full sm:w-44"
            onClick={() => props.setShowModal(false)}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddressModal;
