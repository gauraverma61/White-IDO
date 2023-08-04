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

export interface IVestingDetail {
  tge: string;
  cyclePercent: string;
  cycleSecond: string;
}

const Step3: React.FC<ICreateAirdrop> = (props) => {
  const { formik, airdropBannerImage } = props;
  const { values: data, handleSubmit } = formik;
  const { account, chainId, library } = useAuth();

  const [showSetLocation, setShowSetLocation] = useState(false);
  const closeModal = () => {
    return setShowSetLocation(false);
  };

  const [vestingData, setVestingData] = useState<IVestingDetail>();
  const [allocationsData, setAllocationsData] = useState<IAllocationDetail[]>(
    []
  );

  const [showSetVesting, setShowSetVesting] = useState(false);
  const closeVestingModal = () => {
    return setShowSetVesting(!showSetVesting);
  };

  useEffect(() => {
    if (vestingData) {
      formik.setFieldValue("tge", vestingData.tge);
      formik.setFieldValue("cyclePercent", vestingData.cyclePercent);
      formik.setFieldValue("cycleSecond", vestingData.cycleSecond);
    }
  }, [vestingData]);

  useEffect(() => {
    if (allocationsData.length > 0) {
      formik.setFieldValue("allocationsData", allocationsData);
    }
  }, [allocationsData]);

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
      <p className="text-xl font-semibold">CircleToken Airdrop</p>
      <div className="my-6 sm:max-h-10 flex flex-1 flex-col sm:flex-row sm:gap-10">
        <div
          className="rounded-old-full truncate hover:bg-white hover:outline hover:outline-1 hover:outline-gray2 hover:text-gray2 mb-5 sm:mb-0 bg-gray2 text-white p-2 sm:w-1/2 text-center cursor-pointer"
          onClick={() => setShowSetLocation(true)}>
          Set Allocations
        </div>
        <div
          className="bg-white truncate text-red4 border border-red4  rounded-old-full p-2 sm:w-1/2 text-center cursor-pointer"
          onClick={() => disableAllocationsData()}>
          Remove All Allocations
        </div>
      </div>
      <div className="mb-10 sm:max-h-10 flex flex-1 flex-col sm:flex-row sm:mr-10 ">
        <div
          className="rounded-old-full  truncate hover:bg-white hover:outline hover:outline-1 hover:outline-gray2 hover:text-gray2 mb-5 sm:mb-0 bg-gray2 text-white p-2 sm:w-1/2 text-center cursor-pointer"
          onClick={() => setShowSetVesting(true)}>
          Set Vesting
        </div>
      </div>

      <div>
        <p className="text-xl font-semibold">Details</p>
        <InfoGrid
          specialPosition={[3, 4]}
          specialClass="text-sm font-medium text-[#2B4CFF] cursor-pointer"
          data={airdropDetails}
        />
        {data.allocationsData.length > 0 ? (
          <>
            <p className="text-xl font-semibold">Allocations</p>
            <AllocationDetail details={data.allocationsData} />
          </>
        ) : null}
        <div className="flex justify-center mt-4">
          <HoverImage
            type="staticImageWithHover"
            borderRadius="rounded-old-full"
            classTag="rounded-old-[120px] w-[318px] h-[318px] object-cover"
            src={airdropBannerImage}
            title={formik.values.title}
            time={formik.values.startTime}
          />
        </div>
      </div>
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
      {showSetVesting && (
        <SetVestingModal
          showModal={showSetVesting}
          setShowModal={closeVestingModal}
          setVesting={(vestingValue: IVestingDetail) =>
            setVestingData(vestingValue)
          }
          vestingData={{
            tge: data.tge,
            cyclePercent: data.cyclePercent,
            cycleSecond: data.cycleSecond,
          }}
        />
      )}
    </>
  );
};

export default Step3;
