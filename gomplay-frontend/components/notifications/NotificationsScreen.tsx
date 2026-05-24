import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  getNotifications,
  markAllNotificationsRead,
} from "@/services/notification/notificationService";
import { useNotificationStore } from "@/stores/notification/notificationStore";
import type {
  NotificationApiType,
  NotificationItem,
  NotificationTab,
} from "@/types/domain/notification";

// ── 타입별 아이콘 / 색상 설정 ────────────────────────────────────────────────

type IconConfig = {
  name: keyof typeof Ionicons.glyphMap;
  bg: string;
  color: string;
};

const TYPE_ICON: Record<NotificationApiType, IconConfig> = {
  match_request:     { name: "flash",                   bg: "#EEF2FF", color: "#4C5BE2" },
  match_accepted:    { name: "checkmark-circle",        bg: "#DCFCE7", color: "#16A34A" },
  match_rejected:    { name: "close-circle",            bg: "#FEE2E2", color: "#EF4444" },
  gathering:         { name: "people",                  bg: "#EEF2FF", color: "#4C5BE2" },
  gathering_request: { name: "person-add",              bg: "#EDE9FE", color: "#7C3AED" },
  review_available:  { name: "star",                    bg: "#FEF9C3", color: "#CA8A04" },
  match_end_confirm: { name: "flag",                    bg: "#FFEDD5", color: "#EA580C" },
  match_auto_ended:  { name: "time",                    bg: "#F3F4F6", color: "#6B7280" },
  review:            { name: "star-half",               bg: "#FEF9C3", color: "#CA8A04" },
  point:             { name: "diamond",                 bg: "#F5F3FF", color: "#7C3AED" },
};

// ── 탭 필터 ──────────────────────────────────────────────────────────────────

type FilterOption = { label: string; tab: NotificationTab };

const FILTERS: FilterOption[] = [
  { label: "전체",   tab: "all"     },
  { label: "파트너", tab: "partner" },
  { label: "일반",   tab: "general" },
];

// ── 시간 포맷 ─────────────────────────────────────────────────────────────────

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1)  return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24)   return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days === 1)   return "어제";
  if (days < 7)     return `${days}일 전`;
  const d = new Date(iso);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

// ── 타입별 이동 ───────────────────────────────────────────────────────────────

function handleNotificationPress(item: NotificationItem) {
  const id = item.refId;
  switch (item.type) {
    case "gathering":
    case "gathering_request":
      if (id) router.push(`/posts/${id}` as any);
      break;
    case "review_available":
      if (id) router.push(`/review/${id}` as any);
      break;
    case "match_request":
    case "match_accepted":
    case "match_rejected":
    case "match_end_confirm":
    case "match_auto_ended":
      router.push("/(tabs)/match" as any);
      break;
    case "review":
      router.push("/matches/history" as any);
      break;
    case "point":
      router.push("/point-logs" as any);
      break;
    default:
      break;
  }
}

// ── 알림 행 ───────────────────────────────────────────────────────────────────

function NotificationRow({ item }: { item: NotificationItem }) {
  const iconCfg = TYPE_ICON[item.type] ?? TYPE_ICON.point;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => handleNotificationPress(item)}
      style={({ pressed }) => [
        styles.row,
        !item.read && styles.rowUnread,
        pressed && styles.rowPressed,
      ]}
    >
      {/* 타입 아이콘 */}
      <View style={[styles.iconCircle, { backgroundColor: iconCfg.bg }]}>
        <Ionicons name={iconCfg.name} size={22} color={iconCfg.color} />
      </View>

      {/* 텍스트 */}
      <View style={styles.rowText}>
        <Text style={[styles.title, !item.read && styles.titleUnread]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.body} numberOfLines={2}>
          {item.body}
        </Text>
        <Text style={styles.time}>{formatRelativeTime(item.createdAt)}</Text>
      </View>

      {/* 미읽음 점 */}
      {!item.read && <View style={styles.unreadDot} />}
    </Pressable>
  );
}

