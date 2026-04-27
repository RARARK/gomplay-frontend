import { create } from "zustand";
import type { ChatConnectionStatus } from "@/types/domain/chat";
import type { ChatMessage } from "@/types/domain/chatMessage";
import type { ChatRoom } from "@/types/domain/chatRoom";

type ChatState = {
  chatRooms: ChatRoom[];
  selectedChatRoomId: number | null;
  messagesByRoomId: Record<number, ChatMessage[]>;
  draftsByRoomId: Record<number, string>;
  nextCursorByRoomId: Record<number, string | undefined>;
  connectionStatusByRoomId: Record<number, ChatConnectionStatus>;

  setChatRooms: (chatRooms: ChatRoom[]) => void;
  upsertChatRoom: (chatRoom: ChatRoom) => void;
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
  selectedChatRoomId: null,
  messagesByRoomId: {},
  draftsByRoomId: {},
  nextCursorByRoomId: {},
  connectionStatusByRoomId: {},

  setChatRooms: (chatRooms) =>
    set({
      chatRooms,
    }),

  upsertChatRoom: (chatRoom) =>
    set((state) => {
      const hasExistingRoom = state.chatRooms.some((item) => item.id === chatRoom.id);
      const nextChatRooms = hasExistingRoom
        ? state.chatRooms.map((item) =>
            item.id === chatRoom.id ? chatRoom : item,
          )
        : [...state.chatRooms, chatRoom];

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
    set((state) => ({
      messagesByRoomId: {
        ...state.messagesByRoomId,
        [chatRoomId]: [
          ...(state.messagesByRoomId[chatRoomId] ?? []),
          message,
        ],
      },
    })),

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
      selectedChatRoomId: null,
      messagesByRoomId: {},
      draftsByRoomId: {},
      nextCursorByRoomId: {},
      connectionStatusByRoomId: {},
    }),
}));
