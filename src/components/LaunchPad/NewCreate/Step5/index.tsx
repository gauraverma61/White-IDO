import Input2 from "@atoms/Input2";
import { feesSetting, ICreateLaunchpad, ICreateLaunchpadFormData } from "..";
import SmallSwitch from "@atoms/CustomSmallSwitch";
import DropdownV1 from "@atoms/DropdownV1";
import DateTimePicker from "@atoms/DateTimeInput";

const Step5: React.FC<ICreateLaunchpad> = (props) => {
  const { formik } = props;
  const {
    values,
    handleSubmit,
    handleChange,
    handleBlur,
    errors,
    setFieldValue,
    touched,
  } = formik;
  return (
    <form onSubmit={handleSubmit}>
      <div className=" grid grid-cols-1 md:grid-cols-2 gap-16 mb-4">
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
          Enable whitelist to allow only whitelisted users to contribute in your
          presale
        </p>
      </div>
      <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-x-16 gap-y-12">
        <Input2
          label={`Presale Rate`}
          name="presaleRate"
          type={"number"}
          value={values.presaleRate}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.presaleRate && errors.presaleRate}
        />
        <div className=" hidden md:block"></div>
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
        <DropdownV1
          label={`Refund Type`}
          // name="refundType"
          setSelectedOption={(v) => {
            setFieldValue("refundType", v);
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
        {values.listingOptions === "Auto" && (
          <>
            <Input2
              label={`Liquidity (%)*`}
              name="liquidity"
              type={"text"}
              value={values.liquidity}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.liquidity && errors.liquidity}
            />
            <Input2
              label={`Listing Rate*`}
              name="listingRate"
              type={"number"}
              value={values.listingRate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.listingRate && errors.listingRate}
            />
          </>
        )}
        <div className=" hidden md:block"></div>
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
        {formik.values.saleMethod === "Whitelist" && (
          <>
            <DateTimePicker
              label={"Whitelist End Time (UTC)*"}
              name="tier1EndTime"
              value={formik.values.tier1EndTime}
              onChange={(v: any) => formik.setFieldValue("tier1EndTime", v)}
              onBlur={formik.handleBlur}
              error={formik.touched.tier1EndTime && formik.errors.tier1EndTime}
            />
            {/* <DateTimePicker
              label={"Tier 2 End Time (UTC)*"}
              
              name="tier2EndTime"
              value={formik.values.tier2EndTime}
              onChange={(v: any) => formik.setFieldValue("tier2EndTime", v)}
              onBlur={formik.handleBlur}
              error={formik.touched.tier2EndTime && formik.errors.tier2EndTime}
            /> */}
            <DateTimePicker
              label={"Public Start Time (UTC)*"}
              name="publicStartTime"
              value={formik.values.publicStartTime}
              onChange={(v: any) => formik.setFieldValue("publicStartTime", v)}
              onBlur={formik.handleBlur}
              error={
                formik.touched.publicStartTime && formik.errors.publicStartTime
              }
            />
          </>
        )}
        {values.listingOptions === "Auto" && (
          <Input2
            label={`Liquidity Lockup (Days)*`}
            type={"number"}
            name="liquidityLockupDays"
            value={values.liquidityLockupDays}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.liquidityLockupDays && errors.liquidityLockupDays}
          />
        )}
      </div>
    </form>
  );
};

export default Step5;
