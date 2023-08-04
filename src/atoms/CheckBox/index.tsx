import React from "react";
import { useId } from "react";
import styles from "./index.module.scss";

interface Iprops {
  label: string;
  isChecked: boolean;
  setIsChecked: (value: boolean) => void;
}

const CustomCheckbox = (props: Iprops) => {
  const { label, isChecked, setIsChecked } = props;
  const Clickhandler = () => setIsChecked(!isChecked);
  let ID = useId();
  return (
    <div>
      <input
        onClick={Clickhandler}
        className={`${styles.checkbox} hidden `}
        type="checkbox"
        name=""
        id={ID}
        checked={isChecked}
      />
      <label
        htmlFor={ID}
        className={`${styles.checkbox_label} flex flex-col ml-10 cursor-pointer`}>
        <div className="text-base font-normal">{label}</div>
      </label>
    </div>
  );
};

export default CustomCheckbox;
