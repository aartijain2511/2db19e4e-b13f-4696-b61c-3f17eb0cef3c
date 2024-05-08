import { Value, ValuePiece } from "../types";

const getDaysDifference = (dateRange: Value): number => {
  if (Array.isArray(dateRange)) {
    if (dateRange[0] !== null && dateRange[1] !== null) {
      const differenceInMilliseconds = Math.abs(
        dateRange[1].getTime() - dateRange[0].getTime(),
      );
      const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
      return Math.floor(differenceInDays);
    }
    return 0;
  }
  return 0;
};

export default getDaysDifference;
