import * as React from "react";

export const PackeryContext = React.createContext<{
  packeryInstance?: any;
}>({ packeryInstance: undefined });
