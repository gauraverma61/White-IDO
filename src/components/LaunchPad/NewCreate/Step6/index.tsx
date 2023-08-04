import React from "react";
import { feesSetting, ICreateLaunchpad, ICreateLaunchpadFormData } from "..";
import Input2 from "@atoms/Input2";

const Step6: React.FC<ICreateLaunchpad> = (props) => {
  const { values, handleSubmit, handleChange, handleBlur, errors } =
    props.formik;

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 md:gap-y-14">
        <Input2
          label="First Release"
          type="number"
          name="TGEPercentage"
          onChange={handleChange}
          value={values.TGEPercentage}
          onBlur={handleBlur}
          error={errors.TGEPercentage}
        />

        <Input2
          label="Cycle (Days)"
          type="number"
          name="CycleTime"
          onChange={handleChange}
          value={values.CycleTime}
          error={errors.CycleTime}
        />
        <Input2
          label="Release Per Cycle%"
          type="number"
          name="CycleReleasePercent"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.CycleReleasePercent}
          error={errors.CycleReleasePercent}
        />
      </div>
    </form>
  );
};

export default Step6;
