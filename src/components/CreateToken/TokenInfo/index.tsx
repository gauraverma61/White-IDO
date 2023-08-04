import React from "react";
import TokenDetails from "@constants/tokenDetails/LiquidityGenratorDetails.json";

const TokenInfo = () => {
  return (
    <div className="px-6 md:px-10 container mx-auto">
      <div className="py-6">
        <h2 className="text-5xl font-fonde font-thin">Token Info</h2>

        <div className="mt-20">
          <p className="text-xl font-medium pb-3 border-b-2">
            Your token was created!
          </p>
          <ul className="w-full">
            {Object.keys(TokenDetails).map((key, index) => (
              <>
                <li key={`li-${index}`} className="flex justify-between my-4">
                  <span className="text-sm font-medium">{key}</span>
                  <span className="text-sm font-normal text-blue1">
                    {TokenDetails[key as keyof typeof TokenDetails]}
                  </span>
                </li>
                <hr />
              </>
            ))}
          </ul>
        </div>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-4 mt-16">
          <p className="text-base font-medium cursor-pointer">
            View transaction on BSCScan
          </p>
          <p className="text-base font-medium cursor-pointer">Copy Address</p>
          <p className="text-base font-medium cursor-pointer">Create presale</p>
        </div>
      </div>
    </div>
  );
};

export default TokenInfo;
