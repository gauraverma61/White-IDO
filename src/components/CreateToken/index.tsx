import Button from "@atoms/Button";
import Dropdown from "@atoms/Dropdown";
import { useRouter } from "next/router";
import { useState } from "react";
import CreateWrapper from "../Layouts/CreateWrapper";
import BabyTokenForm from "./BabyTokenForm";
import LiquidityGeneratorForm from "./LiquidityGeneratorForm";
import StandardTokenForm from "./StandardTokenForm";

const TokenTypes = [
  "Standard Token",
  "Baby Token",
  "Liquidity Generator Token",
];
const CreateToken = () => {
  const router = useRouter();
  const [tokenType, setTokenType] = useState<string | undefined>(TokenTypes[0]);
  const handleClick = () => {
    router.push("/launchpad/token/info");
  };

  const renderForm = (token: string | undefined) => {
    if (!token) {
      return <StandardTokenForm />;
    } else {
      switch (token) {
        case TokenTypes[0]:
          return <StandardTokenForm />;
        case TokenTypes[1]:
          return <BabyTokenForm />;
        case TokenTypes[2]:
          return <LiquidityGeneratorForm />;
      }
    }
  };

  return (
    <CreateWrapper pageTitle={"Create A Token"}>
      <p className="text-xs text-[#FF3838] font-normal mt-6">
        (*) is required field.
      </p>
      <div className="mb-8">
        <Dropdown
          selectedOption={tokenType}
          setSelectedOption={setTokenType}
          dropdownList={TokenTypes}
          label={"Select Token Type"}
        />
        <p className="text-xs font-medium">2 BNB</p>
      </div>
      {renderForm(tokenType)}
      <div className="flex justify-center items-center mt-10">
        <Button className="w-full max-w-sm text-xl" onClick={handleClick}>
          Create Token
        </Button>
      </div>
    </CreateWrapper>
  );
};

export default CreateToken;
