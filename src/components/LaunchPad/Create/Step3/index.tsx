import React from "react";
import {
  BsDiscord,
  BsFacebook,
  BsGlobe,
  BsTelegram,
  BsTwitter,
} from "react-icons/bs";
import { FaGithub, FaInstagram, FaReddit } from "react-icons/fa";
import { ICreateLaunchpad } from "..";
import Input2 from "@atoms/Input2";
import dynamic from "next/dynamic";
import useWidth from "@hooks/useWidth";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);
const EditerMarkdown = dynamic(
  () =>
    import("@uiw/react-md-editor").then((mod) => {
      return mod.default.Markdown;
    }),
  { ssr: false }
);

const Step3: React.FC<ICreateLaunchpad> = (props) => {
  const { formik, prev, next } = props;

  const {
    values,
    errors,
    setFieldValue,
    handleChange,
    handleBlur,
    touched,
    handleSubmit,
  } = formik;

  const width = useWidth();

  const [preview, setPreview] = React.useState<any>("preview");

  React.useEffect(() => {
    if (width > 768) {
      setPreview("live");
    } else {
      setPreview("edit");
    }
  }, [width]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="pb-8">
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-x-10 gap-y-6">
          <Input2
            label={"Website Link"}
            variant="icon"
            Icon={BsGlobe}
            name="website"
            value={values.website}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.website && errors.website}
          />
          <Input2
            label={"Telegram"}
            variant="icon"
            Icon={BsTelegram}
            name="telegram"
            value={values.telegram}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.telegram && errors.telegram}
          />
          <Input2
            label={"Facebook"}
            variant="icon"
            Icon={BsFacebook}
            name="facebook"
            value={values.facebook}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.facebook && errors.facebook}
          />
          <Input2
            label={"Twitter"}
            variant="icon"
            Icon={BsTwitter}
            name="twitter"
            value={values.twitter}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.twitter && errors.twitter}
          />
          <Input2
            label={"Instagram"}
            variant="icon"
            Icon={FaInstagram}
            name="instagram"
            value={values.instagram}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.instagram && errors.instagram}
          />
          <Input2
            label={"Github"}
            variant="icon"
            Icon={FaGithub}
            name="github"
            value={values.github}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.github && errors.github}
          />
          <Input2
            label={"Discord"}
            variant="icon"
            Icon={BsDiscord}
            name="discord"
            value={values.discord}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.discord && errors.discord}
          />
          <Input2
            label={"Reddit"}
            variant="icon"
            Icon={FaReddit}
            name="reddit"
            value={values.reddit}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.reddit && errors.reddit}
          />
        </div>
        <div className="col-span-1 sm:col-span-2 xl:col-span-3 unhideBulletPoint">
          <div className="text-base font-semibold text-[#64748B] mb-3">
            Description
          </div>
          <MDEditor
            value={values.description}
            preview={preview}
            onChange={(value) => {
              console.log(value);
              setFieldValue("description", value);
            }}
          />
          {errors.description && (
            <div className="mt-2 text-xs text-red-text capitalize font-medium">
              {errors.description}
            </div>
          )}
          {/* <div className="mt-5">
            <EditerMarkdown
              source={values.description}
              style={{ whiteSpace: "pre-wrap" }}
            />
          </div> */}
        </div>
      </div>
    </form>
  );
};

export default Step3;
