import { useRouter } from "next/router";
import React, { ReactChild } from "react";
import useAuth from "src/hooks/useAuth";

export const Authenticated = ({ children }: { children: any }) => {
  const { account } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!account) {
      router.push("/");
    }
  }, [account]);

  return <>{children}</>;
};

export default Authenticated;
