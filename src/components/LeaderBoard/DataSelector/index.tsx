import React, { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { MdArrowDropDown } from "react-icons/md";
import { IWeekType } from "../Others";

interface Iprops {
  totalWeek: IWeekType[];
  getCurrentTab: (index: number, data: IWeekType) => void;
  currentTab: number;
}
const DateSelector = (props: Iprops) => {
  const [open, setOpen] = React.useState(false);
  const { totalWeek, getCurrentTab, currentTab } = props;
  return (
    <div>
      <Popover className="">
        {({ open, close }) => (
          <>
            <Popover.Button
              className={`
                ${open ? "" : "text-opacity-90"}
                group inline-flex items-center px-3 py-2 text-base font-medium outline-none text-white`}>
              <MdArrowDropDown size={20} />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1">
              <Popover.Panel className="absolute right-6 md:right-8 lg:right-14 z-10 mt-3 max-w-sm px-4 sm:px-0 w-auto">
                <div className="overflow-hidden lg:w-[249px] h-[280px]  shadow-lg ring-1 ring-black ring-opacity-5 border border-primary-green bg-black p-6">
                  <div className=" overflow-y-auto h-full ">
                    {totalWeek &&
                      totalWeek.map((data: IWeekType, index) => {
                        return (
                          <div
                            key={index}
                            className={`cursor-pointer text-center text-lg font-semibold min-w-fit px-6 py-3 rounded-old-md ${
                              currentTab === index ? "text-primary-green" : ""
                            }`}
                            onClick={() => {
                              getCurrentTab(index, data);
                              close();
                            }}>
                            {`Week ${data.weekNumber}/${data.weekYear}`}
                          </div>
                        );
                      })}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
};

export default DateSelector;
