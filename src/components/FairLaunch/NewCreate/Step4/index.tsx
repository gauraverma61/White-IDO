import Input2 from "@atoms/Input2";
import { ICreateFairLaunch } from "..";
import React, { useMemo } from "react";
import useAuth from "@hooks/useAuth";
import { PaymentCurrencies } from "@constants/currencies";
import { supportNetwork } from "@constants/network";
import Dropdown3 from "@atoms/Dropdown3";

const Step4: React.FC<ICreateFairLaunch> = (props) => {
  const { formik } = props;

  const { values: data, handleSubmit } = formik;

  const { ethereum, account, chainId, library } = useAuth();

  const selectedPaymentCurrency = useMemo(
    () =>
      PaymentCurrencies[chainId || "default"]?.find(
        (c) => c.symbol.toLowerCase() === formik.values.currency.toLowerCase()
      )?.symbol,
    [chainId, formik.values.currency]
  );
  const currencySymbol = useMemo(
    () => supportNetwork[chainId || "default"]?.symbol,
    [chainId]
  );

  const CurrencyList = useMemo(
    () => PaymentCurrencies[chainId || "default"]?.map((c) => c.symbol),
    [chainId]
  );
  const FeeOptions = [
    `3% ${selectedPaymentCurrency || currencySymbol} sold`,
    `2% ${selectedPaymentCurrency || currencySymbol} sold + 1% token sold`,
  ];
  const ListingOptions = ["Auto", "Manual"];

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-14 min-h-[300px]">
        <div>
          <Dropdown3
            selectedOption={formik.values.currency}
            setSelectedOption={(v) => {
              formik.setFieldValue("currency", v);
            }}
            dropdownList={CurrencyList}
            label={"Currency"}
            className="w-full selects"
          />
          {formik.touched.currency && formik.errors.currency ? (
            <p className="text-xs text-red-text capitalize font-medium leading-5">
              {formik.errors.currency as string}
            </p>
          ) : null}
        </div>
        <div>
          <Dropdown3
            selectedOption={FeeOptions[Number(formik.values.feeOptions)]}
            setSelectedOption={(v) => {
              const value = String(v).includes("2%") ? "1" : "0";
              formik.setFieldValue("feeOptions", value);
            }}
            dropdownList={FeeOptions}
            label={"Fee Options"}
            className="w-full selects"
          />
          {formik.touched.feeOptions && formik.errors.feeOptions ? (
            <p className="text-xs text-red-text capitalize font-medium leading-5">
              {formik.errors.feeOptions as string}
            </p>
          ) : null}
        </div>
        <div>
          <Dropdown3
            selectedOption={formik.values.listingOptions}
            setSelectedOption={(v) => formik.setFieldValue("listingOptions", v)}
            dropdownList={ListingOptions}
            label={"Listing Options"}
            className="w-full selects"
          />
          {formik.touched.listingOptions && formik.errors.listingOptions ? (
            <p className="text-xs text-red-text capitalize font-medium leading-5">
              {formik.errors.listingOptions as string}
            </p>
          ) : null}
        </div>
      </div>
    </form>
  );
};

export default Step4;
