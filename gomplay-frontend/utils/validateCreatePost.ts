import {
  POST_DIFFICULTY,
  type CreatePostFieldError,
  type CreatePostInput,
} from "@/types/domain/post";

const DIFFICULTY_VALUES = new Set(Object.values(POST_DIFFICULTY));

const isBlank = (value?: string) => !value || value.trim().length === 0;

export const validateCreatePostInput = (
  input: Partial<CreatePostInput>,
  now = new Date(),
): CreatePostFieldError => {
  const errors: CreatePostFieldError = {};

  if (isBlank(input.exerciseType)) {
    errors.exerciseType = "운동 종목을 선택해주세요.";
  }

  if (isBlank(input.location)) {
    errors.location = "운동 장소를 입력해주세요.";
  }

  if (isBlank(input.scheduledStartAt)) {
    errors.scheduledStartAt = "운동 시작 시간을 설정해주세요.";
  }

  if (isBlank(input.scheduledEndAt)) {
    errors.scheduledEndAt = "운동 종료 시간을 설정해주세요.";
  }

  if (typeof input.capacity !== "number" || Number.isNaN(input.capacity)) {
    errors.capacity = "모집 인원을 입력해주세요.";
  } else if (input.capacity < 1) {
    errors.capacity = "모집 인원은 1명 이상이어야 합니다.";
  }

  if (!input.difficulty || !DIFFICULTY_VALUES.has(input.difficulty)) {
    errors.difficulty = "운동 난이도를 선택해주세요.";
  }

  const startAt = input.scheduledStartAt
    ? new Date(input.scheduledStartAt)
    : null;
  const endAt = input.scheduledEndAt ? new Date(input.scheduledEndAt) : null;

  if (startAt && Number.isNaN(startAt.getTime())) {
    errors.scheduledStartAt = "운동 시작 시간을 올바르게 입력해주세요.";
  } else if (startAt && startAt <= now) {
    errors.scheduledStartAt = "시작 시간은 현재 이후여야 합니다.";
  }

  if (endAt && Number.isNaN(endAt.getTime())) {
    errors.scheduledEndAt = "운동 종료 시간을 올바르게 입력해주세요.";
  } else if (startAt && endAt && endAt <= startAt) {
    errors.scheduledEndAt = "종료 시간은 시작 시간 이후여야 합니다.";
  }

  return errors;
};

export const canCreatePost = (
  input: Partial<CreatePostInput>,
  now = new Date(),
) => Object.keys(validateCreatePostInput(input, now)).length === 0;
