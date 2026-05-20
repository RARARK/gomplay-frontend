import { isAxiosError } from "axios";

import apiClient, { ApiError } from "@/lib/api/client";
import type { NotificationItem, NotificationTab } from "@/types/domain/notification";

export async function markAllNotificationsRead(): Promise<void> {
  try {
    await apiClient.patch("/api/notifications/read-all");
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (isAxiosError(error) && error.response?.status === 400) {
      const message =
        (error.response.data as { message?: string })?.message ??
        "읽음 처리에 실패했습니다.";
      throw new ApiError(message);
    }
    throw new ApiError("알 수 없는 오류가 발생하였습니다.");
  }
}

export async function getNotifications(tab: NotificationTab): Promise<NotificationItem[]> {
  try {
    const res = await apiClient.get<NotificationItem[]>("/api/notifications", {
      params: { tab },
    });
    return res.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (isAxiosError(error) && error.response?.status === 400) {
      const message =
        (error.response.data as { message?: string })?.message ??
        "알림을 불러올 수 없습니다.";
      throw new ApiError(message);
    }
    throw new ApiError("알 수 없는 오류가 발생하였습니다.");
  }
}
