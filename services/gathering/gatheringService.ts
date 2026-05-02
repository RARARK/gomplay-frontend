import { isAxiosError } from "axios";

import apiClient, { ApiError } from "@/lib/api/client";
import type {
  CreateGatheringRequest,
  CreateGatheringResponse,
} from "@/types/domain/gathering";

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

export async function createGathering(
  body: CreateGatheringRequest,
): Promise<CreateGatheringResponse> {
  try {
    const res = await apiClient.post<CreateGatheringResponse>(
      "/api/gathering",
      body,
    );

    const responseErrorBody = getBackendErrorBody(res.data);
    if (responseErrorBody?.code === 4000) {
      throw new ApiError("데이터베이스 연결에 실패하였습니다.");
    }

    return res.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (isAxiosError(error)) {
      const errorBody = getBackendErrorBody(error.response?.data);

      if (errorBody?.code === 4000) {
        throw new ApiError("데이터베이스 연결에 실패하였습니다.");
      }

      if (error.response?.status === 400) {
        throw new ApiError(
          errorBody?.message ?? "모집 정보를 다시 확인해주세요.",
        );
      }

      if (error.response?.status === 500) {
        throw new ApiError("서버 내부 오류", "Internal server error");
      }

      throw new ApiError(errorBody?.message ?? "모집글을 생성할 수 없습니다.");
    }

    throw new ApiError("알 수 없는 오류가 발생하였습니다.");
  }
}
