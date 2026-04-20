export const MATCH_REQUEST_STATUS = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
  EXPIRED: "EXPIRED",
} as const;

export type MatchRequestStatus =
  (typeof MATCH_REQUEST_STATUS)[keyof typeof MATCH_REQUEST_STATUS];

export type MatchRequest = {
  id: number;

  requesterUserId: number;
  targetUserId: number;

  exerciseType?: string;
  scheduledAt?: string;
  message?: string;

  status: MatchRequestStatus;

  createdAt: string;
};
