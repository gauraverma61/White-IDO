import Input from "@atoms/Input";
import React from "react";

const LiquidityGeneratorForm = () => {
  return (
    <>
      <div className="mb-8 flex flex-1 flex-col md:flex-row gap-8">
        <Input label={`Name*`} />
        <Input label={`Symbol*`} />
      </div>
      <div className="mb-8 flex flex-1 flex-col md:flex-row gap-8">
        <Input label={`Router*`} />
        <Input label={`Total supply*`} />
      </div>
      <div className="mb-8 flex flex-1 flex-col md:flex-row gap-8">
        <Input label={`Transaction fee to generate yield (%)`} />
        <Input label={`Transaction fee to generate liquidity (%)`} />
      </div>
      <div className="mb-8 flex flex-1 flex-col md:flex-row gap-8">
        <Input label={`Max transaction percent (%)*`} />
        <Input label={`Charity address`} />
      </div>
      <div className="mb-8 flex w-[50%] flex-col md:flex-row gap-8">
        <Input label={`Charity percent (%)*`} />
      </div>
    </>
  );
};

export default LiquidityGeneratorForm;
