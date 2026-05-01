import { POST_DIFFICULTY, type PostDifficulty } from "@/types/domain/post";

export type CreatePostFormState = {
  title: string;
  exerciseType: string;
  location: string;
  scheduledStartAt: Date;
  scheduledEndAt: Date;
  capacity: number;
  message: string;
  difficulty: PostDifficulty;
};

export const CREATE_POST_TITLE = "매칭 등록";
export const CREATE_POST_DEFAULT_LOCATION = "단국대학교";
export const CREATE_POST_RECOMMENDED_LOCATION = "서양대 체육관 실내";
export const CREATE_POST_USE_CURRENT_LOCATION = "서양대 체육관 본관 앞";
export const CREATE_POST_MAX_TAG_SELECTION = 3;

export const CREATE_POST_EXERCISE_OPTIONS = [
  "당구",
  "야구",
  "볼링",
  "자전거",
  "러닝",
  "축구",
  "풋살",
  "테니스",
  "등산",
  "농구",
  "배드민턴",
  "헬스",
] as const;

export const CREATE_POST_TAG_OPTIONS = [
  "#조용함",
  "#초보만",
  "#경험없음",
  "#말많음",
  "#여유있게",
  "#아침운동",
  "#비슷하게",
  "#가볍게",
  "#친목환영",
  "#시간맞춤",
] as const;

export const CREATE_POST_DIFFICULTY_LABELS: Record<PostDifficulty, string> = {
  [POST_DIFFICULTY.BEGINNER]: "완전 초보",
  [POST_DIFFICULTY.EASY]: "가볍게",
  [POST_DIFFICULTY.NORMAL]: "보통",
  [POST_DIFFICULTY.HARD]: "강하게",
};

export const CREATE_POST_DIFFICULTY_CHOICE_OPTIONS = [
  {
    label: CREATE_POST_DIFFICULTY_LABELS[POST_DIFFICULTY.BEGINNER],
    value: POST_DIFFICULTY.BEGINNER,
  },
  {
    label: CREATE_POST_DIFFICULTY_LABELS[POST_DIFFICULTY.EASY],
    value: POST_DIFFICULTY.EASY,
  },
  {
    label: CREATE_POST_DIFFICULTY_LABELS[POST_DIFFICULTY.NORMAL],
    value: POST_DIFFICULTY.NORMAL,
  },
  {
    label: CREATE_POST_DIFFICULTY_LABELS[POST_DIFFICULTY.HARD],
    value: POST_DIFFICULTY.HARD,
  },
] as const;
