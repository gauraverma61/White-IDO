import React from "react";
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
  airdropImage: string;
  setAirdropImage: (value: string) => void;
  setAirdropImages: Function;
  airdropBannerImage: string;
  setAirdropBannerImage: (value: string) => void;
  setAirdropBannerImages: Function;
  setImageUploaded: Function;
  setBannerUploaded: Function;
}> = ({
  setAirdropImage,
  setImageUploaded,
  setBannerUploaded,
  setAirdropImages,
  setAirdropBannerImages,
  setAirdropBannerImage,
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
              if (setAirdropImage) {
                setAirdropImage(v);
                setImageUploaded && setImageUploaded("");
              }
              // setImageUploaded("");
            }}
            setImagesValue={setAirdropImages}
            classTags="upload-bgImage-sec border border-dashed border-primary-green text-center text-secondary-green bg-dull-green-bg  icon-change"
          />
        </div>
        <div>
          <div className="text-xl text-white font-medium mb-4">
            Upload Banner
          </div>
          <UploadImage
            setImageValue={(v: string) => {
              if (setAirdropBannerImage) {
                setAirdropBannerImage(v);
                setBannerUploaded && setBannerUploaded("");
              }
              // setImageUploaded("");
            }}
            setImagesValue={setAirdropBannerImages}
            classTags="upload-bgImage-sec border border-dashed border-primary-green text-center text-secondary-green bg-dull-green-bg  icon-change"
          />
        </div>
      </div>
    </form>
  );
};

export default Step2;
