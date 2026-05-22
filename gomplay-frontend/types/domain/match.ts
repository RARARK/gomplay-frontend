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

export type ActiveMatchType = "GATHERING" | "PARTNER" | "Gathering" | "Partner";
export type ActiveMatchRole = "HOST" | "GUEST" | "host" | "guest" | null;
export type ActiveMatchStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled";

export type ActiveMatch = {
  canComplete: boolean;
  chatRoomId: number | null;
  difficulty: string | null;
  id: number;
  hostDepartment?: string | null;
  hostName?: string | null;
  hostProfileImageUrl?: string | null;
  hostStudentNumber?: string | number | null;
  location: string | null;
  matchedAt: string | null;
  partnerDepartment: string | null;
  partnerName: string;
  partnerProfileImageUrl: string | null;
  partnerStudentNumber: string | number | null;
  pendingCount: number;
  reviewed: boolean;
  role?: ActiveMatchRole;
  scheduledAt?: string | null;
  scheduledEndAt: string | null;
  scheduledTime: string | null;
  sportType: string | null;
  status: ActiveMatchStatus;
  type: ActiveMatchType;
};

export type ActiveMatchesResponse = {
  success: boolean;
  message: string;
  data: ActiveMatch[];
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

export type ToggleMatchingRequest = {
  isMatching: boolean;
};

export type ToggleMatchingResponse = {
  success: boolean;
  message: string;
  data: {
    isMatching: boolean;
  };
};

export type MatchCandidate = {
  userProfileId: number;
  name: string;
  profileImageUrl: string | null;
  department: string;
  college?: string;
  studentId: string;
  partnerStyle: string;
  exerciseIntensity: string;
  exerciseReason: string;
  exerciseTypes: string[];
  compatibilityScore?: number;
  matchScore?: number;
  matchReasons?: string[];
};

export type PassCandidateRequest = {
  excludeIds: number[];
};

export type PassCandidateResponse = {
  success: boolean;
  message: string;
  data: MatchCandidate | null;
};

export type MatchRequestStatus = "PENDING" | "TIMEOUT";

export type MatchRequestBody = {
  opponentId: number;
};

export type MatchRequestResponse = {
  success: boolean;
  message: string;
  data: {
    matchRequestId: number;
    opponentId: number;
    status: MatchRequestStatus;
    expiresAt: string;
  };
};

export type AcceptMatchRequestResponse = {
  success: boolean;
  message: string;
  data: {
    roomId: number;
  } | null;
};

export type RejectMatchRequestResponse = AcceptMatchRequestResponse;
