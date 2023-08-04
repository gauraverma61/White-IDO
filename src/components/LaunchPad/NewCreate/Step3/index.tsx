import React, { useMemo, useState } from "react";
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
import Dropdown3 from "@atoms/Dropdown3";
import { PaymentCurrencies } from "@constants/currencies";
import useAuth from "@hooks/useAuth";
import { supportNetwork } from "@constants/network";

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

  React.useEffect(() => {
    if (width > 768) {
      setPreview("live");
    } else {
      setPreview("edit");
    }
  }, [width]);
  const { ethereum, account, chainId, library } = useAuth();
  const [preview, setPreview] = useState<any>("preview");

  const selectedPaymentCurrency = useMemo(
    () =>
      PaymentCurrencies[chainId || "default"]?.find(
        (c) => c.symbol.toLowerCase() === formik.values.currency.toLowerCase()
      )?.symbol,
    [chainId, formik.values.currency]
  );
  const currencySymbol = useMemo(
    () => supportNetwork[chainId || "default"]?.symbol,
    [chainId]
  );

  const CurrencyList = useMemo(
    () => PaymentCurrencies[chainId || "default"]?.map((c) => c.symbol),
    [chainId]
  );
  const FeeOptions = [
    `3% ${selectedPaymentCurrency || currencySymbol} sold`,
    `2% ${selectedPaymentCurrency || currencySymbol} sold + 1% token sold`,
  ];
  const ListingOptions = ["Auto", "Manual"];

  return (
    <form onSubmit={handleSubmit}>
      <div className="pb-8">
        <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-x-16 gap-y-12">
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
        <div className="text-xl font-semibold text-white mb-3">Description</div>
        {/* <MDEditor
            value={values.description}
            preview={preview}
            onChange={(value) => {
              console.log(value);
              setFieldValue("description", value);
            }}
          /> */}
        <div className=" border border-primary-green  bg-dull-green-bg ">
          <textarea
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full text-white placeholder:text-secondary-green px-7 py-8 min-h-[150px] outline-none"></textarea>
        </div>
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
    </form>
  );
};

export default Step3;
