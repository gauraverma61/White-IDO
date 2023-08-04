import React from "react";
import { ICreateAirdrop } from "..";
import Input2 from "@atoms/Input2";

const Step5: React.FC<ICreateAirdrop> = (props) => {
  const { values, handleSubmit, handleChange, handleBlur, errors } =
    props.formik;

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 md:gap-y-14">
        <Input2
          label="First Release"
          type="number"
          name="tge"
          onChange={handleChange}
          value={values.tge}
          onBlur={handleBlur}
          error={errors.tge}
        />
        <Input2
          label="Cycle (Days)"
          type="number"
          name="cycleSecond"
          onChange={handleChange}
          value={values.cycleSecond}
          error={errors.cycleSecond}
        />
        <Input2
          label="Release Per Cycle%"
          type="number"
          name="cyclePercent"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.cyclePercent}
          error={errors.cyclePercent}
        />
      </div>
    </form>
  );
};

export default Step5;
