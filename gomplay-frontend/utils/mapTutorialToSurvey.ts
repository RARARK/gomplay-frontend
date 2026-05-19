import {
  SURVEY_EXERCISE_INTENSITY,
  SURVEY_EXERCISE_REASON,
  SURVEY_PARTNER_STYLE,
  type SubmitSurveyInput,
  type SurveyExerciseIntensity,
  type SurveyExerciseReason,
  type SurveyPartnerStyle,
} from "@/types/domain/survey";

const PARTNER_STYLE_MAP: Record<string, SurveyPartnerStyle> = {
  quiet: SURVEY_PARTNER_STYLE.SOLO,
  talkative: SURVEY_PARTNER_STYLE.TOGETHER,
};

const INTENSITY_MAP: Record<string, SurveyExerciseIntensity> = {
  light: SURVEY_EXERCISE_INTENSITY.LIGHT,
  moderate: SURVEY_EXERCISE_INTENSITY.MODERATE,
  focused: SURVEY_EXERCISE_INTENSITY.INTENSE,
  intense: SURVEY_EXERCISE_INTENSITY.TO_THE_LIMIT,
};

const REASON_MAP: Record<string, SurveyExerciseReason> = {
  refresh: SURVEY_EXERCISE_REASON.STRESS_RELIEF,
  social: SURVEY_EXERCISE_REASON.SOCIALIZING,
  skill: SURVEY_EXERCISE_REASON.COMPETITION,
  fitness: SURVEY_EXERCISE_REASON.FITNESS,
};

const SPORT_MAP: Record<string, string> = {
  billiards: "당구",
  baseball: "야구",
  bowling: "볼링",
  bicycle: "자전거",
  running: "런닝",
  soccer: "축구",
  futsal: "풋살",
  tennis: "테니스",
  hiking: "등산",
  basketball: "농구",
  badminton: "배드민턴",
  fitness: "헬스",
};

const PARTNER_STYLE_REVERSE: Record<string, string> = {
  "각자": "quiet",
  solo: "quiet",
  SOLO: "quiet",
  "같이": "talkative",
  together: "talkative",
  TOGETHER: "talkative",
};

const INTENSITY_REVERSE: Record<string, string> = {
  "가볍게": "light",
  light: "light",
  LIGHT: "light",
  "적당히": "moderate",
  moderate: "moderate",
  MODERATE: "moderate",
  "제대로": "focused",
  intense: "focused",
  INTENSE: "focused",
  "한계까지": "intense",
  "to the limit": "intense",
  TO_THE_LIMIT: "intense",
};

const REASON_REVERSE: Record<string, string> = {
  "스트레스": "refresh",
  "stress relief": "refresh",
  STRESS_RELIEF: "refresh",
  "친해지려고": "social",
  socializing: "social",
  SOCIALIZING: "social",
  "경쟁": "skill",
  competition: "skill",
  COMPETITION: "skill",
  "체력": "fitness",
  fitness: "fitness",
  FITNESS: "fitness",
};

const SPORT_REVERSE: Record<string, string> = {
  "자전거": "bicycle",
  cycling: "bicycle",
  CYCLING: "bicycle",
  "헬스": "fitness",
  gym: "fitness",
  GYM: "fitness",
  "당구": "billiards",
  BILLIARDS: "billiards",
  "야구": "baseball",
  BASEBALL: "baseball",
  "볼링": "bowling",
  BOWLING: "bowling",
  "런닝": "running",
  RUNNING: "running",
  "축구": "soccer",
  SOCCER: "soccer",
  "풋살": "futsal",
  FUTSAL: "futsal",
  "테니스": "tennis",
  TENNIS: "tennis",
  "등산": "hiking",
  HIKING: "hiking",
  "농구": "basketball",
  BASKETBALL: "basketball",
  "배드민턴": "badminton",
  BADMINTON: "badminton",
};

export type TutorialSelections = {
  exerciseStyle: string | null;
  intensity: string | null;
  motivation: string | null;
  sports: string[];
};

export function mapSurveyToTutorial(survey: {
  partnerStyle: string;
  exerciseIntensity: string;
  exerciseReason: string;
  exerciseTypes: string[];
}): TutorialSelections {
  return {
    exerciseStyle: PARTNER_STYLE_REVERSE[survey.partnerStyle] ?? survey.partnerStyle,
    intensity: INTENSITY_REVERSE[survey.exerciseIntensity] ?? survey.exerciseIntensity,
    motivation: REASON_REVERSE[survey.exerciseReason] ?? survey.exerciseReason,
    sports: survey.exerciseTypes.map((t) => SPORT_REVERSE[t] ?? t),
  };
}

export function mapTutorialToSurvey(
  selections: TutorialSelections,
): SubmitSurveyInput | null {
  const partnerStyle = selections.exerciseStyle
    ? PARTNER_STYLE_MAP[selections.exerciseStyle]
    : null;
  const exerciseIntensity = selections.intensity
    ? INTENSITY_MAP[selections.intensity]
    : null;
  const exerciseReason = selections.motivation
    ? REASON_MAP[selections.motivation]
    : null;

  if (!partnerStyle || !exerciseIntensity || !exerciseReason) return null;

  return {
    partnerStyle,
    exerciseIntensity,
    exerciseReason,
    exerciseTypes: selections.sports.map((s) => SPORT_MAP[s] ?? s),
  };
}
