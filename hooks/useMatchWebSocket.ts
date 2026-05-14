import { useEffect } from "react";

import {
  addMatchMessageHandler,
  connectMatchWs,
  disconnectMatchWs,
} from "@/lib/ws/matchWsClient";
import { useAuthStore } from "@/stores/auth/authStore";
import { useMatchingStore } from "@/stores/matching/matchingStore";
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
        case "CANDIDATES_UPDATE":
          store.setCandidates(event.data);
          break;
        case "NEW_CANDIDATE":
          store.addCandidate(event.data);
          break;
        case "CANDIDATE_LEFT":
          store.removeCandidate(event.data);
          break;
        case "MATCH_REQUEST":
          store.setPendingMatchRequest(event.data);
          break;
        case "MATCH_ACCEPTED":
          store.resolveMatchRequest(event.data, true);
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
