import type { ChatMessage } from "@/types/domain/chatMessage";
import type { ChatRoom } from "@/types/domain/chatRoom";

export async function getChatRooms(): Promise<ChatRoom[]> {
  return [];
}

export async function getChatMessages(chatRoomId: number): Promise<{
  chatRoomId: number;
  messages: ChatMessage[];
  nextCursor?: string;
}> {
  return {
    chatRoomId,
    messages: [],
    nextCursor: undefined,
  };
}

export async function sendChatMessage(input: {
  chatRoomId: number;
  message: string;
}): Promise<ChatMessage> {
  return {
    id: Date.now(),
    chatRoomId: input.chatRoomId,
    senderId: 1,
    message: input.message,
    type: "USER",
    createdAt: new Date().toISOString(),
  };
}
