import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import HoverImage from "@components/Common/HoverImage";
import { IPool } from "@components/LaunchPad/List/hooks/useStats";
import Pagination, { IPaginationSelected } from "@components/Pagination";
import Loader from "@components/Loader";
import useSWR from "swr";
import shuffleArray from "@helpers/shuffleArray";
import dynamic from "next/dynamic";
import { GridItem } from "@components/LaunchPad/Grid/GridItem";
import { PackeryContext } from "@components/LaunchPad/Grid/Context";
import {
  getProjectStatus,
  getProjectTime,
} from "@components/LaunchPad/List/index";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import getProjectLink from "@helpers/getProjectLink";
import useAuth from "@hooks/useAuth";

const PackeryContainer = dynamic(
  () =>
    import("@components/LaunchPad/Grid/PackeryContainer").then(
      (m) => m.PackeryContainer
    ),
  {
    ssr: false,
  }
);

// ParioPad diameter
const getCircleSizeClass = (hardCap: number) => {
  if (hardCap > 0 && hardCap < 10) {
    return "grid-item--width1";
  } else if (hardCap > 10 && hardCap < 50) {
    return "grid-item--width2";
  } else if (hardCap > 50 && hardCap < 200) {
    return "grid-item--width3";
  } else {
    return "grid-item--width4";
  }
};
export interface IStats {
  getTotalNumberOfPools: number;
  page: number;
  pageSize: number;
  poolList: IPool[];
  loading: boolean;
  chainId?: number | undefined;
}

export interface IUpdater {
  page: number;
  pageSize: number;
}

function RenderGid({ data }: { data: any }) {
  const { packeryInstance } = useContext(PackeryContext);
  const { chainId } = useAuth();
  useEffect(() => {
    if (packeryInstance) {
      setTimeout(() => {
        packeryInstance.layout();
      }, 100);
    }
  }, [data, packeryInstance]);

  return (
    data &&
    data.map((item: any, index: any) => {
      if (item.type == "sponsors") {
        return (
          <GridItem
            key={index}
            className={`${getCircleSizeClass(
              Number(item.attributes.hardcap)
            )}`}>
            <div key={index}>
              <HoverImage
                type="HomeBanner"
                hardCap={item.attributes.hardcap}
                src={item.attributes.image}
                borderRadius="rounded-old-full"
                classTag={`object-cover rounded-old-full aspect-square`}
                tagName={"promoted"}
                textClass="text-lg my-1"
                tokenName={`${item.attributes.title}`}
                detailsLink={item.attributes.link}
                outerlink={true}
                startTime={item.startTime}
                endTime={item.endTime}
                time={item.startTime}
                description={item?.attributes?.description}
              />
            </div>
          </GridItem>
        );
      }
      return (
        <GridItem
          key={index}
          className={`${getCircleSizeClass(Number(item.hardCap))}`}>
          <div key={index}>
            <HoverImage
              type="HomeBanner"
              src={item.logourl}
              hardCap={item.hardCap || item.softCap}
              borderRadius="rounded-old-full"
              classTag={`object-cover rounded-old-full aspect-square`}
              tagName={getProjectStatus(item)}
              textClass="text-lg my-1"
              tokenName={`${item.poolDetails?.title ?? item.name}`}
              detailsLink={getProjectLink(
                item.poolAddress,
                item.poolType,
                chainId
              )}
              startTime={item.startTime}
              endTime={item.endTime}
              time={`${getProjectTime(item)}`}
            />
          </div>
        </GridItem>
      );
    })
  );
}

const AllLaunchPadItem = ({
  launchpads,
  loading,
  updater,
  setUpdater,
  showSponsers,
}: {
  launchpads: IPool[];
  // stats: IStats;
  updater: IUpdater;
  setUpdater: Dispatch<SetStateAction<IUpdater>>;
  loading: boolean;
  showSponsers: boolean;
}) => {
  const handlePageClick = ({ selected }: IPaginationSelected) => {
    setUpdater({
      ...updater,
      page: selected,
    });
  };

  const [mergeArray, setMergeArray] = useState<any>([]);

  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data: sponsersData, error } = useSWR(`/api/v1/sponsors`, fetcher);

  React.useEffect(() => {
    let merged = launchpads;
    if (sponsersData?.data) {
      merged = shuffleArray([...merged, ...sponsersData.data]);
    }
    setMergeArray(merged);
  }, [sponsersData, launchpads]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="pt-12 mt-8">
          {launchpads.length > 0 ? (
            <>
              <PackeryContainer>
                <RenderGid data={showSponsers ? mergeArray : launchpads} />
              </PackeryContainer>
            </>
          ) : (
            <div className="text-center py-20">No Data Found </div>
          )}
          <div className="flex justify-center items-center gap-8">
            <button
              onClick={() => {
                if (updater.page > 0) {
                  handlePageClick({ selected: updater.page - 1 });
                }
              }}
              type="button"
              disabled={updater.page === 0}
              className="bg-[#F6F6F6] h-10 w-10 rounded-old-full flex justify-center items-center disabled:text-gray-300">
              <MdOutlineKeyboardArrowLeft size={30} />
            </button>
            <button
              onClick={() => {
                handlePageClick({ selected: updater.page + 1 });
              }}
              disabled={launchpads?.length < updater.pageSize}
              type="button"
              className="bg-[#F6F6F6] h-10 w-10 rounded-old-full flex justify-center items-center disabled:text-gray-300">
              <MdOutlineKeyboardArrowRight size={30} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default AllLaunchPadItem;
