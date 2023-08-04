import SearchInput from "@atoms/SearchInput";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { IconType } from "react-icons";
import { MdOutlineSearch } from "react-icons/md";
import styles from "./index.module.scss";

interface IOptions {
  label: string;
  name: string;
}

interface IProps {
  // onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
  widthClass?: string;
  options?: IOptions[];
  checkedItems?: string[];
  Icon?: IconType;
  isSearch?: boolean;
  setCheckedItems?: any;
  getSearchValue?: Function;
  isSingleSelect?: boolean;
  isFilterSelected?: boolean;
}

const CheckBoxDropdown: React.FC<IProps> = ({
  title,
  options,
  checkedItems,
  setCheckedItems,
  Icon,
  isSearch,
  widthClass,
  getSearchValue,
  isSingleSelect,
  isFilterSelected,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchText, setSearchText] = useState("");
  let id = useId();
  let key = useId();

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (setCheckedItems && checkedItems) {
      let updatedList = [...checkedItems];
      if (event.target.checked) {
        updatedList = [...checkedItems, event.target.name];
      } else {
        updatedList.splice(checkedItems.indexOf(event.target.name), 1);
      }
      setCheckedItems(updatedList);
    }
    if (isSingleSelect && setCheckedItems && checkedItems) {
      let updatedList: string[] = [];
      if (event.target.checked) {
        updatedList = [event.target.name];
      } else {
        updatedList.splice(checkedItems.indexOf(event.target.name), 1);
      }
      setCheckedItems(updatedList);
    }
  };
  const handleReset = () => {
    if (setCheckedItems) {
      setCheckedItems([]);
    }
    setShowDropdown(!showDropdown);
    getSearchValue && getSearchValue("");
    setSearchText("");
  };

  const getSearchValuetxt = () => {
    return getSearchValue && getSearchValue(searchText);
  };

  return (
    <div ref={dropdownRef} className="w-full relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        id={title}
        className={`text-white truncate appearance-none border border-primary-green px-4 h-12 focus:outline-none font-semibold  text-base 2xl:text-lg justify-between  text-center inline-flex gap-4 items-center w-full ${widthClass}`}
        type="button">
        {title}
        {Icon && (
          <Icon
            size={20}
            className={`${
              isFilterSelected ? "text-primary-green" : "text-white"
            }`}
          />
        )}
      </button>
      <div
        className={`${
          showDropdown ? "block" : "hidden"
        } absolute   right-0 top-[3.4rem]  z-30 bg-primary-dark rounded shadow-lg border border-tertiary-green-border p-3 w-40`}>
        <div className="max-h-52 overflow-y-auto">
          {isSearch && (
            <SearchInput
              Icon={MdOutlineSearch}
              className="my-3 !bg-primary-dark"
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
            />
          )}
          {options &&
            options.length > 0 &&
            options.map(({ name, label }) => (
              <>
                {name && (
                  <div
                    key={`${key}-${label}`}
                    className="mb-3 flex text-white items-center justify-start ml-8  cursor-pointer">
                    <input
                      onChange={handleCheckbox}
                      className={`${styles.checkbox} hidden  cursor-pointer `}
                      type="checkbox"
                      name={name}
                      id={`${id}-${label}`}
                      checked={checkedItems && checkedItems.includes(name)}
                    />
                    <label
                      htmlFor={`${id}-${label}`}
                      className={`${styles.checkbox_label}  text-sm xl:text-base font-medium w-full text-left  cursor-pointer`}>
                      {label}
                    </label>
                  </div>
                )}
              </>
            ))}
        </div>

        <div className="flex justify-center text-xs gap-2 my-3 ">
          <p
            onClick={() => {
              setShowDropdown(!showDropdown);
              getSearchValuetxt();
            }}
            className="bg-green5 text-tertiary-green flex-[0.5] text-center cursor-pointer rounded-old-md p-2 px-2.5">
            {isSearch ? "Search" : "Ok"}
          </p>
          <p
            onClick={handleReset}
            className="bg-primary-green flex-[0.5] text-center cursor-pointer rounded-old-md p-2 px-2.5">
            {"Reset"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckBoxDropdown;
