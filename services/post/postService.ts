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

export type PostHostProfile = {
  id: number;
  name: string;
  department: string;
  mannerTemperature: number;
};

export type PostParticipant = {
  id: number;
  name: string;
  department?: string;
  mannerTemperature: number;
};

const now = new Date();

const createDate = (dayOffset: number, hour: number, minute = 0) => {
  const date = new Date(now);
  date.setDate(now.getDate() + dayOffset);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

const hostProfiles: Record<number, PostHostProfile> = {
  1: {
    id: 1,
    name: "김단국",
    department: "소프트웨어학과",
    mannerTemperature: 38.2,
  },
  2: {
    id: 2,
    name: "이서윤",
    department: "체육교육과",
    mannerTemperature: 41.0,
  },
  3: {
    id: 3,
    name: "박지훈",
    department: "컴퓨터공학과",
    mannerTemperature: 36.5,
  },
};

let posts: Post[] = [
  {
    id: 301,
    hostUserId: 1,
    title: "같이 운동하실 분 구해요",
    exerciseType: "농구",
    location: "체육관",
    scheduledStartAt: createDate(1, 19),
    scheduledEndAt: createDate(1, 20, 30),
    capacity: 4,
    message: "초보도 환영해요. 가볍게 같이 뛰실 분 찾아요.",
    difficulty: "BEGINNER",
    tags: ["#초보만", "#조용함"],
    status: POST_STATUS.OPEN,
    createdAt: now.toISOString(),
  },
  {
    id: 302,
    hostUserId: 2,
    title: "퇴근 후 배드민턴 치실 분",
    exerciseType: "배드민턴",
    location: "서양대 체육관",
    scheduledStartAt: createDate(2, 18, 30),
    scheduledEndAt: createDate(2, 20),
    capacity: 2,
    message: "랠리 위주로 편하게 치려고 해요.",
    difficulty: "EASY",
    tags: ["#가볍게", "#시간맞춤"],
    status: POST_STATUS.OPEN,
    createdAt: now.toISOString(),
  },
  {
    id: 303,
    hostUserId: 3,
    title: "아침 러닝 같이 해요",
    exerciseType: "러닝",
    location: "운동장",
    scheduledStartAt: createDate(3, 7),
    scheduledEndAt: createDate(3, 8),
    capacity: 3,
    message: "페이스는 천천히 맞춰서 뛰어요.",
    difficulty: "NORMAL",
    tags: ["#아침운동", "#비슷하게"],
    status: POST_STATUS.OPEN,
    createdAt: now.toISOString(),
  },
];

const participantsByPostId: Record<number, PostParticipant[]> = {
  301: [
    { id: 1, name: "김단국", department: "소프트웨어학과", mannerTemperature: 38.2 },
    { id: 11, name: "정민수", department: "경영학과", mannerTemperature: 36.5 },
  ],
  302: [{ id: 2, name: "이서윤", department: "체육교육과", mannerTemperature: 41.0 }],
  303: [
    { id: 3, name: "박지훈", department: "컴퓨터공학과", mannerTemperature: 36.5 },
    { id: 12, name: "최유나", department: "디자인학과", mannerTemperature: 39.7 },
  ],
};

export async function getPosts(): Promise<Post[]> {
  return posts;
}

export async function getPostById(postId: number): Promise<Post | null> {
  return posts.find((post) => post.id === postId) ?? null;
}

export async function getPostHostProfile(
  hostUserId: number,
): Promise<PostHostProfile> {
  return (
    hostProfiles[hostUserId] ?? {
      id: hostUserId,
      name: "김단국",
      department: "소프트웨어학과",
      mannerTemperature: 36.5,
    }
  );
}

export async function getPostParticipants(
  postId: number,
): Promise<PostParticipant[]> {
  return participantsByPostId[postId] ?? [];
}

export async function createPost(
  input: CreatePostInput,
): Promise<CreatePostResult> {
  const errors = validateCreatePostInput(input);

  if (Object.keys(errors).length > 0) {
    throw new Error(Object.values(errors)[0] ?? "모집글을 생성할 수 없습니다.");
  }

  const nextPostId = Math.max(...posts.map((post) => post.id), 300) + 1;
  const createdAt = new Date().toISOString();

  posts = [
    {
      id: nextPostId,
      hostUserId: 1,
      status: POST_STATUS.OPEN,
      createdAt,
      ...input,
    },
    ...posts,
  ];

  participantsByPostId[nextPostId] = [
    { id: 1, name: "김단국", department: "소프트웨어학과", mannerTemperature: 38.2 },
  ];

  return {
    postId: nextPostId,
    status: POST_STATUS.OPEN,
  };
}

export async function applyToPost(
  input: ApplyToPostInput,
  context: ApplyToPostContext,
): Promise<ApplyToPostResult> {
  const errorMessage = getApplyToPostErrorMessage(context);

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  return {
    applicationId: input.postId + 1000,
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
