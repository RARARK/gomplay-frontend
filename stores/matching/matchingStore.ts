import { create } from "zustand";
import type { Match } from "@/types/domain/match";

type MatchingState = {
  activeMatches: Match[];
  selectedMatchId: number | null;

  setActiveMatches: (matches: Match[]) => void;
  setSelectedMatchId: (matchId: number | null) => void;
  clearMatchingState: () => void;
};

export const useMatchingStore = create<MatchingState>((set) => ({
  activeMatches: [],
  selectedMatchId: null,

  setActiveMatches: (matches) =>
    set({
      activeMatches: matches,
    }),

  setSelectedMatchId: (matchId) =>
    set({
      selectedMatchId: matchId,
    }),

  clearMatchingState: () =>
    set({
      activeMatches: [],
      selectedMatchId: null,
    }),
}));
