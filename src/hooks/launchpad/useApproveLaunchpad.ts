import { ERC20__factory } from "../../blockchain-types";
import { useCallback, useEffect, useMemo, useState } from "react";
import useAuth from "@hooks/useAuth";

export const useApproveLaunchpad = ({
  token,
  spender,
  amount,
  type,
}: {
  token: string;
  spender: string;
  amount: string;
  type: "private_sale" | "presale" | "fair_sale";
}) => {
  const [error, setError] = useState(false);
  const { account, library } = useAuth();
  const erc20 = useMemo(() => {
    let factory = new ERC20__factory();
    return factory.attach(token);
  }, [token]);
  const sendRequest = useCallback(async () => {
    if (!account) {
      return setError(true);
    }
    const allowance = await erc20.allowance(account, spender);
    if (allowance.lt(amount)) {
      await erc20.approve(spender, amount);
    }
  }, [erc20, spender, amount, account, type]);
};
