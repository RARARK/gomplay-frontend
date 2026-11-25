import { isAxiosError } from "axios";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

import apiClient, { ApiError } from "@/lib/api/client";
import type { ApiResponse } from "@/types/auth/auth";
import type {
  UpdateProfileRequest,
  UpdateProfileResponse,
  UserProfile,
} from "@/types/domain/user";

type ProfileApiResponse = ApiResponse<UserProfile> | UserProfile;

const unwrapProfileResponse = (value: ProfileApiResponse): UserProfile =>
  "data" in value ? (value as ApiResponse<UserProfile>).data : (value as UserProfile);

export type OpponentProfile = {
  id: number;
  name: string;
  department: string;
  studentId: string;
  mannerTemperature: number;
  exerciseTypes?: string[];
  partnerStyle?: string;
  exerciseIntensity?: string;
  exerciseReason?: string;
  matchCount?: number;
  noShowCount?: number;
};

export async function getUserProfile(userProfileId: number): Promise<OpponentProfile> {
  try {
    const res = await apiClient.get<OpponentProfile>(`/api/user/${userProfileId}/profile`);
    return res.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (isAxiosError(error) && error.response?.status === 400) {
      throw new ApiError("유저를 찾을 수 없습니다.");
    }
    throw new ApiError("프로필을 불러올 수 없습니다.");
  }
}

export async function getMyProfile(): Promise<UserProfile> {
  try {
    const res = await apiClient.get<ProfileApiResponse>("/api/user/me/profile");
    return unwrapProfileResponse(res.data);
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

type UploadProfileImageResponse = {
  profileImageUrl: string;
};

type UploadProfileImageOptions = {
  fileName?: string | null;
  mimeType?: string | null;
};

const getProfileImageFileName = (
  uri: string,
  fileName?: string | null,
): string => {
  if (fileName) return fileName;

  const uriFileName = uri.split("/").pop();
  if (uriFileName?.includes(".")) return uriFileName;

  return "profile.jpg";
};

const getProfileImageMimeType = (
  fileName: string,
  mimeType?: string | null,
): string => {
  if (mimeType) return mimeType;

  const extension = fileName.split(".").pop()?.toLowerCase();
  if (extension === "png") return "image/png";
  if (extension === "webp") return "image/webp";

  return "image/jpeg";
};

// 프로필 사진은 화면에서 작은 원형으로만 쓰이므로 긴 변 512px JPEG면 충분하다.
const PROFILE_IMAGE_MAX_SIZE = 512;
const PROFILE_IMAGE_COMPRESS_QUALITY = 0.8;

/**
 * 업로드 전에 프로필 사진을 줄이고 JPEG로 다시 저장한다.
 * 실패하면 null을 반환해 원본 그대로 업로드하도록 한다.
 */
async function prepareProfileImage(uri: string): Promise<string | null> {
  try {
    const original = await ImageManipulator.manipulate(uri).renderAsync();
    const isOversized =
      Math.max(original.width, original.height) > PROFILE_IMAGE_MAX_SIZE;
    const image = isOversized
      ? await ImageManipulator.manipulate(uri)
          .resize(
            original.width >= original.height
              ? { width: PROFILE_IMAGE_MAX_SIZE }
              : { height: PROFILE_IMAGE_MAX_SIZE },
          )
          .renderAsync()
      : original;
    const saved = await image.saveAsync({
      compress: PROFILE_IMAGE_COMPRESS_QUALITY,
      format: SaveFormat.JPEG,
    });
    return saved.uri;
  } catch {
    return null;
  }
}

export async function uploadProfileImage(
  sourceUri: string,
  options: UploadProfileImageOptions = {},
): Promise<string> {
  const preparedUri = await prepareProfileImage(sourceUri);
  const uri = preparedUri ?? sourceUri;
  const name = preparedUri
    ? "profile.jpg"
    : getProfileImageFileName(uri, options.fileName);
  const type = preparedUri
    ? "image/jpeg"
    : getProfileImageMimeType(name, options.mimeType);
  const formData = new FormData();
  formData.append("file", {
    uri,
    type,
    name,
  } as unknown as Blob);

  try {
    const res = await apiClient.post<UploadProfileImageResponse>(
      "/api/user/me/profile-image",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data.profileImageUrl;
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
