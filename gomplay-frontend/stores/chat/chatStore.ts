import { create } from "zustand";
import type { ChatConnectionStatus } from "@/types/domain/chat";
import type { ChatMessage } from "@/types/domain/chatMessage";
import type { ChatRoom } from "@/types/domain/chatRoom";

type ChatState = {
  chatRooms: ChatRoom[];
  reviewedMatchIds: number[];
  completedMatchIds: number[];
  completedGatheringIds: number[];
  dismissedGatheringIds: number[];
  selectedChatRoomId: number | null;
  messagesByRoomId: Record<number, ChatMessage[]>;
  draftsByRoomId: Record<number, string>;
  nextCursorByRoomId: Record<number, string | undefined>;
  connectionStatusByRoomId: Record<number, ChatConnectionStatus>;

  setChatRooms: (chatRooms: ChatRoom[]) => void;
  upsertChatRoom: (chatRoom: ChatRoom) => void;
  markReviewCompleted: (matchId: number) => void;
  markMatchCompleted: (matchId: number) => void;
  markGatheringCompleted: (gatheringId: number) => void;
  dismissGatheringReview: (gatheringId: number) => void;
  setSelectedChatRoomId: (chatRoomId: number | null) => void;
  setMessages: (chatRoomId: number, messages: ChatMessage[]) => void;
  prependMessages: (
    chatRoomId: number,
    messages: ChatMessage[],
    nextCursor?: string,
  ) => void;
  appendMessage: (chatRoomId: number, message: ChatMessage) => void;
  updateMessage: (
    chatRoomId: number,
    messageId: number,
    updater: (message: ChatMessage) => ChatMessage,
  ) => void;
  setDraft: (chatRoomId: number, draft: string) => void;
  setConnectionStatus: (
    chatRoomId: number,
    status: ChatConnectionStatus,
  ) => void;
  incrementUnreadCount: (chatRoomId: number) => void;
  clearUnreadCount: (chatRoomId: number) => void;
  clearChatState: () => void;
};

