import React, { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FiUpload } from "react-icons/fi";
import Button from "@atoms/Button";
import { useCSVReader, formatFileSize } from "react-papaparse";

interface IProps {
  showModal: boolean;
  setShowModal: Function;
  setCSVData: any;
}

const UploadFile: React.FC<IProps> = ({
  showModal,
  setShowModal,
  setCSVData,
}) => {
  const cancelButtonRef = useRef(null);
  const { CSVReader } = useCSVReader();

  return (
    <Transition.Root show={showModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-70"
        initialFocus={cancelButtonRef}
        onClose={() => setShowModal(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div
            className="fixed z-10 inset-0 bg-black/30 backdrop-blur-sm"
            aria-hidden="true"
          />
        </Transition.Child>
        <div className="fixed inset-0 z-20 overflow-y-auto">
          <div className="flex min-h-full justify-center p-4 text-center items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <Dialog.Panel className="relative flex justify-center items-center transform overflow-hidden  bg-primary-dark border border-dashed border-[#02EEAB]  text-left shadow-xl transition-all sm:my-8 max-w-[450px] w-full">
                <CSVReader
                  onUploadAccepted={(results: any) => {
                    setCSVData(results.data);
                    setShowModal(false);
                  }}>
                  {({
                    getRootProps,
                    acceptedFile,
                    ProgressBar,
                    getRemoveFileProps,
                    Remove,
                  }: any) => (
                    <>
                      <div
                        className={` text-[#02EEAB] flex flex-col items-center py-8 px-8 w-full ${
                          !acceptedFile ? "cursor-pointer" : ""
                        }`}
                        {...getRootProps()}>
                        {acceptedFile ? (
                          <>
                            <div className="w-full md:w-9/12 lg:w-1/2 flex flex-col items-center text-text3">
                              <div className="text-base font-medium">
                                <span className="mr-2.5">
                                  {formatFileSize(acceptedFile.size)}
                                </span>
                                <span>{acceptedFile.name}</span>
                              </div>
                              <div
                                className="my-5 cursor-pointer "
                                {...getRemoveFileProps()}
                                onMouseOver={(event: Event) => {
                                  event.preventDefault();
                                }}
                                onMouseOut={(event: Event) => {
                                  event.preventDefault();
                                }}>
                                <Remove />
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <FiUpload size={40} />
                            <p className="text-white text-xl font-medium my-5">
                              Drag & Drop to Upload File
                            </p>
                            <p className="text-[#06845C] mb-5">OR</p>
                            <Button
                              variant="bigGreen"
                              className="bg-[#02EEAB] text-sm max-w-[180px] ">
                              Browse File
                            </Button>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </CSVReader>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default UploadFile;
