import {
  getGatheringDetail,
  getGatheringPosts,
  updateGathering,
} from "@/services/gathering/gatheringService";
import type {
  GatheringListItem,
  GatheringListQuery,
  GatheringPostDetailResponse,
  UpdateGatheringResponse,
} from "@/types/domain/gathering";
import { POST_DIFFICULTY, type Post } from "@/types/domain/post";
import { useAuthStore } from "@/stores/auth/authStore";

const DIFFICULTY_ALIASES: Record<string, Post["difficulty"]> = {
  입문자: POST_DIFFICULTY.INTRODUCTORY,
  초보자: POST_DIFFICULTY.BEGINNER,
  중급자: POST_DIFFICULTY.INTERMEDIATE,
  숙련자: POST_DIFFICULTY.ADVANCED,
  전문가: POST_DIFFICULTY.EXPERT,
  beginner: POST_DIFFICULTY.BEGINNER,
  intermediate: POST_DIFFICULTY.INTERMEDIATE,
  advanced: POST_DIFFICULTY.ADVANCED,
  expert: POST_DIFFICULTY.EXPERT,
  초급: POST_DIFFICULTY.BEGINNER,
  중급: POST_DIFFICULTY.INTERMEDIATE,
  고급: POST_DIFFICULTY.ADVANCED,
};

const normalizeDifficulty = (value: string): Post["difficulty"] =>
  DIFFICULTY_ALIASES[value] ?? POST_DIFFICULTY.INTRODUCTORY;

const normalizeTags = (tags?: string | null) =>
  tags
    ?.split(/\s+/)
    .map((tag) => tag.trim())
    .filter(Boolean);

const mapGatheringDetailToPost = (
  detail: GatheringPostDetailResponse,
): Post => ({
  id: detail.id,
  hostUserId: 0,
  title: detail.title,
  exerciseType: detail.sportType,
  location: detail.venue,
  scheduledStartAt: detail.scheduledAt,
  scheduledEndAt: detail.scheduledEndAt,
  capacity: detail.maxParticipants,
  message: detail.description ?? undefined,
  difficulty: normalizeDifficulty(detail.difficulty),
  tags: normalizeTags(detail.tags),
  status: detail.status,
  createdAt: detail.createdAt,
});

const mapGatheringListItemToPost = (item: GatheringListItem): Post => ({
  id: item.id,
  hostUserId: 0,
  title: item.title,
  exerciseType: item.sportType,
  location: item.venue,
  scheduledStartAt: item.scheduledAt,
  scheduledEndAt: item.scheduledEndAt,
  capacity: item.maxParticipants,
  difficulty: normalizeDifficulty(item.difficulty),
  tags: normalizeTags(item.tags),
  status: item.status,
  createdAt: item.scheduledAt,
});

const mapUpdateGatheringResponseToPost = (
  response: UpdateGatheringResponse,
): Post => ({
  id: response.id,
  hostUserId: response.hostId,
  title: response.title,
  exerciseType: response.sportType,
  location: response.venue,
  scheduledStartAt: response.scheduledAt,
  scheduledEndAt: response.scheduledEndAt ?? response.scheduledAt,
  capacity: response.maxParticipants,
  message: response.description,
  difficulty: normalizeDifficulty(response.difficulty),
  tags: normalizeTags(response.tags),
  status: response.status,
  createdAt: response.updatedAt,
  updatedAt: response.updatedAt,
});

export async function getPosts(query: GatheringListQuery = {}): Promise<Post[]> {
  const response = await getGatheringPosts(query);

  return response.content.map(mapGatheringListItemToPost);
}

export async function getPostById(postId: number): Promise<Post | null> {
  return mapGatheringDetailToPost(await getGatheringDetail(postId));
}

export type UpdatePostInput = {
  title?: string;
  tags?: string[];
  message?: string;
};

export async function updatePost(
  postId: number,
  input: UpdatePostInput,
): Promise<Post> {
  const hostId = useAuthStore.getState().userId;
  if (!hostId) throw new Error("로그인이 필요합니다.");

  const response = await updateGathering(postId, {
    hostId,
    title: input.title,
    description: input.message,
    tags: input.tags?.join(" "),
  });

  return mapUpdateGatheringResponseToPost(response);
}

