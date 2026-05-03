import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import { Border, Color, FontFamily, FontSize } from "../GlobalStyles";
import {
  getChatRoomParticipantDisplayName,
  type ChatRoom,
} from "@/types/domain/chatRoom";

export type ChatroomProps = {
  chatRoom: ChatRoom;
  onPress?: (chatRoomId: number) => void;
};

export default function Chatroom({
  chatRoom,
  onPress,
}: ChatroomProps) {
  const {
    id,
    participants,
    lastMessage,
    lastMessageAt,
    unreadMessageCount,
  } = chatRoom;
  const partnerDisplayName = getChatRoomParticipantDisplayName(participants);

  const handlePress = () => {
    if (onPress) {
      onPress(id);
      return;
    }

    router.push(`/chat/${encodeURIComponent(id)}`);
  };
  return (
    <Pressable
      accessibilityLabel={`Open chat with ${partnerDisplayName}`}
      accessibilityRole="button"
      onPress={handlePress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.content}>
        <Image
          source={require("../../assets/chat/Profileimage.png")}
          style={styles.avatar}
        />

        <View style={styles.messageBlock}>
          <Text numberOfLines={1} style={styles.name}>
            {partnerDisplayName}
          </Text>
          <Text numberOfLines={1} style={styles.previewMessage}>
            {lastMessage ?? "No messages yet."}
          </Text>
        </View>
      </View>

      <View style={styles.meta}>
        <Text style={styles.timestamp}>{formatChatListTime(lastMessageAt)}</Text>
        {unreadMessageCount > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadMessageCount}</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

function formatChatListTime(timestamp?: string) {
  if (!timestamp) {
    return "";
  }

  const date = new Date(timestamp);
  const now = new Date();
  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isSameDay) {
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

const styles = StyleSheet.create({
  card: {
    minHeight: 100,
    borderRadius: Border.br_8,
    borderWidth: 1,
    borderColor: Color.colorSilver,
    backgroundColor: Color.colorAliceblue,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  cardPressed: {
    opacity: 0.88,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    resizeMode: "cover",
  },
  messageBlock: {
    flex: 1,
    gap: 8,
  },
  name: {
    fontSize: FontSize.fs_17,
    lineHeight: 22,
    fontWeight: "600",
    fontFamily: FontFamily.inter,
    color: Color.labelsPrimary,
  },
  previewMessage: {
    fontSize: FontSize.fs_12,
    lineHeight: 16,
    fontFamily: FontFamily.inter,
    color: Color.neutral700,
  },
  meta: {
    alignItems: "flex-end",
    gap: 8,
  },
  timestamp: {
    fontSize: FontSize.fs_12,
    lineHeight: 16,
    fontFamily: FontFamily.inter,
    color: Color.neutral700,
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Color.primary100,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: FontSize.fs_12,
    lineHeight: 16,
    fontWeight: "600",
    fontFamily: FontFamily.inter,
    color: Color.colorWhite,
  },
});
