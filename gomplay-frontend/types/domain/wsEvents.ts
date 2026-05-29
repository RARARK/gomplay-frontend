import type { MatchCandidate } from "./match";

export type WsMatchRequestData = {
  matchRequestId: number;
  opponentId: number;
  status: "PENDING";
  expiresAt: string;
  // server sends opponentName / opponentProfileImageUrl
  opponentName?: string;
  opponentProfileImageUrl?: string | null;
  // legacy aliases kept for compatibility
  name?: string;
  profileImageUrl?: string | null;
};

export type WsCandidatesUpdateEvent = {
  type: "CANDIDATES_UPDATE";
  data: MatchCandidate[];
};

export type WsNewCandidateEvent = {
  type: "NEW_CANDIDATE";
  data: MatchCandidate;
};

export type WsCandidateLeftEvent = {
  type: "CANDIDATE_LEFT";
  data: number;
};

export type WsMatchRequestEvent = {
  type: "MATCH_REQUEST";
  data: WsMatchRequestData;
};

export type WsMatchAcceptedEvent = {
  type: "MATCH_ACCEPTED";
  data: {
    matchRequestId: number;
    chatRoomId: number;
  };
};

export type WsMatchRejectedEvent = {
  type: "MATCH_REJECTED";
  data: number;
};

export type WsMatchEvent =
  | WsCandidatesUpdateEvent
  | WsNewCandidateEvent
  | WsCandidateLeftEvent
  | WsMatchRequestEvent
  | WsMatchAcceptedEvent
  | WsMatchRejectedEvent;
