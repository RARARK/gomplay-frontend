export const MINUTE_OPTIONS = [0, 10, 20, 30, 40, 50] as const;
export const HOUR_OPTIONS = Array.from({ length: 24 }, (_, index) => index);

export const getRoundedFutureDate = (hoursFromNow: number) => {
  const next = new Date();
  next.setMinutes(0, 0, 0);
  next.setHours(next.getHours() + hoursFromNow);
  return next;
};

export const formatCreatePostDayLabel = (value: Date) => {
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const date = `${value.getDate()}`.padStart(2, "0");

  return `${month}-${date}`;
};

export const formatCreatePostTimeLabel = (value: Date) => {
  const hours = `${value.getHours()}`.padStart(2, "0");
  const minutes = `${value.getMinutes()}`.padStart(2, "0");

  return `${hours}:${minutes}`;
};

export const formatCreatePostTimeRangeLabel = (
  startAt: Date,
  endAt: Date,
) => {
  return `${formatCreatePostTimeLabel(startAt)} - ${formatCreatePostTimeLabel(endAt)}`;
};

export const applyDateStringToRange = (
  currentStartAt: Date,
  currentEndAt: Date,
  dateString: string,
) => {
  const [year, month, date] = dateString.split("-").map(Number);
  const nextStartAt = new Date(currentStartAt);
  const nextEndAt = new Date(currentEndAt);

  nextStartAt.setFullYear(year, month - 1, date);
  nextEndAt.setFullYear(year, month - 1, date);

  return {
    nextStartAt,
    nextEndAt,
  };
};

export const applyTimePartsToRange = (
  currentStartAt: Date,
  currentEndAt: Date,
  startHour: number,
  startMinute: number,
  endHour: number,
  endMinute: number,
) => {
  const nextStartAt = new Date(currentStartAt);
  const nextEndAt = new Date(currentEndAt);

  nextStartAt.setHours(startHour, startMinute, 0, 0);
  nextEndAt.setHours(endHour, endMinute, 0, 0);

  return {
    nextStartAt,
    nextEndAt,
  };
};

export const getNextValue = <T,>(options: readonly T[], currentValue: T) => {
  const currentIndex = options.indexOf(currentValue);
  const nextIndex =
    currentIndex === -1 ? 0 : (currentIndex + 1) % options.length;

  return options[nextIndex];
};
