import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

export const durationFormat = (seconds) => {
  const dur = dayjs.duration(seconds, "seconds");

  const hrs = dur.hours();
  const mins = dur.minutes();
  const secs = dur.seconds();

  return hrs > 0
    ? `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
    : `${mins}:${String(secs).padStart(2, "0")}`;
};
