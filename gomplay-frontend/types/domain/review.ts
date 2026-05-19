export const REVIEW_STATUS = {
  NONE: "NONE",
  PENDING: "PENDING",
  SUBMITTED: "SUBMITTED",
} as const;

export type ReviewStatus = (typeof REVIEW_STATUS)[keyof typeof REVIEW_STATUS];

export type ReviewRequest = {
  revieweeId: number;
  gatheringId?: number | null;
  matchResultId?: number | null;
  goodTags: string[];
  badTags: string[];
  isNoShow: boolean;
  comment?: string | null;
  reportCategories?: string[];
  reportContent?: string | null;
};

export type ReviewResponse = {
  id: number;
  revieweeId: number;
  goodTags: string;
  badTags: string;
  noShow: boolean;
  comment: string | null;
  createdAt: string;
};

export type ReceivedReview = {
  id: number;
  revieweeId: number;
  goodTags: string;
  badTags: string;
  noShow: boolean;
  comment: string | null;
  createdAt: string;
};
