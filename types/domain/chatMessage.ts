export const CHAT_MESSAGE_TYPE = {
  USER: "USER",
  SYSTEM: "SYSTEM",
} as const;

export type ChatMessageType =
  (typeof CHAT_MESSAGE_TYPE)[keyof typeof CHAT_MESSAGE_TYPE];

export type ChatMessage = {
  id: number;
  chatRoomId: number;

  senderId?: number;

  message: string;
  type: ChatMessageType;

  createdAt: string;
};
