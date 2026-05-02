import { isAxiosError } from "axios";

import apiClient, { ApiError } from "@/lib/api/client";
import type {
  CreateGatheringRequest,
  CreateGatheringResponse,
  GatheringListQuery,
  GatheringListResponse,
  GatheringPostDetailResponse,
  UpdateGatheringRequest,
  UpdateGatheringResponse,
} from "@/types/domain/gathering";

type BackendErrorBody = {
  code?: number;
  message?: string;
};

type JoinGatheringResponse = {
  success: boolean;
  message: string;
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

export async function getGatheringPosts(
  query: GatheringListQuery = {},
): Promise<GatheringListResponse> {
  try {
    const res = await apiClient.get<GatheringListResponse>("/api/gathering", {
      params: query,
    });
    return res.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (isAxiosError(error)) {
      const errorBody = getBackendErrorBody(error.response?.data);

      if (errorBody?.code === 4000) {
        throw new ApiError("데이터베이스 연결에 실패하였습니다.");
      }

      if (error.response?.status === 400) {
        throw new ApiError(errorBody?.message ?? "필터 조건을 다시 확인해주세요.");
      }

      if (error.response?.status === 401) {
        throw new ApiError(errorBody?.message ?? "로그인이 필요합니다.");
      }

      if (error.response?.status === 403) {
        throw new ApiError(errorBody?.message ?? "모집글 목록을 조회할 권한이 없습니다.");
      }

      if (error.response?.status === 404) {
        throw new ApiError(errorBody?.message ?? "모집글 목록 API를 찾을 수 없습니다.");
      }

      if (error.response?.status === 500) {
        throw new ApiError("서버 내부 오류", "Internal server error");
      }

      if (errorBody?.message) {
        throw new ApiError(errorBody.message);
      }

      if (typeof error.response?.status === "number") {
        throw new ApiError(`모집글 목록 조회 실패 (${error.response.status})`);
      }
    }

    throw new ApiError("모집글 목록을 불러올 수 없습니다.");
  }
}

export async function getGatheringDetail(
  postId: number,
): Promise<GatheringPostDetailResponse> {
  try {
    const res = await apiClient.get<GatheringPostDetailResponse>(
      `/api/gathering/${postId}`,
    );
    return res.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (isAxiosError(error)) {
      const errorBody = getBackendErrorBody(error.response?.data);

      if (errorBody?.code === 4000) {
        throw new ApiError("데이터베이스 연결에 실패하였습니다.");
      }

      if (error.response?.status === 400 || error.response?.status === 404) {
        throw new ApiError(errorBody?.message ?? "게시글을 찾을 수 없습니다.");
      }

      if (error.response?.status === 500) {
        throw new ApiError("서버 내부 오류", "Internal server error");
      }

      if (errorBody?.message) {
        throw new ApiError(errorBody.message);
      }
    }

    throw new ApiError("게시글 정보를 불러올 수 없습니다.");
  }
}

export async function updateGathering(
  postId: number,
  body: UpdateGatheringRequest,
): Promise<UpdateGatheringResponse> {
  try {
    const res = await apiClient.patch<UpdateGatheringResponse>(
      `/api/gathering/${postId}`,
      body,
    );
    return res.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (isAxiosError(error)) {
      const errorBody = getBackendErrorBody(error.response?.data);

      if (errorBody?.code === 4000) {
        throw new ApiError("데이터베이스 연결에 실패하였습니다.");
      }

      if (error.response?.status === 400) {
        throw new ApiError(errorBody?.message ?? "게시글을 찾을 수 없습니다.");
      }

      if (error.response?.status === 403) {
        throw new ApiError(errorBody?.message ?? "본인이 작성한 모집글만 수정할 수 있습니다.");
      }

      if (error.response?.status === 404) {
        throw new ApiError(errorBody?.message ?? "게시글을 찾을 수 없습니다.");
      }

      if (error.response?.status === 500) {
        throw new ApiError("서버 내부 오류", "Internal server error");
      }

      if (errorBody?.message) {
        throw new ApiError(errorBody.message);
      }
    }

    throw new ApiError("알 수 없는 오류가 발생하였습니다.");
  }
}

export async function joinGathering(postId: number): Promise<JoinGatheringResponse> {
  try {
    const res = await apiClient.post<JoinGatheringResponse>(
      `/api/gathering/${postId}/join`,
    );
    return res.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (isAxiosError(error)) {
      const errorBody = getBackendErrorBody(error.response?.data);

      if (errorBody?.code === 4000) {
        throw new ApiError("데이터베이스 연결에 실패하였습니다.");
      }

      if (error.response?.status === 400) {
        throw new ApiError(errorBody?.message ?? "이 모집글에는 신청할 수 없습니다.");
      }

      if (error.response?.status === 500) {
        throw new ApiError("서버 내부 오류", "Internal server error");
      }

      if (errorBody?.message) {
        throw new ApiError(errorBody.message);
      }
    }

    throw new ApiError("참여 신청에 실패했습니다.");
  }
}

export async function deleteGathering(postId: number): Promise<void> {
  try {
    await apiClient.delete(`/api/gathering/${postId}`);
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (isAxiosError(error)) {
      const errorBody = getBackendErrorBody(error.response?.data);

      if (errorBody?.code === 4000) {
        throw new ApiError("데이터베이스 연결에 실패하였습니다.");
      }

      if (error.response?.status === 400) {
        throw new ApiError(
          errorBody?.message ?? "게시글을 찾을 수 없습니다.",
        );
      }

      if (error.response?.status === 500) {
        throw new ApiError("서버 내부 오류", "Internal server error");
      }
    }

    throw new ApiError("알 수 없는 오류가 발생하였습니다.");
  }
}
