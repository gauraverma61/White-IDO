import React from "react";
import { useRouter } from "next/router";

interface IData {
  title: string;
  id?: number;
  subtitle: string;
  amount: string;
  href: string;
}

interface ITableProps {
  tableHead: string[];
  data: IData[];
}

const CustomTable = (props: ITableProps) => {
  const router = useRouter();

  const onView = (href: string) => {
    router.push(`/pario-lock/${href}`);
  };

  const { tableHead, data } = props;
  return (
    <div className="overflow-x-auto">
      <table className=" w-full text-white">
        <thead className="">
          <tr>
            {tableHead.map((head, index) => {
              return (
                <th
                  key={index}
                  className={`${index == 0 && "md:pl-14"} ${
                    index < 3 ? "text-left" : ""
                  } text-lg font-medium w-3/12 p-4 pt-10 `}>
                  {head}
                </th>
              );
            })}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((singleData, index) => {
            return (
              <tr
                key={index}
                className="hover border-b border-dull-border last:border-0 ">
                <td className="text-base font-normal text-left md:pl-14 p-4">
                  {singleData?.id ? singleData?.id : index + 1}
                </td>
                <td className="text-base font-normal text-left py-4 md:p-4">
                  <div className="text-base font-normal min-w-max ">
                    {singleData.title}
                  </div>
                  {singleData.subtitle && (
                    <div className="text-gray3">{singleData.subtitle}</div>
                  )}
                </td>
                <td className="text-base font-medium text-left p-4">
                  {singleData.amount}
                </td>
                <td className="text-end pr-4 md:pr-14">
                  <div
                    onClick={() => onView(singleData.href)}
                    className=" cursor-pointer text-primary-green ">
                    View
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
