import { create } from "zustand";

import type { Match, MatchCandidate } from "@/types/domain/match";
import type { WsMatchRequestData } from "@/types/domain/wsEvents";

type ResolvedMatchRequest = {
  matchRequestId: number;
  accepted: boolean;
};

type MatchingState = {
  activeMatches: Match[];
  selectedMatchId: number | null;

  candidates: MatchCandidate[];
  pendingMatchRequest: WsMatchRequestData | null;
  lastResolvedMatchRequest: ResolvedMatchRequest | null;
  wsConnected: boolean;

  setActiveMatches: (matches: Match[]) => void;
  setSelectedMatchId: (matchId: number | null) => void;
  clearMatchingState: () => void;

  setCandidates: (candidates: MatchCandidate[]) => void;
  addCandidate: (candidate: MatchCandidate) => void;
  removeCandidate: (userProfileId: number) => void;
  setPendingMatchRequest: (request: WsMatchRequestData | null) => void;
  resolveMatchRequest: (matchRequestId: number, accepted: boolean) => void;
  clearLastResolvedMatchRequest: () => void;
  setWsConnected: (connected: boolean) => void;
};

export const useMatchingStore = create<MatchingState>((set) => ({
  activeMatches: [],
  selectedMatchId: null,
  candidates: [],
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
      return { candidates: [...state.candidates, candidate] };
    }),
  removeCandidate: (userProfileId) =>
    set((state) => ({
      candidates: state.candidates.filter(
        (c) => c.userProfileId !== userProfileId,
      ),
    })),
  setPendingMatchRequest: (request) => set({ pendingMatchRequest: request }),
  resolveMatchRequest: (matchRequestId, accepted) =>
    set({ lastResolvedMatchRequest: { matchRequestId, accepted } }),
  clearLastResolvedMatchRequest: () =>
    set({ lastResolvedMatchRequest: null }),
  setWsConnected: (connected) => set({ wsConnected: connected }),
}));
