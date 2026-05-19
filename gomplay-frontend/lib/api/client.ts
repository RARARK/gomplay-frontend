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

const apiClient = axios.create({
  baseURL: "http://3.38.165.56:8080",
  headers: { "Content-Type": "application/json" },
});

// Inject Bearer token from auth store on every request
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
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
