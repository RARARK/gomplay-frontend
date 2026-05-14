import "./sockjsPolyfills";

import { Client, type StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

import { useAuthStore } from "@/stores/auth/authStore";
import { useMatchingStore } from "@/stores/matching/matchingStore";

type MessageHandler = (body: string) => void;

let client: Client | null = null;
let subscription: StompSubscription | null = null;
const handlers = new Set<MessageHandler>();

function notifyHandlers(body: string): void {
  handlers.forEach((h) => h(body));
}

export function addMatchMessageHandler(handler: MessageHandler): () => void {
  handlers.add(handler);
  return () => handlers.delete(handler);
}

export function connectMatchWs(): void {
  const token = useAuthStore.getState().accessToken;
  if (!token) return;
  if (client?.connected) return;

  if (client?.active) {
    client.deactivate();
    client = null;
    subscription = null;
  }

  client = new Client({
    webSocketFactory: () =>
      new SockJS(
        `http://3.38.165.56:8080/ws?token=${encodeURIComponent(token)}`,
        null,
        { transports: ["websocket"] },
      ),
    reconnectDelay: 5000,
    onConnect: () => {
      useMatchingStore.getState().setWsConnected(true);
      subscription = client!.subscribe("/user/queue/match", (message) => {
        notifyHandlers(message.body);
      });
    },
    onDisconnect: () => {
      useMatchingStore.getState().setWsConnected(false);
      subscription = null;
    },
    onStompError: (frame) => {
      console.warn("[WS] STOMP error:", frame.headers["message"]);
    },
    onWebSocketError: (error) => {
      console.warn("[WS] WebSocket error:", error);
    },
  });

  client.activate();
}

export function disconnectMatchWs(): void {
  subscription?.unsubscribe();
  subscription = null;
  client?.deactivate();
  client = null;
}

export function isMatchWsActive(): boolean {
  return client?.connected ?? false;
}
