import React from "react";
import listingPic9 from "@public/images/img9.png";
import listingPic10 from "@public/images/img10.png";
import listingPic from "@public/images/bannerpic.png";
import useSWR from "swr";

interface Props {
  classTags: string;
  bannerImg: string;
  dividerWidth: string;
}
interface ICircleStats {
  className: string;
  bgSrc: string;
  title: string;
  valueCount: number | string;
}

const CircleStats: React.FC<ICircleStats> = ({
  className,
  bgSrc,
  title,
  valueCount,
}) => {
  return (
    <div
      style={{ backgroundImage: `url(${bgSrc})` }}
      className={`bg-no-repeat bg-cover bg-center flex font-fonde justify-center rounded-old-full   ${className} aspect-square min-w-[200px] max-w-[320px] w-full hover:scale-105 transform duration-500 `}>
      <div className="flex gap-3 flex-col justify-center items-center text-center w-full bg-white/80 rounded-old-full p-3 border">
        <p className="text-3xl md:text-4xl font-bold">{valueCount}</p>
        <div className="flex items-center justify-center w-full px-4">
          <div className={`border-b border-[#000] w-[45%]`}></div>
          <div className="rounded-old-full w-[18px] shrink-0 h-[18px] border border-[#000] mx-3"></div>
          <div className={`border-b border-[#000] w-[45%]`}></div>
        </div>
        <h1 className="text-xl px-4 lg:px-2 lg:text-2xl text-ellipsis">
          {title}
        </h1>
      </div>
    </div>
  );
};

const SectionOne = () => {
  const { data, error } = useSWR(
    `{
    poolFactories {
    poolsCount
    totalRaised
    totalParticipants
  }
}`
  );
  const loading = !error && !data;
  return (
    <div className="mx-6 my-8 md:mx-10 md:my-16 lg:mx-14 lg:my-12 md:mb-18 lg:mb-20 ">
      <div className="flex gap-4 flex-col items-center">
        <div className="font-fonde text-5xl md:text-6xl lg:text-7xl  mb-2.5 md:mb-0 lg:mt-24">
          <h1 className="text-center">Welcome to the ParioPad Launchpad</h1>
        </div>
        <div className="text-center mb-2.5">
          <p>
            ParioPad is a bespoke platform for pre-sales and launches. Our
            platform provides end-to-end services for launching your next
            project.
          </p>
        </div>
        {/* md:scale-90 lg:scale-95 xl:scale-100 */}
        <div className="flex flex-col sm:flex-row gap-6 items-center justify-center w-full">
          <CircleStats
            className={""}
            bgSrc={listingPic.src}
            title={"Total Projects"}
            valueCount={loading ? 0 : data?.poolFactories[0]?.poolsCount ?? 0}
          />
          <CircleStats
            className={""}
            bgSrc={listingPic10.src}
            title={"Total Participants"}
            valueCount={
              loading ? 0 : data?.poolFactories[0]?.totalParticipants ?? 0
            }
          />
          <CircleStats
            className={""}
            bgSrc={listingPic9.src}
            title={"Total Liquidity Raised"}
            valueCount={
              loading
                ? 0
                : (data?.poolFactories[0]?.totalRaised &&
                    parseFloat(data?.poolFactories[0]?.totalRaised) /
                      10 ** 18) ??
                  0
            }
          />
        </div>
        {/* <div className="flex md:hidden justify-center">
          <div className="flex flex-col w-full max-w-[400px]  md:hidden items-center justify-evenly aspect-square bg-[#BCEAD5] rounded-old-full p-4">
            <div className="flex flex-col justify-center items-center text-center">
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold">
                {loading ? 0 : data?.poolFactories[0].poolsCount}
              </p>
              <p className="text-sm font-normal ">{"Total Projects"}</p>
            </div>
            <div className="flex flex-col justify-center items-center text-center">
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold">
                {loading ? 0 : data?.poolFactories[0].totalParticipants}
              </p>
              <p className="text-sm font-normal ">{"Total Participants"}</p>
            </div>
            <div className="flex flex-col justify-center items-center text-center">
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold">
                {loading ? 0 : data?.poolFactories[0].totalRaised}
              </p>
              <p className="text-sm font-normal">{"Total Liquidity Raised"}</p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default SectionOne;
