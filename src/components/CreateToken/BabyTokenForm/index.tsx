import Input from "@atoms/Input";
import React from "react";

const BabyTokenForm = () => {
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
        <Input label={`Reward token*`} />
        <div className="w-full">
          <Input label={`Minimum token balance for dividends*`} />
          <p className="text-xs text-blue1 font-normal mt-2">
            Min hold each wallet must be over $50 to receive rewards.
          </p>
        </div>
      </div>
      <div className="mb-8 flex flex-1 flex-col md:flex-row gap-8">
        <Input label={`Token reward fee (%)*`} />
        <Input label={`Auto add liquidity (%)*`} />
      </div>
      <div className="mb-8 flex flex-1 flex-col md:flex-row gap-8">
        <Input label={`Marketing fee (%)*`} />
        <Input label={`Marketing wallet*`} />
      </div>
    </>
  );
};

export default BabyTokenForm;
