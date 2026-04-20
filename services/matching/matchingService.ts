import type { Match } from "@/types/domain/match";

export async function getActiveMatches(): Promise<Match[]> {
  return [
    {
      id: 55,
      hostUserId: 1,
      guestUserId: 2,
      sourceType: "APPLICATION",
      sourceId: 101,
      status: "IN_PROGRESS",
      scheduledStartAt: "2026-04-10T18:00:00",
      scheduledEndAt: "2026-04-10T19:30:00",
      createdAt: "2026-04-10T17:00:00",
    },
  ];
}
