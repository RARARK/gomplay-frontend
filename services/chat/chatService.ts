import type {
  ChatRealtimeListener,
  ChatMessagesPage,
  CreateSystemMessageInput,
  GetChatMessagesParams,
  SendChatMessageInput,
  UpdateChatRoomStatusInput,
} from "@/types/domain/chat";
import type { ChatMessage } from "@/types/domain/chatMessage";
import {
  CHAT_MESSAGE_STATUS,
  CHAT_MESSAGE_TYPE,
} from "@/types/domain/chatMessage";
import type { ChatRoom } from "@/types/domain/chatRoom";
import { CHAT_ROOM_STATUS } from "@/types/domain/chatRoom";
import { MATCH_STATUS } from "@/types/domain/match";

const CURRENT_USER_ID = 1;
const PAGE_SIZE = 20;

let nextMessageId = 1000;

const chatRooms: ChatRoom[] = [
  {
    id: 1,
    matchId: 101,
    matchStatus: MATCH_STATUS.IN_PROGRESS,
    status: CHAT_ROOM_STATUS.ACTIVE,
    participants: [
      {
        id: 1,
        name: "Current User",
        isSelf: true,
      },
      {
        id: 2,
        name: "Kim Danguk",
        profileImageUrl: "assets/chat/Profileimage.png",
      },
    ],
    lastMessage: "Where should we meet?",
    lastMessageType: CHAT_MESSAGE_TYPE.USER,
    lastMessageAt: "2026-04-27T18:01:50.000Z",
    unreadMessageCount: 2,
    reviewCompleted: false,
    createdAt: "2026-04-27T17:30:00.000Z",
  },
  {
    id: 2,
    matchId: 102,
    matchStatus: MATCH_STATUS.COMPLETED,
    status: CHAT_ROOM_STATUS.READ_ONLY,
    participants: [
      {
        id: 1,
        name: "Current User",
        isSelf: true,
      },
      {
        id: 3,
        name: "Minsu Lee",
        profileImageUrl: "assets/chat/Profileimage.png",
      },
    ],
    lastMessage: "Workout has been completed.",
    lastMessageType: CHAT_MESSAGE_TYPE.SYSTEM,
    lastMessageAt: "2026-04-26T12:15:00.000Z",
    unreadMessageCount: 0,
    matchCompletedAt: "2026-04-26T12:10:00.000Z",
    reviewCompleted: true,
    createdAt: "2026-04-26T09:10:00.000Z",
  },
];

const messagesByRoomId: Record<number, ChatMessage[]> = {
  1: [
    {
      id: 1,
      chatRoomId: 1,
      senderId: 2,
      senderName: "Kim Danguk",
      message: "Match has been accepted.",
      type: CHAT_MESSAGE_TYPE.SYSTEM,
      status: CHAT_MESSAGE_STATUS.SENT,
      systemEvent: "MATCH_ACCEPTED",
      createdAt: "2026-04-27T17:30:00.000Z",
    },
    {
      id: 2,
      chatRoomId: 1,
      senderId: 2,
      senderName: "Kim Danguk",
      message: "Hello",
      type: CHAT_MESSAGE_TYPE.USER,
      status: CHAT_MESSAGE_STATUS.SENT,
      isMine: false,
      createdAt: "2026-04-27T18:01:00.000Z",
    },
    {
      id: 3,
      chatRoomId: 1,
      senderId: CURRENT_USER_ID,
      senderName: "Current User",
      message: "Hello, are you available tomorrow?",
      type: CHAT_MESSAGE_TYPE.USER,
      status: CHAT_MESSAGE_STATUS.SENT,
      isMine: true,
      createdAt: "2026-04-27T18:01:20.000Z",
    },
    {
      id: 4,
      chatRoomId: 1,
      senderId: 2,
      senderName: "Kim Danguk",
      message: "Where should we meet?",
      type: CHAT_MESSAGE_TYPE.USER,
      status: CHAT_MESSAGE_STATUS.SENT,
      isMine: false,
      createdAt: "2026-04-27T18:01:50.000Z",
    },
  ],
  2: [
    {
      id: 3,
      chatRoomId: 2,
      senderId: 3,
      senderName: "Minsu Lee",
      message: "Workout has been completed.",
      type: CHAT_MESSAGE_TYPE.SYSTEM,
      status: CHAT_MESSAGE_STATUS.SENT,
      systemEvent: "MATCH_COMPLETED",
      createdAt: "2026-04-26T12:15:00.000Z",
    },
  ],
};

const listenersByRoomId = new Map<number, Set<ChatRealtimeListener>>();

export async function getChatRooms(): Promise<ChatRoom[]> {
  return [...chatRooms].sort((left, right) => {
    const leftTime = new Date(left.lastMessageAt ?? left.createdAt).getTime();
    const rightTime = new Date(right.lastMessageAt ?? right.createdAt).getTime();

    return rightTime - leftTime;
  });
}

