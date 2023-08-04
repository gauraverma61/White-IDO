import Input2 from "@atoms/Input2";
import { ICreateFairLaunch } from "..";
import React from "react";
import DateTimePicker from "@atoms/DateTimeInput";

const Step5: React.FC<ICreateFairLaunch> = (props) => {
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
        <div className="mb-6 flex flex-1 flex-col md:flex-row gap-10 md:gap-6 lg:gap-10">
          <div className="md:w-1/2 md:pr-6">
            <Input2
              label={`Total Selling Amount`}
              name="totalAmount"
              type={"number"}
              variant={
                touched.totalAmount && errors.totalAmount
                  ? "warning"
                  : values.totalAmount
                  ? "bright"
                  : "primary"
              }
              value={values.totalAmount}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.totalAmount && errors.totalAmount}
            />
          </div>
        </div>
        <div className="mb-6 flex flex-1 flex-col md:flex-row gap-10 md:gap-6 lg:gap-10">
          <Input2
            label={`Softcap (${values.currency})*`}
            name="softcap"
            type={"number"}
            variant={
              touched.softcap && errors.softcap
                ? "warning"
                : values.softcap
                ? "bright"
                : "primary"
            }
            value={values.softcap}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.softcap && errors.softcap}
          />
          <Input2
            label={`Liquidity (%)*`}
            name="liquidity"
            variant={
              touched.liquidity && errors.liquidity
                ? "warning"
                : values.liquidity
                ? "bright"
                : "primary"
            }
            type={"text"}
            value={values.liquidity}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.liquidity && errors.liquidity}
          />
        </div>

        <div className="mb-6 flex flex-1 flex-col md:flex-row gap-10">
          <DateTimePicker
            label={`Start Time (UTC)*`}
            name="startTime"
            value={formik.values.startTime}
            onChange={(v: any) => formik.setFieldValue("startTime", v)}
            onBlur={formik.handleBlur}
            error={formik.touched.startTime && formik.errors.startTime}
          />
          <DateTimePicker
            label={`End Time (UTC)*`}
            name="endTime"
            value={formik.values.endTime}
            onChange={(v: any) => formik.setFieldValue("endTime", v)}
            onBlur={formik.handleBlur}
            error={formik.touched.endTime && formik.errors.endTime}
          />
        </div>

        <div className="mb-10 flex flex-1 flex-col md:flex-row gap-10">
          <div className="w-full">
            <Input2
              label={`Liquidity Lockup (Days)*`}
              type={"number"}
              variant={
                touched.liquidityLockupDays && errors.liquidityLockupDays
                  ? "warning"
                  : values.liquidityLockupDays
                  ? "bright"
                  : "primary"
              }
              name="liquidityLockupDays"
              value={values.liquidityLockupDays}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.liquidityLockupDays && errors.liquidityLockupDays}
            />
          </div>
        </div>
      </form>
    </>
  );
};

export default Step5;
