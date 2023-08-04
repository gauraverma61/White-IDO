import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import PadCard from "@molecules/PadCard";
import AllLaunchpads from "./AllLaunchpads";
import MyContribution from "./MyContribution";
import { MdOutlineSearch } from "react-icons/md";
import CheckBoxDropdown from "@atoms/CheckboxDropdownV2";
import {
  HCOptions,
  KycOptions,
  ProgressOptions,
} from "@constants/tableDropdownOptions";
import { BiCaretDown } from "react-icons/bi";
import useWidth from "@hooks/useWidth";

export interface IChildProps {
  checkedProgress: string[];
  checkedKyc?: string[];
  checkedType?: string[];
  setCheckedProgress: Dispatch<SetStateAction<string[]>>;
  setCheckedKyc: Dispatch<SetStateAction<undefined | string[]>>;
  setCheckedType: Dispatch<SetStateAction<undefined | string[]>>;
}

const Tabs = [
  {
    title: "All",
  },
  {
    title: "My Contribution",
  },
];

export const LAUNCHPAD_LIMIT = 3;
export const MYCONTRIBUTION_LIMIT = 3;
export const UPCOMING_LIMIT = 3;

const LaunchpadList = ({
  type,
}: {
  type: "Private" | "Fairlaunch" | "Presale" | undefined;
}) => {
  const width = useWidth();
  const [currentTab, setCurrentTab] = React.useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [checkedProgress, setCheckedProgress] = useState<string[]>([]);
  const [checkedKyc, setCheckedKyc] = useState<undefined | string[]>([]);
  const [checkedType, setCheckedType] = useState<undefined | string[]>([]);

  const renderTab = (tabIndex: number) => {
    return (
      <li
        className="mr-10  cursor-pointer flex gap-2 items-center "
        onClick={() => setCurrentTab(tabIndex)}>
        <div className="py-2 relative">
          <div
            className={`whitespace-nowrap  ${
              currentTab === tabIndex
                ? "font-semibold  text-primary-green"
                : "text-white"
            }`}>
            {Tabs[tabIndex].title}
          </div>
        </div>
      </li>
    );
  };

  const Props: IChildProps = {
    checkedKyc,
    setCheckedKyc,
    checkedProgress,
    setCheckedProgress,
    checkedType,
    setCheckedType,
  };

  return (
    <div className="pt-20 pb-12">
      <div className="mt-[4.375rem] flex flex-col gap-5 md:flex-row md:justify-between md:items-center">
        <div className="flex gap-3 relative">
          {Tabs.map((tab, index) => renderTab(index))}
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4  mt-8 md:justify-between md:items-center">
        <div className="flex sm:w-1/2  gap-4 text-base items-center border border-primary-green  px-4 bg-tertiary-dark">
          <MdOutlineSearch className="text-primary-green" size={22} />
          <input
            className="w-full bg-transparent !h-12 border-none outline-none text-white placeholder:text-dull-green2"
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
          />
        </div>

        <div
          className={`flex items-center gap-4 ${
            width < 500 ? "flex-col" : ""
          }`}>
          <CheckBoxDropdown
            checkedItems={checkedType}
            setCheckedItems={setCheckedType}
            title={"Presale type"}
            options={HCOptions}
            Icon={BiCaretDown}
            isFilterSelected={checkedType && checkedType?.length > 0}
            widthClass={"min-w-[5rem]"}
          />
          <CheckBoxDropdown
            checkedItems={checkedProgress}
            setCheckedItems={setCheckedProgress}
            title={"Progress"}
            options={ProgressOptions}
            Icon={BiCaretDown}
            isFilterSelected={checkedProgress && checkedProgress?.length > 0}
            widthClass={"min-w-[5rem]"}
            isSingleSelect={true}
          />
          <CheckBoxDropdown
            checkedItems={checkedKyc}
            setCheckedItems={setCheckedKyc}
            title={"Badges"}
            options={KycOptions}
            Icon={BiCaretDown}
            isFilterSelected={checkedKyc && checkedKyc?.length > 0}
            widthClass={"min-w-[5rem]"}
          />
        </div>
      </div>

      <>
        {currentTab === 0 && (
          <AllLaunchpads searchValue={searchValue} type={type} Props={Props} />
        )}
        {currentTab === 1 && (
          <MyContribution searchValue={searchValue} type={type} Props={Props} />
        )}
      </>
    </div>
  );
};

export default LaunchpadList;
