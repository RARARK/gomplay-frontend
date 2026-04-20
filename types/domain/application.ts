export const APPLICATION_STATUS = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
} as const;

export type ApplicationStatus =
  (typeof APPLICATION_STATUS)[keyof typeof APPLICATION_STATUS];

export type Application = {
  id: number;
  postId: number;
  applicantUserId: number;

  message?: string;

  status: ApplicationStatus;

  createdAt: string;
};
