import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import MatchHistoryCard, {
  type MatchHistoryItem,
} from "@/components/matching/history/MatchHistoryCard";

type HistoryFilter = "ALL" | "COMPLETED" | "CANCELLED";

const FILTERS: { label: string; value: HistoryFilter }[] = [
  { label: "전체", value: "ALL" },
  { label: "매칭 완료", value: "COMPLETED" },
  { label: "매칭 취소", value: "CANCELLED" },
];

const MOCK_HISTORY: MatchHistoryItem[] = [
  {
    id: "history-1",
    sourceType: "POST",
    status: "COMPLETED",
    partnerName: "김단국",
    partnerDepartment: "소프트웨어학과",
    completedAt: "2026-04-04",
    location: "체육관",
    scheduledTime: "19:00~21:00",
    difficulty: "초보",
    exerciseType: "풋살",
  },
  {
    id: "history-2",
    sourceType: "PARTNER",
    status: "COMPLETED",
    partnerName: "김단국",
    partnerDepartment: "소프트웨어학과",
    completedAt: "2026-04-04",
    location: "장소 협의",
    scheduledTime: "시간 협의",
    difficulty: "난이도 협의",
    exerciseType: "종목 협의",
  },
  {
    id: "history-3",
    sourceType: "POST",
    status: "CANCELLED",
    partnerName: "이서윤",
    partnerDepartment: "체육교육과",
    completedAt: "2026-04-02",
    location: "서양대 체육관",
    scheduledTime: "18:30~20:00",
    difficulty: "가볍게",
    exerciseType: "배드민턴",
  },
];

export default function MatchHistoryScreen() {
  const [filter, setFilter] = React.useState<HistoryFilter>("ALL");

  const filteredHistory = React.useMemo(
    () =>
      filter === "ALL"
        ? MOCK_HISTORY
        : MOCK_HISTORY.filter((item) => item.status === filter),
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
          <Ionicons name="chevron-back" size={28} color="#111111" />
        </Pressable>
        <Text style={styles.headerTitle}>매치 히스토리</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        horizontal
        bounces={false}
        overScrollMode="never"
        showsHorizontalScrollIndicator={false}
        style={styles.filterScrollView}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map((item) => {
          const selected = filter === item.value;

          return (
            <Pressable
              key={item.value}
              accessibilityRole="button"
              onPress={() => setFilter(item.value)}
              style={[styles.filterChip, selected && styles.filterChipActive]}
            >
              <Text
                style={[styles.filterText, selected && styles.filterTextActive]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {filteredHistory.length > 0 ? (
        <View style={styles.list}>
          {filteredHistory.map((item) => (
            <MatchHistoryCard
              key={item.id}
              item={item}
              onReview={() => router.push(`/review/${item.id}` as any)}
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
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
  filterScrollView: {
    flexGrow: 0,
    marginHorizontal: -16,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
  },
  filterChip: {
    minHeight: 32,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#4C5BE2",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  filterChipActive: {
    backgroundColor: "#4C5BE2",
  },
  filterText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#070322",
    fontWeight: "700",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  list: {
    gap: 16,
  },
  empty: {
    alignItems: "center",
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#9CA3AF",
    fontWeight: "700",
  },
});
