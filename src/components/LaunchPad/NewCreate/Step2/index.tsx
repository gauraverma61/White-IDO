import React from "react";
import { ICreateLaunchpad, ICreateLaunchpadFormData } from "..";
import UploadImage from "@components/Common/UploadImage";
import { FormikContextType } from "formik/dist/types";
import { FormikValues } from "formik";

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

const Step2: React.FC<{
  formik: FormikContextType<any>;
  launchpadImage: string;
  setLaunchpadImage: (value: string) => void;
  setLaunchpadImages: Function;
  launchpadBannerImage: string;
  setLaunchpadBannerImage: (value: string) => void;
  setLaunchpadBannerImages: Function;
  setImageUploaded: Function;
  setBannerUploaded: Function;
}> = ({
  setLaunchpadImage,
  setImageUploaded,
  setBannerUploaded,
  setLaunchpadImages,
  setLaunchpadBannerImages,
  setLaunchpadBannerImage,
  formik,
}) => {
  const { handleSubmit } = formik;

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 min-h-[300px]">
        <div>
          <div className="text-xl text-white font-medium mb-4">Upload Logo</div>
          <UploadImage
            setImageValue={(v: string) => {
              if (setLaunchpadImage) {
                setLaunchpadImage(v);
                setImageUploaded && setImageUploaded("");
              }
              // setImageUploaded("");
            }}
            setImagesValue={setLaunchpadImages}
            classTags="upload-bgImage-sec border border-dashed border-primary-green text-center text-secondary-green bg-dull-green-bg  icon-change"
          />
        </div>
        <div>
          <div className="text-xl text-white font-medium mb-4">
            Upload Banner
          </div>
          <UploadImage
            setImageValue={(v: string) => {
              if (setLaunchpadBannerImage) {
                setLaunchpadBannerImage(v);
                setBannerUploaded && setBannerUploaded("");
              }
              // setImageUploaded("");
            }}
            setImagesValue={setLaunchpadBannerImages}
            classTags="upload-bgImage-sec border border-dashed border-primary-green text-center text-secondary-green bg-dull-green-bg  icon-change"
          />
        </div>
      </div>
    </form>
  );
};

export default Step2;