export async function getChatMessages({
  chatRoomId,
  cursor,
  limit = PAGE_SIZE,
}: GetChatMessagesParams): Promise<ChatMessagesPage> {
  const allMessages = messagesByRoomId[chatRoomId] ?? [];
  const startIndex = cursor
    ? Number(cursor)
    : Math.max(allMessages.length - limit, 0);
  const pagedMessages = allMessages.slice(startIndex, startIndex + limit);
  const nextCursor =
    startIndex > 0 ? String(Math.max(startIndex - limit, 0)) : undefined;

  return {
    chatRoomId,
    messages: pagedMessages,
    nextCursor,
  };
}

export async function getChatRoom(chatRoomId: number): Promise<ChatRoom | null> {
  return chatRooms.find((chatRoom) => chatRoom.id === chatRoomId) ?? null;
}

export async function sendChatMessage(
  input: SendChatMessageInput,
): Promise<ChatMessage> {
  const chatRoom = findChatRoomOrThrow(input.chatRoomId);

  if (chatRoom.status !== CHAT_ROOM_STATUS.ACTIVE) {
    throw new Error("Cannot send messages in a read-only chat room.");
  }

  const message: ChatMessage = {
    id: nextMessageId++,
    chatRoomId: input.chatRoomId,
    senderId: CURRENT_USER_ID,
    senderName: "Current User",
    message: input.message,
    type: CHAT_MESSAGE_TYPE.USER,
    status: CHAT_MESSAGE_STATUS.SENT,
    isMine: true,
    clientMessageId: input.clientMessageId,
    createdAt: new Date().toISOString(),
  };

  appendMessage(message);

  return message;
}

export async function createSystemMessage(
  input: CreateSystemMessageInput,
): Promise<ChatMessage> {
  findChatRoomOrThrow(input.chatRoomId);
  const message: ChatMessage = {
    id: nextMessageId++,
    chatRoomId: input.chatRoomId,
    message: input.message,
    type: CHAT_MESSAGE_TYPE.SYSTEM,
    status: CHAT_MESSAGE_STATUS.SENT,
    systemEvent: input.systemEvent,
    createdAt: new Date().toISOString(),
  };

  appendMessage(message);

  return message;
}

export async function updateChatRoomStatus(
  input: UpdateChatRoomStatusInput,
): Promise<ChatRoom> {
  const chatRoom = findChatRoomOrThrow(input.chatRoomId);
  chatRoom.status = input.status;

  if (input.status === CHAT_ROOM_STATUS.READ_ONLY) {
    chatRoom.matchCompletedAt = new Date().toISOString();
  }

  return chatRoom;
}

export async function markChatRoomAsRead(chatRoomId: number): Promise<void> {
  const chatRoom = findChatRoomOrThrow(chatRoomId);
  chatRoom.unreadMessageCount = 0;

  const roomMessages = messagesByRoomId[chatRoomId] ?? [];
  const readAt = new Date().toISOString();

  for (const message of roomMessages) {
    if (!message.isMine && message.type === CHAT_MESSAGE_TYPE.USER) {
      message.readAt = readAt;
    }
  }
}

export function subscribeToChatMessages(
  chatRoomId: number,
  listener: ChatRealtimeListener,
): () => void {
  const listeners = listenersByRoomId.get(chatRoomId) ?? new Set();
  listeners.add(listener);
  listenersByRoomId.set(chatRoomId, listeners);

  return () => {
    const currentListeners = listenersByRoomId.get(chatRoomId);
    currentListeners?.delete(listener);

    if (currentListeners && currentListeners.size === 0) {
      listenersByRoomId.delete(chatRoomId);
    }
  };
}

function findChatRoomOrThrow(chatRoomId: number) {
  const chatRoom = chatRooms.find((item) => item.id === chatRoomId);

  if (!chatRoom) {
    throw new Error(`Chat room ${chatRoomId} was not found.`);
  }

  return chatRoom;
}

function appendMessage(message: ChatMessage) {
  const roomMessages = messagesByRoomId[message.chatRoomId] ?? [];
  messagesByRoomId[message.chatRoomId] = [...roomMessages, message];
  touchChatRoom(message.chatRoomId, message);
  emitMessage(message.chatRoomId, message);
}

function touchChatRoom(chatRoomId: number, message: ChatMessage) {
  const chatRoom = findChatRoomOrThrow(chatRoomId);
  chatRoom.lastMessage = message.message;
  chatRoom.lastMessageType = message.type;
  chatRoom.lastMessageAt = message.createdAt;

  if (!message.isMine && message.type === CHAT_MESSAGE_TYPE.USER) {
    chatRoom.unreadMessageCount += 1;
  }
}

function emitMessage(chatRoomId: number, message: ChatMessage) {
  const listeners = listenersByRoomId.get(chatRoomId);

  if (!listeners) {
    return;
  }

  for (const listener of listeners) {
    listener(message);
  }
}
