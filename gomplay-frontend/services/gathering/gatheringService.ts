import { isAxiosError } from "axios";

import apiClient, { ApiError } from "@/lib/api/client";
import { useAuthStore } from "@/stores/auth/authStore";
import { POST_STATUS } from "@/types/domain/post";
import type {
  AcceptParticipantResponse,
  CreateGatheringRequest,
  CreateGatheringResponse,
  GatheringHistoryItem,
  GatheringListQuery,
  GatheringListResponse,
  GatheringParticipant,
  GatheringPostDetailResponse,
  GatheringRecommendItem,
  JoinGatheringResponse,
  RejectParticipantResponse,
  ReviewableGatheringParticipant,
  UpdateGatheringRequest,
  UpdateGatheringResponse,
} from "@/types/domain/gathering";

type BackendErrorBody = {
  code?: number;
  message?: string;
};

const decodeJwtPayload = (token: string | null): Record<string, unknown> | null => {
  if (!token) return null;

  const payload = token.split(".")[1];
  if (!payload) return null;

  try {
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const decoded = globalThis.atob(padded);

    try {
      return JSON.parse(
        decodeURIComponent(
          decoded
            .split("")
            .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
            .join(""),
        ),
      ) as Record<string, unknown>;
    } catch {
      return JSON.parse(decoded) as Record<string, unknown>;
    }
  } catch {
    return null;
  }
};

const getAuthDebugSnapshot = () => {
  const { userId, isLoggedIn, accessToken } = useAuthStore.getState();
  const payload = decodeJwtPayload(accessToken);

  return {
    storeUserId: userId,
    isLoggedIn,
    hasAccessToken: Boolean(accessToken),
    tokenLength: accessToken?.length ?? 0,
    tokenPreview: accessToken
      ? `${accessToken.slice(0, 12)}...${accessToken.slice(-8)}`
      : null,
    jwtSub: payload?.sub,
    jwtUserId: payload?.userId ?? payload?.id ?? payload?.memberId,
    jwtExp: payload?.exp,
  };
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
      params: { hideExpired: true, ...query },
    });
    const openContent = res.data.content.filter(
      (item) => item.status === POST_STATUS.OPEN,
    );

    return {
      ...res.data,
      content: openContent,
      empty: openContent.length === 0,
      numberOfElements: openContent.length,
    };
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
    console.log("[gatheringService] update gathering request", {
      postId,
      body,
      auth: getAuthDebugSnapshot(),
    });
    const res = await apiClient.patch<UpdateGatheringResponse>(
      `/api/gathering/${postId}`,
      body,
    );
    console.log("[gatheringService] update gathering success", {
      postId,
      status: res.status,
      responseData: res.data,
    });
    return res.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (isAxiosError(error)) {
      const errorBody = getBackendErrorBody(error.response?.data);
      console.log("[gatheringService] update gathering error", {
        postId,
        body,
        auth: getAuthDebugSnapshot(),
        status: error.response?.status,
        responseData: error.response?.data,
      });

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

export async function completeGathering(gatheringId: number): Promise<void> {
  try {
    await apiClient.patch(`/api/gathering/${gatheringId}/complete`);
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (isAxiosError(error)) {
      const errorBody = getBackendErrorBody(error.response?.data);

      if (errorBody?.code === 4000) {
        throw new ApiError("데이터베이스 연결에 실패하였습니다.");
      }

      if (error.response?.status === 400) {
        throw new ApiError(
          errorBody?.message ?? "모집글 또는 참여자 정보를 찾을 수 없습니다.",
        );
      }

      if (error.response?.status === 500) {
        throw new ApiError("서버 내부 오류", "Internal server error");
      }

      if (errorBody?.message) {
        throw new ApiError(errorBody.message);
      }
    }

    throw new ApiError("운동 완료 처리에 실패했습니다.");
  }
}

export async function boostGathering(gatheringId: number): Promise<void> {
  try {
    await apiClient.post(`/api/gathering/${gatheringId}/boost`);
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (isAxiosError(error)) {
      const errorBody = getBackendErrorBody(error.response?.data);

      if (errorBody?.code === 4000) {
        throw new ApiError("데이터베이스 연결에 실패하였습니다.");
      }

      if (error.response?.status === 400) {
        throw new ApiError(
          errorBody?.message ?? "모집글을 부스트할 수 없습니다.",
        );
      }

      if (error.response?.status === 500) {
        throw new ApiError("서버 내부 오류", "Internal server error");
      }

      if (errorBody?.message) {
        throw new ApiError(errorBody.message);
      }
    }

    throw new ApiError("모집글 부스트에 실패했습니다.");
  }
}

export async function getGatheringParticipants(
  gatheringId: number,
): Promise<GatheringParticipant[]> {
  try {
    const res = await apiClient.get<GatheringParticipant[]>(
      `/api/gathering/${gatheringId}/participants`,
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
        throw new ApiError(
          errorBody?.message ?? "모집글 작성자만 조회할 수 있습니다.",
        );
      }

      if (error.response?.status === 403) {
        throw new ApiError(
          errorBody?.message ?? "신청자 목록을 조회할 권한이 없습니다.",
        );
      }

      if (error.response?.status === 404) {
        throw new ApiError(errorBody?.message ?? "모집글을 찾을 수 없습니다.");
      }

      if (error.response?.status === 500) {
        throw new ApiError("서버 내부 오류", "Internal server error");
      }

      if (errorBody?.message) {
        throw new ApiError(errorBody.message);
      }
    }

    throw new ApiError("신청자 목록을 불러올 수 없습니다.");
  }
}

