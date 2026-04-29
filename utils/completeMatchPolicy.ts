import {
  MATCH_COMPLETE_ACTION,
  MATCH_STATUS,
  type CompleteMatchContext,
  type CompleteMatchInput,
} from "@/types/domain/match";

const TWO_HOURS_IN_MS = 2 * 60 * 60 * 1000;

export const canForceCompleteMatch = (
  scheduledEndAt?: string,
  now = new Date(),
) => {
  if (!scheduledEndAt) {
    return false;
  }

  const endAt = new Date(scheduledEndAt);

  if (Number.isNaN(endAt.getTime())) {
    return false;
  }

  return now.getTime() - endAt.getTime() >= TWO_HOURS_IN_MS;
};

export const getCompleteMatchErrorMessage = (
  input: CompleteMatchInput,
  context: CompleteMatchContext,
  now = new Date(),
): string | null => {
  if (input.action !== MATCH_COMPLETE_ACTION.COMPLETE) {
    return "지원하지 않는 종료 요청입니다.";
  }

  if (!context.currentUserId) {
    return "로그아웃 상태입니다.";
  }

  const isParticipant =
    context.currentUserId === context.hostUserId ||
    context.currentUserId === context.guestUserId;

  if (!isParticipant) {
    return "처리 권한이 없습니다.";
  }

  if (context.isBlocked) {
    return "차단된 사용자와의 매칭은 종료 처리만 제한적으로 가능합니다.";
  }

  if (context.status === MATCH_STATUS.COMPLETED) {
    return "이미 종료된 매칭입니다.";
  }

  if (
    context.status !== MATCH_STATUS.IN_PROGRESS &&
    context.status !== MATCH_STATUS.END_PENDING
  ) {
    return "진행 중 상태가 아닌 매칭은 종료 처리할 수 없습니다.";
  }

  if (
    context.status === MATCH_STATUS.END_PENDING &&
    context.endRequestedBy === context.currentUserId &&
    !canForceCompleteMatch(context.scheduledEndAt, now)
  ) {
    return "상대방 확인 대기 중입니다.";
  }

  return null;
};
