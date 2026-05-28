export type GroupChatLastMessage = {
  content?: string | null;
  senderName?: string | null;
  sentAt?: string | null;
};

export type GroupChatRoom = {
  id: number;
  gatheringId: number;
  gatheringTitle: string;
  sportType: string;
  participantCount: number;
  lastMessage: GroupChatLastMessage | null;
  createdAt: string;
  hostProfileImageUrl?: string | null;
};

export type GroupChatMessageType = "TEXT" | "NOTICE" | "SCHEDULE";

export type GroupChatMessage = {
  id: number;
  senderId: number;
  senderName: string;
  senderProfileImageUrl: string | null;
  content: string;
  messageType: GroupChatMessageType;
  scheduledAt: string | null;
  venue: string | null;
  sportType: string | null;
  sentAt: string;
};

export type GroupChatParticipant = {
  id: number;
  name: string;
  profileImageUrl: string | null;
  isHost: boolean;
};

export type GroupChatRoomDetails = {
  id: number;
  gatheringId: number;
  gatheringTitle: string;
  sportType: string;
  venue: string;
  participantCount: number;
  isHost?: boolean;
  participants?: GroupChatParticipant[];
  messages: GroupChatMessage[];
};