export async function acceptParticipant(
  gatheringId: number,
  participantId: number,
): Promise<AcceptParticipantResponse> {
  try {
    const res = await apiClient.patch<AcceptParticipantResponse>(
      `/api/gathering/${gatheringId}/participants/${participantId}/accept`,
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
        throw new ApiError(
          errorBody?.message ?? "이미 처리된 신청이거나 모집이 마감되었습니다.",
        );
      }

      if (error.response?.status === 403) {
        throw new ApiError(
          errorBody?.message ?? "모집글 작성자만 신청을 수락할 수 있습니다.",
        );
      }

      if (error.response?.status === 404) {
        throw new ApiError(
          errorBody?.message ?? "모집글 또는 신청 내역을 찾을 수 없습니다.",
        );
      }

      if (error.response?.status === 500) {
        throw new ApiError("서버 내부 오류", "Internal server error");
      }

      if (errorBody?.message) {
        throw new ApiError(errorBody.message);
      }
    }

    throw new ApiError("신청 수락에 실패했습니다.");
  }
}

export async function rejectParticipant(
  gatheringId: number,
  participantId: number,
): Promise<RejectParticipantResponse> {
  try {
    const res = await apiClient.patch<RejectParticipantResponse>(
      `/api/gathering/${gatheringId}/participants/${participantId}/reject`,
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
        throw new ApiError(
          errorBody?.message ?? "모집글 작성자만 거절할 수 있습니다.",
        );
      }

      if (error.response?.status === 500) {
        throw new ApiError("서버 내부 오류", "Internal server error");
      }

      if (errorBody?.message) {
        throw new ApiError(errorBody.message);
      }
    }

    throw new ApiError("신청 거절에 실패했습니다.");
  }
}

