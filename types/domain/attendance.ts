export type AttendanceStatus = {
  todayCheckedIn: boolean;
  checkedInDates: string[]; // "YYYY-MM-DD" server-time dates
  totalPoints: number;
  serverDate: string; // today in server time "YYYY-MM-DD"
};

export type CheckInResult = {
  pointsEarned: number;
  totalPoints: number;
  serverDate: string;
};
