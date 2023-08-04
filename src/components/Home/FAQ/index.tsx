import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";

const FAQ = () => {
  const [flag, setflag] = useState([0, 1, 1, 1, 1, 1, 1]);
  const toggler = (i: number) => {
    const newflag = [...flag];
    newflag[i] ^= 1;
    setflag(newflag);
  };
  return (
    <div className="container mx-auto max-w-3xl 2xl:max-w-5xl ">
      <div className="flex flex-col mb-8 mt-28 lg:mt-36 pt-4 ">
        <div className="text-4xl md:text-6xl 2xl:text-7xl text-center font-fonde">
          Frequently Asked Questions
        </div>
        <div className="mt-12 flex justify-center">
          <div className="flex justify-between flex-col px-4 w-full md:max-w-[90%]">
            <div
              className="flex flex-row justify-between cursor-pointer"
              onClick={() => toggler(0)}>
              <div className="font-bold text-base">Where can I watch?</div>
              <div className="flex items-center ">
                {flag[0] === 1 ? (
                  <IoIosArrowForward
                    size={20}
                    className="cursor-pointer font-bold text-indigo-500"
                  />
                ) : (
                  <IoIosArrowDown
                    size={20}
                    className="cursor-pointer font-bold text-indigo-500"
                  />
                )}
              </div>
            </div>
            <div
              className={`text-base text-gray-600 mt-2 ${
                flag[0] === 1 ? "hidden" : ""
              }`}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
              sodales, enim in ultricies pellentesque, sapien erat gravida
              neque, euismod tempus ex velit nec tortor. Fusce ultrices lectus
              nulla, ullamcorper semper ipsum auctor eget. Aliquam euismod vel
              nibh sit amet imperdiet.
            </div>
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <div className="flex justify-between flex-col px-4 w-full md:max-w-[90%]">
            <div
              className="flex flex-row justify-between cursor-pointer"
              onClick={() => toggler(1)}>
              <div className="font-bold text-base">Where can I watch?</div>
              <div className="flex items-center ">
                {flag[1] === 1 ? (
                  <IoIosArrowForward
                    size={20}
                    className="cursor-pointer text-indigo-500"
                  />
                ) : (
                  <IoIosArrowDown
                    size={20}
                    className="cursor-pointer text-indigo-500"
                  />
                )}
              </div>
            </div>
            <div
              className={`text-base text-gray-600 mt-2 ${
                flag[1] === 1 ? "hidden" : ""
              }`}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
              sodales, enim in ultricies pellentesque, sapien erat gravida
              neque, euismod tempus ex velit nec tortor. Fusce ultrices lectus
              nulla, ullamcorper semper ipsum auctor eget. Aliquam euismod vel
              nibh sit amet imperdiet.
            </div>
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <div className="flex justify-between flex-col px-4 w-full md:max-w-[90%]">
            <div
              className="flex flex-row justify-between cursor-pointer"
              onClick={() => toggler(2)}>
              <div className="font-bold text-base">Where can I watch?</div>
              <div className="flex items-center ">
                {flag[2] === 1 ? (
                  <IoIosArrowForward
                    size={20}
                    className="cursor-pointer text-indigo-500"
                  />
                ) : (
                  <IoIosArrowDown
                    size={20}
                    className="cursor-pointer text-indigo-500"
                  />
                )}
              </div>
            </div>
            <div
              className={`text-base text-gray-600 mt-2 ${
                flag[2] === 1 ? "hidden" : ""
              }`}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
              sodales, enim in ultricies pellentesque, sapien erat gravida
              neque, euismod tempus ex velit nec tortor. Fusce ultrices lectus
              nulla, ullamcorper semper ipsum auctor eget. Aliquam euismod vel
              nibh sit amet imperdiet.
            </div>
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <div className="flex justify-between flex-col px-4 w-full md:max-w-[90%]">
            <div
              className="flex flex-row justify-between cursor-pointer"
              onClick={() => toggler(3)}>
              <div className="font-bold text-base">Where can I watch?</div>
              <div className="flex items-center ">
                {flag[3] === 1 ? (
                  <IoIosArrowForward
                    size={20}
                    className="cursor-pointer text-indigo-500"
                  />
                ) : (
                  <IoIosArrowDown
                    size={20}
                    className="cursor-pointer text-indigo-500"
                  />
                )}
              </div>
            </div>
            <div
              className={`text-base text-gray-600 mt-2 ${
                flag[3] === 1 ? "hidden" : ""
              }`}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
              sodales, enim in ultricies pellentesque, sapien erat gravida
              neque, euismod tempus ex velit nec tortor. Fusce ultrices lectus
              nulla, ullamcorper semper ipsum auctor eget. Aliquam euismod vel
              nibh sit amet imperdiet.
            </div>
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <div className="flex justify-between flex-col px-4 w-full md:max-w-[90%]">
            <div
              className="flex flex-row justify-between cursor-pointer"
              onClick={() => toggler(4)}>
              <div className="font-bold text-base">Where can I watch?</div>
              <div className="flex items-center ">
                {flag[4] === 1 ? (
                  <IoIosArrowForward
                    size={20}
                    className="cursor-pointer text-indigo-500"
                  />
                ) : (
                  <IoIosArrowDown
                    size={20}
                    className="cursor-pointer text-indigo-500"
                  />
                )}
              </div>
            </div>
            <div
              className={`text-base text-gray-600 mt-2 ${
                flag[4] === 1 ? "hidden" : ""
              }`}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
              sodales, enim in ultricies pellentesque, sapien erat gravida
              neque, euismod tempus ex velit nec tortor. Fusce ultrices lectus
              nulla, ullamcorper semper ipsum auctor eget. Aliquam euismod vel
              nibh sit amet imperdiet.
            </div>
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <div className="flex justify-between flex-col px-4 w-full md:max-w-[90%]">
            <div
              className="flex flex-row justify-between cursor-pointer"
              onClick={() => toggler(5)}>
              <div className="font-bold text-base">Where can I watch?</div>
              <div className="flex items-center ">
                {flag[5] === 1 ? (
                  <IoIosArrowForward
                    size={20}
                    className="cursor-pointer text-indigo-500"
                  />
                ) : (
                  <IoIosArrowDown
                    size={20}
                    className="cursor-pointer text-indigo-500"
                  />
                )}
              </div>
            </div>
            <div
              className={`text-base text-gray-600 mt-2 ${
                flag[5] === 1 ? "hidden" : ""
              }`}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
              sodales, enim in ultricies pellentesque, sapien erat gravida
              neque, euismod tempus ex velit nec tortor. Fusce ultrices lectus
              nulla, ullamcorper semper ipsum auctor eget. Aliquam euismod vel
              nibh sit amet imperdiet.
            </div>
          </div>
        </div>
        {/* <div className="mt-10 flex justify-center">
        <div className="flex justify-between flex-col px-4  w-screen sm:min-w-[60%] sm:max-w-[60%]">
          <div
            className="flex flex-row justify-between cursor-pointer"
            onClick={() => toggler(6)}>
            <div className="font-bold text-base">Where can I watch?</div>
            <div>
              {flag[6] === 1 ? (
                <IoIosArrowForward
                  size={20}
                  className="cursor-pointer text-indigo-500"
                />
              ) : (
                <IoIosArrowDown
                  size={20}
                  className="cursor-pointer text-indigo-500"
                />
              )}
            </div>
          </div>
          <div
            className={`text-base text-gray-600 mt-2 ${
              flag[6] === 1 ? "hidden" : ""
            }`}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sodales,
            enim in ultricies pellentesque, sapien erat gravida neque, euismod
            tempus ex velit nec tortor. Fusce ultrices lectus nulla, ullamcorper
            semper ipsum auctor eget. Aliquam euismod vel nibh sit amet
            imperdiet.
          </div>
        </div>
      </div> */}
      </div>
    </div>
  );
};

export default FAQ;
