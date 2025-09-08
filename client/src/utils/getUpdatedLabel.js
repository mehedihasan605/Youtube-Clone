import { differenceInCalendarDays, formatDistanceToNow } from "date-fns";

export const getUpdatedLabel = (date) => {
  const updatedDate = new Date(date);
  const diff = differenceInCalendarDays(new Date(), updatedDate);

  if (diff === 0) return "Updated today";
  if (diff === 1) return "Updated yesterday";
  return `Updated ${formatDistanceToNow(updatedDate, {
    addSuffix: false,
  })} ago`;
};
