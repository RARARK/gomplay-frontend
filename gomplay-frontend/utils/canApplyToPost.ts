import { POST_STATUS } from "@/types/domain/post";
import type { ApplyToPostContext } from "@/types/domain/application";

export const getApplyToPostErrorMessage = ({
  currentUserId,
  hostUserId,
  postStatus,
  currentParticipantCount,
  capacity,
  isBlocked = false,
  hasExistingApplication = false,
}: ApplyToPostContext): string | null => {
  if (!currentUserId) {
    return "로그아웃 상태입니다.";
  }

  if (postStatus !== POST_STATUS.OPEN) {
    return "모집이 마감되었습니다.";
  }

  if (currentUserId === hostUserId) {
    return "자신의 모집글입니다.";
  }

  if (isBlocked) {
    return "사용자에게 차단되었습니다.";
  }

  if (hasExistingApplication) {
    return "이미 신청한 모집글입니다.";
  }

  if (capacity <= 0 || currentParticipantCount >= capacity) {
    return "정원이 모두 찼습니다.";
  }

  return null;
};

export const canApplyToPost = (context: ApplyToPostContext) =>
  !getApplyToPostErrorMessage(context);
