import { isAxiosError } from "axios";

import apiClient from "@/lib/api/client";
import type { GroupChatRoom, GroupChatRoomDetails } from "@/types/domain/groupChatRoom";

export async function getGroupChatRooms(): Promise<GroupChatRoom[]> {
  try {
    const response = await apiClient.get<GroupChatRoom[]>("/api/group-chat/rooms");
    return response.data;
  } catch {
    return [];
  }
}

export async function getGroupChatRoomDetails(
  roomId: number,
): Promise<GroupChatRoomDetails | null> {
  try {
    const response = await apiClient.get<GroupChatRoomDetails>(
      `/api/group-chat/rooms/${roomId}`,
    );
    return response.data;
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 400) {
      const message: string =
        (err.response.data as { message?: string })?.message ??
        "채팅방에 입장할 수 없습니다.";
      throw new GroupChatRoomAccessError(message);
    }
    return null;
  }
}

export class GroupChatRoomAccessError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GroupChatRoomAccessError";
  }
}

export class GroupChatNoticeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GroupChatNoticeError";
  }
}

export async function sendGroupChatNotice(
  roomId: number,
  content: string,
): Promise<void> {
  try {
    await apiClient.post(`/api/group-chat/rooms/${roomId}/notice`, { content });
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 400) {
      const message: string =
        (err.response.data as { message?: string })?.message ??
        "공지를 전송할 수 없습니다.";
      throw new GroupChatNoticeError(message);
    }
    throw err;
  }
}

export type SendGroupChatScheduleInput = {
  content: string;
  scheduledAt: string;
  venue: string;
  sportType: string;
};

export class GroupChatScheduleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GroupChatScheduleError";
  }
}

export async function sendGroupChatSchedule(
  roomId: number,
  input: SendGroupChatScheduleInput,
): Promise<void> {
  try {
    await apiClient.post(`/api/group-chat/rooms/${roomId}/schedule`, input);
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 400) {
      const message: string =
        (err.response.data as { message?: string })?.message ??
        "일정을 전송할 수 없습니다.";
      throw new GroupChatScheduleError(message);
    }
    throw err;
  }
}
