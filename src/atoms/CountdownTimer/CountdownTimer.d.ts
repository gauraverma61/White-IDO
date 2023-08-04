export module ICountdownTimer {
  export interface IProps {
    date: string;
    isTimeUnix?: boolean;
    className?: string;
    variant?: any;
    callback?: Function;
  }
}
