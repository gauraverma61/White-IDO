import { Disclosure, Transition } from "@headlessui/react";
import { MdArrowDropDown } from "react-icons/md";

interface IProps {
  title: string;
  children: React.ReactNode;
  icon?: any;
  defaultOpen?: boolean;
}

export default function Accordian({
  title,
  children,
  icon,
  defaultOpen,
}: IProps) {
  return (
    <div className="w-full">
      <div className="w-full  ">
        <Disclosure defaultOpen={defaultOpen}>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full  px-6  py-3 text-left text-white text-base font-medium">
                <div className="flex flex-1 items-center text-base font-medium ">
                  {/* <div className="mr-3 h-[18px] w-[18px] relative flex-shrink-0">
                    <Image layout="fill" objectFit="fill" src={icon} alt="" />
                  </div> */}
                  <p className="whitespace-nowrap">{title}</p>
                </div>
                <MdArrowDropDown
                  className={`${!open ? "" : "rotate-180 transform"} h-4 w-4`}
                />
              </Disclosure.Button>
              <Transition
                show={open}
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-100 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0">
                <Disclosure.Panel className={`pb-2 text-base`}>
                  {children}
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}
