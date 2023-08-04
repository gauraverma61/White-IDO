import React from "react";
import { ICreateFairLaunch } from "..";
import Input2 from "@atoms/Input2";
import DateTimePicker from "@atoms/DateTimeInput";
import CustomSwitch from "@molecules/Switch";
import SmallSwitch from "@atoms/CustomSmallSwitch";
import RangeInput from "@atoms/RangeInput";
import moment from "moment";
import { TIME_FORMAT } from "@constants/timeFormats";
import Dropdown from "@atoms/Dropdown";
import DropdownV1 from "@atoms/DropdownV1";
import UploadImage from "@components/Common/UploadImage";

const saleMethods = [
  {
    label: "Public",
    name: "sale-methods",
  },
  {
    label: "Whitelist",
    name: "sale-methods",
  },
];

const Step2: React.FC<ICreateFairLaunch> = ({ setLaunchpadImage, formik }) => {
  const {
    values,
    errors,
    setFieldValue,
    handleChange,
    handleBlur,
    touched,
    handleSubmit,
  } = formik;

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 min-h-[300px]">
        <div>
          <div className="text-xl text-white font-medium mb-4">Upload Logo</div>
          <UploadImage
            setImageValue={(v: string) => {
              if (setLaunchpadImage) {
                setLaunchpadImage(v);
              }
              // setImageUploaded("");
            }}
            setImagesValue={setLaunchpadImage}
            classTags="upload-bgImage-sec border border-dashed icon-change"
          />
        </div>
        <div>
          <div className="text-xl text-white font-medium mb-4">
            Upload Banner
          </div>
          <div className=" border border-dashed border-primary-green py-6 text-center text-secondary-green bg-dull-green-bg ">
            Select or drag max 1 file | PNG, JPEG, PDF |{" "}
          </div>
        </div>
      </div>
    </form>
  );
};

export default Step2;
