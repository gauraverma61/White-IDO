import moment from "moment";

export type IStatus =
  | "upcoming"
  | "sale live"
  | "airdrop live"
  | "sale ended"
  | "sponsored"
  | "promoted"
  | string
  | undefined;

export const getPercentage = (
  startTime: number,
  endTime: number,
  status: IStatus
) => {
  let currTime = moment().unix(); //unixTimestamp in seconds;
  let oneDay = 86400; //one day in seconds
  if (status === "airdrop live") {
    return 100;
  }
  if (status === "promoted") {
    return 100;
  }

  // count down (percent decrease)
  if (status === "upcoming") {
    if (startTime - currTime < oneDay) {
      return ((startTime - currTime) / oneDay) * 100;
    } else {
      return 100;
    }
  }

  // count Up (percent increase)
  if (status === "sale live" || status === "sale ended") {
    if (currTime < endTime) {
      return ((currTime - startTime) / (endTime - startTime)) * 100;
    } else {
      return 100;
    }
  }
};

export const getRingColor = (
  status: IStatus
): { trailColor: string; strokeColor: string } => {
  if (status === "upcoming") {
    return {
      trailColor: "#A0BBFF",
      strokeColor: "#4475F2",
    };
  } else if (status === "sale live" || status === "airdrop live") {
    return {
      trailColor: "#9FF298",
      strokeColor: "#28B81B",
    };
  } else if (status === "sale ended") {
    return {
      trailColor: "#FB7979",
      strokeColor: "#FD3D39",
    };
  } else if (status === "promoted") {
    return {
      trailColor: "#d5f1ff",
      strokeColor: "#91cae7",
    };
  } else {
    return {
      trailColor: "#F5B8EC",
      strokeColor: "#F33DD6",
    };
  }
};
