import HoverImage from "@components/Common/HoverImage";
import UploadImage from "@components/Common/UploadImage";

type CreateWrapperProps = {
  children: React.ReactNode;
  step?: number;
  pageTitle: string;
  time?: string;
  title?: string;
  image?: string;
  setImage?: (value: string) => void;
  banner?: string;
  setBanner?: (value: string) => void;
  startTime?: string;
  endTime?: string;
};
const CreateWrapper: React.FC<CreateWrapperProps> = ({
  children,
  step,
  pageTitle,
  time,
  title,
  image,
  setImage,
  startTime,
  endTime,
  setBanner,
  banner,
}) => {
  return (
    <div className="px-6 md:px-8 lg:px-10 container mx-auto">
      <div className="">
        <div className="h-full w-full py-6 ">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-fonde font-thin">
            {pageTitle}
          </h2>
          {step && (
            <h2 className="text-3xl font-montserrat my-8 font-normal">
              {" "}
              Step <span className=" text-3xl">{step}</span>
            </h2>
          )}
          <div className="flex flex-col lg:flex-row  justify-between gap-6">
            <div className="flex lg:w-[60%] flex-col">{children}</div>
            <div className="flex lg:w-[40%] flex-col  items-center md:items-start lg:items-center gap-6 my-10">
              <div>
                <div className="mb-3">
                  <label className="capitalize text-base font-semibold text-gray-900">
                    Upload Logo Image
                  </label>
                </div>
                <UploadImage
                  setImageValue={setImage}
                  classTags="upload-image-sec"
                />
              </div>
              <div className="">
                <div className="mb-3">
                  <label className="capitalize text-base font-semibold text-gray-900">
                    Upload Cover Image
                  </label>
                </div>
                <UploadImage
                  setImageValue={setBanner}
                  classTags="upload-image-sec"
                />
              </div>
              {banner && (
                <HoverImage
                  type="staticImageWithHover"
                  borderRadius="rounded-old-[120px]"
                  classTag="rounded-old-[120px] w-[420px] h-[250px] object-cover"
                  src={banner}
                  title={title}
                  time={time}
                  startTime={startTime}
                  endTime={endTime}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWrapper;
