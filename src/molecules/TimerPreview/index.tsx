import { CountdownTimer } from "@atoms/CountdownTimer";
import moment from "moment";
import React from "react";

const TimerPreview = ({
  startTime,
  endTime,
  tier1StartTime,
  tier1EndTime,
  tier2StartTime,
  tier2EndTime,
}: {
  startTime: string;
  endTime: string;
  tier1StartTime?: string;
  tier1EndTime?: string;
  tier2StartTime?: string;
  tier2EndTime?: string;
}) => {
  return (
    <div className="text-white flex md:flex-row gap-4 flex-col">
      {moment(tier1EndTime).isAfter(moment()) &&
        (moment(tier1StartTime).isAfter(moment()) ? (
          <div className="flex flex-col justify-center">
            <p className="text-base font-normal">Tier 1 Starts In</p>
            {tier1StartTime && (
              <CountdownTimer
                variant={"inBox"}
                date={tier1StartTime}
                className="font-semibold text-3xl sm:text-4xl"
              />
            )}
          </div>
        ) : (
          <div className="flex flex-col justify-center ">
            <p className="text-base font-normal">Tier 2 Ends In</p>
            {tier1EndTime && (
              <CountdownTimer
                variant={"inBox"}
                date={tier1EndTime}
                className="font-semibold text-3xl sm:text-4xl"
              />
            )}
          </div>
        ))}
      {moment(tier2EndTime).isAfter(moment()) &&
        (moment(tier2StartTime).isAfter(moment()) ? (
          <div className="flex flex-col justify-center">
            <p className="text-base font-normal">Tier 2 Starts In</p>
            {tier2StartTime && (
              <CountdownTimer
                variant={"inBox"}
                date={tier2StartTime}
                className="font-semibold text-3xl sm:text-4xl"
              />
            )}
          </div>
        ) : (
          <div className="flex flex-col justify-center ">
            <p className="text-base font-normal">Tier 2 Ends In</p>
            {tier2EndTime && (
              <CountdownTimer
                variant={"inBox"}
                date={tier2EndTime}
                className="font-semibold text-3xl sm:text-4xl"
              />
            )}
          </div>
        ))}
      {moment(endTime).isAfter(moment()) ? (
        moment(startTime).isAfter(moment()) ? (
          <div className="flex flex-col justify-center">
            <p className="text-base font-normal">Starts In</p>
            {startTime && (
              <CountdownTimer
                variant={"inBox"}
                date={startTime}
                className="font-semibold text-3xl sm:text-4xl"
              />
            )}
          </div>
        ) : (
          <div className="flex flex-col justify-center ">
            <p className="text-base font-normal">Ends In</p>
            {endTime && (
              <CountdownTimer
                variant={"inBox"}
                date={endTime}
                className="font-semibold text-3xl sm:text-4xl"
              />
            )}
          </div>
        )
      ) : (
        <div className="flex items-center">
          <span className="text-3xl font-semibold">0:0:0:0</span>
        </div>
      )}
    </div>
  );
};

export default TimerPreview;
