export const CHAT_MESSAGE_TYPE = {
  USER: "USER",
  SYSTEM: "SYSTEM",
} as const;

export type ChatMessageType =
  (typeof CHAT_MESSAGE_TYPE)[keyof typeof CHAT_MESSAGE_TYPE];

export const CHAT_MESSAGE_STATUS = {
  SENDING: "SENDING",
  SENT: "SENT",
  FAILED: "FAILED",
} as const;

export type ChatMessageStatus =
  (typeof CHAT_MESSAGE_STATUS)[keyof typeof CHAT_MESSAGE_STATUS];

export const CHAT_SYSTEM_EVENT = {
  MATCH_ACCEPTED: "MATCH_ACCEPTED",
  MATCH_IN_PROGRESS: "MATCH_IN_PROGRESS",
  MATCH_END_PENDING: "MATCH_END_PENDING",
  MATCH_COMPLETED: "MATCH_COMPLETED",
  MATCH_CANCELLED: "MATCH_CANCELLED",
  REVIEW_PROMPT: "REVIEW_PROMPT",
} as const;

export type ChatSystemEvent =
  (typeof CHAT_SYSTEM_EVENT)[keyof typeof CHAT_SYSTEM_EVENT];

export type ChatMessage = {
  id: number;
  chatRoomId: number;

  senderId?: number;
  senderName?: string;

  message: string;
  type: ChatMessageType;
  status: ChatMessageStatus;
  systemEvent?: ChatSystemEvent;
  readAt?: string;
  isMine?: boolean;
  clientMessageId?: string;

  createdAt: string;
};
