export const SURVEY_PARTNER_STYLE = {
  SOLO: "각자",
  TOGETHER: "같이",
} as const;

export type SurveyPartnerStyle =
  (typeof SURVEY_PARTNER_STYLE)[keyof typeof SURVEY_PARTNER_STYLE];

export const SURVEY_EXERCISE_INTENSITY = {
  LIGHT: "가볍게",
  MODERATE: "적당히",
  INTENSE: "제대로",
  TO_THE_LIMIT: "한계까지",
} as const;

export type SurveyExerciseIntensity =
  (typeof SURVEY_EXERCISE_INTENSITY)[keyof typeof SURVEY_EXERCISE_INTENSITY];

export const SURVEY_EXERCISE_REASON = {
  STRESS_RELIEF: "스트레스",
  SOCIALIZING: "친해지려고",
  COMPETITION: "경쟁",
  FITNESS: "체력",
} as const;

export type SurveyExerciseReason =
  (typeof SURVEY_EXERCISE_REASON)[keyof typeof SURVEY_EXERCISE_REASON];

export type SubmitSurveyInput = {
  partnerStyle: SurveyPartnerStyle;
  exerciseIntensity: SurveyExerciseIntensity;
  exerciseReason: SurveyExerciseReason;
  exerciseTypes: string[];
};

export type Survey = {
  userId: number;
  partnerStyle: SurveyPartnerStyle;
  exerciseIntensity: SurveyExerciseIntensity;
  exerciseReason: SurveyExerciseReason;
  exerciseTypes: string[];
};
