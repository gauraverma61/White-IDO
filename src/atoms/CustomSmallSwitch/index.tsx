import React from "react";
import { Switch } from "@headlessui/react";

interface Iprops {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
  label?: string;
  className?: string;
  enableColor?: string;
  disableColor?: string;
}

const SmallSwitch = (props: Iprops) => {
  const { enabled, setEnabled, label, className, enableColor, disableColor } =
    props;
  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <div className="text-primary-green text-xl font-medium capitalize">
          {label}
        </div>
        <Switch
          checked={enabled}
          onChange={setEnabled}
          className={`${
            enabled ? "bg-primary-green" : "bg-white"
          } relative inline-flex h-[15px] w-[38px] shrink-0 cursor-pointer rounded-old-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}>
          <span className="sr-only">Use setting</span>
          <span
            aria-hidden="true"
            className={`${
              enabled
                ? `translate-x-6 bg-[#ffffff]`
                : `translate-x-1 ${disableColor ?? "bg-slate-400"}`
            }
            pointer-events-none inline-block h-[12px] w-[12px] transform rounded-old-full  my-auto shadow-lg ring-0 transition duration-200 ease-in-out`}
          />
        </Switch>
      </div>
    </div>
  );
};

export default SmallSwitch;
