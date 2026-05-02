export type CreateGatheringRequest = {
  title: string;
  sportType: string;
  difficulty: string;
  venue: string;
  venueLat: number;
  venueLng: number;
  scheduledAt: string;
  maxParticipants: number;
};

export type GatheringStatus = "OPEN" | "CLOSED" | "CANCELLED";

export type CreateGatheringResponse = {
  id: number;
  title: string;
  sportType: string;
  difficulty: string;
  venue: string;
  scheduledAt: string;
  maxParticipants: number;
  currentParticipants: number;
  status: GatheringStatus;
  createdAt: string;
};
