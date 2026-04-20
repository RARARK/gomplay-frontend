import type { Review, ReviewStatus } from "@/types/domain/review";

export async function createReview(input: {
  matchId: number;
  score: number;
  isNoShow?: boolean;
  comment?: string;
}): Promise<{ reviewId: number; matchId: number; status: ReviewStatus }> {
  return {
    reviewId: 501,
    matchId: input.matchId,
    status: "SUBMITTED",
  };
}

export async function getReviewStatus(matchId: number): Promise<{
  matchId: number;
  matchStatus: string;
  myReviewStatus: ReviewStatus;
  partnerReviewSubmitted: boolean;
}> {
  return {
    matchId,
    matchStatus: "COMPLETED",
    myReviewStatus: "PENDING",
    partnerReviewSubmitted: false,
  };
}

export async function getReviewByMatchId(
  matchId: number,
): Promise<Review | null> {
  return null;
}
