import axios, { isAxiosError } from "axios";
import { router } from "expo-router";

import { useAuthStore } from "@/stores/auth/authStore";
import type { ApiResponse } from "@/types/auth/auth";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly description?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const API_BASE_URL = "http://52.78.97.182:8080";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ── 액세스 토큰 자동 재발급 ──────────────────────────────────────────────
// 액세스 토큰은 30분짜리인데, 만료된 토큰으로 요청하면 서버가 401이 아니라
// 400("프로필을 찾을 수 없습니다" 등)을 돌려준다. 그래서 응답을 보고 재발급하는
// 대신, 요청 직전에 만료 시각을 확인해 곧 만료되면 미리 재발급한다.
const REFRESH_MARGIN_MS = 60_000;

function getTokenExpiryMs(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const { exp } = JSON.parse(atob(padded)) as { exp?: unknown };
    return typeof exp === "number" ? exp * 1000 : null;
  } catch {
    return null;
  }
}

async function reissueAccessToken(): Promise<string | null> {
  const { refreshToken, userId } = useAuthStore.getState();
  if (!refreshToken) return null;

  try {
    // apiClient를 쓰면 인터셉터가 다시 재발급을 시도하므로 기본 axios로 호출한다.
    const res = await axios.post<
      ApiResponse<{ accessToken: string; refreshToken: string; userId?: number }>
    >(`${API_BASE_URL}/api/auth/reissue`, { refreshToken });
    const data = res.data?.data;
    if (!data?.accessToken || !data.refreshToken) return null;

    const current = useAuthStore.getState();
    // 재발급을 기다리는 사이 로그아웃/다른 계정 로그인이 일어났으면 반영하지 않는다
    if (current.refreshToken !== refreshToken) return current.accessToken;

    current.setAuth({
      userId: data.userId ?? userId ?? 0,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      matching: current.matching,
    });
    return data.accessToken;
  } catch {
    return null;
  }
}

function handleSessionExpired(): void {
  useAuthStore.getState().clearAuth();
  router.replace("/login");
}

let reissuePromise: Promise<string | null> | null = null;

/**
 * 유효한 액세스 토큰을 돌려준다. 곧 만료되면 재발급하고(동시 요청은 한 번만 재발급),
 * 재발급에 실패하면 로그아웃시키고 null을 돌려준다. 로그인 상태가 아니면 null.
 */
export async function getFreshAccessToken(): Promise<string | null> {
  const token = useAuthStore.getState().accessToken;
  if (!token) return null;

  const expiresAt = getTokenExpiryMs(token);
  if (expiresAt === null || expiresAt - Date.now() > REFRESH_MARGIN_MS) {
    return token;
  }

  if (!reissuePromise) {
    reissuePromise = reissueAccessToken().finally(() => {
      reissuePromise = null;
    });
  }
  const fresh = await reissuePromise;
  if (!fresh) handleSessionExpired();
  return fresh;
}

// Inject Bearer token from auth store on every request
apiClient.interceptors.request.use(async (config) => {
  const isAuthRequest = config.url?.startsWith("/api/auth/") ?? false;
  const hadToken = useAuthStore.getState().accessToken !== null;
  const token = isAuthRequest
    ? useAuthStore.getState().accessToken
    : await getFreshAccessToken();

  if (!isAuthRequest && hadToken && !token) {
    throw new ApiError("로그인이 만료되었습니다. 다시 로그인해주세요.");
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralised response error handling
apiClient.interceptors.response.use(
  (response) => {
    const data = response.data as ApiResponse<unknown> & { code?: number };

    // 200 OK but success: false — check for custom error codes
    if (data?.success === false) {
      if (data.code === 4000) {
        throw new ApiError(
          "데이터베이스 연결에 실패하였습니다.",
          "Database connection failed"
        );
      }
      throw new ApiError(data.message || "요청에 실패하였습니다.");
    }

    return response;
  },
  (error) => {
    if (!isAxiosError(error)) throw error;

    if (!error.response) {
      throw new ApiError("서버에 연결할 수 없습니다.");
    }

    if (error.response.status === 401) {
      useAuthStore.getState().clearAuth();
      router.replace("/login");
      throw new ApiError("로그인이 필요합니다.");
    }

    if (error.response.status === 500) {
      throw new ApiError("서버 내부 오류", "Internal server error");
    }

    // 400 and other HTTP errors are re-thrown for per-endpoint handling
    throw error;
  }
);

export default apiClient;
