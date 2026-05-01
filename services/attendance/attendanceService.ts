import type { AttendanceStatus, CheckInResult } from "@/types/domain/attendance";

const POINTS_PER_CHECKIN = 10;

// Mock storage — replace with real API calls
const checkedInDates = new Set<string>([
  "2026-04-28",
  "2026-04-29",
  "2026-04-30",
]);
let totalPoints = checkedInDates.size * POINTS_PER_CHECKIN;

function getServerDateString(): string {
  // In production this comes from the API response, not the device clock.
  return new Date().toISOString().split("T")[0];
}

export async function getAttendanceStatus(
  _userId: number,
): Promise<AttendanceStatus> {
  const serverDate = getServerDateString();
  return {
    todayCheckedIn: checkedInDates.has(serverDate),
    checkedInDates: Array.from(checkedInDates),
    totalPoints,
    serverDate,
  };
}

export async function checkIn(_userId: number): Promise<CheckInResult> {
  const serverDate = getServerDateString();

  if (checkedInDates.has(serverDate)) {
    throw new Error("이미 오늘 출석체크를 완료했어요.");
  }

  checkedInDates.add(serverDate);
  totalPoints += POINTS_PER_CHECKIN;

  return {
    pointsEarned: POINTS_PER_CHECKIN,
    totalPoints,
    serverDate,
  };
}
