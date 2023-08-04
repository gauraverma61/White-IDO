import React from "react";
import DownloadImage from "@public/icons/svgs/downloadicon.svg";
import Image from "next/image";
import UploadImage from "@components/Common/UploadImage";
import { usePrivateSaleData } from "src/Contexts/PrivateSaleContext";

const UploadImageSizeComp = ({
  setImage,
}: {
  setImage?: (value: string) => void;
}) => {
  const { setSaleCoverImage } = usePrivateSaleData();
  return (
    <div className="mt-8 md:mt-16 mb-">
      {/* <div className="flex items-start justify-center md:justify-start">
        <div className="mt-1">
          <Image src={DownloadImage} />
        </div>
        <div className="ml-2">
          <div className="text-lg font-medium ">Background Image aaaa</div>
          <div className="text-sm text-[#FF0000] font-medium">
            Size - 1920x1080 pixel
          </div>
        </div>
      </div> */}
      <div className="">
        <label className="capitalize text-base font-semibold text-gray-900">
          Upload for Cover Image
        </label>
        <UploadImage setImageValue={setImage} classTags="upload-bgImage-sec" />
      </div>
    </div>
  );
};

export default UploadImageSizeComp;
