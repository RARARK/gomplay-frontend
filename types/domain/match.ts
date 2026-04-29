export const MATCH_STATUS = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  IN_PROGRESS: "IN_PROGRESS",
  END_PENDING: "END_PENDING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export type MatchStatus = (typeof MATCH_STATUS)[keyof typeof MATCH_STATUS];

export const MATCH_COMPLETE_ACTION = {
  COMPLETE: "COMPLETE",
} as const;

export type MatchCompleteAction =
  (typeof MATCH_COMPLETE_ACTION)[keyof typeof MATCH_COMPLETE_ACTION];

export const MATCH_SOURCE_TYPE = {
  APPLICATION: "APPLICATION",
  PARTNER_REQUEST: "PARTNER_REQUEST",
} as const;

export type MatchSourceType =
  (typeof MATCH_SOURCE_TYPE)[keyof typeof MATCH_SOURCE_TYPE];

export type Match = {
  id: number;

  hostUserId: number;
  guestUserId: number;

  sourceType: MatchSourceType;
  sourceId: number;

  status: MatchStatus;

  scheduledStartAt?: string;
  scheduledEndAt?: string;

  endRequestedBy?: number;
  endRequestedAt?: string;

  completedAt?: string;

  createdAt: string;
};

export type CompleteMatchInput = {
  matchId: number;
  action: MatchCompleteAction;
};

export type CompleteMatchContext = {
  currentUserId?: number | null;
  hostUserId: number;
  guestUserId: number;
  status: MatchStatus;
  scheduledEndAt?: string;
  endRequestedBy?: number;
  isBlocked?: boolean;
};

export type CompleteMatchPendingResult = {
  matchId: number;
  status: typeof MATCH_STATUS.END_PENDING;
};

export type CompleteMatchDoneResult = {
  matchId: number;
  status: typeof MATCH_STATUS.COMPLETED;
};

export type CompleteMatchResult =
  | CompleteMatchPendingResult
  | CompleteMatchDoneResult;
