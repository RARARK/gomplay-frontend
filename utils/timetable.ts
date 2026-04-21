import type {
  DayOfWeek,
  UserTimetableRange,
  UserTimetableState,
} from "@/types/domain/user";

export const DAY_OF_WEEKS: DayOfWeek[] = ["MON", "TUE", "WED", "THU", "FRI"];

export const DAY_LABELS: Record<DayOfWeek, string> = {
  MON: "MON",
  TUE: "TUE",
  WED: "WED",
  THU: "THU",
  FRI: "FRI",
};

const START_HOUR = 9;
const END_HOUR = 18;
const SLOT_MINUTES = 30;

const padTime = (value: number) => value.toString().padStart(2, "0");

const formatMinutes = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${padTime(hours)}:${padTime(minutes)}`;
};

export const TIME_SLOTS = Array.from(
  { length: ((END_HOUR - START_HOUR) * 60) / SLOT_MINUTES + 1 },
  (_, index) => formatMinutes(START_HOUR * 60 + index * SLOT_MINUTES)
);

export const getSlotEndTime = (slotIndex: number) =>
  formatMinutes(START_HOUR * 60 + (slotIndex + 1) * SLOT_MINUTES);

export const createEmptyTimetableState = (
  slotCount = TIME_SLOTS.length
): UserTimetableState => ({
  MON: Array(slotCount).fill(false),
  TUE: Array(slotCount).fill(false),
  WED: Array(slotCount).fill(false),
  THU: Array(slotCount).fill(false),
  FRI: Array(slotCount).fill(false),
});

export const updateTimetableCell = (
  state: UserTimetableState,
  dayOfWeek: DayOfWeek,
  slotIndex: number,
  nextValue: boolean
): UserTimetableState => ({
  ...state,
  [dayOfWeek]: state[dayOfWeek].map((value, index) =>
    index === slotIndex ? nextValue : value
  ),
});

export const compressTimetableState = (
  state: UserTimetableState
): UserTimetableRange[] => {
  const ranges: UserTimetableRange[] = [];

  DAY_OF_WEEKS.forEach((dayOfWeek) => {
    const daySlots = state[dayOfWeek];
    let rangeStartIndex: number | null = null;

    daySlots.forEach((isSelected, slotIndex) => {
      if (isSelected && rangeStartIndex === null) {
        rangeStartIndex = slotIndex;
        return;
      }

      if (!isSelected && rangeStartIndex !== null) {
        ranges.push({
          dayOfWeek,
          startTime: TIME_SLOTS[rangeStartIndex],
          endTime: TIME_SLOTS[slotIndex],
        });
        rangeStartIndex = null;
      }
    });

    if (rangeStartIndex !== null) {
      ranges.push({
        dayOfWeek,
        startTime: TIME_SLOTS[rangeStartIndex],
        endTime: getSlotEndTime(daySlots.length - 1),
      });
    }
  });

  return ranges;
};
