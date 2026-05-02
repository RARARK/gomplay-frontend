import { create } from "zustand";

import type { SubmitSurveyInput } from "@/types/domain/survey";
import type { UserTimetableRange } from "@/types/domain/user";

type SurveyStore = {
  pendingSurvey: SubmitSurveyInput | null;
  pendingSchedule: UserTimetableRange[] | null;
  setPendingSurvey: (survey: SubmitSurveyInput | null) => void;
  setPendingSchedule: (schedule: UserTimetableRange[] | null) => void;
};

export const useSurveyStore = create<SurveyStore>((set) => ({
  pendingSurvey: null,
  pendingSchedule: null,
  setPendingSurvey: (survey) => set({ pendingSurvey: survey }),
  setPendingSchedule: (schedule) => set({ pendingSchedule: schedule }),
}));
