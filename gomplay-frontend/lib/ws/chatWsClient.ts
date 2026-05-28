import "./sockjsPolyfills";

import { Client, type StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

import { useAuthStore } from "@/stores/auth/authStore";
import type { GroupChatMessage } from "@/types/domain/groupChatRoom";

// ─── 1:1 Chat types ───────────────────────────────────────────────────────────

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

// ─── Group Chat types ─────────────────────────────────────────────────────────

export type GroupChatWsEvent = {
  type: "NEW_MESSAGE";
  data: GroupChatMessage;
};

type GroupChatWsHandler = (event: GroupChatWsEvent) => void;

// ─── Shared client state ──────────────────────────────────────────────────────

let client: Client | null = null;

// 1:1 chat
let userQueueSub: StompSubscription | null = null;
const individualHandlers = new Set<ChatWsEventHandler>();

// Group chat: roomId → Set of handlers + STOMP subscription
const groupHandlers = new Map<number, Set<GroupChatWsHandler>>();
const groupStompSubs = new Map<number, StompSubscription>();

// ─── Internal helpers ─────────────────────────────────────────────────────────

function notifyIndividualHandlers(body: string): void {
  try {
    const event = JSON.parse(body) as ChatWsEvent;
    individualHandlers.forEach((h) => h(event));
  } catch {
    console.warn("[Chat WS] Failed to parse 1:1 message:", body);
  }
}

function createGroupRoomStompSub(roomId: number): StompSubscription {
  return client!.subscribe(`/topic/group-chat/${roomId}`, (message) => {
    try {
      const event = JSON.parse(message.body) as GroupChatWsEvent;
      groupHandlers.get(roomId)?.forEach((h) => h(event));
    } catch {
      console.warn(`[Chat WS] Failed to parse group message (room ${roomId}):`, message.body);
    }
  });
}

function activatePendingGroupSubs(): void {
  for (const [roomId, handlers] of groupHandlers.entries()) {
    if (handlers.size > 0 && !groupStompSubs.has(roomId)) {
      groupStompSubs.set(roomId, createGroupRoomStompSub(roomId));
    }
  }
}

// ─── Public API: connection ───────────────────────────────────────────────────

export function addChatEventHandler(handler: ChatWsEventHandler): () => void {
  individualHandlers.add(handler);
  return () => individualHandlers.delete(handler);
}

export function connectChatWs(): void {
  const token = useAuthStore.getState().accessToken;
  if (!token) return;
  if (client?.connected) return;

  if (client?.active) {
    client.deactivate();
    client = null;
    userQueueSub = null;
    groupStompSubs.clear();
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
      userQueueSub = client!.subscribe("/user/queue/chat", (message) => {
        notifyIndividualHandlers(message.body);
      });
      // Re-activate any group room subscriptions registered before connection
      activatePendingGroupSubs();
    },
    onDisconnect: () => {
      userQueueSub = null;
      groupStompSubs.clear();
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
  userQueueSub?.unsubscribe();
  userQueueSub = null;
  groupStompSubs.forEach((sub) => sub.unsubscribe());
  groupStompSubs.clear();
  client?.deactivate();
  client = null;
}

// ─── Public API: 1:1 chat ─────────────────────────────────────────────────────

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

// ─── Public API: group chat ───────────────────────────────────────────────────

export function subscribeToGroupChatRoom(
  roomId: number,
  handler: GroupChatWsHandler,
): () => void {
  if (!groupHandlers.has(roomId)) {
    groupHandlers.set(roomId, new Set());
  }
  groupHandlers.get(roomId)!.add(handler);

  // Subscribe on the STOMP layer immediately if already connected
  if (client?.connected && !groupStompSubs.has(roomId)) {
    groupStompSubs.set(roomId, createGroupRoomStompSub(roomId));
  }

  return () => {
    const set = groupHandlers.get(roomId);
    if (!set) return;
    set.delete(handler);
    if (set.size === 0) {
      groupHandlers.delete(roomId);
      groupStompSubs.get(roomId)?.unsubscribe();
      groupStompSubs.delete(roomId);
    }
  };
}

export function publishGroupChatMessage(roomId: number, content: string): void {
  if (!client?.connected) {
    throw new Error("[Chat WS] Not connected.");
  }
  client.publish({
    destination: `/app/group-chat/${roomId}`,
    body: JSON.stringify({ content }),
  });
}
