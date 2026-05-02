import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import DifficultyIcon from "@/assets/match/heroicons-chart-bar-16-solid.svg";
import LocationIcon from "@/assets/match/mdi-location.svg";
import ExerciseIcon from "@/assets/match/fluent-run-16-filled.svg";

export type MatchHistoryItem = {
  id: string;
  sourceType: "POST" | "PARTNER";
  status: "COMPLETED" | "CANCELLED";
  partnerName: string;
  partnerDepartment?: string;
  completedAt: string;
  location?: string;
  scheduledTime?: string;
  difficulty?: string;
  exerciseType?: string;
};

type MatchHistoryCardProps = {
  item: MatchHistoryItem;
  onChat?: () => void;
  onRetry?: () => void;
  onReview?: () => void;
};

export default function MatchHistoryCard({
  item,
  onChat,
  onRetry,
  onReview,
}: MatchHistoryCardProps) {
  const isPost = item.sourceType === "POST";
  const isCompleted = item.status === "COMPLETED";
  const badgeColor = isPost ? "#C8960C" : "#4E9B6A";

  const details = [
    item.location && {
      icon: <LocationIcon width={13} height={13} />,
      label: item.location,
    },
    item.scheduledTime && {
      icon: <Ionicons name="time-outline" size={13} color="#413F46" />,
      label: item.scheduledTime,
    },
    item.difficulty && {
      icon: <DifficultyIcon width={13} height={13} />,
      label: item.difficulty,
    },
    item.exerciseType && {
      icon: <ExerciseIcon width={13} height={13} />,
      label: item.exerciseType,
    },
  ].filter(Boolean) as { icon: React.ReactNode; label: string }[];

  return (
    <View style={styles.container}>
      <View style={[styles.badge, { backgroundColor: badgeColor }]}>
        {isPost ? (
          <ExerciseIcon width={14} height={14} />
        ) : (
          <Ionicons name="people-outline" size={14} color="#FFFFFF" />
        )}
        <Text style={styles.badgeText}>
          {isPost ? "운동 모집" : "파트너 모집"}
        </Text>
      </View>

      <View style={styles.card}>
        <Image
          source={require("../../../assets/match/Ellipse-12.png")}
          style={styles.avatar}
          contentFit="cover"
        />

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <View style={styles.nameBlock}>
              <Text style={styles.name} numberOfLines={1}>
                {item.partnerName}
              </Text>
              {item.partnerDepartment ? (
                <Text style={styles.department} numberOfLines={1}>
                  {item.partnerDepartment}
                </Text>
              ) : null}
            </View>
            <View style={styles.titleMeta}>
              <Text style={styles.date}>{item.completedAt}</Text>
              <View style={styles.openIndicator}>
                <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
              </View>
            </View>
          </View>

          <Text style={styles.statusText}>
            {isCompleted ? "매칭 완료" : "매칭 취소"}
          </Text>

          {details.length > 0 ? (
            <View style={styles.detailRow}>
              {details.map((detail) => (
                <View key={detail.label} style={styles.detailChip}>
                  {detail.icon}
                  <Text style={styles.detailText} numberOfLines={1}>
                    {detail.label}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}

          <View style={styles.actionRow}>
            <Pressable
              accessibilityRole="button"
              onPress={onRetry}
              style={[styles.actionButton, styles.retryActionButton]}
            >
              <Ionicons name="refresh" size={14} color="#4C5BE2" />
              <Text style={styles.actionText}>다시 매칭하기</Text>
            </Pressable>
            {isCompleted ? (
              <>
                <Pressable
                  accessibilityRole="button"
                  onPress={onChat}
                  style={styles.actionButton}
                >
                  <Ionicons
                    name="chatbubble-outline"
                    size={14}
                    color="#4C5BE2"
                  />
                  <Text style={styles.actionText}>채팅 보기</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={onReview}
                  style={styles.actionButton}
                >
                  <Ionicons name="star-outline" size={14} color="#4C5BE2" />
                  <Text style={styles.actionText}>평가하기</Text>
                </Pressable>
              </>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  badge: {
    alignSelf: "flex-start",
    minHeight: 28,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 12,
  },
  badgeText: {
    fontSize: 12,
    lineHeight: 16,
    color: "#FFFFFF",
    fontWeight: "800",
  },
  card: {
    flexDirection: "row",
    gap: 12,
    borderRadius: 16,
    borderTopLeftRadius: 0,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 14,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#EEF2FF",
  },
  content: {
    flex: 1,
    gap: 8,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  nameBlock: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minWidth: 0,
  },
  name: {
    fontSize: 15,
    lineHeight: 20,
    color: "#111827",
    fontWeight: "800",
    flexShrink: 0,
  },
  department: {
    fontSize: 12,
    lineHeight: 16,
    color: "#6B7280",
    fontWeight: "700",
    flexShrink: 1,
  },
  date: {
    fontSize: 12,
    lineHeight: 16,
    color: "#6B7280",
    fontWeight: "700",
  },
  titleMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexShrink: 0,
  },
  openIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
  },
  statusText: {
    fontSize: 15,
    lineHeight: 20,
    color: "#111827",
    fontWeight: "800",
  },
  detailRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 6,
    rowGap: 6,
  },
  detailChip: {
    flexBasis: "47%",
    flexGrow: 1,
    minHeight: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 8,
  },
  detailText: {
    flex: 1,
    minWidth: 0,
    fontSize: 12,
    lineHeight: 16,
    color: "#413F46",
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    gap: 6,
  },
  actionButton: {
    flex: 1,
    minHeight: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4C5BE2",
    paddingHorizontal: 4,
  },
  retryActionButton: {
    flex: 1.22,
  },
  actionText: {
    flexShrink: 1,
    fontSize: 10,
    lineHeight: 16,
    color: "#4C5BE2",
    fontWeight: "700",
    textAlign: "center",
  },
});
