export type PointLogReason =
  | "signup"
  | "quick_match"
  | "gathering"
  | "attendance"
  | "review"
  | "review_detail"
  | "no_show"
  | "first_match"
  | "match_complete"
  | "exercise_complete"
  | "recommendation_refresh"
  | "post_boost"
  | "mutual_review";

export type PointLog = {
  id: number;
  delta: number;
  balanceSnapshot: number;
  reason: PointLogReason;
  createdAt: string;
};
