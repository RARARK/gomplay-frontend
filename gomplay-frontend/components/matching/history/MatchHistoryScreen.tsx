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
import OpponentProfileModal, {
  type OpponentProfileData,
} from "@/components/matching/OpponentProfileModal";
import { getMatchHistory } from "@/services/matching/matchingService";
import type { MatchHistoryEntry } from "@/types/domain/match";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${m}.${day}`;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function mapEntryToItem(entry: MatchHistoryEntry): MatchHistoryItem {
  const isGathering = entry.type === "GATHERING";
  const dateSource = isGathering ? entry.scheduledAt : entry.matchedAt;
  return {
    id: String(entry.id),
    sourceType: isGathering ? "POST" : "PARTNER",
    partnerName: entry.partnerName,
    partnerProfileImageUrl: entry.partnerProfileImageUrl,
    partnerDepartment: entry.partnerDepartment,
    partnerStudentNumber: entry.partnerStudentNumber,
    completedAt: dateSource ? formatDate(dateSource) : "",
    location: entry.location ?? undefined,
    scheduledTime: entry.scheduledAt ? formatTime(entry.scheduledAt) : undefined,
    exerciseType: entry.sportType ?? undefined,
    reviewed: entry.reviewed,
    gatheringId: isGathering ? entry.id : undefined,
    partnerIsVerified: entry.partnerIsVerified,
    partnerMannerTemperature: entry.partnerMannerTemperature,
    partnerMatchCount: entry.partnerMatchCount,
    partnerNoShowCount: entry.partnerNoShowCount,
    partnerStyle: entry.partnerStyle,
    partnerExerciseIntensity: entry.partnerExerciseIntensity,
    partnerExerciseReason: entry.partnerExerciseReason,
    partnerExerciseTypes: entry.partnerExerciseTypes,
  };
}

function mapItemToProfileData(item: MatchHistoryItem): OpponentProfileData {
  return {
    name: item.partnerName,
    department: item.partnerDepartment,
    studentId: item.partnerStudentNumber,
    profileImageUrl: item.partnerProfileImageUrl,
    isVerified: item.partnerIsVerified,
    partnerStyle: item.partnerStyle,
    exerciseIntensity: item.partnerExerciseIntensity,
    exerciseReason: item.partnerExerciseReason,
    exerciseTypes: item.partnerExerciseTypes ?? (item.exerciseType ? [item.exerciseType] : undefined),
    mannerTemperature: item.partnerMannerTemperature,
    matchCount: item.partnerMatchCount,
    noShowCount: item.partnerNoShowCount,
    matchStatus: "COMPLETED",
  };
}

export default function MatchHistoryScreen() {
  const insets = useSafeAreaInsets();
  const [history, setHistory] = React.useState<MatchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [profileModal, setProfileModal] = React.useState<OpponentProfileData | null>(null);

  React.useEffect(() => {
    getMatchHistory()
      .then((data) => {
        const seen = new Set<number>();
        const deduped = data.filter((entry) => {
          if (seen.has(entry.id)) return false;
          seen.add(entry.id);
          return true;
        });
        const sorted = deduped.sort((a, b) => {
          const dateA = a.scheduledAt ?? a.matchedAt ?? "";
          const dateB = b.scheduledAt ?? b.matchedAt ?? "";
          return dateB.localeCompare(dateA);
        });
        setHistory(sorted.map(mapEntryToItem));
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.content, { paddingBottom: 32 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View style={styles.backButton} />
          <Text pointerEvents="none" style={styles.headerTitle}>매치 히스토리</Text>
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
                onChat={
                  item.chatRoomId
                    ? () => router.push(`/chat/${item.chatRoomId}` as any)
                    : undefined
                }
                onReview={
                  !item.reviewed && item.gatheringId != null
                    ? () => router.push(`/review/${item.gatheringId}?type=gathering` as any)
                    : undefined
                }
                onViewProfile={() => setProfileModal(mapItemToProfileData(item))}
              />
            ))}
          </View>
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>해당하는 매치 기록이 없어요.</Text>
          </View>
        )}
      </ScrollView>
      {profileModal && (
        <OpponentProfileModal
          visible
          data={profileModal}
          onClose={() => setProfileModal(null)}
        />
    )}
    </>
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
  },
  headerTitle: {
    position: "absolute",
    left: 0,
    right: 0,
    alignSelf: "center",
    fontSize: 20,
    lineHeight: 28,
    color: "#111827",
    fontWeight: "800",
    textAlign: "center",
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
