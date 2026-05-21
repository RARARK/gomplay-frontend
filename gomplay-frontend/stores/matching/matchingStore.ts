import { create } from "zustand";

import type { Match, MatchCandidate } from "@/types/domain/match";
import type { WsMatchRequestData } from "@/types/domain/wsEvents";

export const VISIBLE_CANDIDATE_LIMIT = 3;

type ResolvedMatchRequest = {
  matchRequestId: number;
  accepted: boolean;
  roomId?: number;
};

type MatchingState = {
  activeMatches: Match[];
  selectedMatchId: number | null;

  candidates: MatchCandidate[];
  candidateBuffer: MatchCandidate[];
  seenCandidateIds: number[];
  disconnectedCandidateIds: number[];

  pendingMatchRequest: WsMatchRequestData | null;
  lastResolvedMatchRequest: ResolvedMatchRequest | null;
  wsConnected: boolean;

  setActiveMatches: (matches: Match[]) => void;
  setSelectedMatchId: (matchId: number | null) => void;
  clearMatchingState: () => void;

  setCandidates: (candidates: MatchCandidate[]) => void;
  addCandidate: (candidate: MatchCandidate) => void;
  removeCandidate: (userProfileId: number) => void;

  setCandidateBuffer: (candidates: MatchCandidate[]) => void;
  addToBuffer: (candidate: MatchCandidate) => void;
  removeFromBuffer: (userProfileId: number) => void;
  popFromBuffer: () => MatchCandidate | null;

  addSeenIds: (ids: number[]) => void;

  markCandidateDisconnected: (userProfileId: number) => void;
  clearDisconnectedCandidate: (userProfileId: number) => void;
  resetDisconnectedCandidates: () => void;

  setPendingMatchRequest: (request: WsMatchRequestData | null) => void;
  resolveMatchRequest: (matchRequestId: number, accepted: boolean, roomId?: number) => void;
  clearLastResolvedMatchRequest: () => void;
  setWsConnected: (connected: boolean) => void;
};

export const useMatchingStore = create<MatchingState>((set, get) => ({
  activeMatches: [],
  selectedMatchId: null,
  candidates: [],
  candidateBuffer: [],
  seenCandidateIds: [],
  disconnectedCandidateIds: [],
  pendingMatchRequest: null,
  lastResolvedMatchRequest: null,
  wsConnected: false,

  setActiveMatches: (matches) => set({ activeMatches: matches }),
  setSelectedMatchId: (matchId) => set({ selectedMatchId: matchId }),
  clearMatchingState: () =>
    set({
      activeMatches: [],
      selectedMatchId: null,
      candidates: [],
      candidateBuffer: [],
      seenCandidateIds: [],
      disconnectedCandidateIds: [],
      pendingMatchRequest: null,
      lastResolvedMatchRequest: null,
      wsConnected: false,
    }),

  setCandidates: (candidates) => set({ candidates }),
  addCandidate: (candidate) =>
    set((state) => {
      const exists = state.candidates.some(
        (c) => c.userProfileId === candidate.userProfileId,
      );
      if (exists) return state;
      return {
        candidates: [...state.candidates, candidate],
        candidateBuffer: state.candidateBuffer.filter(
          (c) => c.userProfileId !== candidate.userProfileId,
        ),
      };
    }),
  removeCandidate: (userProfileId) =>
    set((state) => ({
      candidates: state.candidates.filter(
        (c) => c.userProfileId !== userProfileId,
      ),
    })),

  setCandidateBuffer: (candidates) => set({ candidateBuffer: candidates }),
  addToBuffer: (candidate) =>
    set((state) => {
      const exists =
        state.candidates.some(
          (c) => c.userProfileId === candidate.userProfileId,
        ) ||
        state.candidateBuffer.some(
          (c) => c.userProfileId === candidate.userProfileId,
        );
      if (exists) return state;
      return { candidateBuffer: [...state.candidateBuffer, candidate] };
    }),
  removeFromBuffer: (userProfileId) =>
    set((state) => ({
      candidateBuffer: state.candidateBuffer.filter(
        (c) => c.userProfileId !== userProfileId,
      ),
    })),
  popFromBuffer: () => {
    const { candidateBuffer } = get();
    if (candidateBuffer.length === 0) return null;
    const [first, ...rest] = candidateBuffer;
    set({ candidateBuffer: rest });
    return first;
  },

  addSeenIds: (ids) =>
    set((state) => {
      const existing = new Set(state.seenCandidateIds);
      const next = ids.filter((id) => !existing.has(id));
      if (next.length === 0) return state;
      return { seenCandidateIds: [...state.seenCandidateIds, ...next] };
    }),

  markCandidateDisconnected: (userProfileId) =>
    set((state) => ({
      disconnectedCandidateIds: state.disconnectedCandidateIds.includes(userProfileId)
        ? state.disconnectedCandidateIds
        : [...state.disconnectedCandidateIds, userProfileId],
    })),
  clearDisconnectedCandidate: (userProfileId) =>
    set((state) => ({
      disconnectedCandidateIds: state.disconnectedCandidateIds.filter(
        (id) => id !== userProfileId,
      ),
    })),
  resetDisconnectedCandidates: () => set({ disconnectedCandidateIds: [] }),

  setPendingMatchRequest: (request) => set({ pendingMatchRequest: request }),
  resolveMatchRequest: (matchRequestId, accepted, roomId) =>
    set({ lastResolvedMatchRequest: { matchRequestId, accepted, roomId } }),
  clearLastResolvedMatchRequest: () =>
    set({ lastResolvedMatchRequest: null }),
  setWsConnected: (connected) => set({ wsConnected: connected }),
}));
