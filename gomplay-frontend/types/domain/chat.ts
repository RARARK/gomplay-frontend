import type { ChatMessage } from "@/types/domain/chatMessage";
import type { ChatRoom, ChatRoomStatus } from "@/types/domain/chatRoom";

export const CHAT_CONNECTION_STATUS = {
  IDLE: "IDLE",
  CONNECTING: "CONNECTING",
  CONNECTED: "CONNECTED",
  DISCONNECTED: "DISCONNECTED",
} as const;

export type ChatConnectionStatus =
  (typeof CHAT_CONNECTION_STATUS)[keyof typeof CHAT_CONNECTION_STATUS];

export type ChatMessagesPage = {
  chatRoomId: number;
  messages: ChatMessage[];
  nextCursor?: string;
};

export type GetChatMessagesParams = {
  chatRoomId: number;
  cursor?: string;
  limit?: number;
};

export type SendChatMessageInput = {
  chatRoomId: number;
  message: string;
  clientMessageId?: string;
};

export type CreateSystemMessageInput = {
  chatRoomId: number;
  message: string;
  systemEvent?: ChatMessage["systemEvent"];
};

export type UpdateChatRoomStatusInput = {
  chatRoomId: number;
  status: ChatRoomStatus;
};

export type ChatRealtimeListener = (message: ChatMessage) => void;

export type ChatStateSnapshot = {
  chatRooms: ChatRoom[];
  selectedChatRoomId: number | null;
  messagesByRoomId: Record<number, ChatMessage[]>;
  draftsByRoomId: Record<number, string>;
  nextCursorByRoomId: Record<number, string | undefined>;
  connectionStatusByRoomId: Record<number, ChatConnectionStatus>;
};
