import React from "react";
import HoverImage from "@components/Common/HoverImage";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { AiOutlineSearch } from "react-icons/ai";
import { launchpads } from "@constants/launchpads";
import SearchInput from "@atoms/SearchInput";
import useAuth from "@hooks/useAuth";

const AllPrivateSale = () => {
  const { chainId } = useAuth();
  return (
    <>
      <SearchInput Icon={AiOutlineSearch} className="mt-6 max-w-2xl" />
      <div className="border-t border-[#DFDADA] pt-12 mt-8">
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
          <Masonry gutter={"10px"}>
            {launchpads.map((lp, index) => (
              <HoverImage
                src={lp.Cover_Img.src}
                tokenName={`${lp.Token_Name}`}
                borderRadius="rounded-old-[16px] cursor-pointer"
                classTag="object-cover rounded-old-[16px] w-full"
                tagName={lp.Status.toLowerCase()}
                textClass="text-[24px] md:text-[32px] m-3"
                tagClass="mb-4"
                type="HomeBanner"
                detailsLink={`private-sale/details/${lp.Address}?blockchain=${chainId}`}
                key={`${index}`}
                time={
                  lp.Status.toLowerCase() === "upcoming"
                    ? lp.Presale_StartTime
                    : lp.Presale_EndTime
                }
              />
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </div>
    </>
  );
};
export default AllPrivateSale;
