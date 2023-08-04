import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Input from "@atoms/Input";
import RadioButtonGroup from "@atoms/RadioButtonGroup";

import useWidth from "@hooks/useWidth";

import moment from "moment";
import Button from "@atoms/Button";

interface Props {
  showModal: boolean;
  setShowModal: Function;
  setStartAirdropTime: Function;
}

const saleMethods = [
  // {
  //   label: "Start now",
  //   name: "sale-methods",
  // },
  {
    label: "Start with specific time",
    name: "sale-methods",
  },
];

const SetTimeAiredropModal: React.FC<Props> = ({
  showModal,
  setShowModal,
  setStartAirdropTime,
}) => {
  const cancelButtonRef = useRef(null);
  const width = useWidth();

  const [saleMethod, setSaleMethod] = useState<String>(saleMethods[0].label);

  const saleRadioHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSaleMethod(event.target.value);
  };

  const [timeValue, setTimeValue] = useState(moment());

  const setTime = (value: string) => {
    return setTimeValue(moment(value));
  };

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
              <Dialog.Panel className="relative transform overflow-hidden  bg-white text-left shadow-xl transition-all sm:my-8 max-w-[387px]">
                <div className="bg-white px-7 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="text-center sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 text-center">
                      <span className="border-b border-[#000]">
                        Set Time Airdrop
                      </span>
                    </Dialog.Title>
                    <div className="mt-7">
                      <RadioButtonGroup
                        label={"Set time to start airdrop"}
                        options={saleMethods}
                        onChange={saleRadioHandler}
                        className="mb-10"
                        variant={width < 500 ? "verticle" : "horizontal"}
                      />
                      {saleMethod === "Start with specific time" && (
                        <>
                          <Input
                            label={`Start Time (UTC)*`}
                            type={"datetime-local"}
                            name="startTime"
                            onChange={(e) => setTime(e.target.value)}
                          />
                          <p className="text-[12px] mt-2">
                            Set the time that you want to start this airdrop
                          </p>
                        </>
                      )}
                      {/* <p className="mt-7 text-[12px] text-[#FF0000]">
                        You need atleast 2000hsgxbcjss8956123 to start airdrop.{" "}
                        <br />
                        Your balance is 10000hsgxbcjss8956123
                      </p> */}
                    </div>
                  </div>
                </div>
                <div className="w-full mb-5 mt-5 flex justify-center">
                  <Button
                    onClick={() => {
                      setShowModal(false);
                      setStartAirdropTime(timeValue);
                    }}>
                    Start Airdrop
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

export default SetTimeAiredropModal;
