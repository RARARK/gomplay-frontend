import "./sockjsPolyfills";

import { Client, type StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

import { useAuthStore } from "@/stores/auth/authStore";

export type NewMessageEventData = {
  messageId: number;
  roomId: number;
  senderId: number;
  senderName: string;
  content: string;
  sentAt: string;
  read: boolean;
};

export type ChatWsEvent =
  | { type: "NEW_MESSAGE"; data: NewMessageEventData }
  | { type: "PARTNER_COMPLETED"; data: number }
  | { type: "MATCH_COMPLETED"; data: number };

type ChatWsEventHandler = (event: ChatWsEvent) => void;

let client: Client | null = null;
let subscription: StompSubscription | null = null;
const handlers = new Set<ChatWsEventHandler>();

function notifyHandlers(body: string): void {
  try {
    const event = JSON.parse(body) as ChatWsEvent;
    handlers.forEach((h) => h(event));
  } catch {
    console.warn("[Chat WS] Failed to parse message:", body);
  }
}

export function addChatEventHandler(handler: ChatWsEventHandler): () => void {
  handlers.add(handler);
  return () => handlers.delete(handler);
}

export function connectChatWs(): void {
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
      subscription = client!.subscribe("/user/queue/chat", (message) => {
        notifyHandlers(message.body);
      });
    },
    onDisconnect: () => {
      subscription = null;
    },
    onStompError: (frame) => {
      console.warn("[Chat WS] STOMP error:", frame.headers["message"]);
    },
    onWebSocketError: (error) => {
      console.warn("[Chat WS] WebSocket error:", error);
    },
  });

  client.activate();
}

export function disconnectChatWs(): void {
  subscription?.unsubscribe();
  subscription = null;
  client?.deactivate();
  client = null;
}

export function publishChatMessage(roomId: number, content: string): void {
  if (!client?.connected) {
    throw new Error("[Chat WS] Not connected.");
  }
  client.publish({
    destination: `/app/chat/room/${roomId}/message`,
    body: JSON.stringify({ content }),
  });
}

export function isChatWsActive(): boolean {
  return client?.connected ?? false;
}
