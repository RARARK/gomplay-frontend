import {
  APPLICATION_ACTION,
  APPLICATION_STATUS,
  type ResolveApplicationContext,
  type ResolveApplicationInput,
} from "@/types/domain/application";
import { POST_STATUS } from "@/types/domain/post";

export const getResolveApplicationErrorMessage = (
  input: ResolveApplicationInput,
  context: ResolveApplicationContext,
): string | null => {
  if (!context.currentUserId) {
    return "로그아웃 상태입니다.";
  }

  if (context.currentUserId !== context.hostUserId) {
    return "처리 권한이 없습니다.";
  }

  if (context.applicationStatus !== APPLICATION_STATUS.PENDING) {
    return "이미 처리된 신청입니다.";
  }

  if (context.postStatus !== POST_STATUS.OPEN) {
    return "모집이 마감되었습니다.";
  }

  if (context.isBlocked) {
    return "사용자에게 차단되었습니다.";
  }

  if (
    input.action === APPLICATION_ACTION.ACCEPT &&
    context.currentAcceptedCount >= context.capacity
  ) {
    return "정원이 모두 찼습니다.";
  }

  return null;
};

export const canResolveApplication = (
  input: ResolveApplicationInput,
  context: ResolveApplicationContext,
) => !getResolveApplicationErrorMessage(input, context);
