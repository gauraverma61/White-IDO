import React, { Dispatch, SetStateAction } from "react";
import Modal from "@molecules/Modal";
import { IoCloseOutline } from "react-icons/io5";

interface Iprops {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const ExampleModal = (props: Iprops) => {
  const { showModal, setShowModal } = props;
  return (
    <Modal
      isOpen={showModal}
      setIsOpen={setShowModal}
      className="mx-2.5 h-full relative   flex items-center  bg-primary-dark border border-[#02EEAB] p-8">
      <IoCloseOutline
        color="#05CD94"
        size={26}
        onClick={() => setShowModal(false)}
        className="absolute top-3 right-5 cursor-pointer"
      />
      <div className="w-full break-words">
        <p className="text-[#05CD94] text-xl font-semibold mb-5">Examples</p>
        <p className="text-white text-base font-medium">
          {"For ERC20 or mMATIC (address, amount)"}
        </p>
        <p className="text-[#075A40] text-base font-medium break-words">
          khb5152jkmOcdcbiknsd1025sds6Dbdverv21d4,100
        </p>
        <p className="text-[#075A40] text-base font-medium break-words">
          cfs152jkmOcdcbiknsd1025sds6DverHHv21d4,556
        </p>
        <p className="text-[#075A40] text-base font-medium break-words">
          cCxs5152jkmOcdcbiknsd1025sds6Dverv2HBG1d4,282
        </p>
      </div>
    </Modal>
  );
};

export default ExampleModal;
