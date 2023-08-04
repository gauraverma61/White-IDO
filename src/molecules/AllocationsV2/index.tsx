import { confirmation2MultiSenderData } from "@constants/multisenderData";

export interface IAllocationDetail {
  address: string;
  amount: string;
}
const AllocationDetail = ({ details }: { details: IAllocationDetail[] }) => {
  return (
    <div className="mt-6 w-full shadow-boxShadow6 p-4 py-6  ">
      <div className="flex items-center justify-between px-3 sm:px-4 mb-4">
        <p className="text-base font-semibold">Address</p>
        <p className="text-base font-semibold">Amount</p>
      </div>
      <div className="max-h-[440px] overflow-y-scroll">
        {details.map((data, index) => (
          <div
            key={index}
            className="flex justify-between text-sm font-medium gap-3 px-3 sm:px-4 sm:gap-5 py-3 ">
            <p className="w-[150px] sm:w-auto overflow-x-scroll sm:overflow-x-auto ">
              {data.address}
            </p>
            <p>{data.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AllocationDetail;
