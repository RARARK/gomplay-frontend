import { isAxiosError } from "axios";

import apiClient, { ApiError } from "@/lib/api/client";
import type {
  UpdateProfileRequest,
  UpdateProfileResponse,
  UserProfile,
} from "@/types/domain/user";

export async function getMyProfile(): Promise<UserProfile> {
  try {
    // Response is flat (not wrapped in ApiResponse) — fields are directly in res.data
    const res = await apiClient.get<UserProfile>("/api/user/me/profile");
    return res.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (isAxiosError(error) && error.response?.status === 400) {
      const message =
        (error.response.data as { message?: string })?.message ??
        "프로필을 찾을 수 없습니다.";
      throw new ApiError(message);
    }
    throw new ApiError("알 수 없는 오류가 발생하였습니다.");
  }
}

export async function uploadProfileImage(uri: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", {
    uri,
    type: "image/jpeg",
    name: "profile.jpg",
  } as unknown as Blob);

  try {
    const res = await apiClient.post<{ imageUrl: string }>(
      "/api/user/me/profile-image",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data.imageUrl;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (isAxiosError(error) && error.response?.status === 400) {
      throw new ApiError("이미지 업로드에 실패하였습니다.");
    }
    throw new ApiError("알 수 없는 오류가 발생하였습니다.");
  }
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<string> {
  try {
    const res = await apiClient.patch<string>("/api/user/me/password", {
      currentPassword,
      newPassword,
    });
    return res.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (isAxiosError(error) && error.response?.status === 400) {
      throw new ApiError("현재 비밀번호가 올바르지 않습니다.");
    }
    throw new ApiError("알 수 없는 오류가 발생하였습니다.");
  }
}

export async function updateMyProfile(
  body: UpdateProfileRequest
): Promise<UpdateProfileResponse> {
  try {
    // Response is flat (not wrapped in ApiResponse) — { userId, updateAt }
    const res = await apiClient.patch<UpdateProfileResponse>(
      "/api/user/me/profile",
      body
    );
    return res.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (isAxiosError(error) && error.response?.status === 400) {
      const data = error.response.data as { message?: string; code?: string };
      throw new ApiError(data.message ?? "잘못된 파라미터입니다.");
    }
    throw new ApiError("알 수 없는 오류가 발생하였습니다.");
  }
}
