import { create } from "zustand";

import type { MatchHistoryEntry } from "@/types/domain/match";
import type { PointLog } from "@/types/domain/point";
import type { Survey } from "@/types/domain/survey";

/**
 * 화면을 나갔다 다시 들어올 때 마지막으로 받은 데이터를 바로 보여주기 위한 캐시.
 * 화면은 캐시가 있으면 로딩 화면 없이 그대로 그리고, 뒤에서 새로 받아 갱신한다.
 * 사용자별 데이터이므로 로그아웃(clearAuth) 시 반드시 비운다.
 */
type ScreenCacheState = {
  survey: Survey | null;
  pointLogs: PointLog[] | null;
  matchHistory: MatchHistoryEntry[] | null;
  setSurvey: (survey: Survey | null) => void;
  setPointLogs: (logs: PointLog[]) => void;
  setMatchHistory: (history: MatchHistoryEntry[]) => void;
  clearAll: () => void;
};

export const useScreenCacheStore = create<ScreenCacheState>((set) => ({
  survey: null,
  pointLogs: null,
  matchHistory: null,
  setSurvey: (survey) => set({ survey }),
  setPointLogs: (pointLogs) => set({ pointLogs }),
  setMatchHistory: (matchHistory) => set({ matchHistory }),
  clearAll: () => set({ survey: null, pointLogs: null, matchHistory: null }),
}));
