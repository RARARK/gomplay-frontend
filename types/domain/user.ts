export type DayOfWeek = "MON" | "TUE" | "WED" | "THU" | "FRI";

export type UserTimetableState = Record<DayOfWeek, boolean[]>;

export type UserTimetableRange = {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
};

export type User = {
  id: number;
  nickname: string;
  email?: string;
  studentId?: string;

  profileImageUrl?: string;
  mannerTemperature?: number;

  department?: string;
  bio?: string;
  tags?: string[];

  isVerified?: boolean;
};
