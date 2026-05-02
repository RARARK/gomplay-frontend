import { isAxiosError } from "axios";

import apiClient, { ApiError } from "@/lib/api/client";
import type { ApiResponse } from "@/types/auth/auth";
import type { SubmitSurveyInput, Survey } from "@/types/domain/survey";

type SurveyApiResponse = ApiResponse<Survey> | Survey;

type BackendErrorBody = {
  code?: number;
  message?: string;
};

const getBackendErrorBody = (value: unknown): BackendErrorBody | null => {
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  return {
    code: typeof record.code === "number" ? record.code : undefined,
    message: typeof record.message === "string" ? record.message : undefined,
  };
};

const isApiResponse = (value: SurveyApiResponse): value is ApiResponse<Survey> =>
  "data" in value;

const unwrapSurveyResponse = (value: SurveyApiResponse): Survey => {
  if (isApiResponse(value)) return value.data;
  return value;
};

const toSurveyApiError = (error: unknown, fallbackMessage: string): Error => {
  if (error instanceof ApiError) return error;

  if (isAxiosError(error)) {
    const errorBody = getBackendErrorBody(error.response?.data);

    if (errorBody?.code === 4000) {
      return new ApiError("데이터베이스 연결에 실패하였습니다.");
    }

    if (error.response?.status === 400) {
      return new ApiError(errorBody?.message ?? fallbackMessage);
    }

    if (error.response?.status === 500) {
      return new ApiError("서버 내부 오류", "Internal server error");
    }
  }

  return error instanceof Error ? error : new ApiError(fallbackMessage);
};

export async function getSurvey(): Promise<Survey> {
  try {
    const response = await apiClient.get<SurveyApiResponse>("/api/survey");
    return unwrapSurveyResponse(response.data);
  } catch (err) {
    throw toSurveyApiError(err, "설문 정보를 찾을 수 없습니다.");
  }
}

export async function submitSurvey(input: SubmitSurveyInput): Promise<Survey> {
  try {
    const response = await apiClient.post<SurveyApiResponse>("/api/survey", input);
    return unwrapSurveyResponse(response.data);
  } catch (err) {
    throw toSurveyApiError(err, "설문 제출에 실패했습니다.");
  }
}

export async function updateSurvey(input: SubmitSurveyInput): Promise<Survey> {
  try {
    const response = await apiClient.patch<SurveyApiResponse>("/api/survey", input);
    return unwrapSurveyResponse(response.data);
  } catch (err) {
    throw toSurveyApiError(err, "설문 수정에 실패했습니다.");
  }
}
