import RadioButtonGroup, { IOption } from "@atoms/RadioButtonGroup";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
interface IDropdownProps {
  label: string;
  dropdownList: IOption[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  note?: string;
}

const RadioDropdown: React.FC<IDropdownProps> = ({
  dropdownList,
  label,
  onChange,
  note,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    setShowDropdown(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-full md:w-56 ">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        id="dropdownDefault"
        data-dropdown-toggle="dropdown"
        className="text-gray1  appearance-none border-b-2 border-b-[#C6C6C6] focus:outline-none font-medium  text-sm  py-2.5 text-center inline-flex justify-between items-center w-full"
        type="button">
        {label}
        <svg
          className="ml-2 w-4 h-4"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      <div
        id="dropdown"
        className={`${
          showDropdown ? "block" : "hidden"
        } absolute  z-50 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 p-3 w-full`}>
        <RadioButtonGroup
          options={dropdownList}
          onChange={handleOnchange}
          className="mb-4"
          variant="verticle"
        />
        {note && <p className="text-xs font-normal">{note}</p>}
      </div>
    </div>
  );
};

export default RadioDropdown;
