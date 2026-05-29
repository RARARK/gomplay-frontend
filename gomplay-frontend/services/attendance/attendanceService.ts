import { isAxiosError } from "axios";

import apiClient, { ApiError } from "@/lib/api/client";
import { useUserStore } from "@/stores/user/userStore";
import type {
  AttendanceCalendarResponse,
  AttendanceStatus,
  CheckInResult,
} from "@/types/domain/attendance";

type CheckInApiResponse = {
  date: string;
  totalPoints: number;
  totalAttendance: number;
};

function todayString(): string {
  return new Date().toISOString().split("T")[0];
}

export async function getAttendanceStatus(
  _userId: number,
): Promise<AttendanceStatus> {
  const serverDate = todayString();
  const [year, month] = serverDate.split("-").map(Number);

  try {
    const calendar = await getAttendanceCalendar(year, month);
    return {
      todayCheckedIn: calendar.attendanceDates.includes(serverDate),
      checkedInDates: calendar.attendanceDates,
      totalPoints: useUserStore.getState().profile?.pointBalance ?? 0,
      serverDate,
    };
  } catch {
    return {
      todayCheckedIn: false,
      checkedInDates: [],
      totalPoints: useUserStore.getState().profile?.pointBalance ?? 0,
      serverDate,
    };
  }
}

export async function checkIn(_userId: number): Promise<CheckInResult> {
  try {
    const res = await apiClient.post<CheckInApiResponse>("/api/attendance");
    return {
      pointsEarned: 10,
      totalPoints: res.data.totalPoints,
      serverDate: res.data.date,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (isAxiosError(error)) {
      const msg = (error.response?.data as { message?: string })?.message;
      if (error.response?.status === 400) {
        throw new ApiError(msg ?? "이미 오늘 출석체크를 완료했어요.");
      }
      if (error.response?.status === 500) {
        throw new ApiError("서버 내부 오류");
      }
      if (msg) throw new ApiError(msg);
    }
    throw new ApiError("출석 체크에 실패했습니다.");
  }
}

export async function getAttendanceCalendar(
  year: number,
  month: number,
): Promise<AttendanceCalendarResponse> {
  try {
    const res = await apiClient.get<AttendanceCalendarResponse>(
      "/api/attendance/calendar",
      { params: { year, month } },
    );
    return res.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (isAxiosError(error) && error.response?.status === 400) {
      const message =
        (error.response.data as { message?: string })?.message ??
        "유저를 찾을 수 없습니다.";
      throw new ApiError(message);
    }
    throw new ApiError("알 수 없는 오류가 발생하였습니다.");
  }
}
