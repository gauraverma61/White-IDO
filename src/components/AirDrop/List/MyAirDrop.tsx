import React from "react";
import { usePoolListUser } from "@components/AirDrop/List/hooks/useStats";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import HoverImage from "@components/Common/HoverImage";
import useAuth from "@hooks/useAuth";

const MyAirDrop = () => {
  const stats = usePoolListUser({
    page: 0,
    pageSize: 10,
    loading: false,
  });
  const { chainId } = useAuth();
  console.log("airdrop stats", stats);
  return (
    <>
      {stats.poolList.length <= 0 && (
        <div className="text-center pt-32 pb-10">No data</div>
      )}
      <div className="border-t border-[#DFDADA] pt-12 mt-8">
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
          <Masonry gutter={"10px"}>
            {stats.poolList.map((lp, index) => (
              <HoverImage
                src={lp.poolDetails.banner}
                tokenName={`${lp.token.name}`}
                borderRadius="rounded-old-[16px] cursor-pointer"
                classTag="object-cover rounded-old-[16px] w-full"
                tagName={"live"}
                textClass="text-[24px] md:text-[32px] m-3"
                tagClass="mb-4"
                type="HomeBanner"
                detailsLink={`airdrop/details/${lp.poolAddress}?blockchain=${chainId}`}
                key={`${index}`}
                time={lp.startTime}
              />
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </div>
    </>
  );
};

export default MyAirDrop;
