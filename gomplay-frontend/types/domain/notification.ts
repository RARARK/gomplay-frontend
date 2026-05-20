export type NotificationApiType =
  | "match_request"
  | "match_accepted"
  | "match_rejected"
  | "gathering"
  | "gathering_request"
  | "review_available"
  | "match_end_confirm"
  | "match_auto_ended"
  | "review"
  | "point";

export type NotificationTab = "all" | "partner" | "general";

export type NotificationItem = {
  id: number;
  type: NotificationApiType;
  title: string;
  body: string;
  refId: number | string | null;
  read: boolean;
  createdAt: string;
};
