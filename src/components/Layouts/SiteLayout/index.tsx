import SidebarComp from "@components/Sidebar";
import React, { useEffect, useState } from "react";
import HeaderComp from "../../Header";
import { useRouter } from "next/router";
import Footer from "@components/Footer";
import useWidth from "@hooks/useWidth";
import NewHeader from "@components/NewHeader";
import parioBgLeft from "@public/images/left-bg-elment.png";
import parioBgRight from "@public/images/right-bg-elment.png";

const LayoutContainer = ({ children }: { children: React.ReactNode }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();
  const width = useWidth();

  const returnContainerClass = () => {
    if (router.pathname === "/") {
      return " ";
    } else {
      return "px-6 md:px-12 lg:px-14 z-20 relative";
    }
  };
  const returnContainerClass2 = () => {
    if (router.pathname === "/") {
      return " ";
    } else {
      return "container mx-auto";
    }
  };
  return (
    <>
      <div className={`relative bg-[#010501] dark overflow-hidden`}>
        {/*<div className="grad-bg top-0 left-[50%] right-[50%]  h-[400px] w-full sm:w-[400px] z-0"></div>*/}
        {/*<div className="grad-bg bottom-0 -right-20  h-[400px] w-full sm:w-[400px] z-0"></div>*/}
        {router.pathname !== "/" && (
          <>
            <div
              style={{
                background: `url(${parioBgLeft.src})`,
              }}
              className="absolute top-0 left-0 bg-contain bg-no-repeat h-[500px] w-[500px] z-[1]"></div>
            <div
              style={{
                background: `url(${parioBgRight.src})`,
              }}
              className="absolute bottom-0 -right-20 bg-contain bg-no-repeat h-[500px] w-[500px] z-[1]"></div>{" "}
          </>
        )}
        <NewHeader
          setIsDrawerOpen={setIsDrawerOpen}
          isDrawerOpen={isDrawerOpen}
        />
        {isDrawerOpen && (
          <SidebarComp
            setIsDrawerOpen={setIsDrawerOpen}
            isDrawerOpen={isDrawerOpen}
          />
        )}
        <div
          className={`transition-all ease-linear duration-200 ${returnContainerClass2()} `}>
          <div className={`${returnContainerClass()} min-h-screen`}>
            {children}
          </div>
        </div>
        {/*<Footer className="" />*/}
      </div>
    </>
  );
};

export default LayoutContainer;
