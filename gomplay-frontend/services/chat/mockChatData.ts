import {
  CHAT_MESSAGE_STATUS,
  CHAT_MESSAGE_TYPE,
  type ChatMessage,
} from "@/types/domain/chatMessage";
import { CHAT_ROOM_STATUS, type ChatRoom } from "@/types/domain/chatRoom";
import { MATCH_STATUS } from "@/types/domain/match";

const minutesAgo = (now: number, minutes: number) =>
  new Date(now - minutes * 60 * 1000).toISOString();

export function createMockChatRooms(now = Date.now()): ChatRoom[] {
  return [
    {
      id: 9001,
      matchId: 7001,
      matchStatus: MATCH_STATUS.IN_PROGRESS,
      status: CHAT_ROOM_STATUS.ACTIVE,
      participants: [{ id: 101, name: "김도윤" }],
      lastMessage: "그럼 오늘 7시에 체육관 앞에서 볼게요!",
      lastMessageAt: minutesAgo(now, 8),
      unreadMessageCount: 2,
      completeButtonVisible: true,
      reviewCompleted: false,
      createdAt: minutesAgo(now, 120),
    },
    {
      id: 9002,
      matchId: 7002,
      matchStatus: MATCH_STATUS.IN_PROGRESS,
      status: CHAT_ROOM_STATUS.ACTIVE,
      participants: [{ id: 102, name: "이서연" }],
      lastMessage: "러닝은 천천히 페이스 맞춰서 가요.",
      lastMessageAt: minutesAgo(now, 52),
      unreadMessageCount: 0,
      completeButtonVisible: true,
      reviewCompleted: false,
      createdAt: minutesAgo(now, 300),
    },
    {
      id: 9003,
      matchId: 7003,
      matchStatus: MATCH_STATUS.COMPLETED,
      status: CHAT_ROOM_STATUS.READ_ONLY,
      participants: [{ id: 103, name: "박민준" }],
      lastMessage: "오늘 운동 고생했어요!",
      lastMessageAt: minutesAgo(now, 1440),
      unreadMessageCount: 0,
      matchCompletedAt: minutesAgo(now, 1380),
      completeButtonVisible: false,
      reviewCompleted: false,
      createdAt: minutesAgo(now, 1800),
    },
  ];
}

export function createMockMessagesByRoomId(
  now = Date.now(),
): Record<number, ChatMessage[]> {
  return {
    9001: [
      {
        id: 91001,
        chatRoomId: 9001,
        senderId: 101,
        senderName: "김도윤",
        message: "안녕하세요! 오늘 배드민턴 같이 하기로 한 도윤입니다.",
        type: CHAT_MESSAGE_TYPE.USER,
        status: CHAT_MESSAGE_STATUS.SENT,
        isMine: false,
        createdAt: minutesAgo(now, 115),
      },
      {
        id: 91002,
        chatRoomId: 9001,
        message: "네 좋아요. 저는 라켓 챙겨갈게요.",
        type: CHAT_MESSAGE_TYPE.USER,
        status: CHAT_MESSAGE_STATUS.SENT,
        isMine: true,
        createdAt: minutesAgo(now, 110),
      },
      {
        id: 91003,
        chatRoomId: 9001,
        senderId: 101,
        senderName: "김도윤",
        message: "그럼 오늘 7시에 체육관 앞에서 볼게요!",
        type: CHAT_MESSAGE_TYPE.USER,
        status: CHAT_MESSAGE_STATUS.SENT,
        isMine: false,
        createdAt: minutesAgo(now, 8),
      },
    ],
    9002: [
      {
        id: 92001,
        chatRoomId: 9002,
        senderId: 102,
        senderName: "이서연",
        message: "오늘 러닝 가능한 시간 있으세요?",
        type: CHAT_MESSAGE_TYPE.USER,
        status: CHAT_MESSAGE_STATUS.SENT,
        isMine: false,
        createdAt: minutesAgo(now, 80),
      },
      {
        id: 92002,
        chatRoomId: 9002,
        message: "저녁 8시 이후면 괜찮아요.",
        type: CHAT_MESSAGE_TYPE.USER,
        status: CHAT_MESSAGE_STATUS.SENT,
        isMine: true,
        createdAt: minutesAgo(now, 75),
      },
      {
        id: 92003,
        chatRoomId: 9002,
        senderId: 102,
        senderName: "이서연",
        message: "러닝은 천천히 페이스 맞춰서 가요.",
        type: CHAT_MESSAGE_TYPE.USER,
        status: CHAT_MESSAGE_STATUS.SENT,
        isMine: false,
        createdAt: minutesAgo(now, 52),
      },
    ],
    9003: [
      {
        id: 93001,
        chatRoomId: 9003,
        message: "운동이 완료되었습니다. 파트너에게 후기를 남겨주세요.",
        type: CHAT_MESSAGE_TYPE.SYSTEM,
        status: CHAT_MESSAGE_STATUS.SENT,
        systemEvent: "MATCH_COMPLETED",
        createdAt: minutesAgo(now, 1380),
      },
      {
        id: 93002,
        chatRoomId: 9003,
        senderId: 103,
        senderName: "박민준",
        message: "오늘 운동 고생했어요!",
        type: CHAT_MESSAGE_TYPE.USER,
        status: CHAT_MESSAGE_STATUS.SENT,
        isMine: false,
        createdAt: minutesAgo(now, 1375),
      },
    ],
  };
}

export function isMockChatRoomId(chatRoomId: number) {
  return chatRoomId >= 9001 && chatRoomId <= 9003;
}
