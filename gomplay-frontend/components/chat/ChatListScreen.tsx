import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import ChatHeader from "./ChatHeader";
import Chatroom from "./Chatroom";
import { Color } from "../GlobalStyles";
import { parseServerTimestamp } from "@/lib/utils/time";
import { getChatRooms } from "@/services/chat/chatService";
import { getGroupChatRooms } from "@/services/groupChat/groupChatService";
import { useChatStore } from "@/stores/chat/chatStore";
import type { ChatRoom } from "@/types/domain/chatRoom";
import type { GroupChatRoom } from "@/types/domain/groupChatRoom";

type UnifiedRoom = { chatRoom: ChatRoom; isGroup: boolean };

function mapGroupToChatRoom(room: GroupChatRoom): ChatRoom {
  return {
    id: room.id,
    matchId: room.gatheringId,
    matchStatus: "IN_PROGRESS",
    status: "ACTIVE",
    participants: [
      {
        id: room.gatheringId,
        name: room.gatheringTitle,
        profileImageUrl: room.hostProfileImageUrl ?? undefined,
      },
    ],
    lastMessage: room.lastMessage?.content ?? undefined,
    lastMessageAt: room.lastMessage?.sentAt ?? undefined,
    unreadMessageCount: 0,
    reviewed: false,
    createdAt: room.createdAt,
  };
}

function sortKey(room: ChatRoom): number {
  const ts = room.lastMessageAt ?? room.createdAt;
  return ts ? -parseServerTimestamp(ts).getTime() : 0;
}

export default function ChatListScreen() {
  const chatRooms = useChatStore((state) => state.chatRooms);
  const setChatRooms = useChatStore((state) => state.setChatRooms);
  const [isLoading, setIsLoading] = useState(true);
  const [groupRooms, setGroupRooms] = useState<GroupChatRoom[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const [individual, group] = await Promise.all([
          getChatRooms(),
          getGroupChatRooms(),
        ]);
        if (isMounted) {
          setChatRooms(individual);
          setGroupRooms(group);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void load();
    return () => { isMounted = false; };
  }, [setChatRooms]);

  const unified: UnifiedRoom[] = [
    ...chatRooms.map((r) => ({ chatRoom: r, isGroup: false })),
    ...groupRooms.map((r) => ({ chatRoom: mapGroupToChatRoom(r), isGroup: true })),
  ].sort((a, b) => sortKey(a.chatRoom) - sortKey(b.chatRoom));

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
  const { Text } = require("react-native");
  const { FontFamily, FontSize } = require("../GlobalStyles");
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
    color: "#111827",
  },
  emptyDescription: {
    fontSize: 12,
    lineHeight: 16,
    color: "#6B7280",
  },
});
