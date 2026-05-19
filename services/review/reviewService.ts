import apiClient from "@/lib/api/client";
import type { ApiResponse } from "@/types/auth/auth";
import type { ReceivedReview, ReviewRequest, ReviewResponse } from "@/types/domain/review";

export async function submitReview(input: ReviewRequest): Promise<ReviewResponse> {
  const response = await apiClient.post<ApiResponse<ReviewResponse>>(
    "/api/review",
    input,
  );
  return response.data.data;
}

export async function getMyReviews(): Promise<ReceivedReview[]> {
  const response = await apiClient.get<ReceivedReview[]>("/api/review");
  return response.data;
}
