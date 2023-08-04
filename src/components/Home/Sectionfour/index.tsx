import React from "react";
import card1Img from "@public/images/smallcardpic.png";
import card2Img from "@public/images/smallcardpic2.png";
import card3Img from "@public/images/smallcardpic3.png";

const SectionFour = () => {
  return (
    <div>
      <div className="mx-auto max-w-[1000px] 2xl:max-w-[1400px] px-10 lg:px-5 py-8 md:py-16">
        <h4 className="font-fonde text-4xl 2xl:text-5xl text-center mb-14">
          UPCOMING
        </h4>
        <div className="flex flex-col lg:flex-row justify-between">
          <img
            className="my-5 lg:h-[150px] 2xl:h-[200px]"
            src={card3Img.src}
            alt=""
          />
          <img
            className="my-5 lg:h-[150px] 2xl:h-[200px]"
            src={card2Img.src}
            alt=""
          />
          <img
            className="my-5 lg:h-[150px] 2xl:h-[200px]"
            src={card1Img.src}
            alt=""
          />
        </div>
      </div>
      <div className="mx-auto max-w-[1000px] 2xl:max-w-[1400px] px-10 lg:px-5 py-8 md:py-16">
        <h4 className="font-fonde text-4xl 2xl:text-5xl text-center mb-14">
          UPCOMING
        </h4>
        <div className="flex flex-col lg:flex-row justify-between">
          <img
            className="my-5 lg:h-[150px] 2xl:h-[200px]"
            src={card3Img.src}
            alt=""
          />
          <img
            className="my-5 lg:h-[150px] 2xl:h-[200px]"
            src={card2Img.src}
            alt=""
          />
          <img
            className="my-5 lg:h-[150px] 2xl:h-[200px]"
            src={card1Img.src}
            alt=""
          />
        </div>
      </div>
      <div className="mx-auto max-w-[1000px] 2xl:max-w-[1400px] px-10 lg:px-5 py-8 md:py-16">
        <h4 className="font-fonde text-4xl 2xl:text-5xl text-center mb-14">
          UPCOMING
        </h4>
        <div className="flex flex-col lg:flex-row justify-between">
          <img
            className="my-5 lg:h-[150px] 2xl:h-[200px]"
            src={card3Img.src}
            alt=""
          />
          <img
            className="my-5 lg:h-[150px] 2xl:h-[200px]"
            src={card2Img.src}
            alt=""
          />
          <img
            className="my-5 lg:h-[150px] 2xl:h-[200px]"
            src={card1Img.src}
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default SectionFour;
