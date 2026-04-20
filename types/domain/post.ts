export const POST_STATUS = {
  OPEN: "OPEN",
  CLOSED: "CLOSED",
} as const;

export type PostStatus = (typeof POST_STATUS)[keyof typeof POST_STATUS];

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
  difficulty: string;
  tags?: string[];

  status: PostStatus;

  createdAt: string;
  updatedAt?: string;
};
