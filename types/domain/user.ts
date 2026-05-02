export type DayOfWeek = "MON" | "TUE" | "WED" | "THU" | "FRI";

export type UserTimetableState = Record<DayOfWeek, boolean[]>;

export type UserTimetableRange = {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
};

export type User = {
  id: number;
  nickname?: string;
  email?: string;
  studentId?: string;

  profileImageUrl?: string;
  mannerTemperature?: number;

  department?: string;
  bio?: string;
  tags?: string[];

  isVerified?: boolean;
};

export type UpdateProfileRequest = {
  profileImageUrl?: string;
  exerciseTypes?: string[];
  difficulty?: string;
  bio?: string;
};

export type UpdateProfileResponse = {
  userId: number;
  updateAt: string;
};

export type UserProfile = {
  id: number;
  name: string;
  department: string;
  studentId: string;
  profileImageUrl: string | null;
  mannerTemperature: number;
  noShowCount: number;
  pointBalance: number;
  matchCount: number;
  exerciseTypes: string;
  difficulty: string;
  bio: string | null;
};
