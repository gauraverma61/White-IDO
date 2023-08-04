import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
interface IDropdownProps {
  label?: string;
  className?: string;
  dropdownList: string[];
  selectedOption: string | undefined;
  setSelectedOption: Dispatch<SetStateAction<string | undefined>>;
}

const Dropdown: React.FC<IDropdownProps> = ({
  dropdownList,
  setSelectedOption,
  selectedOption,
  label,
  className,
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

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const handleSelectOption = (item: string) => {
    setSelectedOption(item);
    setShowDropdown(false);
  };

  return (
    <div ref={dropdownRef} className={`relative  ${className}`}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        id="dropdownDefault"
        data-dropdown-toggle="dropdown"
        className="text-gray1  appearance-none border-b border-b-[#C6C6C6] focus:outline-none font-medium  text-sm  py-2.5 text-center inline-flex justify-between items-center w-full"
        type="button">
        {selectedOption ?? label}
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
        } absolute z-50 bg-white rounded divide-y divide-gray-100 shadow w-full`}>
        <ul
          className="py-1 text-sm text-gray-700"
          aria-labelledby="dropdownDefault">
          {dropdownList.map((dl, index) => (
            <li key={`dl-${index}`}>
              <div
                onClick={() => handleSelectOption(dl)}
                className="block cursor-pointer py-2 px-4 hover:bg-gray-100 font-medium text-sm">
                {dl}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dropdown;
