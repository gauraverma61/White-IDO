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

const PrivateSaleCreateStep2: React.FC<ICreatePrivateSale> = (props) => {
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
        <div className="flex flex-1 flex-col md:flex-row gap-10 mb-4">
          <SmallSwitch
            className="w-full"
            label="Whitelist"
            enabled={values.saleMethod === "Whitelist"}
            setEnabled={(value) => {
              setFieldValue("saleMethod", value ? "Whitelist" : "");
            }}
          />
        </div>
        <div className="mb-6 flex flex-1 flex-col md:flex-row gap-10">
          <p className="text-md font-medium text-bordergraydark">
            Enable whitelist to allow only whitelisted users to contribute in
            your presale
          </p>
        </div>
        <div className="mb-6 flex flex-1 flex-col md:flex-row gap-10">
          <Input2
            label={`Softcap (${values.currency})*`}
            name="softcap"
            type={"number"}
            value={values.softcap}
            variant={
              touched.softcap && errors.softcap
                ? "warning"
                : values.softcap
                ? "bright"
                : "primary"
            }
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.softcap && errors.softcap}
          />
          <Input2
            label={`Hardcap (${values.currency})*`}
            name="hardcap"
            type={"number"}
            variant={
              touched.hardcap && errors.hardcap
                ? "warning"
                : values.hardcap
                ? "bright"
                : "primary"
            }
            value={values.hardcap}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.hardcap && errors.hardcap}
          />
        </div>
        <div className="mb-6 flex flex-1 flex-col md:flex-row gap-10">
          <Input2
            label={`Minimum Buy (${values.currency})*`}
            name="minimumBuy"
            type={"number"}
            variant={
              touched.minimumBuy && errors.minimumBuy
                ? "warning"
                : values.minimumBuy
                ? "bright"
                : "primary"
            }
            value={values.minimumBuy}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.minimumBuy && errors.minimumBuy}
          />
          <Input2
            label={`Maximum Buy (${values.currency})*`}
            name="maximumBuy"
            type={"number"}
            variant={
              touched.maximumBuy && errors.maximumBuy
                ? "warning"
                : values.maximumBuy
                ? "bright"
                : "primary"
            }
            value={values.maximumBuy}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.maximumBuy && errors.maximumBuy}
          />
        </div>

        <div className="mb-6 flex flex-1 flex-col md:flex-row gap-10">
          <Input2
            label="First Fund TGE*"
            type="number"
            name="TGEPercentage"
            variant={
              touched.TGEPercentage && errors.TGEPercentage
                ? "warning"
                : values.TGEPercentage
                ? "bright"
                : "primary"
            }
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
            variant={
              touched.CycleTime && errors.CycleTime
                ? "warning"
                : values.CycleTime
                ? "bright"
                : "primary"
            }
            value={values.CycleTime}
            onBlur={handleBlur}
            error={touched.CycleTime && errors.CycleTime}
          />
        </div>
        <div className="mb-6 flex flex-1 flex-col md:flex-row gap-10 md:pr-10">
          <Input2
            label="Fund Release (%)*"
            type="number"
            variant={
              touched.CycleReleasePercent && errors.CycleReleasePercent
                ? "warning"
                : values.CycleReleasePercent
                ? "bright"
                : "primary"
            }
            name="CycleReleasePercent"
            className="md:w-1/2"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.CycleReleasePercent}
            error={touched.CycleReleasePercent && errors.CycleReleasePercent}
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
        {formik.values.saleMethod === "Whitelist" && (
          <>
            <div className="mb-6 flex flex-1 flex-col md:flex-row gap-10">
              <DateTimePicker
                label={"Public Start Time (UTC)*"}
                name="publicStartTime"
                value={formik.values.publicStartTime}
                onChange={(v: any) =>
                  formik.setFieldValue("publicStartTime", v)
                }
                onBlur={formik.handleBlur}
                error={
                  formik.touched.publicStartTime &&
                  formik.errors.publicStartTime
                }
              />
              <DateTimePicker
                label={"Tier 1 End Time (UTC)*"}
                name="tier1EndTime"
                value={formik.values.tier1EndTime}
                onChange={(v: any) => formik.setFieldValue("tier1EndTime", v)}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.tier1EndTime && formik.errors.tier1EndTime
                }
              />
            </div>
          </>
        )}
        {formik.values.saleMethod === "Whitelist" && (
          <div className="md:w-1/2 pr-6">
            <DateTimePicker
              label={"Tier 2 End Time (UTC)*"}
              name="tier2EndTime"
              value={formik.values.tier2EndTime}
              onChange={(v: any) => formik.setFieldValue("tier2EndTime", v)}
              onBlur={formik.handleBlur}
              error={formik.touched.tier2EndTime && formik.errors.tier2EndTime}
            />
          </div>
        )}
      </form>
    </>
  );
};

export default PrivateSaleCreateStep2;