export async function getGatheringRecommendations(): Promise<GatheringRecommendItem[]> {
  try {
    const res = await apiClient.get<GatheringRecommendItem[]>("/api/gathering/recommend", {
      headers: { "Cache-Control": "no-cache" },
    });
    const now = Date.now();
    return res.data.filter(
      (item) =>
        item.status === POST_STATUS.OPEN &&
        new Date(item.scheduledAt).getTime() > now,
    );
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (isAxiosError(error)) {
      const errorBody = getBackendErrorBody(error.response?.data);

      if (errorBody?.code === 4000) {
        throw new ApiError("데이터베이스 연결에 실패하였습니다.");
      }

      if (error.response?.status === 400) {
        throw new ApiError(errorBody?.message ?? "유저를 찾을 수 없습니다.");
      }

      if (error.response?.status === 500) {
        throw new ApiError("서버 내부 오류", "Internal server error");
      }

      if (errorBody?.message) {
        throw new ApiError(errorBody.message);
      }
    }

    throw new ApiError("추천 모집글을 불러올 수 없습니다.");
  }
}

export async function getGatheringHistory(): Promise<GatheringHistoryItem[]> {
  try {
    const res = await apiClient.get<GatheringHistoryItem[]>("/api/gathering/history");
    return res.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (isAxiosError(error)) {
      const errorBody = getBackendErrorBody(error.response?.data);

      if (error.response?.status === 500) {
        throw new ApiError("서버 내부 오류", "Internal server error");
      }

      if (errorBody?.message) {
        throw new ApiError(errorBody.message);
      }
    }

    throw new ApiError("히스토리를 불러올 수 없습니다.");
  }
}

export async function getReviewableGatheringParticipants(
  gatheringId: number,
): Promise<ReviewableGatheringParticipant[]> {
  try {
    const res = await apiClient.get<ReviewableGatheringParticipant[]>(
      `/api/gathering/${gatheringId}/participants/reviewable`,
    );
    return res.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (isAxiosError(error)) {
      const errorBody = getBackendErrorBody(error.response?.data);

      if (errorBody?.code === 4000) {
        throw new ApiError("데이터베이스 연결에 실패하였습니다.");
      }

      if (error.response?.status === 500) {
        throw new ApiError("서버 내부 오류", "Internal server error");
      }

      if (errorBody?.message) {
        throw new ApiError(errorBody.message);
      }
    }

    throw new ApiError("평가 가능한 참여자 목록을 불러올 수 없습니다.");
  }
}

export async function deleteGathering(postId: number): Promise<string> {
  const endpoint = `/api/gathering/${postId}`;
  try {
    console.log("[gatheringService] delete gathering request", {
      postId,
      method: "DELETE",
      endpoint,
      auth: getAuthDebugSnapshot(),
    });
    const res = await apiClient.delete<string>(endpoint);
    console.log("[gatheringService] delete gathering success", {
      postId,
      status: res.status,
      responseData: res.data,
    });
    return res.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (isAxiosError(error)) {
      const errorBody = getBackendErrorBody(error.response?.data);
      console.log("[gatheringService] delete gathering error", {
        postId,
        method: "DELETE",
        endpoint,
        auth: getAuthDebugSnapshot(),
        status: error.response?.status,
        responseHeaders: error.response?.headers,
        responseData: error.response?.data,
        requestHeaders: error.config?.headers,
        requestUrl: error.config?.url,
        requestBaseUrl: error.config?.baseURL,
      });

      if (errorBody?.code === 4000) {
        throw new ApiError("데이터베이스 연결에 실패하였습니다.");
      }

      if (error.response?.status === 400) {
        throw new ApiError(
          errorBody?.message ?? "게시글을 찾을 수 없습니다.",
        );
      }

      if (error.response?.status === 403) {
        throw new ApiError(
          errorBody?.message ?? "모집글 작성자만 취소할 수 있습니다.",
        );
      }

      if (error.response?.status === 404) {
        throw new ApiError(
          errorBody?.message ?? "모집글을 찾을 수 없습니다.",
        );
      }

      if (error.response?.status === 500) {
        throw new ApiError("서버 내부 오류", "Internal server error");
      }

      if (errorBody?.message) {
        throw new ApiError(errorBody.message);
      }
    }

    throw new ApiError("매칭 취소에 실패했습니다.");
  }
}
