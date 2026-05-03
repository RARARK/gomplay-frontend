import type { PostDifficulty } from "@/types/domain/post";

export type GatheringListItem = {
  currentParticipants: number;
  difficulty: string;
  hostMannerTemperature: number;
  hostProfileImageUrl: string | null;
  id: number;
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
};

export type CreateGatheringRequest = {
  title: string;
  sportType: string;
  difficulty: PostDifficulty;
  venue: string;
  venueLat: number;
  venueLng: number;
  scheduledAt: string;
  maxParticipants: number;
};

export type GatheringStatus = "OPEN" | "CLOSED" | "CANCELLED";

export type UpdateGatheringRequest = {
  title?: string;
  description?: string;
  tags?: string[];
};

export type GatheringPostDetailResponse = {
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
  hostName: string;
  hostProfileImageUrl: string | null;
};

export type UpdateGatheringResponse = {
  id: number;
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
