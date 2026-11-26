import { Client, type StompSubscription } from "@stomp/stompjs";

import { useAuthStore } from "@/stores/auth/authStore";
import { useMatchingStore } from "@/stores/matching/matchingStore";

type MessageHandler = (body: string) => void;

let client: Client | null = null;
let connectedToken: string | null = null;
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
  if (client?.connected && connectedToken === token) return;

  if (client?.active) {
    client.deactivate();
    client = null;
    connectedToken = null;
    subscription = null;
  }

  client = new Client({
    // SockJS는 Expo 터널(https) 환경에서 http 연결을 SecurityError로 막으므로
    // Spring SockJS 엔드포인트의 raw WebSocket 경로(/ws/websocket)에 직접 연결한다.
    webSocketFactory: () =>
      new WebSocket(
        `ws://52.78.97.182:8080/ws/websocket?token=${encodeURIComponent(token)}`,
      ),
    reconnectDelay: 2000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    onConnect: () => {
      connectedToken = token;
      useMatchingStore.getState().setWsConnected(true);
      subscription = client!.subscribe("/user/queue/match", (message) => {
        notifyHandlers(message.body);
      });
    },
    onDisconnect: () => {
      connectedToken = null;
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
  connectedToken = null;
}

export function isMatchWsActive(): boolean {
  return client?.connected ?? false;
}
