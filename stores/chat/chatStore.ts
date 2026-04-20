import { create } from "zustand";
import type { ChatRoom } from "@/types/domain/chatRoom";

type ChatState = {
  chatRooms: ChatRoom[];
  selectedChatRoomId: number | null;

  setChatRooms: (chatRooms: ChatRoom[]) => void;
  setSelectedChatRoomId: (chatRoomId: number | null) => void;
  clearChatState: () => void;
};

export const useChatStore = create<ChatState>((set) => ({
  chatRooms: [],
  selectedChatRoomId: null,

  setChatRooms: (chatRooms) =>
    set({
      chatRooms,
    }),

  setSelectedChatRoomId: (chatRoomId) =>
    set({
      selectedChatRoomId: chatRoomId,
    }),

  clearChatState: () =>
    set({
      chatRooms: [],
      selectedChatRoomId: null,
    }),
}));
