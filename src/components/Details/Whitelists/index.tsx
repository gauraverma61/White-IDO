import { IPoolDetailsData } from "@components/Details";
import CopyAddress from "@components/Details/CopyAddress";
import { IPoolDetails } from "@components/LaunchPad/Details/hooks/useStats";

const WhitelistDetail = ({
  details,
  token,
}: {
  details: IPoolDetails["whitelists"];
  token: IPoolDetailsData["token"];
}) => {
  return (
    <div className="py-4 sm:py-6 w-full border border-primary-green  ">
      <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 pb-4 mb-4 border-b border-secondary-green ">
        <p className="text-white text-xl font-medium">Whitelist Address</p>
      </div>
      {(details || []).map((data, index) => (
        <div
          key={index}
          className="flex justify-between text-sm font-medium gap-3 px-3 sm:px-4 md:px-6 sm:gap-5 border-b py-3 last:border-b-0 border-secondary-green ">
          <p className="w-[150px] sm:w-auto overflow-x-scroll sm:overflow-x-auto ">
            <CopyAddress
              containerClass={`text-sm font-medium text-right capitalize text-primary-green`}
              type={"address"}
              scale={false}
              iconSize={18}
              address={data.address}
            />
          </p>
          <p className="w-[150px] sm:w-auto overflow-x-scroll sm:overflow-x-auto text-white">
            {data.tier}
          </p>
        </div>
      ))}
    </div>
  );
};
export default WhitelistDetail;
