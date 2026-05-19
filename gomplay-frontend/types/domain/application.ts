export const APPLICATION_STATUS = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
} as const;

export type ApplicationStatus =
  (typeof APPLICATION_STATUS)[keyof typeof APPLICATION_STATUS];

export const APPLICATION_ACTION = {
  ACCEPT: "ACCEPT",
  REJECT: "REJECT",
} as const;

export type ApplicationAction =
  (typeof APPLICATION_ACTION)[keyof typeof APPLICATION_ACTION];

export type ApplyToPostInput = {
  postId: number;
  message?: string;
};

export type ApplyToPostResult = {
  applicationId: number;
  status: ApplicationStatus;
};

export type ApplyToPostContext = {
  currentUserId?: number | null;
  hostUserId: number;
  postStatus: string;
  currentParticipantCount: number;
  capacity: number;
  isBlocked?: boolean;
  hasExistingApplication?: boolean;
};

export type ResolveApplicationInput = {
  applicationId: number;
  action: ApplicationAction;
};

export type ResolveApplicationContext = {
  currentUserId?: number | null;
  hostUserId: number;
  applicationStatus: ApplicationStatus;
  postStatus: string;
  currentAcceptedCount: number;
  capacity: number;
  isBlocked?: boolean;
};

export type ResolveApplicationAcceptedResult = {
  applicationId: number;
  status: typeof APPLICATION_STATUS.ACCEPTED;
  matchId: number;
  chatRoomId: number;
};

export type ResolveApplicationRejectedResult = {
  applicationId: number;
  status: typeof APPLICATION_STATUS.REJECTED;
};

export type ResolveApplicationResult =
  | ResolveApplicationAcceptedResult
  | ResolveApplicationRejectedResult;

export type Application = {
  id: number;
  postId: number;
  applicantUserId: number;

  message?: string;

  status: ApplicationStatus;

  createdAt: string;
};
