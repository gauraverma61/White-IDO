import Input from "@atoms/Input";
import React from "react";

const StandardTokenForm = () => {
  return (
    <>
      <div className="mb-8 flex flex-1 flex-col md:flex-row gap-8">
        <Input label={`Name*`} />
        <Input label={`Symbol*`} />
      </div>
      <div className="mb-8 flex flex-1 flex-col md:flex-row gap-8">
        <Input label={`Decimals*`} />
        <Input label={`Total supply*`} />
      </div>
    </>
  );
};

export default StandardTokenForm;
