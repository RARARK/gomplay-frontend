import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import { Border, Color, FontFamily, FontSize } from "../GlobalStyles";
import {
  getChatRoomParticipantDisplayName,
  type ChatRoom,
} from "@/types/domain/chatRoom";
import { MATCH_STATUS } from "@/types/domain/match";

export type ChatroomProps = {
  chatRoom: ChatRoom;
  onPress?: (chatRoomId: number) => void;
};

type BadgeVariant = "outline-primary" | "filled-blue" | "filled-gray";

type StatusBadge = {
  label: string;
  variant: BadgeVariant;
};

function getStatusBadge(chatRoom: ChatRoom): StatusBadge | null {
  const { matchStatus, reviewed } = chatRoom;
  if (matchStatus === MATCH_STATUS.COMPLETED && !reviewed) {
    return { label: "평가 필요", variant: "outline-primary" };
  }
  if (matchStatus === MATCH_STATUS.COMPLETED && reviewed) {
    return { label: "운동 완료", variant: "filled-gray" };
  }
  return null;
}

export default function Chatroom({ chatRoom, onPress }: ChatroomProps) {
  const {
    id,
    participants,
    lastMessage,
    lastMessageAt,
    unreadMessageCount,
  } = chatRoom;
  const partnerDisplayName = getChatRoomParticipantDisplayName(participants);
  const badge = getStatusBadge(chatRoom);

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
          <View style={styles.nameRow}>
            <Text numberOfLines={1} style={styles.name}>
              {partnerDisplayName}
            </Text>
            {badge ? (
              <View style={[styles.statusBadge, statusBadgeContainer[badge.variant]]}>
                <Text style={[styles.statusBadgeText, statusBadgeTextColor[badge.variant]]}>
                  {badge.label}
                </Text>
              </View>
            ) : null}
          </View>
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
  if (!timestamp) return "";

  const date = new Date(timestamp);
  const now = new Date();
  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isSameDay) {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

const statusBadgeContainer: Record<BadgeVariant, object> = {
  "outline-primary": {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#4C5BE2",
  },
  "filled-blue": {
    backgroundColor: "#4C5BE2",
  },
  "filled-gray": {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
};

const statusBadgeTextColor: Record<BadgeVariant, object> = {
  "outline-primary": { color: "#4C5BE2" },
  "filled-blue": { color: "#FFFFFF" },
  "filled-gray": { color: "#6B7280" },
};

const styles = StyleSheet.create({
  card: {
    minHeight: 100,
    borderRadius: Border.br_8,
    borderWidth: 1,
    borderColor: "#F0F0F5",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
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
    gap: 6,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "nowrap",
  },
  name: {
    fontSize: FontSize.fs_17,
    lineHeight: 22,
    fontWeight: "600",
    fontFamily: FontFamily.inter,
    color: Color.labelsPrimary,
    flexShrink: 1,
  },
  statusBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
    flexShrink: 0,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    fontFamily: FontFamily.inter,
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
