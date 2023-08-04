import React from "react";
import SectionFive from "./SectionFive";
// import SectionFour from "./Sectionfour";
import SectionOne from "./Sectionone";
import SectionThree from "./Sectionthree";
import SectionTwo from "./Sectiontwo";
// import Footer from "@components/Footer";
// import FAQ from "@components/Home/FAQ";
import RaiseCapitalSection from "./RaiseCapitalSection";
// import StepSection from "./StepSection";
import PerformerStats from "./PerformerStats";

const HomeComp = () => {
  return (
    <>
      <div className="container mx-auto">
        <SectionOne />
      </div>
      <RaiseCapitalSection />
      <SectionThree />
      <div className="container mx-auto">
        <SectionTwo />
      </div>
      <div className="container mx-auto">
        <PerformerStats />
        <SectionFive />
        {/* <StepSection /> */}
        {/*<FAQ />*/}
      </div>
    </>
  );
};

export default HomeComp;
