import { isAxiosError } from "axios";

import apiClient, { ApiError } from "@/lib/api/client";
import type { ApiResponse } from "@/types/auth/auth";
import type { DayOfWeek, UserTimetableRange } from "@/types/domain/user";

type ScheduleItem = {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
};

type ScheduleResponse = {
  userId: number;
  schedules: ScheduleItem[];
};

export async function getSchedule(): Promise<UserTimetableRange[]> {
  try {
    const response = await apiClient.get<ApiResponse<ScheduleResponse>>("/api/schedule");
    return response.data.data.schedules;
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 400) {
      throw new ApiError("스케줄 정보를 찾을 수 없습니다.");
    }
    throw err;
  }
}

export async function submitSchedule(
  ranges: UserTimetableRange[],
): Promise<ScheduleResponse> {
  try {
    const response = await apiClient.post<ApiResponse<ScheduleResponse>>(
      "/api/schedule",
      { schedules: ranges },
    );
    return response.data.data;
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 400) {
      throw new ApiError("스케줄 저장에 실패했습니다.");
    }
    throw err;
  }
}

export async function updateSchedule(
  ranges: UserTimetableRange[],
): Promise<ScheduleResponse> {
  try {
    const response = await apiClient.patch<ApiResponse<ScheduleResponse>>(
      "/api/schedule",
      { schedules: ranges },
    );
    return response.data.data;
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 400) {
      throw new ApiError("스케줄 수정에 실패했습니다.");
    }
    throw err;
  }
}
