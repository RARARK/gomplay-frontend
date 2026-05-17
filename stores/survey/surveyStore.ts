import { create } from "zustand";

import type { SubmitSurveyInput } from "@/types/domain/survey";
import type { UserTimetableRange } from "@/types/domain/user";
import type { TutorialSelections } from "@/utils/mapTutorialToSurvey";

type SurveyStore = {
  pendingSurvey: SubmitSurveyInput | null;
  pendingSchedule: UserTimetableRange[] | null;
  tutorialSelections: TutorialSelections | null;
  setPendingSurvey: (survey: SubmitSurveyInput | null) => void;
  setPendingSchedule: (schedule: UserTimetableRange[] | null) => void;
  setTutorialSelections: (selections: TutorialSelections | null) => void;
};

export const useSurveyStore = create<SurveyStore>((set) => ({
  pendingSurvey: null,
  pendingSchedule: null,
  tutorialSelections: null,
  setPendingSurvey: (survey) => set({ pendingSurvey: survey }),
  setPendingSchedule: (schedule) => set({ pendingSchedule: schedule }),
  setTutorialSelections: (selections) => set({ tutorialSelections: selections }),
}));
