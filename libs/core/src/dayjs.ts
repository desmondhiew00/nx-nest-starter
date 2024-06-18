import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

export const initDayjs = () => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
};

export default initDayjs;
