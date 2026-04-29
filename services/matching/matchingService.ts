import {
  MATCH_STATUS,
  type CompleteMatchContext,
  type CompleteMatchInput,
  type CompleteMatchResult,
  type Match,
} from "@/types/domain/match";
import { getCompleteMatchErrorMessage } from "@/utils/completeMatchPolicy";

export async function getActiveMatches(): Promise<Match[]> {
  return [
    {
      id: 55,
      hostUserId: 1,
      guestUserId: 2,
      sourceType: "APPLICATION",
      sourceId: 101,
      status: "IN_PROGRESS",
      scheduledStartAt: "2026-04-10T18:00:00",
      scheduledEndAt: "2026-04-10T19:30:00",
      createdAt: "2026-04-10T17:00:00",
    },
  ];
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
