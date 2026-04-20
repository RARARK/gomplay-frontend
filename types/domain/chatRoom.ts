export const CHAT_ROOM_STATUS = {
  ACTIVE: "ACTIVE",
  READ_ONLY: "READ_ONLY",
} as const;

export type ChatRoomStatus =
  (typeof CHAT_ROOM_STATUS)[keyof typeof CHAT_ROOM_STATUS];

export type ChatRoom = {
  id: number;
  matchId: number;

  status: ChatRoomStatus;

  createdAt: string;
};
