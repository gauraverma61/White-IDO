import React from "react";
import PrivateSaleDataProvider from "src/Contexts/PrivateSaleContext";
import LaunchpadDataProvider from "src/Contexts/LaunchPadContext";
import FairLaunchDataProvider from "src/Contexts/FairLaunchContext";

const DataProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <LaunchpadDataProvider>
        <FairLaunchDataProvider>
          <PrivateSaleDataProvider>{children}</PrivateSaleDataProvider>
        </FairLaunchDataProvider>
      </LaunchpadDataProvider>
    </>
  );
};

export default DataProviders;
