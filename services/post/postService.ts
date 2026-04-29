import {
  APPLICATION_ACTION,
  APPLICATION_STATUS,
  type ApplyToPostContext,
  type ApplyToPostInput,
  type ApplyToPostResult,
  type ResolveApplicationContext,
  type ResolveApplicationInput,
  type ResolveApplicationResult,
} from "@/types/domain/application";
import {
  POST_STATUS,
  type CreatePostInput,
  type CreatePostResult,
  type Post,
} from "@/types/domain/post";
import { getApplyToPostErrorMessage } from "@/utils/canApplyToPost";
import { getResolveApplicationErrorMessage } from "@/utils/resolveApplicationAction";
import { validateCreatePostInput } from "@/utils/validateCreatePost";

export async function getPosts(): Promise<Post[]> {
  return [];
}

export async function getPostById(postId: number): Promise<Post | null> {
  void postId;
  return null;
}

export async function createPost(
  input: CreatePostInput,
): Promise<CreatePostResult> {
  const errors = validateCreatePostInput(input);

  if (Object.keys(errors).length > 0) {
    throw new Error(Object.values(errors)[0] ?? "모집글을 생성할 수 없습니다.");
  }

  return {
    postId: 301,
    status: POST_STATUS.OPEN,
  };
}

export async function applyToPost(
  input: ApplyToPostInput,
  context: ApplyToPostContext,
): Promise<ApplyToPostResult> {
  void input;
  const errorMessage = getApplyToPostErrorMessage(context);

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  return {
    applicationId: 101,
    status: APPLICATION_STATUS.PENDING,
  };
}

export async function resolveApplication(
  input: ResolveApplicationInput,
  context: ResolveApplicationContext,
): Promise<ResolveApplicationResult> {
  const errorMessage = getResolveApplicationErrorMessage(input, context);

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  if (input.action === APPLICATION_ACTION.ACCEPT) {
    return {
      applicationId: input.applicationId,
      status: APPLICATION_STATUS.ACCEPTED,
      matchId: 55,
      chatRoomId: 23,
    };
  }

  return {
    applicationId: input.applicationId,
    status: APPLICATION_STATUS.REJECTED,
  };
}
