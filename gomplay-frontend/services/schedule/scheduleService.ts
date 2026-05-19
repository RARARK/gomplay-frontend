import { isAxiosError } from "axios";

import apiClient, { ApiError } from "@/lib/api/client";
import type { ApiResponse } from "@/types/auth/auth";
import type { DayOfWeek, UserTimetableRange } from "@/types/domain/user";

// Module-level cache so callers can read the last known value synchronously.
// null = never fetched yet, boolean = last known result.
let _hasSchedule: boolean | null = null;

export function getHasScheduleCache(): boolean | null {
  return _hasSchedule;
}

export function setHasScheduleCache(value: boolean): void {
  _hasSchedule = value;
}

type ScheduleItem = {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
};

type ScheduleResponse = {
  userId: number;
  schedules: ScheduleItem[];
};

type ScheduleApiResponse = ApiResponse<ScheduleResponse> | ScheduleResponse;

const unwrapScheduleResponse = (value: ScheduleApiResponse): ScheduleResponse =>
  "data" in value
    ? (value as ApiResponse<ScheduleResponse>).data
    : (value as ScheduleResponse);

const extractScheduleError = (err: unknown, fallback: string): ApiError => {
  if (err instanceof ApiError) return err;
  if (isAxiosError(err)) {
    const status = err.response?.status;
    const data = err.response?.data;
    const msg =
      (data as { message?: string })?.message ||
      (data as { error?: string })?.error ||
      (typeof data === "string" ? data : undefined);
    return new ApiError(msg ?? `${fallback} (${status})`);
  }
  return new ApiError(fallback);
};

export async function getSchedule(): Promise<UserTimetableRange[]> {
  try {
    const response = await apiClient.get<ScheduleApiResponse>("/api/schedule");
    return unwrapScheduleResponse(response.data).schedules;
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
    const response = await apiClient.post<ScheduleApiResponse>(
      "/api/schedule",
      { schedules: ranges },
    );
    return unwrapScheduleResponse(response.data);
  } catch (err) {
    if (
      isAxiosError(err) &&
      (err.response?.status === 400 || err.response?.status === 403)
    ) {
      throw extractScheduleError(err, "스케줄 저장에 실패했습니다.");
    }
    throw err;
  }
}

export async function updateSchedule(
  ranges: UserTimetableRange[],
): Promise<ScheduleResponse> {
  try {
    const response = await apiClient.patch<ScheduleApiResponse>(
      "/api/schedule",
      { schedules: ranges },
    );
    return unwrapScheduleResponse(response.data);
  } catch (err) {
    if (
      isAxiosError(err) &&
      (err.response?.status === 400 || err.response?.status === 403)
    ) {
      throw extractScheduleError(err, "스케줄 수정에 실패했습니다.");
    }
    throw err;
  }
}