// ── 메인 화면 ─────────────────────────────────────────────────────────────────

export default function NotificationsScreen() {
  const [activeTab, setActiveTab] = React.useState<NotificationTab>("all");
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { setUnreadCount, clearUnread } = useNotificationStore();

  React.useEffect(() => {
    let alive = true;
    setIsLoading(true);
    setError(null);

    getNotifications(activeTab)
      .then((data) => {
        if (!alive) return;
        setNotifications(data);
        // 전체 탭 기준으로 미읽음 수 동기화
        if (activeTab === "all") {
          setUnreadCount(data.filter((n) => !n.read).length);
        }
      })
      .catch((err) => {
        if (alive) {
          setNotifications([]);
          setError(err instanceof Error ? err.message : "알림을 불러오지 못했어요.");
        }
      })
      .finally(() => { if (alive) setIsLoading(false); });

    return () => { alive = false; };
  }, [activeTab, setUnreadCount]);

  const handleMarkAllRead = React.useCallback(() => {
    markAllNotificationsRead()
      .then(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        clearUnread();
      })
      .catch(() => {});
  }, [clearUnread]);

  const hasUnread = notifications.some((n) => !n.read);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* 헤더 */}
      <View style={styles.headerRow}>
        <Pressable
          accessibilityRole="button"
          onPress={() => (router.canGoBack() ? router.back() : router.replace("/" as any))}
          style={styles.headerBtn}
          hitSlop={10}
        >
          <Ionicons name="chevron-back" size={28} color="#111827" />
        </Pressable>

        <Text pointerEvents="none" style={styles.headerTitle}>알림</Text>

        <Pressable
          accessibilityRole="button"
          onPress={handleMarkAllRead}
          disabled={!hasUnread}
          style={styles.headerBtn}
        >
          <Ionicons
            name="checkmark-done-outline"
            size={22}
            color={hasUnread ? "#4C5BE2" : "#D1D5DB"}
          />
        </Pressable>
      </View>

      {/* 필터 탭 */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => {
          const active = activeTab === f.tab;
          return (
            <Pressable
              key={f.tab}
              accessibilityRole="button"
              onPress={() => setActiveTab(f.tab)}
              style={[styles.filterChip, active && styles.filterChipActive]}
            >
              <Text style={[styles.filterText, active && styles.filterTextActive]}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* 목록 */}
      {isLoading ? (
        <View style={styles.stateBox}>
          <ActivityIndicator color="#4C5BE2" />
        </View>
      ) : error ? (
        <View style={styles.stateBox}>
          <Ionicons name="alert-circle-outline" size={40} color="#D1D5DB" />
          <Text style={styles.stateText}>{error}</Text>
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.stateBox}>
          <Ionicons name="notifications-off-outline" size={40} color="#D1D5DB" />
          <Text style={styles.stateText}>알림이 없어요.</Text>
        </View>
      ) : (
        <View>
          {notifications.map((item, idx) => (
            <React.Fragment key={item.id}>
              <NotificationRow item={item} />
              {idx < notifications.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

// ── 스타일 ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    paddingBottom: 40,
  },

  // 헤더
  headerRow: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  headerBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
    color: "#111827",
  },

  // 필터
  filterRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  filterChip: {
    minHeight: 34,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  filterChipActive: {
    borderColor: "#4C5BE2",
    backgroundColor: "#4C5BE2",
  },
  filterText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },

  // 알림 행
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
  },
  rowUnread: {
    backgroundColor: "#F5F7FF",
  },
  rowPressed: {
    opacity: 0.8,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  rowText: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#9CA3AF",
    lineHeight: 19,
  },
  titleUnread: {
    color: "#111827",
  },
  body: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280",
    lineHeight: 18,
  },
  time: {
    fontSize: 11,
    color: "#9CA3AF",
    lineHeight: 15,
    marginTop: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4C5BE2",
    flexShrink: 0,
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginHorizontal: 16,
  },

  // 빈 상태
  stateBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  stateText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "600",
  },
});
