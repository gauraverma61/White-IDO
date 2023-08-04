import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Input from "@atoms/Input";
import Button from "@atoms/Button";

interface Props {
  showModal: boolean;
  setShowModal: Function;
  setVesting: Function;
  vestingData: any;
}

const SetVestingModal: React.FC<Props> = ({
  showModal,
  setShowModal,
  setVesting,
  vestingData,
}) => {
  const cancelButtonRef = useRef(null);

  const [data, setData] = useState({
    tge: "",
    cyclePercent: "",
    cycleSecond: "",
  });

  useEffect(() => {
    if (vestingData) {
      setData({
        tge: vestingData.tge,
        cyclePercent: vestingData.cyclePercent,
        cycleSecond: vestingData.cycleSecond,
      });
    }
  }, []);

  return (
    <Transition.Root show={showModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
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
          <div className="fixed inset-0 bg-black bg-opacity-90 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full justify-center p-4 text-center items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <Dialog.Panel className="relative transform overflow-hidden  bg-white text-left shadow-xl transition-all sm:my-8 max-w-[387px] w-full">
                <div className="bg-white px-7 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 text-center">
                      <span className="border-b border-[#000]">
                        Set Vesting
                      </span>
                    </Dialog.Title>
                    <div className="mt-7">
                      <div className="mb-5">
                        <Input
                          label={`TGE release percent (%)`}
                          defaultValue={data.tge}
                          onChange={(e) =>
                            setData({ ...data, tge: e.target.value })
                          }
                        />
                      </div>
                      <div className="mb-5">
                        <Input
                          label={`Cycle release percent (%)`}
                          defaultValue={data.cyclePercent}
                          onChange={(e) =>
                            setData({ ...data, cyclePercent: e.target.value })
                          }
                        />
                      </div>
                      <div className="mb-5">
                        <Input
                          label={`Cycle (Days)`}
                          defaultValue={data.cycleSecond}
                          onChange={(e) =>
                            setData({ ...data, cycleSecond: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full mb-5 mt-5 flex justify-center">
                  <Button
                    onClick={() => {
                      setShowModal(false);
                      setVesting(data);
                    }}>
                    Set Vesting
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default SetVestingModal;
