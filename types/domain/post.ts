export const POST_STATUS = {
  OPEN: "OPEN",
  CLOSED: "CLOSED",
} as const;

export type PostStatus = (typeof POST_STATUS)[keyof typeof POST_STATUS];

export const POST_DIFFICULTY = {
  BEGINNER: "BEGINNER",
  EASY: "EASY",
  NORMAL: "NORMAL",
  HARD: "HARD",
} as const;

export type PostDifficulty =
  (typeof POST_DIFFICULTY)[keyof typeof POST_DIFFICULTY];

export type CreatePostInput = {
  title?: string;
  exerciseType: string;
  location: string;
  scheduledStartAt: string;
  scheduledEndAt: string;
  capacity: number;
  message?: string;
  difficulty: PostDifficulty;
  tags?: string[];
};

export type CreatePostResult = {
  postId: number;
  status: PostStatus;
};

export type CreatePostFieldError = Partial<
  Record<
    | "exerciseType"
    | "location"
    | "scheduledStartAt"
    | "scheduledEndAt"
    | "capacity"
    | "difficulty",
    string
  >
>;

export type Post = {
  id: number;
  hostUserId: number;

  title?: string;
  exerciseType: string;
  location: string;

  scheduledStartAt: string;
  scheduledEndAt: string;

  capacity: number;
  message?: string;
  difficulty: PostDifficulty;
  tags?: string[];

  status: PostStatus;

  createdAt: string;
  updatedAt?: string;
};
