import { isAxiosError } from "axios";

import apiClient, { ApiError } from "@/lib/api/client";
import {
  MATCH_STATUS,
  type AcceptMatchRequestResponse,
  type ActiveMatch,
  type ActiveMatchesResponse,
  type CompleteMatchContext,
  type CompleteMatchInput,
  type CompleteMatchResult,
  type MatchCandidate,
  type MatchHistoryEntry,
  type MatchHistoryResponse,
  type MatchRequestBody,
  type MatchRequestResponse,
  type PassCandidateResponse,
  type RejectMatchRequestResponse,
  type ToggleMatchingRequest,
  type ToggleMatchingResponse,
} from "@/types/domain/match";
import { getCompleteMatchErrorMessage } from "@/utils/completeMatchPolicy";

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

export async function toggleMatching(
  isMatching: boolean,
): Promise<ToggleMatchingResponse> {
  const body: ToggleMatchingRequest = { isMatching };

  try {
    const res = await apiClient.patch<ToggleMatchingResponse>(
      "/api/match/toggle",
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
        throw new ApiError(errorBody?.message ?? "잘못된 요청입니다.");
      }

      if (error.response?.status === 500) {
        throw new ApiError("서버 내부 오류", "Internal server error");
      }

      if (errorBody?.message) {
        throw new ApiError(errorBody.message);
      }
    }

    throw new ApiError("매칭 상태 변경에 실패했습니다.");
  }
}

export async function requestPartnerMatch(
  opponentId: number,
): Promise<MatchRequestResponse> {
  const body: MatchRequestBody = { opponentId };

  try {
    const res = await apiClient.post<MatchRequestResponse>("/api/match/request", body);
    return res.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (isAxiosError(error)) {
      const errorBody = getBackendErrorBody(error.response?.data);

      if (errorBody?.code === 4000) {
        throw new ApiError("데이터베이스 연결에 실패하였습니다.");
      }

      if (error.response?.status === 400) {
        throw new ApiError(errorBody?.message ?? "잘못된 요청입니다.");
      }

      if (error.response?.status === 500) {
        throw new ApiError("서버 내부 오류", "Internal server error");
      }

      if (errorBody?.message) {
        throw new ApiError(errorBody.message);
      }
    }

    throw new ApiError("매칭 요청에 실패했습니다.");
  }
}

export async function acceptMatchRequest(
  matchRequestId: number,
): Promise<AcceptMatchRequestResponse> {
  try {
    const res = await apiClient.patch<AcceptMatchRequestResponse>(
      `/api/match/request/${matchRequestId}/accept`,
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
        throw new ApiError(errorBody?.message ?? "잘못된 요청입니다.");
      }

      if (error.response?.status === 500) {
        throw new ApiError("서버 내부 오류", "Internal server error");
      }

      if (errorBody?.message) {
        throw new ApiError(errorBody.message);
      }
    }

    throw new ApiError("매칭 수락에 실패했습니다.");
  }
}

export async function rejectMatchRequest(
  matchRequestId: number,
): Promise<RejectMatchRequestResponse> {
  try {
    const res = await apiClient.patch<RejectMatchRequestResponse>(
      `/api/match/request/${matchRequestId}/reject`,
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
        throw new ApiError(errorBody?.message ?? "잘못된 요청입니다.");
      }

      if (error.response?.status === 500) {
        throw new ApiError("서버 내부 오류", "Internal server error");
      }

      if (errorBody?.message) {
        throw new ApiError(errorBody.message);
      }
    }

    throw new ApiError("매칭 거절에 실패했습니다.");
  }
}

export async function passCandidate(
  excludeIds: number[],
): Promise<MatchCandidate | null> {
  try {
    const res = await apiClient.post<PassCandidateResponse>("/api/match/pass", {
      excludeIds,
    });
    return res.data.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (isAxiosError(error)) {
      const errorBody = getBackendErrorBody(error.response?.data);
      if (errorBody?.code === 4000) {
        throw new ApiError("데이터베이스 연결에 실패하였습니다.");
      }
      if (error.response?.status === 500) {
        throw new ApiError("서버 내부 오류");
      }
    }
    throw new ApiError("다음 추천을 불러오는 데 실패했습니다.");
  }
}

export async function getActiveMatches(): Promise<ActiveMatch[]> {
  try {
    const res = await apiClient.get<ActiveMatchesResponse | ActiveMatch[]>(
      "/api/match/active",
      {
        headers: { "Cache-Control": "no-cache" },
      },
    );

    const matches = Array.isArray(res.data) ? res.data : res.data.data;
    return matches;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (isAxiosError(error)) {
      const errorBody = getBackendErrorBody(error.response?.data);

      if (errorBody?.code === 4000) {
        throw new ApiError("데이터베이스 연결에 실패하였습니다.");
      }

      if (error.response?.status === 400) {
        throw new ApiError(errorBody?.message ?? "잘못된 요청입니다.");
      }

      if (error.response?.status === 500) {
        throw new ApiError("서버 내부 오류", "Internal server error");
      }

      if (errorBody?.message) {
        throw new ApiError(errorBody.message);
      }
    }

    throw new ApiError("매칭 현황을 불러오지 못했습니다.");
  }
}

export async function getMatchHistory(): Promise<MatchHistoryEntry[]> {
  try {
    const res = await apiClient.get<MatchHistoryResponse | MatchHistoryEntry[]>("/api/match/history");
    const entries = Array.isArray(res.data) ? res.data : res.data.data;
    return entries;
  } catch (error) {
    if (isAxiosError(error)) {
      const errorBody = getBackendErrorBody(error.response?.data);
      if (errorBody?.code === 4000) throw new ApiError("데이터베이스 연결에 실패하였습니다.");
      if (error.response?.status === 400) throw new ApiError(errorBody?.message ?? "유저를 찾을 수 없습니다.");
      if (error.response?.status === 500) throw new ApiError("서버 내부 오류");
    }
    throw new ApiError("매치 내역을 불러오지 못했습니다.");
  }
}

export async function completeMatch(
  input: CompleteMatchInput,
  context: CompleteMatchContext,
): Promise<CompleteMatchResult> {
  const errorMessage = getCompleteMatchErrorMessage(input, context);

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  if (
    context.status === MATCH_STATUS.END_PENDING &&
    context.endRequestedBy !== context.currentUserId
  ) {
    return {
      matchId: input.matchId,
      status: MATCH_STATUS.COMPLETED,
    };
  }

  if (context.status === MATCH_STATUS.END_PENDING) {
    return {
      matchId: input.matchId,
      status: MATCH_STATUS.COMPLETED,
    };
  }

  return {
    matchId: input.matchId,
    status: MATCH_STATUS.END_PENDING,
  };
}
