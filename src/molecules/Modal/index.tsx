import React, { Dispatch, SetStateAction } from "react";
import { Dialog } from "@headlessui/react";

interface IProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<IProps> = ({
  isOpen,
  setIsOpen,
  children,
  className,
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
          <Dialog.Panel className={`${className}`}>{children}</Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
};

export default Modal;
