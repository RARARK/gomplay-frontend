import type { PostDifficulty } from "@/types/domain/post";

export type GatheringListItem = {
  boostExpiredAt?: string | null;
  currentParticipants: number;
  difficulty: string;
  hostMannerTemperature: number;
  hostProfileImageUrl: string | null;
  id: number;
  isBoosted?: boolean;
  maxParticipants: number;
  scheduledAt: string;
  scheduledEndAt: string;
  sportType: string;
  status: GatheringStatus;
  tags?: string | null;
  title: string;
  venue: string;
};

export type GatheringListResponse = {
  content: GatheringListItem[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type GatheringListQuery = {
  sportType?: string;
  difficulty?: string;
  page?: number;
  size?: number;
  hideExpired?: boolean;
};

export type CreateGatheringRequest = {
  title: string;
  sportType: string;
  difficulty: PostDifficulty;
  venue: string;
  venueLat: number;
  venueLng: number;
  scheduledAt: string;
  scheduledEndAt: string;
  maxParticipants: number;
  description?: string;
  tags?: string;
};

export type GatheringStatus = "OPEN" | "CLOSED" | "EXPIRED" | "CANCELLED" | "COMPLETED";

export type UpdateGatheringRequest = {
  hostId: number;
  title?: string;
  description?: string;
  tags?: string;
};

export type GatheringPostDetailResponse = {
  boostExpiredAt?: string | null;
  id: number;
  title: string;
  sportType: string;
  difficulty: string;
  venue: string;
  venueLat: number;
  venueLng: number;
  scheduledAt: string;
  scheduledEndAt: string;
  maxParticipants: number;
  currentParticipants: number;
  description?: string | null;
  tags?: string | null;
  status: GatheringStatus;
  createdAt: string;
  hostId: number;
  hostName: string;
  hostProfileImageUrl: string | null;
  isBoosted?: boolean;
};

export type UpdateGatheringResponse = {
  id: number;
  hostId: number;
  title: string;
  description?: string;
  sportType: string;
  difficulty: string;
  venue: string;
  scheduledAt: string;
  scheduledEndAt?: string;
  maxParticipants: number;
  currentParticipants: number;
  status: GatheringStatus;
  tags?: string;
  updatedAt: string;
};

export type JoinGatheringResponse = {
  id: number;
  gatheringId: number;
  userId: number;
  status: string;
  createdAt: string;
};

export type ParticipantStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export type GatheringParticipant = {
  id: number;
  gatheringId: number;
  mannerTemperature?: number | null;
  userId: number;
  userName: string;
  userProfileImageUrl: string | null;
  department?: string | null;
  studentNumber?: string | null;
  status: ParticipantStatus;
  updatedAt: string;
};

export type ReviewableGatheringParticipant = {
  userId: number;
  name: string;
  profileImageUrl: string | null;
  department: string;
  studentNumber: string;
  reviewed: boolean;
};

export type AcceptParticipantResponse = {
  id: number;
  gatheringId: number;
  userId: number;
  status: string;
  updatedAt: string;
};

export type RejectParticipantResponse = AcceptParticipantResponse;

export type CreateGatheringResponse = {
  id: number;
  title: string;
  sportType: string;
  difficulty: PostDifficulty;
  venue: string;
  scheduledAt: string;
  maxParticipants: number;
  currentParticipants: number;
  status: GatheringStatus;
  createdAt: string;
};

export type GatheringRecommendItem = {
  boostExpiredAt?: string | null;
  id: number;
  isBoosted?: boolean;
  title: string;
  sportType: string;
  difficulty: string;
  venue: string;
  scheduledAt: string;
  scheduledEndAt: string;
  maxParticipants: number;
  currentParticipants: number;
  tags: string | null;
  status: GatheringStatus;
  hostProfileImageUrl: string | null;
  score: number;
};

export type GatheringHistoryItem = {
  id: number;
  title: string;
  sportType: string;
  venue: string;
  scheduledAt: string;
  scheduledEndAt: string;
  reviewed: boolean;
};
