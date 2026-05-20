import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
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

import { getNotifications, markAllNotificationsRead } from "@/services/notification/notificationService";
import type { NotificationItem, NotificationTab } from "@/types/domain/notification";

type FilterOption = { label: string; tab: NotificationTab };

const FILTERS: FilterOption[] = [
  { label: "전체", tab: "all" },
  { label: "파트너", tab: "partner" },
  { label: "일반", tab: "general" },
];

const PROFILE_IMAGE = require("../../assets/chat/Profileimage.png");

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

function NotificationRow({ item }: { item: NotificationItem }) {
  return (
    <View>
      <View style={[styles.row, !item.read && styles.rowUnread]}>
        <Image source={PROFILE_IMAGE} style={styles.avatar} contentFit="cover" />
        <View style={styles.rowText}>
          <Text style={[styles.message, !item.read && styles.messageUnread]}>
            {item.body}
          </Text>
          <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
        </View>
        {!item.read && <View style={styles.unreadDot} />}
      </View>
      <View style={styles.divider} />
    </View>
  );
}

export default function NotificationsScreen() {
  const [activeTab, setActiveTab] = React.useState<NotificationTab>("all");
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    getNotifications(activeTab)
      .then((data) => {
        if (isMounted) setNotifications(data);
      })
      .catch((err) => {
        if (isMounted) {
          setNotifications([]);
          setError(err instanceof Error ? err.message : "알림을 불러오지 못했어요.");
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, [activeTab]);

  const handleMarkAllRead = React.useCallback(() => {
    markAllNotificationsRead()
      .then(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      })
      .catch(() => {});
  }, []);

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/" as any);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <Pressable
          accessibilityRole="button"
          onPress={handleBackPress}
          style={styles.backButton}
          hitSlop={10}
        >
          <Ionicons name="chevron-back" size={28} color="#111827" />
        </Pressable>
        <Text pointerEvents="none" style={styles.headerTitle}>알림</Text>
        <Pressable
          accessibilityRole="button"
          onPress={handleMarkAllRead}
          style={styles.markAllButton}
        >
          <Ionicons name="checkmark-done-outline" size={18} color="#4C5BE2" />
          <Text style={styles.markAllText}>전체확인</Text>
        </Pressable>
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((f) => {
          const selected = activeTab === f.tab;
          return (
            <Pressable
              key={f.tab}
              accessibilityRole="button"
              onPress={() => setActiveTab(f.tab)}
              style={[styles.filterChip, selected && styles.filterChipActive]}
            >
              <Text style={[styles.filterText, selected && styles.filterTextActive]}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {isLoading ? (
        <View style={styles.stateBox}>
          <ActivityIndicator color="#4C5BE2" />
        </View>
      ) : error ? (
        <View style={styles.stateBox}>
          <Text style={styles.emptyText}>{error}</Text>
        </View>
      ) : notifications.length > 0 ? (
        <View>
          {notifications.map((item) => (
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
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  headerTitle: {
    position: "absolute",
    left: 0,
    right: 0,
    alignSelf: "center",
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },
  markAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    height: 40,
    zIndex: 1,
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

  stateBox: {
    alignItems: "center",
    paddingTop: 80,
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
