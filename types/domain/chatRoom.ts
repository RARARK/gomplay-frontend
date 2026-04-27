import type { MatchStatus } from "@/types/domain/match";

export const CHAT_ROOM_STATUS = {
  ACTIVE: "ACTIVE",
  READ_ONLY: "READ_ONLY",
} as const;

export type ChatRoomStatus =
  (typeof CHAT_ROOM_STATUS)[keyof typeof CHAT_ROOM_STATUS];

export type ChatRoomParticipant = {
  id: number;
  name: string;
  profileImageUrl?: string;
  isSelf?: boolean;
};

export type ChatRoom = {
  id: number;
  matchId: number;
  matchStatus: MatchStatus;
  status: ChatRoomStatus;
  participants: ChatRoomParticipant[];
  lastMessage?: string;
  lastMessageType?: "USER" | "SYSTEM";
  lastMessageAt?: string;
  unreadMessageCount: number;
  matchCompletedAt?: string;
  reviewCompleted: boolean;
  createdAt: string;
};

export function getChatRoomOtherParticipants(
  participants: ChatRoomParticipant[],
) {
  return participants.filter((participant) => !participant.isSelf);
}

export function getChatRoomPrimaryParticipant(
  participants: ChatRoomParticipant[],
) {
  return getChatRoomOtherParticipants(participants)[0] ?? participants[0] ?? null;
}

export function getChatRoomParticipantDisplayName(
  participants: ChatRoomParticipant[],
) {
  const others = getChatRoomOtherParticipants(participants);

  if (others.length === 0 && participants.length === 0) {
    return "Unknown";
  }

  if (others.length <= 1) {
    return (others[0] ?? participants[0]).name;
  }

  return `${others[0].name} +${others.length - 1}`;
}
