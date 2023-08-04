import React from "react";
import { ICreateLaunchpad } from "..";
import Input2 from "@atoms/Input2";
import DateTimePicker from "@atoms/DateTimeInput";
import CustomSwitch from "@molecules/Switch";
import SmallSwitch from "@atoms/CustomSmallSwitch";
import RangeInput from "@atoms/RangeInput";
import moment from "moment";
import { TIME_FORMAT } from "@constants/timeFormats";
import Dropdown from "@atoms/Dropdown";
import DropdownV1 from "@atoms/DropdownV1";

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

const Step2: React.FC<ICreateLaunchpad> = (props) => {
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
        {/* <p className="text-xs text-[#FF3838] font-normal mb-4">
          (*) is required field.
        </p> */}
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
        <div className="mb-6 flex flex-1 flex-col md:flex-row gap-10 md:gap-6 lg:gap-10">
          <div className="md:w-1/2 md:pr-6">
            <Input2
              label={`Presale Rate`}
              name="presaleRate"
              type={"number"}
              variant={
                touched.presaleRate && errors.presaleRate
                  ? "warning"
                  : values.presaleRate
                  ? "bright"
                  : "primary"
              }
              value={values.presaleRate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.presaleRate && errors.presaleRate}
            />
            {/* <p className="text-xs font-normal text-blue1 mt-2">
              1 {values.currency} ={" "}
              {values.presaleRate ? values.presaleRate : "X"} {values.symbol}
            </p> */}
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
          {/* <CustomSwitch
            backGroundClass="bg-[#EB6D65]"
            label="Refund Type"
            options={["Refund", "Burn"]}
            selectedOption={values.refundType}
            setSelectedOption={(v) => {
              setFieldValue("refundType", v);
            }}
          /> */}
          {/* <Input2
            label={`Refund Type`}

            name="refundType"
            type={"text"}
            variant={
              touched.refundType && errors.refundType
                ? "warning"
                : values.refundType
                ? "bright"
                : "primary"
            }
            value={values.refundType}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.refundType && errors.refundType}
          /> */}
          <DropdownV1
            label={`Refund Type`}
            // name="refundType"
            setSelectedOption={(v) => {
              formik.setFieldValue("refundType", v);
            }}
            // type={"text"}
            // variant={
            //   touched.refundType && errors.refundType
            //     ? "warning"
            //     : values.refundType
            //     ? "bright"
            //     : "primary"
            // }
            selectedOption={values.refundType}
            // setSelectedOption={handleChange}
            dropdownList={["Refund", "Burn"]}
            // onBlur={handleBlur}
            // error={touched.refundType && errors.refundType}
          />

          {/* <DropdownV1
            label={`Router (${values.currency})*`}
            selectedOption={values.router}
            setSelectedOption={(v) => {
              formik.setFieldValue("router", v);
            }}
            dropdownList={["Refund", "Burn"]}
            //
            // name="router"
            // type={"text"}
            // variant={
            //   touched.refundType && errors.refundType
            //     ? "warning"
            //     : values.refundType
            //     ? "bright"
            //     : "primary"
            // }
            // value={values.router}
            // onChange={handleChange}
            // onBlur={handleBlur}
            // error={touched.router && errors.router}
          /> */}
        </div>

        {values.listingOptions === "Auto" && (
          <div className="mb-6 flex flex-1 flex-col md:flex-row gap-10">
            <div className="w-full">
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
            <div className="w-full">
              <Input2
                label={`Listing Rate*`}
                name="listingRate"
                type={"number"}
                variant={
                  touched.listingRate && errors.listingRate
                    ? "warning"
                    : values.listingRate
                    ? "bright"
                    : "primary"
                }
                value={values.listingRate}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.listingRate && errors.listingRate}
              />
              {/* <p className="text-xs font-normal text-blue1 mt-2">
              1 {values.currency} ={" "}
              {values.listingRate ? values.listingRate : "X"} {values.symbol}
            </p> */}
            </div>
          </div>
        )}

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

        <div className="mb-6 flex flex-1 flex-col md:flex-row gap-10">
          {formik.values.saleMethod === "Whitelist" && (
            <div className="md:w-1/2">
              <DateTimePicker
                label={"Tier 2 End Time (UTC)*"}
                name="tier2EndTime"
                value={formik.values.tier2EndTime}
                onChange={(v: any) => formik.setFieldValue("tier2EndTime", v)}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.tier2EndTime && formik.errors.tier2EndTime
                }
              />
            </div>
          )}
          {values.listingOptions === "Auto" ? (
            <div className="md:w-1/2">
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
                error={
                  touched.liquidityLockupDays && errors.liquidityLockupDays
                }
              />
              {/* {values.liquidityLockupDays && (
              <p className="text-xs font-normal text-blue1 mt-2">
                {`Liquidity Unlocks at ${
                  values.liquidityLockupDays
                    ? moment(values.endTime)
                        .utc()
                        .add(values.liquidityLockupDays, "days")
                        .format(TIME_FORMAT)
                    : "X date"
                }`}
              </p>
            )} */}
            </div>
          ) : (
            <div className="md:w-1/2"></div>
          )}
          {values.saleMethod !== "Whitelist" && (
            <div className="md:w-1/2"></div>
          )}
        </div>

        <div className="flex flex-1 flex-col md:flex-row gap-10 mb-4">
          <SmallSwitch
            className="w-full"
            label="Use Vesting"
            enabled={values.isvesting}
            setEnabled={(value) => {
              setFieldValue("isvesting", value);
            }}
          />
        </div>

        {/* <div className="mb-10 flex flex-1 flex-col md:flex-row gap-10"> */}
        {/* <div className="w-full"> */}
        {/* <Input2
              label={Liquidity Lockup (Days)*}

              type={"number"}
              variant="bright"
              name="liquidityLockupDays"
              value={values.liquidityLockupDays}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.liquidityLockupDays && errors.liquidityLockupDays}
            /> */}
        {/* {values.liquidityLockupDays && (
              <p className="text-xs font-normal text-blue1 mt-2">
                {`Liquidity Unlocks at ${
                  values.liquidityLockupDays
                    ? moment(values.endTime)
                        .utc()
                        .add(values.liquidityLockupDays, "days")
                        .format(TIME_FORMAT)
                    : "X date"
                }`}
              </p>
            )} */}
        {/* </div> */}
        {/* </div> */}
        {values.isvesting && (
          <>
            <div className="mb-6 flex flex-1 flex-col md:flex-row gap-10">
              <Input2
                label="TGE percent*"
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
              <div className="w-full">
                <Input2
                  label="Cycle (Days)*"
                  type="number"
                  variant={
                    touched.CycleTime && errors.CycleTime
                      ? "warning"
                      : values.CycleTime
                      ? "bright"
                      : "primary"
                  }
                  name="CycleTime"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.CycleTime}
                  error={touched.CycleTime && errors.CycleTime}
                />
              </div>
              {/* <Input2
                label="Cycle release percent*"

                type="number"
                name="CycleReleasePercent"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.CycleReleasePercent}
                error={errors.CycleReleasePercent}
              /> */}
            </div>
            <div className="mb-6 flex flex-1 flex-col md:flex-row gap-10">
              <div className="md:w-1/2 md:pr-6">
                <Input2
                  label="Cycle release percent*"
                  type="number"
                  variant={
                    touched.CycleReleasePercent && errors.CycleReleasePercent
                      ? "warning"
                      : values.CycleReleasePercent
                      ? "bright"
                      : "primary"
                  }
                  name="CycleReleasePercent"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.CycleReleasePercent}
                  error={
                    touched.CycleReleasePercent && errors.CycleReleasePercent
                  }
                />
              </div>
            </div>
          </>
        )}
      </form>
    </>
  );
};

export default Step2;
