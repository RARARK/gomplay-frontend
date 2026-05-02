import { isAxiosError } from "axios";

import apiClient, { ApiError } from "@/lib/api/client";
import type {
  ApiResponse,
  LoginResponseData,
  ResendVerificationRequest,
  SignupRequest,
  SignupResponseData,
  VerifyEmailRequest,
} from "@/types/auth/auth";

// Re-export so screens importing AuthError don't need to change
export { ApiError as AuthError };

export async function login(
  schoolEmail: string,
  password: string
): Promise<LoginResponseData> {
  try {
    const res = await apiClient.post<ApiResponse<LoginResponseData>>(
      "/api/auth/login",
      { schoolEmail, password }
    );
    const data = res.data?.data;
    if (!data) throw new ApiError("로그인 응답 데이터가 올바르지 않습니다.");
    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (isAxiosError(error) && error.response?.status === 400) {
      throw new ApiError("로그인에 실패하였습니다.");
    }
    throw new ApiError("알 수 없는 오류가 발생하였습니다.");
  }
}

export async function logout(): Promise<void> {
  // Authorization header is injected automatically by the axios interceptor.
  // Always resolves — caller must clear local auth state regardless of result.
  await apiClient.post<ApiResponse<null>>("/api/auth/logout").catch(() => {});
}

export async function verifyEmail(token: string): Promise<string> {
  try {
    const res = await apiClient.post<ApiResponse<null>>(
      "/api/auth/verify-email",
      { token } satisfies VerifyEmailRequest
    );
    return res.data.message;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (isAxiosError(error) && error.response?.status === 400) {
      throw new ApiError("인증 코드가 올바르지 않습니다.");
    }
    throw new ApiError("알 수 없는 오류가 발생하였습니다.");
  }
}

export async function resendVerification(schoolEmail: string): Promise<string> {
  try {
    const res = await apiClient.post<ApiResponse<null>>(
      "/api/auth/resend-verification",
      { schoolEmail } satisfies ResendVerificationRequest
    );
    return res.data.message;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (isAxiosError(error) && error.response?.status === 400) {
      throw new ApiError("인증 코드 재전송에 실패하였습니다.");
    }
    throw new ApiError("알 수 없는 오류가 발생하였습니다.");
  }
}

export async function signup(
  params: SignupRequest
): Promise<{ email: string; message: string }> {
  try {
    const res = await apiClient.post<ApiResponse<SignupResponseData>>(
      "/api/auth/signup",
      params
    );
    const email = res.data?.data?.email;
    if (!email) throw new ApiError("회원가입 응답 데이터가 올바르지 않습니다.");
    return { email, message: res.data.message };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (isAxiosError(error) && error.response?.status === 400) {
      throw new ApiError("회원가입에 실패하였습니다.");
    }
    throw new ApiError("알 수 없는 오류가 발생하였습니다.");
  }
}
