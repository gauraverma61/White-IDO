import React, { useEffect, useState } from "react";
import { ICountdownTimer } from "./CountdownTimer";
import { getCountDownTime } from "@helpers/getCountDownTime";
import { zeroPad } from "@helpers/formatNum";

export const CountdownTimer: React.FC<ICountdownTimer.IProps> = (
  props: ICountdownTimer.IProps
) => {
  const { date, isTimeUnix, className, variant, callback } = props;

  const [callbackCalled, setCallbackCalled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(
    getCountDownTime({ dataWithTime: date, isTimeUnix })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const time = getCountDownTime({ dataWithTime: date, isTimeUnix });
      setTimeLeft(time);
      if (
        time.seconds <= 0 &&
        time.days <= 0 &&
        time.minutes <= 0 &&
        time.hours <= 0 &&
        !callbackCalled &&
        callback
      ) {
        callback();
        setCallbackCalled(true);
      }
    }, 1000);
    return () => clearInterval(timer);
  });

  switch (variant) {
    case "simple":
      return (
        <div
          className={`flex justify-center items-center text-primary-green  text-xl font-medium ${className}`}>
          {timeLeft?.days >= 2 ? (
            <p>{`${timeLeft.days} days`}</p>
          ) : timeLeft?.days < 1 ? (
            <>
              <div className=" text-center">{zeroPad(timeLeft.hours)}</div>{" "}
              <div className="mx-1">:</div>
              <div className=" text-center">{zeroPad(timeLeft.minutes)}</div>
              <div className="mx-1">:</div>
              <div className=" text-center">{zeroPad(timeLeft.seconds)}</div>
            </>
          ) : (
            <>
              <div className=" text-center">{zeroPad(timeLeft.days)}</div>
              <div className="mx-1">:</div>
              <div className=" text-center">{zeroPad(timeLeft.hours)}</div>{" "}
              <div className="mx-1">:</div>
              <div className=" text-center">{zeroPad(timeLeft.minutes)}</div>
            </>
          )}
        </div>
      );
    case "inBox":
      return (
        <div className={`flex items-center ${className}`}>
          {timeLeft?.days >= 2 ? (
            <p>{`${timeLeft.days} days left`}</p>
          ) : timeLeft?.days < 1 ? (
            <>
              <div className=" text-center">{zeroPad(timeLeft.hours)}</div>{" "}
              <div className="mx-1">:</div>
              <div className=" text-center">
                {zeroPad(timeLeft.minutes)}
              </div>{" "}
              <div className="mx-1">:</div>
              <div className=" text-center">{zeroPad(timeLeft.seconds)}</div>
            </>
          ) : (
            <>
              <div className=" text-center">{zeroPad(timeLeft.days)}</div>
              <div className="mx-1">:</div>
              <div className=" text-center">{zeroPad(timeLeft.hours)}</div>{" "}
              <div className="mx-1">:</div>
              <div className=" text-center">{zeroPad(timeLeft.minutes)}</div>
            </>
          )}
        </div>
      );
    case "details":
      return (
        <div
          className={`flex justify-between md:gap-2 capitalize  items-center ${className}`}>
          {timeLeft?.days > 0 && (
            <div>
              <div className="text-center">{zeroPad(timeLeft.days)}</div>
              <div className="font-medium text-sm">{"days"}</div>
            </div>
          )}

          <div>
            <div className=" text-center">{zeroPad(timeLeft.hours)}</div>{" "}
            <div className="font-medium text-sm">{"hours"}</div>
          </div>
          <div>
            <div className=" text-center">{zeroPad(timeLeft.minutes)}</div>{" "}
            <div className="font-medium text-sm">{"minutes"}</div>
          </div>
          <div>
            <div className=" text-center">{zeroPad(timeLeft.seconds)}</div>
            <div className="font-medium text-sm">{"second"}</div>
          </div>
        </div>
      );

    case "unlock":
      return (
        <div className="flex items-end min-w-max ">
          {timeLeft?.days >= 2 ? (
            <p className="text-white">{`${timeLeft.days} days left`}</p>
          ) : timeLeft?.days < 1 ? (
            <>
              <div className="text-white">
                {" "}
                <span className="text-4xl md:text-3xl text-primary-green">
                  {zeroPad(timeLeft.hours)}
                </span>{" "}
                <span className="font-normal text-2xl md:text-2xl ">h</span>
              </div>
              <div className="text-3xl md:text-3xl text-primary-green mx-2.5 md:mx-5">
                :
              </div>
              <div className="text-white ">
                {" "}
                <span className="text-2xl md:text-3xl text-primary-green">
                  {zeroPad(timeLeft.minutes)}
                </span>{" "}
                <span className="font-normal text-2xl md:text-2xl">m</span>
              </div>
              <div className="text-3xl md:text-3xl text-primary-green mx-2.5 md:mx-5">
                :
              </div>
              <div className="text-white">
                {" "}
                <span className="text-2xl md:text-3xl text-primary-green">
                  {zeroPad(timeLeft.seconds)}
                </span>{" "}
                <span className="font-normal text-2xl md:text-2xl">s</span>
              </div>
            </>
          ) : (
            <>
              <div className="text-white">
                {" "}
                <span className="text-2xl md:text-3xl text-primary-green">
                  {zeroPad(timeLeft.days)}
                </span>{" "}
                <span className="font-normal text-2xl md:text-2xl ">d</span>
              </div>
              <div className="text-3xl md:text-3xl text-primary-green mx-2.5 md:mx-5">
                :
              </div>
              <div className="text-white ">
                {" "}
                <span className="text-2xl md:text-3xl text-primary-green">
                  {zeroPad(timeLeft.hours)}
                </span>{" "}
                <span className="font-normal text-2xl md:text-2xl">h</span>
              </div>
              <div className="text-3xl md:text-3xl text-primary-green mx-2.5 md:mx-5">
                :
              </div>
              <div className="text-white">
                {" "}
                <span className="text-2xl md:text-3xl text-primary-green">
                  {zeroPad(timeLeft.minutes)}
                </span>{" "}
                <span className="font-normal text-2xl md:text-2xl">m</span>
              </div>
            </>
          )}
        </div>
      );

    case "new-box":
      return (
        <div className={`flex gap-4 justify-center items-center ${className}`}>
          {timeLeft.days >= 2 ? (
            <div className="p-3 py-2  ">
              <p>{`${timeLeft.days} days`}</p>
            </div>
          ) : timeLeft?.days < 1 ? (
            <div className="flex items-end gap-1 sm:gap-4">
              <div className="p-1 sm:p-3 flex items-end py-2 pr-0 ">
                <div className="font-medium text-3xl sm:text-4xl md:text-5xl text-tertiary-green">
                  {zeroPad(timeLeft.hours)}
                </div>
                <div className="font-normal text-2xl truncate pl-1  sm:pl-2">
                  {"h"}
                </div>
                <div className="pl-1 sm:pl-3 text-4xl  sm:text-6xl text-quinary-green">
                  :
                </div>
              </div>
              <div className="p-1 sm:p-3 flex items-end pr-0 py-2 ">
                <div className="font-medium text-3xl sm:text-4xl md:text-5xl text-tertiary-green">
                  {zeroPad(timeLeft.minutes)}
                </div>
                <div className="font-normal text-2xl truncate  pl-1 sm:pl-2">
                  {"m"}
                </div>
                <div className="pl-1 sm:pl-3 text-4xl  sm:text-6xl text-quinary-green">
                  :
                </div>
              </div>
              <div className="p-1 sm:p-3 flex items-end pr-0 py-2 ">
                <div className="font-medium text-3xl sm:text-4xl md:text-5xl text-tertiary-green">
                  {zeroPad(timeLeft.seconds)}
                </div>
                <div className="font-normal text-2xl truncate  pl-1 sm:pl-2">
                  {"s"}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-end gap-2 sm:gap-4">
              <div className="p-1 sm:p-3 flex items-end py-2 pr-0 ">
                <div className="font-medium text-3xl sm:text-4xl md:text-5xl text-tertiary-green">
                  {zeroPad(timeLeft.days)}
                </div>
                <div className="font-normal text-2xl truncate pl-1  sm:pl-2">
                  {"d"}
                </div>
                <div className="pl-1 sm:pl-3 text-4xl  sm:text-6xl text-quinary-green">
                  :
                </div>
              </div>
              <div className="p-1 sm:p-3 flex items-end pr-0 py-2 ">
                <div className="font-medium text-3xl sm:text-4xl md:text-5xl text-tertiary-green">
                  {zeroPad(timeLeft.hours)}
                </div>
                <div className="font-normal text-2xl truncate  pl-1 sm:pl-2">
                  {"h"}
                </div>
                <div className="pl-1 sm:pl-3 text-4xl  sm:text-6xl text-quinary-green">
                  :
                </div>
              </div>
              <div className="p-1 sm:p-3 flex items-end pr-0 py-2 ">
                <div className="font-medium text-3xl sm:text-4xl md:text-5xl text-tertiary-green">
                  {zeroPad(timeLeft.minutes)}
                </div>
                <div className="font-normal text-2xl truncate  pl-1 sm:pl-2">
                  {"m"}
                </div>
              </div>
            </div>
          )}
        </div>
      );
    default:
      return (
        <div
          className={`flex md:gap-10 lg:gap-16 justify-between lg:justify-center items-center ${className}`}>
          {timeLeft.days >= 2 ? (
            <div className="p-3 py-2   bg-timer-bg ">
              <p>{`${zeroPad(timeLeft.days)} days left`}</p>
            </div>
          ) : timeLeft?.days < 1 ? (
            <>
              <div className="text-3xl font-bold text-center py-5 px-10  bg-[#C6CED6] md:w-[140px]">
                <div>
                  {zeroPad(timeLeft.hours)}
                  <div className="text-base font-normal">hours</div>
                </div>
              </div>
              <div className="text-3xl font-bold text-center py-5 px-10  bg-[#C6CED6] md:w-[140px]">
                <div>
                  {zeroPad(timeLeft.minutes)}
                  <div className="text-base font-normal">minutes</div>
                </div>
              </div>
              <div className="text-3xl font-bold text-center py-5 px-10  bg-[#C6CED6] md:w-[140px]">
                <div>
                  {zeroPad(timeLeft.seconds)}
                  <div className="text-base font-normal">seconds</div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-3xl font-bold text-center py-5 px-10  bg-[#C6CED6]  md:w-[140px]">
                {zeroPad(timeLeft.days)}{" "}
                <div className="text-base font-normal">days</div>
              </div>

              <div className="text-3xl font-bold text-center py-5 px-10  bg-[#C6CED6] md:w-[140px]">
                <div>
                  {zeroPad(timeLeft.hours)}
                  <div className="text-base font-normal">hours</div>
                </div>
              </div>
              <div className="text-3xl font-bold text-center py-5 px-10  bg-[#C6CED6] md:w-[140px]">
                <div>
                  {zeroPad(timeLeft.minutes)}
                  <div className="text-base font-normal">minutes</div>
                </div>
              </div>
            </>
          )}
        </div>
      );
  }
};
