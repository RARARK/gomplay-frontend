import { isAxiosError } from "axios";

import apiClient, { ApiError } from "@/lib/api/client";
import type { ReceivedReview, ReviewRequest, ReviewResponse } from "@/types/domain/review";

export async function submitReview(input: ReviewRequest): Promise<ReviewResponse> {
  try {
    const response = await apiClient.post<ReviewResponse>("/api/review", input);
    return response.data;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (isAxiosError(err)) {
      const msg = (err.response?.data as { message?: string })?.message;
      throw new ApiError(msg ?? `제출 실패 (${err.response?.status ?? "unknown"})`);
    }
    throw err;
  }
}

export async function getMyReviews(): Promise<ReceivedReview[]> {
  const response = await apiClient.get<ReceivedReview[]>("/api/review");
  return response.data;
}
