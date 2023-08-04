import React from "react";

interface IData {
  title: string;
  subtitle: string;
  amount: string;
  view: string;
}

interface ITableProps {
  tableHead: string[];
  data: IData[];
}

const CustomTable = (props: ITableProps) => {
  const { tableHead, data } = props;
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead className="border-b border-bordergraydark">
          <tr>
            {tableHead.map((head, index) => {
              return (
                <th key={index} className="bg-white">
                  {head}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((singleData, index) => {
            return (
              <tr
                key={index}
                className="hover border-b border-bordergraylight ">
                <td className="text-base font-normal">
                  <div>{singleData.title}</div>
                  {singleData.subtitle && (
                    <div className="text-gray3">{singleData.subtitle}</div>
                  )}
                </td>
                <td className="text-base font-normal">{singleData.amount}</td>
                <td
                  className={`${
                    singleData.view
                      ? "text-base font-normal text-primary-violet cursor-pointer underline"
                      : ""
                  }`}>
                  {singleData.view}
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
