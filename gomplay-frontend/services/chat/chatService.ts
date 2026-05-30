import { isAxiosError } from "axios";

import type {
  ChatRealtimeListener,
  CreateSystemMessageInput,
  SendChatMessageInput,
  UpdateChatRoomStatusInput,
} from "@/types/domain/chat";
import { useAuthStore } from "@/stores/auth/authStore";

import type { ChatMessage } from "@/types/domain/chatMessage";
import {
  CHAT_MESSAGE_STATUS,
  CHAT_MESSAGE_TYPE,
} from "@/types/domain/chatMessage";
import type { ChatRoom } from "@/types/domain/chatRoom";
import { CHAT_ROOM_STATUS } from "@/types/domain/chatRoom";
import { MATCH_STATUS } from "@/types/domain/match";
import apiClient from "@/lib/api/client";
import type { ApiResponse } from "@/types/auth/auth";
import {
  addChatEventHandler,
  isChatWsActive,
  publishChatMessage,
  type ChatWsEvent,
} from "@/lib/ws/chatWsClient";

export { connectChatWs, disconnectChatWs } from "@/lib/ws/chatWsClient";


type ChatRoomApiItem = {
  roomId: number;
  matchResultId: number;
  opponentId: number;
  opponentName: string;
  opponentProfileImageUrl: string | null;
  matchStatus: "IN_PROGRESS" | "COMPLETED";
  unreadCount: number;
  createdAt: string;
  lastMessageContent?: string | null;
  lastMessageAt?: string | null;
  completeButtonVisible: boolean;
  reviewed: boolean;
};

function mapApiChatRoom(item: ChatRoomApiItem): ChatRoom {
  return {
    id: item.roomId,
    matchId: item.matchResultId,
    matchStatus: item.matchStatus,
    status:
      item.matchStatus === MATCH_STATUS.COMPLETED
        ? CHAT_ROOM_STATUS.READ_ONLY
        : CHAT_ROOM_STATUS.ACTIVE,
    participants: [
      {
        id: item.opponentId,
        name: item.opponentName,
        profileImageUrl: item.opponentProfileImageUrl ?? undefined,
      },
    ],
    lastMessage: item.lastMessageContent ?? undefined,
    lastMessageAt: item.lastMessageAt ?? undefined,
    unreadMessageCount: item.unreadCount,
    completeButtonVisible: item.completeButtonVisible,
    reviewed: item.reviewed,
    createdAt: item.createdAt,
  };
}

export async function getChatRooms(): Promise<ChatRoom[]> {
  try {
    const response = await apiClient.get<ApiResponse<ChatRoomApiItem[]>>(
      "/api/chat/rooms",
    );
    return (response.data.data ?? []).map(mapApiChatRoom);
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 403) return [];
    return [];
  }
}

type ChatRoomMessageApiItem = {
  messageId: number;
  roomId: number;
  senderId: number;
  senderName: string;
  content: string;
  sentAt: string;
  read: boolean;
};

type ChatRoomDetailsApiResponse = ChatRoomApiItem & {
  messages: ChatRoomMessageApiItem[];
};

export type ChatRoomDetails = {
  chatRoom: ChatRoom;
  messages: ChatMessage[];
};

export async function getChatRoomDetails(
  chatRoomId: number,
): Promise<ChatRoomDetails | null> {
  try {
    const response = await apiClient.get<ApiResponse<ChatRoomDetailsApiResponse>>(
      `/api/chat/room/${chatRoomId}`,
    );
    const data = response.data.data;
    const currentUserId = useAuthStore.getState().userId;

    const chatRoom = mapApiChatRoom(data);
    const messages: ChatMessage[] = data.messages.map((msg) => ({
      id: msg.messageId,
      chatRoomId: msg.roomId,
      senderId: msg.senderId,
      senderName: msg.senderName,
      message: msg.content,
      type: CHAT_MESSAGE_TYPE.USER,
      status: CHAT_MESSAGE_STATUS.SENT,
      isMine: msg.senderId === currentUserId,
      createdAt: msg.sentAt,
    }));

    return { chatRoom, messages };
  } catch {
    return null;
  }
}

export async function sendChatMessage(
  input: SendChatMessageInput,
): Promise<ChatMessage> {
  if (isChatWsActive()) {
    publishChatMessage(input.chatRoomId, input.message);
  }

  return {
    id: Date.now(),
    chatRoomId: input.chatRoomId,
    message: input.message,
    type: CHAT_MESSAGE_TYPE.USER,
    status: CHAT_MESSAGE_STATUS.SENT,
    isMine: true,
    clientMessageId: input.clientMessageId,
    createdAt: new Date().toISOString(),
  };
}

export async function createSystemMessage(
  input: CreateSystemMessageInput,
): Promise<ChatMessage> {
  return {
    id: Date.now(),
    chatRoomId: input.chatRoomId,
    message: input.message,
    type: CHAT_MESSAGE_TYPE.SYSTEM,
    status: CHAT_MESSAGE_STATUS.SENT,
    systemEvent: input.systemEvent,
    createdAt: new Date().toISOString(),
  };
}

export async function updateChatRoomStatus(
  _input: UpdateChatRoomStatusInput,
): Promise<void> {
  // no-op until REST endpoint is available
}

export async function markChatRoomAsRead(_chatRoomId: number): Promise<void> {
  // no-op until REST endpoint is available
}

export function subscribeToChatMessages(
  chatRoomId: number,
  listener: ChatRealtimeListener,
): () => void {
  return addChatEventHandler((event) => {
    if (event.type !== "NEW_MESSAGE") return;
    if (event.data.roomId !== chatRoomId) return;

    const message: ChatMessage = {
      id: event.data.messageId,
      chatRoomId: event.data.roomId,
      senderId: event.data.senderId,
      senderName: event.data.senderName,
      message: event.data.content,
      type: CHAT_MESSAGE_TYPE.USER,
      status: CHAT_MESSAGE_STATUS.SENT,
      isMine: false,
      createdAt: event.data.sentAt,
    };

    listener(message);
  });
}

export type ChatRoomEventListener = (
  event: Extract<ChatWsEvent, { type: "PARTNER_COMPLETED" | "MATCH_COMPLETED" }>,
) => void;

export function subscribeToChatRoomEvents(
  matchResultId: number,
  listener: ChatRoomEventListener,
): () => void {
  return addChatEventHandler((event) => {
    if (event.type !== "PARTNER_COMPLETED" && event.type !== "MATCH_COMPLETED") return;
    if (event.data !== matchResultId) return;
    listener(event as Extract<ChatWsEvent, { type: "PARTNER_COMPLETED" | "MATCH_COMPLETED" }>);
  });
}
