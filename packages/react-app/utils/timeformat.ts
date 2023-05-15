import { format, formatDistance } from "date-fns";

export const timeFormat = (timestamp: number) => {
  const formattedDate = format(timestamp * 1000, "PPpp");
  return formattedDate;
};

export const timeDistanceFormat = (timestamp: number) => {
  const formattedDate = formatDistance(timestamp * 1000, new Date(), {
    addSuffix: true,
  });
  return formattedDate;
};
