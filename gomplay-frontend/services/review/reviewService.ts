import { isAxiosError } from "axios";

import apiClient from "@/lib/api/client";
import type { ApiResponse } from "@/types/auth/auth";
import type { ReceivedReview, ReviewRequest, ReviewResponse } from "@/types/domain/review";

export async function submitReview(input: ReviewRequest): Promise<ReviewResponse> {
  console.log("[submitReview] 요청 body:", JSON.stringify(input));
  try {
    const response = await apiClient.post<ApiResponse<ReviewResponse>>(
      "/api/review",
      input,
    );
    console.log("[submitReview] 성공 응답:", JSON.stringify(response.data));
    return response.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.log("[submitReview] 에러 status:", error.response?.status);
      console.log("[submitReview] 에러 body:", JSON.stringify(error.response?.data));
    } else {
      console.log("[submitReview] 에러:", error);
    }
    throw error;
  }
}

export async function getMyReviews(): Promise<ReceivedReview[]> {
  const response = await apiClient.get<ReceivedReview[]>("/api/review");
  return response.data;
}
