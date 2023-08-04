import { IPoolDetailsData } from "@components/Details";
import CopyAddress from "@components/Details/CopyAddress";

export interface IAllocationDetail {
  address: string;
  amount: string;
}
const AllocationDetail = ({
  details,
  token,
}: {
  details: IAllocationDetail[];
  token: IPoolDetailsData["token"];
}) => {
  return (
    <div className="py-4 sm:py-6   mt-8 w-full  border border-greenV3 ">
      <div className="flex items-center text-white  justify-between px-3 sm:px-4 md:px-6 pb-4 mb-4 border-b border-greenV3 ">
        <p className="text-base font-medium">Address</p>
        <p className="text-base font-medium">Amount</p>
      </div>
      {details.map((data, index) => (
        <div
          key={index}
          className="flex justify-between text-sm font-medium gap-3 px-3 sm:px-4 md:px-6 sm:gap-5 border-b py-3 last:border-b-0">
          <p className="w-[150px] sm:w-auto overflow-x-scroll sm:overflow-x-auto ">
            <CopyAddress
              type={"address"}
              scale={false}
              address={data.address}
            />
          </p>
          <p className="text-primary-green">
            {parseFloat(data.amount) / 10 ** token.decimals}{" "}
            {token.symbol.toUpperCase()}
          </p>
        </div>
      ))}
    </div>
  );
};
export default AllocationDetail;