export const useChatStore = create<ChatState>((set) => ({
  chatRooms: [],
  reviewedMatchIds: [],
  completedMatchIds: [],
  completedGatheringIds: [],
  dismissedGatheringIds: [],
  selectedChatRoomId: null,
  messagesByRoomId: {},
  draftsByRoomId: {},
  nextCursorByRoomId: {},
  connectionStatusByRoomId: {},

  setChatRooms: (chatRooms) =>
    set((state) => {
      const mapped = chatRooms.map((room) =>
        state.reviewedMatchIds.includes(room.matchId)
          ? { ...room, reviewed: true }
          : room,
      );
      mapped.sort((a, b) => {
        const aTime = new Date(a.lastMessageAt ?? a.createdAt).getTime();
        const bTime = new Date(b.lastMessageAt ?? b.createdAt).getTime();
        return bTime - aTime;
      });
      return { chatRooms: mapped };
    }),

  markReviewCompleted: (matchId) =>
    set((state) => ({
      reviewedMatchIds: Array.from(new Set([...state.reviewedMatchIds, matchId])),
      chatRooms: state.chatRooms.map((room) =>
        room.matchId === matchId ? { ...room, reviewed: true } : room,
      ),
    })),

  markMatchCompleted: (matchId) =>
    set((state) => ({
      completedMatchIds: Array.from(new Set([...state.completedMatchIds, matchId])),
    })),

  markGatheringCompleted: (gatheringId) =>
    set((state) => ({
      completedGatheringIds: Array.from(new Set([...state.completedGatheringIds, gatheringId])),
    })),

  dismissGatheringReview: (gatheringId) =>
    set((state) => ({
      dismissedGatheringIds: Array.from(new Set([...state.dismissedGatheringIds, gatheringId])),
    })),

  upsertChatRoom: (chatRoom) =>
    set((state) => {
      const normalized = state.reviewedMatchIds.includes(chatRoom.matchId)
        ? { ...chatRoom, reviewed: true }
        : chatRoom;
      const existing = state.chatRooms.find((item) => item.id === normalized.id);
      // Preserve lastMessage/lastMessageAt if the incoming data omits them
      // (e.g. detail API doesn't always return these fields)
      const normalizedChatRoom = existing
        ? {
            ...normalized,
            lastMessage: normalized.lastMessage ?? existing.lastMessage,
            lastMessageAt: normalized.lastMessageAt ?? existing.lastMessageAt,
          }
        : normalized;
      const hasExistingRoom = existing !== undefined;
      const nextChatRooms = hasExistingRoom
        ? state.chatRooms.map((item) =>
            item.id === normalizedChatRoom.id ? normalizedChatRoom : item,
          )
        : [...state.chatRooms, normalizedChatRoom];

      nextChatRooms.sort((left, right) => {
        const leftTime = new Date(left.lastMessageAt ?? left.createdAt).getTime();
        const rightTime = new Date(right.lastMessageAt ?? right.createdAt).getTime();

        return rightTime - leftTime;
      });

      return {
        chatRooms: nextChatRooms,
      };
    }),

  setSelectedChatRoomId: (chatRoomId) =>
    set({
      selectedChatRoomId: chatRoomId,
    }),

  setMessages: (chatRoomId, messages) =>
    set((state) => ({
      messagesByRoomId: {
        ...state.messagesByRoomId,
        [chatRoomId]: messages,
      },
    })),

  prependMessages: (chatRoomId, messages, nextCursor) =>
    set((state) => ({
      messagesByRoomId: {
        ...state.messagesByRoomId,
        [chatRoomId]: [
          ...messages,
          ...(state.messagesByRoomId[chatRoomId] ?? []),
        ],
      },
      nextCursorByRoomId: {
        ...state.nextCursorByRoomId,
        [chatRoomId]: nextCursor,
      },
    })),

  appendMessage: (chatRoomId, message) =>
    set((state) => {
      const chatRooms = state.chatRooms.map((chatRoom) =>
        chatRoom.id === chatRoomId
          ? {
              ...chatRoom,
              lastMessage: message.message,
              lastMessageType: message.type,
              lastMessageAt: message.createdAt,
            }
          : chatRoom,
      );

      chatRooms.sort((left, right) => {
        const leftTime = new Date(left.lastMessageAt ?? left.createdAt).getTime();
        const rightTime = new Date(right.lastMessageAt ?? right.createdAt).getTime();

        return rightTime - leftTime;
      });

      return {
        messagesByRoomId: {
          ...state.messagesByRoomId,
          [chatRoomId]: [
            ...(state.messagesByRoomId[chatRoomId] ?? []),
            message,
          ],
        },
        chatRooms,
      };
    }),

  updateMessage: (chatRoomId, messageId, updater) =>
    set((state) => ({
      messagesByRoomId: {
        ...state.messagesByRoomId,
        [chatRoomId]: (state.messagesByRoomId[chatRoomId] ?? []).map(
          (message) =>
            message.id === messageId ? updater(message) : message,
        ),
      },
    })),

  setDraft: (chatRoomId, draft) =>
    set((state) => ({
      draftsByRoomId: {
        ...state.draftsByRoomId,
        [chatRoomId]: draft,
      },
    })),

  setConnectionStatus: (chatRoomId, status) =>
    set((state) => ({
      connectionStatusByRoomId: {
        ...state.connectionStatusByRoomId,
        [chatRoomId]: status,
      },
    })),

  incrementUnreadCount: (chatRoomId) =>
    set((state) => ({
      chatRooms: state.chatRooms.map((chatRoom) =>
        chatRoom.id === chatRoomId
          ? {
              ...chatRoom,
              unreadMessageCount: chatRoom.unreadMessageCount + 1,
            }
          : chatRoom,
      ),
    })),

  clearUnreadCount: (chatRoomId) =>
    set((state) => ({
      chatRooms: state.chatRooms.map((chatRoom) =>
        chatRoom.id === chatRoomId
          ? {
              ...chatRoom,
              unreadMessageCount: 0,
            }
          : chatRoom,
      ),
    })),

  clearChatState: () =>
    set({
      chatRooms: [],
      reviewedMatchIds: [],
      completedMatchIds: [],
      completedGatheringIds: [],
      dismissedGatheringIds: [],
      selectedChatRoomId: null,
      messagesByRoomId: {},
      draftsByRoomId: {},
      nextCursorByRoomId: {},
      connectionStatusByRoomId: {},
    }),
}));
