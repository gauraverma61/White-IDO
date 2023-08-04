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
  checkedItems?: { [key: string]: boolean };
  Icon?: IconType;
  isSearch?: boolean;
  setCheckedItems?: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
  getSearchValue?: Function;
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
    if (setCheckedItems) {
      setCheckedItems({
        ...checkedItems,
        [event.target.name]: event.target.checked,
      });
    }
  };
  const handleReset = () => {
    if (setCheckedItems) {
      setCheckedItems({});
    }
    setShowDropdown(!showDropdown);
    getSearchValue && getSearchValue("");
    setSearchText("");
  };

  const getSearchValuetxt = () => {
    return getSearchValue && getSearchValue(searchText);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        id={title}
        className={`text-gray1  appearance-none focus:outline-none font-semibold  text-[15px]  py-2.5 text-center inline-flex justify-between items-center w-full ${widthClass}`}
        type="button">
        {title}
        {Icon && <Icon size={20} />}
      </button>
      <div
        className={`${
          showDropdown ? "block" : "hidden"
        } absolute  z-10 bg-white rounded shadow-lg p-3 w-40`}>
        {isSearch && (
          <SearchInput
            Icon={MdOutlineSearch}
            className="my-3"
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
                  className="mb-2.5 flex items-center justify-start ml-8  cursor-pointer">
                  <input
                    onChange={handleCheckbox}
                    className={`${styles.checkbox} hidden  cursor-pointer `}
                    type="checkbox"
                    name={name}
                    id={`${id}-${label}`}
                    checked={checkedItems && checkedItems[name]}
                  />
                  <label
                    htmlFor={`${id}-${label}`}
                    className={`${styles.checkbox_label}  text-xs font-medium w-full text-left  cursor-pointer`}>
                    {label}
                  </label>
                </div>
              )}
            </>
          ))}
        <div className="flex justify-center text-xs gap-2 my-3 ">
          <p
            onClick={() => {
              setShowDropdown(!showDropdown);
              getSearchValuetxt();
            }}
            className="bg-gray2 flex-[0.5] text-center cursor-pointer rounded-old-3xl p-2 px-2.5 text-white hover:bg-white hover:outline hover:outline-1 hover:outline-gray2 hover:text-gray2">
            {isSearch ? "Search" : "Ok"}
          </p>
          <p
            onClick={handleReset}
            className="bg-white flex-[0.5] text-center cursor-pointer rounded-old-3xl p-2 px-2.5 border border-gray2 text-gray2 hover:bg-gray2 hover:text-white">
            {"Reset"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckBoxDropdown;
