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
import OpponentProfileModal, {
  type OpponentProfileData,
} from "@/components/matching/OpponentProfileModal";
const MOCK_HISTORY: MatchHistoryItem[] = [
  {
    id: "1",
    sourceType: "POST",
    partnerName: "김단국",
    partnerDepartment: "소프트웨어학과",
    partnerStudentNumber: "20학번",
    completedAt: "2026-04-04",
    location: "체육관",
    scheduledTime: "19:00 ~ 21:00",
    difficulty: "초보자",
    exerciseType: "풋살",
    reviewed: false,
    chatRoomId: 3,
    partnerIsVerified: true,
    partnerMannerTemperature: 92,
    partnerMatchCount: 18,
    partnerNoShowCount: 0,
    partnerStyle: "독립형",
    partnerExerciseIntensity: "꾸준형",
    partnerExerciseReason: "건강관리",
    partnerExerciseTypes: ["풋살", "헬스", "러닝", "배드민턴", "농구"],
  },
  {
    id: "2",
    sourceType: "PARTNER",
    partnerName: "이서윤",
    partnerDepartment: "체육교육과",
    partnerStudentNumber: "21학번",
    completedAt: "2026-04-04",
    reviewed: true,
    chatRoomId: 7,
  },
  {
    id: "3",
    sourceType: "POST",
    partnerName: "박지훈",
    partnerDepartment: "컴퓨터공학과",
    partnerStudentNumber: "22학번",
    completedAt: "2026-04-02",
    location: "서양대 체육관",
    scheduledTime: "18:30 ~ 20:00",
    difficulty: "가볍게",
    exerciseType: "배드민턴",
    reviewed: true,
    chatRoomId: 5,
  },
  {
    id: "4",
    sourceType: "PARTNER",
    partnerName: "최민준",
    partnerDepartment: "스포츠과학과",
    partnerStudentNumber: "23학번",
    completedAt: "2026-03-28",
    reviewed: false,
    chatRoomId: 9,
  },
];

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
  const [history, setHistory] = React.useState<MatchHistoryItem[]>(MOCK_HISTORY);
  const [isLoading, setIsLoading] = React.useState(false);
  const [profileModal, setProfileModal] = React.useState<OpponentProfileData | null>(null);

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/" as any);
  };

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
                item.reviewed
                  ? undefined
                  : () =>
                      router.push(
                        `/review/${item.gatheringId}?type=gathering` as any,
                      )
              }
              onViewProfile={() =>
                setProfileModal({
                  name: item.partnerName,
                  department: item.partnerDepartment,
                  studentId: item.partnerStudentNumber,
                  profileImageUrl: item.partnerProfileImageUrl,
                  isVerified: item.partnerIsVerified,
                  partnerStyle: item.partnerStyle,
                  exerciseIntensity: item.partnerExerciseIntensity,
                  exerciseReason: item.partnerExerciseReason,
                  exerciseTypes:
                    item.partnerExerciseTypes ??
                    (item.exerciseType ? [item.exerciseType] : undefined),
                  mannerTemperature: item.partnerMannerTemperature,
                  matchCount: item.partnerMatchCount,
                  noShowCount: item.partnerNoShowCount,
                  matchStatus: "COMPLETED",
                })
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
