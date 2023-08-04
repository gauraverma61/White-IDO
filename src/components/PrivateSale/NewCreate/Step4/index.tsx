import React from "react";
import { ICreatePrivateSale } from "..";
import Input2 from "@atoms/Input2";
import DateTimePicker from "@atoms/DateTimeInput";
import SmallSwitch from "@atoms/CustomSmallSwitch";

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

const PrivateSaleCreateStep4: React.FC<ICreatePrivateSale> = (props) => {
  const { formik } = props;

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
    <>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
          <Input2
            label={`Softcap (${values.currency})*`}
            name="softcap"
            type={"number"}
            value={values.softcap}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.softcap && errors.softcap}
          />
          <Input2
            label={`Hardcap (${values.currency})*`}
            name="hardcap"
            type={"number"}
            value={values.hardcap}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.hardcap && errors.hardcap}
          />
          <Input2
            label={`Minimum Buy (${values.currency})*`}
            name="minimumBuy"
            type={"number"}
            value={values.minimumBuy}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.minimumBuy && errors.minimumBuy}
          />
          <Input2
            label={`Maximum Buy (${values.currency})*`}
            name="maximumBuy"
            type={"number"}
            value={values.maximumBuy}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.maximumBuy && errors.maximumBuy}
          />
          <Input2
            label="First Fund Vesting*"
            type="number"
            name="TGEPercentage"
            onChange={handleChange}
            value={values.TGEPercentage}
            onBlur={handleBlur}
            error={touched.TGEPercentage && errors.TGEPercentage}
          />
          <Input2
            label="Fund Vesting (Days)"
            type="number"
            name="CycleTime"
            onChange={handleChange}
            value={values.CycleTime}
            onBlur={handleBlur}
            error={touched.CycleTime && errors.CycleTime}
          />
          <Input2
            label="Fund Release (%)*"
            type="number"
            name="CycleReleasePercent"
            className=""
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.CycleReleasePercent}
            error={touched.CycleReleasePercent && errors.CycleReleasePercent}
          />
        </div>
      </form>
    </>
  );
};

export default PrivateSaleCreateStep4;
