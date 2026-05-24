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

    return Array.isArray(res.data) ? res.data : res.data.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (isAxiosError(error)) {
      const errorBody = getBackendErrorBody(error.response?.data);

      if (errorBody?.code === 4000) {
        throw new ApiError("?곗씠?곕쿋?댁뒪 ?곌껐???ㅽ뙣?섏??듬땲??");
      }

      if (error.response?.status === 400) {
        throw new ApiError(errorBody?.message ?? "?섎せ???붿껌?낅땲??");
      }

      if (error.response?.status === 500) {
        throw new ApiError("?쒕쾭 ?대? ?ㅻ쪟", "Internal server error");
      }

      if (errorBody?.message) {
        throw new ApiError(errorBody.message);
      }
    }

    throw new ApiError("매칭 현황을 불러오지 못했습니다.");
  }
}

const MOCK_MATCH_HISTORY: MatchHistoryEntry[] = [
  {
    id: 5,
    type: "GATHERING",
    status: "COMPLETED",
    role: "GUEST",
    partnerName: "김단국",
    partnerProfileImageUrl: null,
    partnerDepartment: "소프트웨어학과",
    partnerStudentNumber: "32201234",
    location: "체육관",
    sportType: "풋살",
    scheduledAt: "2026-04-04T19:00:00+09:00",
    matchedAt: null,
    reviewed: false,
  },
  {
    id: 2,
    type: "PARTNER",
    status: "COMPLETED",
    role: null,
    partnerName: "이서윤",
    partnerProfileImageUrl: null,
    partnerDepartment: "체육교육과",
    partnerStudentNumber: "32211234",
    location: null,
    sportType: null,
    scheduledAt: null,
    matchedAt: "2026-04-04T18:00:00+09:00",
    reviewed: true,
  },
  {
    id: 8,
    type: "GATHERING",
    status: "COMPLETED",
    role: "HOST",
    partnerName: "박지훈",
    partnerProfileImageUrl: null,
    partnerDepartment: "컴퓨터공학과",
    partnerStudentNumber: "32221234",
    location: "단국대 체육관",
    sportType: "배드민턴",
    scheduledAt: "2026-04-02T18:30:00+09:00",
    matchedAt: null,
    reviewed: true,
  },
  {
    id: 3,
    type: "PARTNER",
    status: "COMPLETED",
    role: null,
    partnerName: "최민준",
    partnerProfileImageUrl: null,
    partnerDepartment: "스포츠과학과",
    partnerStudentNumber: "32231234",
    location: null,
    sportType: null,
    scheduledAt: null,
    matchedAt: "2026-03-28T15:00:00+09:00",
    reviewed: false,
  },
];

export async function getMatchHistory(): Promise<MatchHistoryEntry[]> {
  try {
    const res = await apiClient.get<MatchHistoryResponse>("/api/match/history");
    return res.data.data;
  } catch {
    return MOCK_MATCH_HISTORY;
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
