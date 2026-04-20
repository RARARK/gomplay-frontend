export const REVIEW_STATUS = {
  NONE: "NONE",
  PENDING: "PENDING",
  SUBMITTED: "SUBMITTED",
} as const;

export type ReviewStatus = (typeof REVIEW_STATUS)[keyof typeof REVIEW_STATUS];

export type Review = {
  id: number;

  matchId: number;
  reviewerId: number;
  revieweeId: number;

  score: number;
  isNoShow?: boolean;
  comment?: string;

  createdAt: string;
};
