import { useEffect } from "react";

import {
  addMatchMessageHandler,
  connectMatchWs,
  disconnectMatchWs,
} from "@/lib/ws/matchWsClient";
import { useAuthStore } from "@/stores/auth/authStore";
import { useMatchingStore, VISIBLE_CANDIDATE_LIMIT } from "@/stores/matching/matchingStore";
import type { WsMatchEvent } from "@/types/domain/wsEvents";


export function useMatchWebSocket(): void {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) return;

    connectMatchWs();

    const removeHandler = addMatchMessageHandler((body) => {
      let event: WsMatchEvent;
      try {
        event = JSON.parse(body) as WsMatchEvent;
      } catch {
        return;
      }

      const store = useMatchingStore.getState();
      switch (event.type) {
        case "CANDIDATES_UPDATE": {
          const all = event.data;
          store.setCandidates(all.slice(0, VISIBLE_CANDIDATE_LIMIT));
          store.setCandidateBuffer(all.slice(VISIBLE_CANDIDATE_LIMIT));
          store.addSeenIds(all.map((c) => c.userProfileId));
          store.resetDisconnectedCandidates();
          break;
        }
        case "NEW_CANDIDATE":
          store.clearDisconnectedCandidate(event.data.userProfileId);
          if (store.candidates.length < VISIBLE_CANDIDATE_LIMIT) {
            store.addCandidate(event.data);
          } else {
            store.addToBuffer(event.data);
          }
          store.addSeenIds([event.data.userProfileId]);
          break;
        case "CANDIDATE_LEFT": {
          const isVisible = store.candidates.some(
            (c) => c.userProfileId === event.data,
          );
          store.removeFromBuffer(event.data);
          if (isVisible) {
            store.markCandidateDisconnected(event.data);
          }
          break;
        }
        case "MATCH_REQUEST":
          store.setPendingMatchRequest(event.data);
          break;
        case "MATCH_ACCEPTED":
          // Set matching=false immediately so the polling fallback stops on its next tick
          useAuthStore.getState().setMatching(false);
          store.resolveMatchRequest(event.data.matchRequestId, true, event.data.chatRoomId);
          break;
        case "MATCH_REJECTED":
          store.resolveMatchRequest(event.data, false);
          break;
      }
    });

    return () => {
      removeHandler();
      disconnectMatchWs();
    };
  }, [isLoggedIn]);
}
