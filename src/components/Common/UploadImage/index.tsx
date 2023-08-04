import React, { useEffect, useRef, useState } from "react";

import dynamic from "next/dynamic";
import { MediaLibrary } from "@spatie/media-library-pro-core/dist/types";
import MediaLibraryClass from "@spatie/media-library-pro-core/dist/MediaLibrary";
import { toast } from "react-toastify";

interface Iprops {
  classTags?: string;
  setImageValue?: Function;
  setImagesValue?: Function;
}

const MediaLibraryCollectionNoSSR = dynamic(
  () => import("@spatie/media-library-pro-react-collection"),
  { ssr: false }
);

const UploadImage: React.FC<Iprops> = ({
  classTags,
  setImageValue,
  setImagesValue,
}) => {
  const [value, setValue] = useState<{
    name: string;
    media: {
      [uuid: string]: MediaLibrary.MediaAttributes;
    };
  }>({
    name: "",
    media: {},
  });
  const [validationErrors, setValidationErrors] = useState<
    MediaLibrary.State["validationErrors"]
  >({});
  const mediaLibrary = useRef<MediaLibraryClass | null>(null);

  useEffect(() => {
    if (value.media[Object.keys(value.media)[0]]?.original_url) {
      const mediaObject = value.media[Object.keys(value.media)[0]];
      setImageValue && setImageValue(mediaObject?.original_url);
      setImagesValue && setImagesValue(value);
    }
  }, [value]);

  useEffect(() => {
    if (mediaLibrary?.current?.state.invalidMedia[0]?.errors) {
      toast.error("Image is not uploaded due to server error");
    }
  }, [mediaLibrary?.current?.state.invalidMedia]);

  return (
    <div className={`${classTags} w-full`}>
      <MediaLibraryCollectionNoSSR
        name="documents"
        initialValue={value.media}
        validationErrors={validationErrors}
        setMediaLibrary={(mediaLib) => (mediaLibrary.current = mediaLib)}
        maxItems={1}
        onChange={(media) => setValue((value) => ({ ...value, media }))}
        validationRules={{
          accept: ["image/png", "image/jpeg", "image/jpg"],
        }}
      />
    </div>
  );
};

export default UploadImage;
