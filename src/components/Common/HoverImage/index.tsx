import React, { useEffect, useState } from "react";
import parachuteIcon from "@public/images/parachute-icon.svg";
import Link from "next/link";
import { CountdownTimer } from "@atoms/CountdownTimer";
import moment from "moment";
import { getPercentage, getRingColor } from "@helpers/ringHelpers";
import { Circle } from "rc-progress";
import { Tooltip as ReactTooltip } from "react-tooltip";

interface Iprops {
  borderRadius?: string;
  src?: string;
  type: string;
  classTag?: string;
  marginSpace?: string;
  containerWidth?: string;
  containerHeight?: string;
  sectionPage?: string;
  title?: string;
  time?: string;
  detailsLink?: string;
  tagName?: string;
  textClass?: string;
  tagClass?: string;
  StartAirDropTime?: string;
  tokenName?: string;
  startTime?: string;
  endTime?: string;
  saleType?: string;
  outerlink?: boolean;
  hardCap?: string | number;
  description?: string;
}

const HoverImage: React.FC<Iprops> = ({
  borderRadius,
  src,
  type,
  classTag,
  marginSpace,
  containerWidth,
  containerHeight,
  sectionPage,
  title,
  time,
  detailsLink,
  tagName,
  textClass,
  tagClass,
  StartAirDropTime,
  tokenName,
  startTime,
  endTime,
  saleType,
  outerlink,
  hardCap,
  description,
}) => {
  const [percentage, setPercentage] = useState<number>();

  useEffect(() => {
    const interval = setInterval(() => {
      setPercentage(getPercentage(Number(startTime), Number(endTime), tagName));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {type === "staticImage" && (
        <img src={src} alt={"token-img-1"} className={classTag} />
      )}
      {type === "staticImageWithHover" && (
        <div
          className={`${borderRadius} relative border border-[#e4dfe1] overflow-hidden`}>
          <img src={src} className={classTag} alt="" />
          <div
            className={`flex content-center overflow-hidden text-center flex-wrap absolute w-full h-full left-0 top-0 `}>
            {(title || time) && (
              <div className="w-full h-full bg-white opacity-80 flex items-center">
                <div className="w-full">
                  {title && (
                    <p className="text-xl sm:text-2xl font-bold truncate px-5">
                      {title}
                    </p>
                  )}
                  {(title || time) && (
                    <div className="flex items-center justify-center px-6 sm:px-10">
                      <div
                        className={`border-t-[1px] border-black  w-[45%]`}></div>
                      <span className="text-xl mx-2">&Omicron;</span>
                      <div
                        className={`border-t-[1px] border-black w-[45%]`}></div>
                    </div>
                  )}
                  {time && (
                    <>
                      <CountdownTimer
                        variant={"simple"}
                        date={time ? time : ""}
                      />
                    </>
                  )}
                  {startTime && endTime && (
                    <div className="ok">
                      {moment(endTime).isAfter(moment()) ? (
                        moment(startTime).isAfter(moment()) ? (
                          <div className="flex flex-col justify-center items-center">
                            <p className="text-sm  text-gray-700 font-medium">
                              Starts In
                            </p>
                            {startTime && (
                              <CountdownTimer
                                variant={"simple"}
                                date={startTime}
                                className="font-semibold  "
                              />
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col justify-center items-center">
                            {endTime && (
                              <CountdownTimer
                                variant={"simple"}
                                date={endTime}
                                className="font-semibold "
                              />
                            )}
                            <p className="text-sm  text-gray-700 font-medium">
                              Left
                            </p>
                          </div>
                        )
                      ) : (
                        <div className="flex justify-center items-center">
                          <span className="text-black text-xl font-semibold">
                            Sale Ended
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {type === "presaleBox" && (
        <div
          className={`${borderRadius} px-10 border mt-16 border-[#E8E8E8] h-[200px] items-center w-full flex flex-wrap justify-center`}>
          {/* <div className="px-4 py-1 bg-[#fff3e4] text-[#ff8a01] rounded-old-[16px] text-sm font-normal flex items-center">
          <span className="w-1 h-1 bg-[#ff8a01] flex rounded-old-full mr-1.5"></span>{" "}
          Promoted
        </div> */}
          <h3 className="w-full font-semibold text-center mt-5 truncate">
            {title ? title : "Airdrop Title"}
          </h3>
          <div className="flex items-center justify-center relative w-full">
            <div className={`w-[50%] pr-6`}>
              <div className="border-b border-[#000] w-full"></div>
            </div>
            <div className="rounded-old-full w-[22px] h-[22px] border border-[#000] mx-2.5 flex items-center justify-center absolute left-50">
              <img src={parachuteIcon.src} alt="" />
            </div>
            <div className={`w-[50%] pl-6`}>
              <div className="border-b border-[#000] w-full"></div>
            </div>
          </div>
          <p>presale Start in</p>
          <h3 className="w-full font-fonde font-thin text-center mt-[-20px] mb-[15px]">
            {time ? (
              <CountdownTimer
                className={`font-fonde font-thin w-full ${textClass} justify-center`}
                variant={"inBox"}
                date={time}
              />
            ) : (
              "50:20:10:50"
            )}
          </h3>
        </div>
      )}
      {type === "presale" && (
        <div
          className={`${borderRadius} ${marginSpace} ${containerHeight} ${containerWidth} relative overflow-hidden`}>
          <img
            className={`${containerHeight} ${containerWidth} w-full object-cover`}
            src={src}
            alt=""
          />
          <div className="flex border border-[#DFDADA] bg-white content-center overflow-hidden text-center flex-wrap absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-100 duration-500">
            <div className="w-full justify-center flex">
              <div className="px-4 py-1 bg-[#fff3e4] text-[#ff8a01] rounded-old-[16px] text-sm font-normal flex items-center">
                <span className="w-1 h-1 bg-[#ff8a01] flex rounded-old-full mr-1.5"></span>{" "}
                Promoted
              </div>
            </div>
            <div
              className={`${
                sectionPage === "homePage" ? "pt-3 pb-1" : "py-8"
              } w-full flex justify-center  text-sm font-normal px-5`}>
              <div className="w-[45%]">
                <p className="border-b border-[#161616] pb-1.5 mb-1.5">
                  Omniverse
                </p>
                <p>12:06:01:49</p>
              </div>
              <div className="border border-[#161616] mx-2.5 w-4 h-4 mt-5 rounded-old-full"></div>
              <div className="w-[45%]">
                <p className="border-b border-[#161616] pb-1.5 mb-1.5">
                  liquidity 100%
                </p>
                <p>lockup time365 days</p>
              </div>
            </div>
            <div
              className={`${
                sectionPage === "homePage" ? "text-xs" : "text-base"
              } w-full uppercase`}>
              {detailsLink ? (
                <Link href={`/${detailsLink}`} passHref>
                  <a href="" className="border-b border-[#161616] text-[##555]">
                    Know More
                  </a>
                </Link>
              ) : (
                <a href="" className="border-b border-[#161616] text-[##555]">
                  Know More
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {type === "HomeBanner" && (
        <div
          style={{ backgroundImage: `url(${src})` }}
          className={` bg-no-repeat bg-cover bg-center ${classTag} relative`}>
          {/* <img className={`${classTag} hover:opacity-5`} src={src} alt="" /> */}
          <Circle
            percent={percentage}
            strokeWidth={2}
            strokeColor={getRingColor(tagName).strokeColor}
            trailWidth={2}
            trailColor={getRingColor(tagName).trailColor}
            className="absolute h-full w-full"
          />

          <div
            className={`${borderRadius} flex px-3 border border-[#DFDADA] bg-white content-center  text-center flex-wrap absolute w-full h-full left-0 top-0 opacity-0 hover:opacity-90 cursor-pointer`}>
            {detailsLink ? (
              !outerlink ? (
                <Link href={`/${detailsLink}`} passHref>
                  <div className="w-full h-full  py-4 px-2 flex justify-center content-center items-center flex-wrap text-center text-sm font-normal">
                    <div className={`${tagClass} w-full justify-center flex`}>
                      {tagName?.toLowerCase() === "sponsored" && (
                        <div className="px-2.5 py-1 bg-[#FFD68A] text-[#FFA500] rounded-old-[16px] text-sm capitalize font-semibold flex items-center">
                          <span className="w-2 h-2 bg-[#FFA500] flex rounded-old-full mr-1.5"></span>{" "}
                          {tagName}
                        </div>
                      )}
                      {tagName?.toLowerCase() === "upcoming" && (
                        <div className="px-2.5 py-1 bg-[#A0BBFF] text-[#4475F2] rounded-old-[16px] text-sm capitalize font-semibold flex items-center">
                          <span className="w-2 h-2 bg-[#4475F2] flex rounded-old-full mr-1.5"></span>{" "}
                          {tagName}
                        </div>
                      )}
                      {tagName?.toLowerCase() === "sale live" && (
                        <div className="px-2.5 py-1 bg-[#9FF298] text-[#28B81B] rounded-old-[16px] text-sm capitalize font-semibold flex items-center">
                          <span className="w-2 h-2 bg-[#28B81B] flex rounded-old-full mr-1.5"></span>{" "}
                          {tagName}
                        </div>
                      )}
                      {tagName?.toLowerCase() === "airdrop live" && (
                        <div className="px-2.5 py-1 bg-[#9FF298] text-[#28B81B] rounded-old-[16px] text-sm capitalize font-semibold flex items-center">
                          <span className="w-2 h-2 bg-[#28B81B] flex rounded-old-full mr-1.5"></span>{" "}
                          {tagName}
                        </div>
                      )}
                      {tagName?.toLowerCase() === "sale ended" && (
                        <div className="px-2.5 py-1 bg-[#FD3D39]/20 text-[#FD3D39] rounded-old-[16px] text-sm font-semibold capitalize  flex items-center">
                          <span className="w-2 h-2 bg-[#FD3D39] flex rounded-old-full mr-1.5"></span>{" "}
                          {tagName}
                        </div>
                      )}
                      {/* {tagName?.toLowerCase() === "ads" && (
                      <div className="px-4 py-1 bg-[#E4C2FF] text-[#930BFF] rounded-old-[16px] text-sm font-normal flex items-center">
                        <span className="w-2 h-2 bg-[#930BFF] flex rounded-old-full mr-1.5"></span>{" "}
                        {tagName}
                      </div>
                    )} */}
                    </div>
                    <p
                      className={`font-fonde font-bold w-full ${textClass} truncate`}>
                      {tokenName}
                    </p>
                    <div className="flex items-center justify-center px-2 w-full">
                      <div className={`border-b border-[#000] w-[45%]`}></div>
                      <div className="rounded-old-full w-[14px] shrink-0 h-[14px] border border-[#000] mx-3"></div>
                      <div className={`border-b border-[#000] w-[45%]`}></div>
                    </div>
                    {saleType == "Airdrop" ? (
                      tagName === "airdrop live" ? (
                        <p className="font-fonde w-full font-medium text-lg mt-1">
                          {"Airdrop Live"}
                        </p>
                      ) : (
                        <>
                          {time && (
                            <CountdownTimer
                              className={`font-fonde font-thin w-full ${textClass} justify-center`}
                              variant={"inBox"}
                              date={time}
                              isTimeUnix
                            />
                          )}
                        </>
                      )
                    ) : tagName === "sale ended" ? (
                      <>
                        <p className="font-fonde w-full font-medium text-lg mt-1">
                          {"Sale Ended"}
                        </p>
                        {hardCap !== undefined ? (
                          <div className="leading-none mt-1">
                            <p className="text-center mb-0 text-base font-bold flex justify-center">
                              {hardCap}
                            </p>
                            <p className="text-center text-[14px] font-normal flex justify-center">
                              Hardcap
                            </p>
                          </div>
                        ) : (
                          <></>
                        )}
                      </>
                    ) : (
                      <>
                        {time && (
                          <CountdownTimer
                            className={`font-fonde font-thin w-full ${textClass} justify-center`}
                            variant={"inBox"}
                            date={time}
                            isTimeUnix
                          />
                        )}
                        {hardCap !== undefined ? (
                          <div className="leading-none mt-1">
                            <p className="text-center mb-0 text-base font-bold flex justify-center">
                              {hardCap}
                            </p>
                            <p className="text-center text-[14px] font-normal flex justify-center">
                              Hardcap
                            </p>
                          </div>
                        ) : (
                          <></>
                        )}
                      </>
                    )}
                  </div>
                </Link>
              ) : (
                <Link href={detailsLink} passHref>
                  <a className="h-full w-full" target="_blank">
                    <div className="w-full h-full  py-4 px-2 flex justify-center content-center flex-wrap text-center text-sm font-normal">
                      <div className={`${tagClass} w-full justify-center flex`}>
                        {tagName?.toLowerCase() === "promoted" && (
                          <div className="px-2.5 py-1 bg-[#d5f1ff] text-[#91cae7] rounded-old-[16px] text-sm capitalize font-semibold flex items-center">
                            <span className="w-2 h-2 bg-[#91cae7] flex rounded-old-full mr-1.5"></span>{" "}
                            {tagName}
                          </div>
                        )}
                        {tagName?.toLowerCase() === "upcoming" && (
                          <div className="px-2.5 py-1 bg-[#A0BBFF] text-[#4475F2] rounded-old-[16px] text-sm capitalize font-semibold flex items-center">
                            <span className="w-2 h-2 bg-[#4475F2] flex rounded-old-full mr-1.5"></span>{" "}
                            {tagName}
                          </div>
                        )}
                        {tagName?.toLowerCase() === "sale live" && (
                          <div className="px-2.5 py-1 bg-[#9FF298] text-[#28B81B] rounded-old-[16px] text-sm capitalize font-semibold flex items-center">
                            <span className="w-2 h-2 bg-[#28B81B] flex rounded-old-full mr-1.5"></span>{" "}
                            {tagName}
                          </div>
                        )}
                        {tagName?.toLowerCase() === "airdrop live" && (
                          <div className="px-2.5 py-1 bg-[#9FF298] text-[#28B81B] rounded-old-[16px] text-sm capitalize font-semibold flex items-center">
                            <span className="w-2 h-2 bg-[#28B81B] flex rounded-old-full mr-1.5"></span>{" "}
                            {tagName}
                          </div>
                        )}
                        {tagName?.toLowerCase() === "sale ended" && (
                          <div className="px-2.5 py-1 bg-[#FD3D39]/20 text-[#FD3D39] rounded-old-[16px] text-sm capitalize font-semibold flex items-center">
                            <span className="w-2 h-2 bg-[#FD3D39] flex rounded-old-full mr-1.5"></span>{" "}
                            {tagName}
                          </div>
                        )}
                        {/* {tagName?.toLowerCase() === "ads" && (
                      <div className="px-4 py-1 bg-[#E4C2FF] text-[#930BFF] rounded-old-[16px] text-sm font-normal flex items-center">
                        <span className="w-2 h-2 bg-[#930BFF] flex rounded-old-full mr-1.5"></span>{" "}
                        {tagName}
                      </div>
                    )} */}
                      </div>
                      <p
                        className={`font-fonde font-bold w-full ${textClass} truncate`}>
                        {tokenName}
                      </p>
                      <div className="flex items-center justify-center px-2 w-full">
                        <div className={`border-b border-[#000] w-[45%]`}></div>
                        <div className="rounded-old-full w-[14px] shrink-0 h-[14px] border border-[#000] mx-3"></div>
                        <div className={`border-b border-[#000] w-[45%]`}></div>
                      </div>
                      {saleType == "Airdrop" ? (
                        tagName === "airdrop live" ? (
                          <p className="font-fonde w-full font-medium text-lg mt-1">
                            {"Airdrop Live"}
                          </p>
                        ) : (
                          <>
                            {time && (
                              <CountdownTimer
                                className={`font-fonde font-thin w-full ${textClass} justify-center`}
                                variant={"inBox"}
                                date={time}
                                isTimeUnix
                              />
                            )}
                          </>
                        )
                      ) : tagName === "sale ended" ? (
                        <p className="font-fonde w-full font-medium text-lg mt-1">
                          {"Sale Ended"}
                        </p>
                      ) : (
                        <>
                          {time && (
                            <CountdownTimer
                              className={`font-fonde font-thin w-full ${textClass} justify-center`}
                              variant={"inBox"}
                              date={time}
                              isTimeUnix
                            />
                          )}
                        </>
                      )}
                      {description ? (
                        <div className="w-full">
                          <p
                            id={tokenName?.replaceAll(" ", "-")}
                            className={`font-fonde  font-semibold line-clamp w-full mt-2 px-2`}>
                            {description}
                          </p>
                          <ReactTooltip
                            className="w-full"
                            anchorId={tokenName?.replaceAll(" ", "-")}
                            content={description}
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </a>
                </Link>
              )
            ) : (
              <div className="w-full h-full  py-8 flex content-center flex-wrap text-center text-sm font-normal">
                <div className={`${tagClass} w-full justify-center flex`}>
                  {tagName?.toLowerCase() === "promoted" && (
                    <div className="px-2.5 py-1 bg-[#FFD68A] text-[#FFA500] rounded-old-[16px] text-base capitalize font-medium flex items-center">
                      <span className="w-2 h-2 bg-[#FFA500] flex rounded-old-full mr-1.5"></span>{" "}
                      {tagName}
                    </div>
                  )}
                  {tagName?.toLowerCase() === "upcoming" && (
                    <div className="px-2.5 py-1 bg-[#A0BBFF] text-[#4475F2] rounded-old-[16px] text-base capitalize font-medium flex items-center">
                      <span className="w-2 h-2 bg-[#4475F2] flex rounded-old-full mr-1.5"></span>{" "}
                      {tagName}
                    </div>
                  )}
                  {tagName?.toLowerCase() === "sale live" && (
                    <div className="px-2.5 py-1 bg-[#9FF298] text-[#28B81B] rounded-old-[16px] text-base capitalize font-medium flex items-center">
                      <span className="w-2 h-2 bg-[#28B81B] flex rounded-old-full mr-1.5"></span>{" "}
                      {tagName}
                    </div>
                  )}
                  {tagName?.toLowerCase() === "airdrop live" && (
                    <div className="px-2.5 py-1 bg-[#9FF298] text-[#28B81B] rounded-old-[16px] text-base capitalize font-medium flex items-center">
                      <span className="w-2 h-2 bg-[#28B81B] flex rounded-old-full mr-1.5"></span>{" "}
                      {tagName}
                    </div>
                  )}
                  {tagName?.toLowerCase() === "sale ended" && (
                    <div className="px-2.5 py-1 bg-[#FD3D39]/20 text-[#FD3D39] rounded-old-[16px] text-base capitalize font-medium flex items-center">
                      <span className="w-2 h-2 bg-[#FD3D39] flex rounded-old-full mr-1.5"></span>{" "}
                      {tagName}
                    </div>
                  )}
                  {/* {tagName?.toLowerCase() === "ads" && (
                <div className="px-4 py-1 bg-[#E4C2FF] text-[#930BFF] rounded-old-[16px] text-sm font-normal flex items-center">
                  <span className="w-2 h-2 bg-[#930BFF] flex rounded-old-full mr-1.5"></span>{" "}
                  {tagName}
                </div>
              )} */}
                </div>
                <p
                  className={`font-fonde font-thin w-full ${textClass} truncate`}>
                  {tokenName}
                </p>
                <div className="flex items-center justify-center px-6 w-full">
                  <div className={`border-b border-[#000] w-[45%]`}></div>
                  <div className="rounded-old-full w-[20px] shrink-0 h-[20px] border border-[#000] mx-3"></div>
                  <div className={`border-b border-[#000] w-[45%]`}></div>
                </div>
                {saleType == "Airdrop" ? (
                  tagName === "airdrop live" ? (
                    <p className="font-fonde w-full font-medium text-lg mt-1">
                      {"Airdrop Live"}
                    </p>
                  ) : (
                    <>
                      {time && (
                        <CountdownTimer
                          className={`font-fonde font-thin w-full ${textClass} justify-center`}
                          variant={"inBox"}
                          date={time}
                          isTimeUnix
                        />
                      )}
                    </>
                  )
                ) : tagName === "sale ended" ? (
                  <p className="font-fonde w-full font-medium text-lg mt-1">
                    {"Sale Ended"}
                  </p>
                ) : (
                  <>
                    {time && (
                      <CountdownTimer
                        className={`font-fonde font-thin w-full ${textClass} justify-center`}
                        variant={"inBox"}
                        date={time}
                        isTimeUnix
                      />
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default HoverImage;
