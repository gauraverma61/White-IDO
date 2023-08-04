export const getCountDownTime = ({
  dataWithTime,
  isTimeUnix = false,
}: {
  dataWithTime: string;
  isTimeUnix?: boolean;
}) => {
  const startDate = new Date();
  const milliseconds = Number(dataWithTime) * 1000;
  let endDate = new Date();
  if (isTimeUnix) {
    endDate = new Date(milliseconds);
  } else {
    endDate = new Date(dataWithTime);
  }

  const timeRemaining = endDate.getTime() - startDate.getTime();

  if (timeRemaining > 0) {
    const start_date = new Date(startDate);
    const end_date = new Date(endDate);
    const start_millis = start_date.getTime(); // Get timestamp of start date
    const end_millis = end_date.getTime(); // Get timestamp of end date

    // Convert to seconds, 1 second = 1000 milli seconds
    const old_sec = start_millis / 1000;
    const current_sec = end_millis / 1000;

    // Get remaining seconds
    let seconds = current_sec - old_sec;

    let days = Math.floor(seconds / (24 * 60 * 60)); // 1 day is equal to 24 hours, each hour has 60 mins and each minute has 60 seconds
    seconds -= days * 24 * 60 * 60; // Get remaining seconds

    let hours = Math.floor(seconds / (60 * 60)); // 1 hour has 60 mins and each minute has 60 seconds
    seconds -= hours * 60 * 60; // Get remaining seconds

    let minutes = Math.floor(seconds / 60); // 1 minute is equal to 60 seconds
    seconds -= minutes * 60; // Get remaining seconds

    days = Math.abs(days);
    hours = Math.abs(hours);
    minutes = Math.abs(minutes);
    seconds = Math.floor(Math.abs(seconds));

    return {
      days,
      hours,
      minutes,
      seconds,
    };
  } else {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }
};
