import React, { Dispatch, SetStateAction } from "react";
import { Dialog } from "@headlessui/react";
import Input from "@atoms/Input";
import Button from "@atoms/Button";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setIsOpenStep4: Dispatch<SetStateAction<boolean>>;
}

const TransactionModal: React.FC<IProps> = ({
  isOpen,
  setIsOpen,
  setIsOpenStep4,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(!isOpen)}
      className="relative z-50">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="text-base font-medium flex min-h-full items-center justify-center p-4">
          <Dialog.Panel className="mx-auto pt-9 pb-8 max-w-md  shadow-lg bg-white">
            <div className="px-7 pb-3 flex gap-8 border-b border-gray4">
              <p className="text-base font-bold cursor-pointer">Details</p>
              <p className="text-base font-normal cursor-pointer">Data</p>
            </div>
            <div className="px-7 pt-9">
              <div className="flex justify-between mb-7">
                <p>Gas fee</p>
                <div className="flex flex-col items-end">
                  <p className="text-lg">0.001856</p>
                  <p className="text-gray5 font-normal text-sm">
                    No conversion rate available
                  </p>
                </div>
              </div>

              <Input className="mb-7" label={"Gas Price (GWEI)"} />
              <Input className="mb-7" label={"Gas Limit"} />
              <div className="flex justify-between mb-7">
                <p>Total</p>
                <div className="flex flex-col items-end">
                  <p className="text-gray5 font-normal text-sm">
                    Amount + Gas fee
                  </p>
                  <p className="text-lg">0.001856</p>
                  <p className="text-gray5 font-normal text-sm">
                    No conversion rate available
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-center mt-16">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Reject
                </Button>
                <Button
                  variant="success"
                  onClick={() => {
                    setIsOpenStep4(true);
                    setIsOpen(false);
                  }}>
                  Confirm
                </Button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default TransactionModal;
