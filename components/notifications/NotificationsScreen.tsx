import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type NotificationType = "파트너" | "일반";
type FilterType = "전체" | NotificationType;

type NotificationItem = {
  id: string;
  type: NotificationType;
  message: string;
  date: string;
  isRead: boolean;
};

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  { id: "1", type: "파트너", message: "나에게 파트너 신청을 보낸 친구가 있어요!", date: "2026년 4월 25일", isRead: false },
  { id: "2", type: "파트너", message: "나에게 파트너 신청을 보낸 친구가 있어요!", date: "2026년 4월 25일", isRead: false },
  { id: "3", type: "파트너", message: "나에게 파트너 신청을 보낸 친구가 있어요!", date: "2026년 4월 25일", isRead: false },
  { id: "4", type: "일반", message: "내가 신청한 운동 매칭이 성사되었어요!", date: "2026년 4월 25일", isRead: false },
  { id: "5", type: "파트너", message: "나에게 파트너 신청을 보낸 친구가 있어요!", date: "2026년 4월 25일", isRead: true },
  { id: "6", type: "일반", message: "내가 신청한 운동 매칭이 성사되었어요!", date: "2026년 4월 25일", isRead: true },
  { id: "7", type: "일반", message: "내 운동 매칭에 신청을 보낸 친구가 있어요!", date: "2026년 4월 25일", isRead: true },
  { id: "8", type: "파트너", message: "내가 신청한 파트너 매칭이 성사되었어요!", date: "2026년 4월 25일", isRead: true },
];

const FILTERS: { label: string; value: FilterType }[] = [
  { label: "전체", value: "전체" },
  { label: "파트너", value: "파트너" },
  { label: "일반", value: "일반" },
];

const PROFILE_IMAGE = require("../../assets/chat/Profileimage.png");

function NotificationRow({ item }: { item: NotificationItem }) {
  return (
    <View>
      <View style={[styles.row, !item.isRead && styles.rowUnread]}>
        <Image source={PROFILE_IMAGE} style={styles.avatar} contentFit="cover" />
        <View style={styles.rowText}>
          <Text style={[styles.message, !item.isRead && styles.messageUnread]}>
            {item.message}
          </Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
        {!item.isRead && <View style={styles.unreadDot} />}
      </View>
      <View style={styles.divider} />
    </View>
  );
}

export default function NotificationsScreen() {
  const [filter, setFilter] = React.useState<FilterType>("전체");

  const filtered = React.useMemo(
    () =>
      filter === "전체"
        ? MOCK_NOTIFICATIONS
        : MOCK_NOTIFICATIONS.filter((n) => n.type === filter),
    [filter],
  );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#111827" />
        </Pressable>
        <Text style={styles.headerTitle}>알림</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => {}}
          style={styles.markAllButton}
        >
          <Ionicons name="checkmark-done-outline" size={18} color="#4C5BE2" />
          <Text style={styles.markAllText}>전체확인</Text>
        </Pressable>
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((f) => {
          const selected = filter === f.value;
          return (
            <Pressable
              key={f.value}
              accessibilityRole="button"
              onPress={() => setFilter(f.value)}
              style={[styles.filterChip, selected && styles.filterChipActive]}
            >
              <Text style={[styles.filterText, selected && styles.filterTextActive]}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {filtered.length > 0 ? (
        <View>
          {filtered.map((item) => (
            <NotificationRow key={item.id} item={item} />
          ))}
        </View>
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>알림이 없어요.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    paddingBottom: 32,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.41,
  },
  markAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    height: 40,
  },
  markAllText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4C5BE2",
  },

  filterRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  filterChip: {
    minHeight: 32,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#4C5BE2",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  filterChipActive: {
    backgroundColor: "#4C5BE2",
  },
  filterText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
  },
  rowUnread: {
    backgroundColor: "#F5F7FF",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  rowText: {
    flex: 1,
    gap: 6,
  },
  message: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    lineHeight: 18,
    letterSpacing: -0.08,
  },
  messageUnread: {
    color: "#111827",
  },
  date: {
    fontSize: 11,
    color: "#9CA3AF",
    lineHeight: 13,
    letterSpacing: 0.07,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 16,
  },

  empty: {
    alignItems: "center",
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 15,
    color: "#9CA3AF",
    fontWeight: "600",
  },
});
