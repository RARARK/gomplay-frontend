import { Ionicons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import React from "react";
import { Alert, AppState, type AppStateStatus, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import MatchRequestToast from "@/components/matching/toast/MatchRequestToast";
import { addChatEventHandler } from "@/lib/ws/chatWsClient";
import { connectChatWs, getChatRooms } from "@/services/chat/chatService";
import { toggleMatching } from "@/services/matching/matchingService";
import { getNotifications } from "@/services/notification/notificationService";
import { useAuthStore } from "@/stores/auth/authStore";
import { useChatStore } from "@/stores/chat/chatStore";
import { useMatchingStore } from "@/stores/matching/matchingStore";
import { useNotificationStore } from "@/stores/notification/notificationStore";
import {
  CHAT_MESSAGE_STATUS,
  CHAT_MESSAGE_TYPE,
  type ChatMessage,
} from "@/types/domain/chatMessage";

const NOTIFICATION_POLL_MS = 60_000;

function useSyncNotificationUnread() {
  const setUnreadCount = useNotificationStore((s) => s.setUnreadCount);

  const sync = React.useCallback(() => {
    getNotifications("all")
      .then((list) => setUnreadCount(list.filter((n) => !n.read).length))
      .catch(() => {});
  }, [setUnreadCount]);

  React.useEffect(() => {
    sync();

    const interval = setInterval(sync, NOTIFICATION_POLL_MS);

    const sub = AppState.addEventListener("change", (state: AppStateStatus) => {
      if (state === "active") sync();
    });

    return () => {
      clearInterval(interval);
      sub.remove();
    };
  }, [sync]);
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const chatRooms = useChatStore((state) => state.chatRooms);
  const setChatRooms = useChatStore((state) => state.setChatRooms);
  const handledMessageIdsRef = React.useRef(new Set<number>());

  const lastResolvedMatchRequest = useMatchingStore((s) => s.lastResolvedMatchRequest);
  const clearLastResolvedMatchRequest = useMatchingStore((s) => s.clearLastResolvedMatchRequest);
  const setCandidates = useMatchingStore((s) => s.setCandidates);
  const setMatching = useAuthStore((s) => s.setMatching);

  React.useEffect(() => {
    if (!lastResolvedMatchRequest) return;
    const { accepted, roomId } = lastResolvedMatchRequest;
    clearLastResolvedMatchRequest();
    if (accepted && roomId) {
      setMatching(false);
      setCandidates([]);
      toggleMatching(false).catch(() => {});
      // 채팅 WS를 이동 전에 미리 연결 — ChatRoomScreen 마운트 전에 연결이 완료되어야
      // 방 생성 직후 백엔드가 보내는 WS 메시지를 놓치지 않음
      connectChatWs();
      getChatRooms()
        .then(setChatRooms)
        .catch(() => {})
        .finally(() => router.push(`/chat/${encodeURIComponent(roomId)}`));
    } else if (!accepted) {
      Alert.alert("매칭 거절", "상대방이 매칭을 거절했어요.");
    }
  }, [lastResolvedMatchRequest, clearLastResolvedMatchRequest, setCandidates, setMatching, setChatRooms]);

  useSyncNotificationUnread();

  const totalUnread = React.useMemo(
    () => chatRooms.reduce((sum, room) => sum + room.unreadMessageCount, 0),
    [chatRooms],
  );
  const chatBadge =
    totalUnread > 0 ? (totalUnread > 99 ? "99+" : totalUnread) : undefined;

  const screenOptions = React.useCallback(
    ({ route }: { route: { name: string } }) => ({
      headerShown: false,
      tabBarActiveTintColor: "#4C5BE2",
      tabBarInactiveTintColor: "#999",
      tabBarStyle: {
        height: 60 + insets.bottom,
        paddingBottom: Math.max(insets.bottom, 6),
        paddingTop: 6,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        marginBottom: 2,
      },
      tabBarIcon: ({
        color,
        size,
        focused,
      }: {
        color: string;
        size: number;
        focused: boolean;
      }) => {
        let iconName: keyof typeof Ionicons.glyphMap;

        if (route.name === "index") {
          iconName = focused ? "home" : "home-outline";
        } else if (route.name === "match") {
          iconName = focused ? "flash" : "flash-outline";
        } else if (route.name === "chat") {
          iconName = focused ? "chatbubble" : "chatbubble-outline";
        } else if (route.name === "partner") {
          iconName = focused ? "compass" : "compass-outline";
        } else {
          iconName = "ellipse";
        }

        return (
          <Ionicons
            name={iconName}
            size={route.name === "partner" ? size + 4 : size}
            color={color}
          />
        );
      },
    }),
    [insets.bottom],
  );

  React.useEffect(() => {
    connectChatWs();

    let isMounted = true;

    getChatRooms()
      .then((nextChatRooms) => {
        if (isMounted) setChatRooms(nextChatRooms);
      })
      .catch(() => {});

    const unsubscribe = addChatEventHandler((event) => {
      if (event.type !== "NEW_MESSAGE") return;

      const { messageId, roomId, senderId } = event.data;
      if (handledMessageIdsRef.current.has(messageId)) return;
      handledMessageIdsRef.current.add(messageId);

      const {
        selectedChatRoomId,
        chatRooms: currentChatRooms,
        messagesByRoomId,
        appendMessage,
        incrementUnreadCount,
        setChatRooms: syncChatRooms,
      } = useChatStore.getState();
      const currentUserId = useAuthStore.getState().userId;

      if (senderId === currentUserId) return;
      if (selectedChatRoomId === roomId) return;

      const message: ChatMessage = {
        id: messageId,
        chatRoomId: roomId,
        senderId,
        senderName: event.data.senderName,
        message: event.data.content,
        type: CHAT_MESSAGE_TYPE.USER,
        status: CHAT_MESSAGE_STATUS.SENT,
        isMine: false,
        createdAt: event.data.sentAt,
      };

      const roomExists = currentChatRooms.some((room) => room.id === roomId);
      const alreadyStored = (messagesByRoomId[roomId] ?? []).some(
        (item) => item.id === message.id,
      );

      if (roomExists) {
        if (!alreadyStored) appendMessage(roomId, message);
        incrementUnreadCount(roomId);
        return;
      }

      getChatRooms()
        .then(syncChatRooms)
        .catch(() => {});
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [setChatRooms]);

  return (
    <View style={{ flex: 1 }}>
      <Tabs screenOptions={screenOptions}>
        <Tabs.Screen name="index" options={{ title: "홈" }} />
        <Tabs.Screen name="partner" options={{ title: "탐색" }} />
        <Tabs.Screen name="match" options={{ title: "매칭현황" }} />
        <Tabs.Screen
          name="chat"
          options={{ title: "채팅", tabBarBadge: chatBadge }}
        />
      </Tabs>
      <MatchRequestToast />
    </View>
  );
}
