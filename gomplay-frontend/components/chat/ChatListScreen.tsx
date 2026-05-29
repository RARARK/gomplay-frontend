import { useCallback, useRef, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import ChatHeader from "./ChatHeader";
import Chatroom from "./Chatroom";
import { Color, FontFamily, FontSize } from "../GlobalStyles";
import { parseServerTimestamp } from "@/lib/utils/time";
import { getChatRooms } from "@/services/chat/chatService";
import { getGroupChatRooms } from "@/services/groupChat/groupChatService";
import { useChatStore } from "@/stores/chat/chatStore";
import type { ChatRoom } from "@/types/domain/chatRoom";
import type { GroupChatRoom } from "@/types/domain/groupChatRoom";

type UnifiedRoom = { chatRoom: ChatRoom; isGroup: boolean };

function mapGroupToChatRoom(room: GroupChatRoom): ChatRoom {
  const lastMessageAt =
    room.lastMessage?.sentAt ??
    room.lastMessage?.lastMessageAt ??
    room.lastMessage?.createdAt ??
    undefined;
  const matchStatus = room.gatheringStatus ?? "IN_PROGRESS";

  return {
    id: room.id,
    matchId: room.gatheringId,
    matchStatus,
    status: matchStatus === "COMPLETED" ? "READ_ONLY" : "ACTIVE",
    participants: [
      {
        id: room.gatheringId,
        name: room.gatheringTitle,
        profileImageUrl: room.hostProfileImageUrl || undefined,
      },
    ],
    lastMessage: room.lastMessage?.content ?? undefined,
    lastMessageAt,
    unreadMessageCount: 0,
    reviewed: room.reviewed ?? false,
    createdAt: room.createdAt,
  };
}

function getSortTimestamp(room: ChatRoom): number {
  const ts = room.lastMessageAt ?? room.createdAt;
  if (!ts) return 0;

  const time = parseServerTimestamp(ts).getTime();
  return Number.isFinite(time) ? time : 0;
}

function getRoomSortPriority(room: ChatRoom): number {
  return room.matchStatus === "COMPLETED" ? 1 : 0;
}

export default function ChatListScreen() {
  const chatRooms = useChatStore((state) => state.chatRooms);
  const setChatRooms = useChatStore((state) => state.setChatRooms);
  const [isLoading, setIsLoading] = useState(true);
  const [groupRooms, setGroupRooms] = useState<GroupChatRoom[]>([]);
  const requestIdRef = useRef(0);

  const loadRooms = useCallback(() => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    async function load() {
      if (chatRooms.length === 0 && groupRooms.length === 0) {
        setIsLoading(true);
      }
      try {
        const [individual, group] = await Promise.all([
          getChatRooms(),
          getGroupChatRooms(),
        ]);
        if (requestIdRef.current === requestId) {
          setChatRooms(individual);
          setGroupRooms(group);
        }
      } finally {
        if (requestIdRef.current === requestId) {
          setIsLoading(false);
        }
      }
    }

    void load();
    return () => {
      if (requestIdRef.current === requestId) {
        requestIdRef.current += 1;
        setIsLoading(false);
      }
    };
  }, [chatRooms.length, groupRooms.length, setChatRooms]);

  useFocusEffect(loadRooms);

  const unified: UnifiedRoom[] = [
    ...chatRooms.map((r) => ({ chatRoom: r, isGroup: false })),
    ...groupRooms.map((r) => ({ chatRoom: mapGroupToChatRoom(r), isGroup: true })),
  ].sort((a, b) => {
    const priorityDiff = getRoomSortPriority(a.chatRoom) - getRoomSortPriority(b.chatRoom);
    if (priorityDiff !== 0) return priorityDiff;
    return getSortTimestamp(b.chatRoom) - getSortTimestamp(a.chatRoom);
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <ChatHeader title="채팅" showBackButton={false} showMenuButton={false} />
        <View style={styles.listContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={Color.primary100} />
            </View>
          ) : (
            <FlatList
              data={unified}
              keyExtractor={(item) => `${item.isGroup ? "g" : "i"}-${item.chatRoom.id}`}
              renderItem={({ item }) => (
                <Chatroom
                  chatRoom={item.chatRoom}
                  onPress={
                    item.isGroup
                      ? (id) => router.push(`/group-chat/${encodeURIComponent(id)}` as any)
                      : undefined
                  }
                />
              )}
              contentContainerStyle={
                unified.length === 0 ? styles.emptyContainer : styles.listContent
              }
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={<EmptyState />}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyTitle, { fontFamily: FontFamily.inter }]}>아직 채팅이 없어요</Text>
      <Text style={[styles.emptyDescription, { fontFamily: FontFamily.inter }]}>
        매칭이 성사되거나 모집이 완료되면 여기에 채팅방이 나타나요.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Color.colorWhite },
  container: { flex: 1, backgroundColor: Color.colorWhite },
  listContainer: { flex: 1, paddingHorizontal: 15, paddingTop: 20 },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  listContent: { paddingBottom: 24 },
  emptyContainer: { flex: 1 },
  separator: { height: 16 },
  emptyState: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F7F8FC",
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "600",
    fontFamily: FontFamily.inter,
    color: "#111827",
  },
  emptyDescription: {
    fontSize: FontSize.fs_12,
    lineHeight: 16,
    fontFamily: FontFamily.inter,
    color: "#6B7280",
  },
});
