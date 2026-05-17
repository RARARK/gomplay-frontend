import { isAxiosError } from "axios";

import apiClient, { ApiError } from "@/lib/api/client";
import type { PointLog, PointLogsResponse } from "@/types/domain/point";

export async function getPointLogs(): Promise<PointLog[]> {
  try {
    const res = await apiClient.get<PointLogsResponse>("/api/point/logs");
    return res.data.logs;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (isAxiosError(error) && error.response?.status === 400) {
      const message =
        (error.response.data as { message?: string })?.message ??
        "포인트 내역을 불러올 수 없습니다.";
      throw new ApiError(message);
    }
    throw new ApiError("알 수 없는 오류가 발생하였습니다.");
  }
}
