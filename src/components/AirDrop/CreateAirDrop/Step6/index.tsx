import React, { useEffect, useMemo, useState } from "react";
import InfoGrid, { IInfoGridProps } from "@molecules/InfoGrid";
import SetAllocationModal from "@components/CreateAirDrop/setAllocationModal";
import SetVestingModal from "@components/CreateAirDrop/setVestingModal";
import AllocationDetail, { IAllocationDetail } from "@molecules/AllocationsV2";
import useAuth from "@hooks/useAuth";
import { title } from "case";
import { ICreateAirdrop, ICreateAirdropFormData } from "..";
import moment from "moment";
import HoverImage from "@components/Common/HoverImage";
import { TIME_FORMAT } from "@constants/timeFormats";
import { CountdownTimer } from "@atoms/CountdownTimer";

export interface IVestingDetail {
  tge: string;
  cyclePercent: string;
  cycleSecond: string;
}

const Step6: React.FC<ICreateAirdrop> = (props) => {
  const { formik, airdropBannerImage } = props;
  const { values: data, handleSubmit } = formik;
  const { account, chainId, library } = useAuth();

  const [showSetLocation, setShowSetLocation] = useState(false);
  const closeModal = () => {
    return setShowSetLocation(false);
  };

  const [allocationsData, setAllocationsData] = useState<IAllocationDetail[]>(
    []
  );

  const getKeyValue =
    <U extends keyof T, T extends object>(key: U) =>
    (obj: T): string =>
      String(obj[key]);

  const airdropDetails = useMemo<IInfoGridProps["data"]>(() => {
    const map = Object.keys(data)
      ?.filter(
        (k: any) =>
          getKeyValue<keyof ICreateAirdropFormData, ICreateAirdropFormData>(k)(
            data
          ) !== ""
      )
      ?.filter((key) => !["isvesting", "step", "allocationsData"].includes(key))
      ?.map((key: any) => {
        const value = getKeyValue<
          keyof ICreateAirdropFormData,
          ICreateAirdropFormData
        >(key)(data);
        if (["tokenAddress"].includes(key)) {
          return {
            title: title(key),
            value: value,
            type: "address",
          };
        }
        if (["tge"].includes(key)) {
          return {
            title: "TGE Percent",
            value: value + "%",
          };
        }
        if (["cyclePercent"].includes(key)) {
          return {
            title: title(key),
            value: value + "%",
          };
        }
        if (["cycleSecond"].includes(key)) {
          return {
            title: "Cycle Days",
            value: value,
          };
        }
        if (["startTime"].includes(key)) {
          return {
            title: title(key) + " (UTC)",
            value: moment(formik.values.startTime).utc().format(TIME_FORMAT),
          };
        }
        if (
          [
            "website",
            "facebook",
            "twitter",
            "instagram",
            "github",
            "telegram",
            "discord",
            "reddit",
          ].includes(key)
        ) {
          return {
            title: title(key),
            type: "socials",
            value: value,
          };
        }
        return {
          title: title(key),
          fullWidth: ["description"].includes(key.toLowerCase()),
          value: String(value),
        };
      });
    return map || [];
  }, [data]);

  const disableAllocationsData = () => {
    formik.setFieldValue("allocationsData", []);
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <p className=" text-primary-green text-2xl font-medium mb-6">Details</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <InfoGrid data={airdropDetails} />
          </div>
          <div>
            <div className="">
              <div className=" text-primary-green text-2xl font-medium mb-6">
                Presale starts in
              </div>
              <CountdownTimer date={data.startTime} variant={"unlock"} />
            </div>
          </div>
        </div>
      </form>
      {showSetLocation && (
        <SetAllocationModal
          showModal={showSetLocation}
          setShowModal={closeModal}
          setAllocations={(AllocationsData: IAllocationDetail[]) =>
            setAllocationsData(AllocationsData)
          }
          allocationsData={data.allocationsData}
        />
      )}
    </>
  );
};

export default Step6;
