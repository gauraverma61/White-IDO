import { useEffect, useState } from "react";
import SetTimeAiredropModal from "@components/CreateAirDrop/setTimeAiredropModal";
import { ICreateAirdrop } from "..";
import useTokenInfo from "@hooks/useTokenInfo";
import useAuth from "@hooks/useAuth";
import { supportNetwork } from "@constants/network";
import Input2 from "@atoms/Input2";
import DateTimePicker from "@atoms/DateTimeInput";
import { formatUnits } from "ethers/lib/utils";

type ICreateStepOne = Omit<ICreateAirdrop, "prev">;

const Step1: React.FC<ICreateStepOne> = (props) => {
  const { formik, commonStats, setAirdropBannerImage, setAirdropImage } = props;

  const [showSetLocation, setShowSetLocation] = useState(false);
  const [airdropStartTime, setAirdropStartTime] = useState("");

  const closeModal = () => {
    return setShowSetLocation(!showSetLocation);
  };

  const { ethereum, chainId } = useAuth();

  const {
    tokenName,
    tokenSymbol,
    tokenBalance,
    totalSupply,
    decimals,
    fetchTokenError,
    fetchtokenDetail,
    fetchTokenBalance,
  } = useTokenInfo({
    tokenAddress: formik.values.tokenAddress || "",
    ethereum,
  });

  useEffect(() => {
    if (formik.values.tokenAddress) {
      fetchtokenDetail();
      fetchTokenBalance();
    }
  }, [formik.values.tokenAddress]);

  useEffect(() => {
    if (tokenName && tokenName && tokenSymbol && tokenBalance && decimals) {
      formik.setValues({
        ...formik.values,
        name: tokenName,
        symbol: tokenSymbol,
        decimals: decimals,
        title: tokenName,
        balance: (
          parseFloat(tokenBalance) /
          10 ** parseFloat(decimals)
        ).toString(),
      });
    } else {
      formik.setFieldValue("name", "");
      formik.setFieldValue("symbol", "");
      formik.setFieldValue("decimals", "");
      formik.setFieldValue("totalSupply", "");
      formik.setFieldValue("title", "");
      formik.setFieldValue("balance", "");
    }
  }, [tokenName, tokenBalance]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="mt-10 mb-6 relative">
        <h3 className="text-base font-semibold text-[#64748B]">
          Token address*
        </h3>
        <div className="flex justify-between border px-4 rounded-old-[69px] shadow-sm my-4">
          <input
            type="text"
            className="outline-none w-full"
            name="tokenAddress"
            onChange={formik.handleChange}
            value={formik.values.tokenAddress}
          />
        </div>
        {formik.touched.tokenAddress && formik.errors.tokenAddress ? (
          <p className="text-xs text-red-text capitalize font-medium leading-5">
            {formik.errors.tokenAddress as string}
          </p>
        ) : null}
        {fetchTokenError && formik.values.tokenAddress && (
          <div className="text-sm text-red-text4 font-normal absolute left-2.5">
            {fetchTokenError}
          </div>
        )}
        {commonStats.poolPrice > 0 && (
          <p className="text-right text-xs font-normal">
            Pool creation fee: {commonStats.poolPrice}{" "}
            {supportNetwork[chainId || "default"]?.symbol}
          </p>
        )}
      </div>

      <div className="grid gap-10 grid-cols-1 md:grid-cols-2 ">
        <Input2
          label={`Title*`}
          name="title"
          variant="title"
          titleText=" Airdrop"
          value={formik.values.title}
          error={formik.touched.title && formik.errors.title}
          disabled
        />
        <Input2
          label={`Name*`}
          name="name"
          value={formik.values.name}
          error={formik.touched.name && formik.errors.name}
          disabled
        />
        <Input2
          label={`Symbol*`}
          name="symbol"
          value={formik.values.symbol}
          error={formik.touched.symbol && formik.errors.symbol}
          disabled
        />
        <Input2
          label={`Decimals*`}
          name="decimals"
          value={formik.values.decimals}
          error={formik.touched.decimals && formik.errors.decimals}
          disabled
        />
        <Input2
          label={`Balance*`}
          name="balance"
          value={formik.values.balance}
          error={formik.touched.decimals && formik.errors.balance}
          disabled
        />
        <div className="w-full">
          <DateTimePicker
            label={`Start Time (UTC)*`}
            className="cursor-pointer"
            name="startTime"
            value={formik.values.startTime}
            onChange={(v: any) => formik.setFieldValue("startTime", v)}
            onBlur={formik.handleBlur}
          />
          {formik.errors.startTime ? (
            <div className="text-sm text-red-500">
              {formik.errors.startTime}
            </div>
          ) : null}
        </div>
      </div>
      {showSetLocation && (
        <SetTimeAiredropModal
          showModal={showSetLocation}
          setShowModal={closeModal}
          setStartAirdropTime={(airdropStartTime: string) =>
            setAirdropStartTime(airdropStartTime)
          }
        />
      )}
    </form>
  );
};

export default Step1;
