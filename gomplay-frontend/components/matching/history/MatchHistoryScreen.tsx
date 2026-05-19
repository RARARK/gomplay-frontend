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
import { useSafeAreaInsets } from "react-native-safe-area-context";

import MatchHistoryCard, {
  type MatchHistoryItem,
} from "@/components/matching/history/MatchHistoryCard";
import { getGatheringHistory } from "@/services/gathering/gatheringService";

function formatDate(iso: string) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatTimeRange(start: string, end: string) {
  const fmt = (iso: string) =>
    new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  return `${fmt(start)}~${fmt(end)}`;
}

export default function MatchHistoryScreen() {
  const insets = useSafeAreaInsets();
  const [history, setHistory] = React.useState<MatchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const items = await getGatheringHistory();
        if (!isMounted) return;
        setHistory(
          items.map((item) => ({
            id: String(item.id),
            sourceType: "POST" as const,
            status: "COMPLETED" as const,
            partnerName: item.title,
            completedAt: formatDate(item.scheduledAt),
            location: item.venue,
            scheduledTime: formatTimeRange(item.scheduledAt, item.scheduledEndAt),
            exerciseType: item.sportType,
            reviewed: item.reviewed,
            gatheringId: item.id,
          })),
        );
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void load();
    return () => { isMounted = false; };
  }, []);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingBottom: 32 + insets.bottom }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#111111" />
        </Pressable>
        <Text style={styles.headerTitle}>매치 히스토리</Text>
        <View style={styles.headerSpacer} />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#4C5BE2" />
        </View>
      ) : history.length > 0 ? (
        <View style={styles.list}>
          {history.map((item) => (
            <MatchHistoryCard
              key={item.id}
              item={item}
              onReview={
                item.reviewed
                  ? undefined
                  : () =>
                      router.push(
                        `/review/${item.gatheringId}?type=gathering` as any,
                      )
              }
            />
          ))}
        </View>
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>해당하는 매치 기록이 없어요.</Text>
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
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    lineHeight: 28,
    color: "#111827",
    fontWeight: "800",
  },
  headerSpacer: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  list: {
    gap: 16,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#9CA3AF",
    fontWeight: "700",
  },
});
