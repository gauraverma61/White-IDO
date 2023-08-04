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

const Dropdown3: React.FC<IDropdownProps> = ({
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
    <div
      ref={dropdownRef}
      className={`relative overflow-x-visible ${className}`}>
      <div className="text-white text-xl font-medium mb-4">{label}</div>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        id="dropdownDefault"
        data-dropdown-toggle="dropdown"
        className="text-white appearance-none focus:outline-none font-medium text-xl text-center inline-flex justify-between items-center w-full border border-primary-green  bg-dull-green-bg px-7"
        type="button">
        {selectedOption ?? label}
        <svg
          className="w-4 h-4 ml-2"
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
        } absolute z-50 border border-primary-green  bg-dull-green-bg divide-y divide-gray-100 shadow w-full px-7 pt-5 `}>
        <ul className=" text-white min-w-fit" aria-labelledby="dropdownDefault">
          {dropdownList?.map((dl, index) => (
            <li key={`dl-${index}`}>
              <div
                onClick={() => handleSelectOption(dl)}
                className="block cursor-pointer hover:bg-primary-focus font-medium text-xl min-w-fit mb-5 ">
                {dl}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dropdown3;
