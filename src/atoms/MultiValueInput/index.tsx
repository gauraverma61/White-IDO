import { useWhitelistStats } from "@components/LaunchPad/Details/hooks/useStats";
import { trimAddress } from "@constants/constant";
import { isAddress } from "ethers/lib/utils";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { toast } from "react-toastify";

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  allocationsData?: any;
  users?: any;
  setUsers?: any;
  whitelisted?: any;
  tier?: any;
  deleteMode?: any;
  addressArray: string[];
  PushThisCSV?: any;
}

const MultiValueInput: React.FC<IInputProps> = ({
  allocationsData,
  users,
  setUsers,
  whitelisted,
  tier,
  deleteMode,
  addressArray,
  PushThisCSV,
}) => {
  const allocations = useWhitelistStats({
    address: whitelisted,
    page: 0,
    pageSize: 10,
    loading: false,
  });
  const [tier1White, settier1White] = useState<any>(
    allocations?.filter((obj) => obj.tier == "1")?.map((obj) => obj.address)
  );
  const [tier2White, settier2White] = useState<any>(
    allocations?.filter((obj) => obj.tier == "2")?.map((obj) => obj.address)
  );
  const [deleteUser, setDeleteUser] = useState<any>([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (value) {
      setUsers(value);
    }
  }, [value]);

  useEffect(() => {
    let CSVarr = PushThisCSV.map((arr: any) => arr[0]);
    if (tier === "1") {
      settier1White([...tier1White, ...(CSVarr ?? [""])]);
    } else {
      settier2White([...tier2White, ...(CSVarr ?? [""])]);
    }
  }, [PushThisCSV]);

  // useEffect(() => {
  //   settier1White(allocations?.filter((obj) => obj.tier == "1")?.map((obj) => obj.address))
  //   settier2White(allocations?.filter((obj) => obj.tier == "2")?.map((obj) => obj.address))
  // },[tier])

  useEffect(() => {
    if (tier === "1") {
      settier1White([...(addressArray ?? [""])]);
    } else {
      settier2White([...(addressArray ?? [""])]);
    }
  }, [addressArray]);

  useEffect(() => {
    settier1White(
      allocations?.filter((obj) => obj.tier == "1")?.map((obj) => obj.address)
    );
    settier2White(
      allocations?.filter((obj) => obj.tier == "2")?.map((obj) => obj.address)
    );
  }, [allocations]);
  //   let tier1White = allocations?.filter((obj) => obj.tier == "1");
  //   let tier2White = allocations?.filter((obj) => obj.tier == "2");
  const handleAppendAllocation = (e: any) => {
    if (e.key === "Enter" && e.target.value) {
      setValue("");
      if (isAddress(e.target.value)) {
        if (
          tier1White.includes(e.target.value) ||
          tier1White.includes(e.target.value?.toLowerCase()) ||
          tier2White.includes(e.target.value) ||
          tier2White.includes(e.target.value?.toLowerCase())
        ) {
          toast.error("Address Already in Whitelist !");
        } else {
          if (tier === "1") {
            let arr1 = [...tier1White, e.target.value.toLowerCase()];
            settier1White(arr1);
          } else {
            settier2White([...tier2White, e.target.value.toLowerCase()]);
          }
        }
      } else {
        toast.error("Please Enter Valid Addess !");
      }
      e.target.value = "";
    }
  };

  useLayoutEffect(() => {
    if (deleteMode) {
      setUsers(deleteUser.join("\r\n"));
    } else if (tier === "1") {
      setUsers((state: any) =>
        // ...state,
        tier1White
          ?.filter(
            (obj: any) => !allocations?.find((alloc) => alloc.address === obj)
          )
          .join("\r\n")
      );
    } else {
      setUsers((state: any) =>
        // ...state,
        tier2White
          ?.filter(
            (obj: any) => !allocations?.find((alloc) => alloc.address === obj)
          )
          .join("\r\n")
      );
    }
  }, [tier1White, tier2White, tier, deleteUser, deleteMode]);

  // useLayoutEffect(() => {

  // }, []);

  console.log(whitelisted, "users w", users, allocations);

  const AddressElement = (data: any, index: any) => (
    <span
      className={`border-dull-green border ${
        index === 0 ? "ml-1" : "ml-3"
      } px-2 py-1  relative`}
      onClick={() => {
        if (tier1White.includes(data)) {
          settier1White(tier1White.filter((address: any) => address !== data));
          if (allocations?.some((alloc) => alloc.address === data)) {
            setDeleteUser([...deleteUser, data]);
          }
        } else if (tier2White.includes(data)) {
          settier2White(tier2White.filter((address: any) => address !== data));
          if (allocations?.some((alloc) => alloc.address === data)) {
            setDeleteUser([...deleteUser, data]);
          }
        } else {
          setDeleteUser([...deleteUser, data]);
        }
      }}
      key={index}>
      {deleteMode && (
        <div className="absolute top-2 -right-2 bg-red5 text-secondary-dark rounded-old-sm text-xs px-1 text-center cursor-pointer">
          -
        </div>
      )}
      {data && trimAddress(data)}
    </span>
  );

  return (
    <div
      className={`flex w-full max-w-[480px] 2xl:max-w-[600px] border border-primary-${
        deleteMode ? "red" : "green"
      }  bg-secondary-dark px-4 py-4 placeholder:secondary-green text-secondary-green`}>
      <div
        className={`text-primary-${
          deleteMode ? "red" : "green"
        } border-r px-3 pr-5 py-2 ${
          deleteMode ? "border-dull-red" : "border-dull-green"
        }`}>
        {deleteMode ? "-" : "+"}
      </div>
      <div className="py-1 ml-1 overflow-x-auto overflow-y-visible w-full min-w-[410px] flex">
        {deleteMode ? (
          <>
            {tier1White?.length > 0 &&
              tier1White?.map((data: any, index: any) =>
                AddressElement(data, index)
              )}
            {tier2White?.length > 0 &&
              tier2White?.map((data: any, index: any) =>
                AddressElement(data, index)
              )}
          </>
        ) : tier == "1" ? (
          tier1White?.length > 0 &&
          tier1White?.map((data: any, index: any) =>
            AddressElement(data, index)
          )
        ) : (
          tier2White?.length > 0 &&
          tier2White?.map((data: any, index: any) =>
            AddressElement(data, index)
          )
        )}
        {!deleteMode && (
          <input
            className="bg-transparent pl-2 pt-0.5 m-0 outline-none h-full w-full min-w-[200px]"
            onKeyDown={handleAppendAllocation}
            onChange={(e) => setValue(e.target.value)}
            value={value}></input>
        )}
      </div>
    </div>
  );
};

export default MultiValueInput;
