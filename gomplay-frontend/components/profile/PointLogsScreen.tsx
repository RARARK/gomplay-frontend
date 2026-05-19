import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { getPointLogs } from "@/services/point/pointService";
import type { PointLog, PointLogReason } from "@/types/domain/point";

const REASON_LABELS: Record<PointLogReason, string> = {
  signup: "가입 보너스",
  quick_match: "퀵매치",
  gathering: "모임 참여",
  attendance: "출석 체크",
  review: "후기 작성",
  no_show: "노쇼",
  first_match: "첫 매칭",
  match_complete: "매칭 완료",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = d.getHours().toString().padStart(2, "0");
  const min = d.getMinutes().toString().padStart(2, "0");
  return `${month}월 ${day}일 ${hour}:${min}`;
}

function PointLogItem({ item }: { item: PointLog }) {
  const isPositive = item.delta >= 0;
  const label = REASON_LABELS[item.reason] ?? item.reason;

  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <Text style={styles.itemLabel}>{label}</Text>
        <Text style={styles.itemDate}>{formatDate(item.createdAt)}</Text>
      </View>
      <View style={styles.itemRight}>
        <Text style={[styles.itemDelta, isPositive ? styles.positive : styles.negative]}>
          {isPositive ? `+${item.delta}` : `${item.delta}`}
        </Text>
        <Text style={styles.itemBalance}>{item.balanceSnapshot.toLocaleString()}P</Text>
      </View>
    </View>
  );
}

export default function PointLogsScreen() {
  const [logs, setLogs] = React.useState<PointLog[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    getPointLogs()
      .then(setLogs)
      .catch((e) => setError(e instanceof Error ? e.message : "오류가 발생했습니다."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </Pressable>
        <Text style={styles.headerTitle}>포인트 내역</Text>
        <View style={styles.headerSpacer} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4C5BE2" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : logs.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>포인트 내역이 없어요</Text>
        </View>
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <PointLogItem item={item} />}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.3,
  },
  headerSpacer: {
    width: 32,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 14,
    color: "#EF4444",
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  list: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  itemLeft: {
    gap: 4,
  },
  itemLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    letterSpacing: -0.2,
  },
  itemDate: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  itemRight: {
    alignItems: "flex-end",
    gap: 2,
  },
  itemDelta: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  positive: {
    color: "#4C5BE2",
  },
  negative: {
    color: "#EF4444",
  },
  itemBalance: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  separator: {
    height: 1,
    backgroundColor: "#F3F4F6",
  },
});
