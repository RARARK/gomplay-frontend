export type PointLogReason =
  | "signup"
  | "quick_match"
  | "gathering"
  | "attendance"
  | "review"
  | "no_show"
  | "first_match"
  | "match_complete"
  | "recommendation_refresh"
  | "post_boost";

export type PointLog = {
  id: number;
  delta: number;
  balanceSnapshot: number;
  reason: PointLogReason;
  createdAt: string;
};

export type PointLogsResponse = {
  logs: PointLog[];
};
