import type { ReactNode } from "react";

export type TutorialOption = {
  id: string;
  label: string;
  icon: ReactNode;
};

export type TutorialQuestionStep =
  | "exerciseStyle"
  | "intensity"
  | "motivation";

export type TutorialStep = TutorialQuestionStep | "sports" | "schedule";

export type TutorialStepConfig = {
  backLabel: string;
  headerTitle: string;
  titleLines: string[];
  description: string;
  progressRatio: number;
  centeredOptions: boolean;
  options: TutorialOption[];
};
