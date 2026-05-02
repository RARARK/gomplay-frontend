import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import DifficultyIcon from "@/assets/match/heroicons-chart-bar-16-solid.svg";
import ExerciseIcon from "@/assets/match/fluent-run-16-filled.svg";

export type MatchSourceType = "POST" | "PARTNER";
export type MatchStatus = "IN_PROGRESS" | "PENDING";
export type MatchRole = "HOST" | "GUEST";

export type MatchItem = {
  id: string;
  sourceType: MatchSourceType;
  status: MatchStatus;
  role: MatchRole;
  partnerName: string;
  partnerDepartment?: string;
  location?: string;
  scheduledTime?: string;
  difficulty?: string;
  exerciseType?: string;
  applicantCount?: number;
};

type MatchStatusCardProps = {
  item: MatchItem;
  onComplete?: () => void;
  onChat?: () => void;
  onViewApplicants?: () => void;
};

export default function MatchStatusCard({
  item,
  onComplete,
  onChat,
  onViewApplicants,
}: MatchStatusCardProps) {
  const isInProgress = item.status === "IN_PROGRESS";
  const isHost = item.role === "HOST";
  const isPost = item.sourceType === "POST";

  const badgeColor = isPost ? "#C8960C" : "#4E9B6A";
  const statusLabel = isInProgress ? "진행중" : "수락 대기";

  const location = isPost ? item.location : (item.location ?? "장소 협의");
  const scheduledTime = isPost
    ? item.scheduledTime
    : (item.scheduledTime ?? "시간 협의");
  const difficulty = isPost
    ? item.difficulty
    : (item.difficulty ?? "난이도 협의");
  const exerciseType = isPost
    ? item.exerciseType
    : (item.exerciseType ?? "종목 협의");

  return (
    <View style={styles.container}>
      <View style={[styles.badge, { backgroundColor: badgeColor }]}>
        {isPost ? (
          <ExerciseIcon width={14} height={14} />
        ) : (
          <Ionicons name="people-outline" size={14} color="#FFFFFF" />
        )}
        <Text style={styles.badgeText} numberOfLines={1}>
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
              <View
                style={[
                  styles.statusPill,
                  isInProgress
                    ? styles.statusPillActive
                    : styles.statusPillPending,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    isInProgress
                      ? styles.statusTextActive
                      : styles.statusTextPending,
                  ]}
                >
                  {statusLabel}
                </Text>
              </View>
              <View style={styles.openIndicator} pointerEvents="none">
                <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
              </View>
            </View>
          </View>

          <View style={styles.detailBlock}>
            {location ? (
              <View style={[styles.detailItem, styles.locationItem]}>
                <Ionicons name="location-sharp" size={16} color="#EF4444" />
                <Text
                  numberOfLines={2}
                  style={[styles.detailText, styles.locationText]}
                >
                  {location}
                </Text>
              </View>
            ) : null}

            <View style={styles.detailRow}>
              {scheduledTime ? (
                <View style={styles.detailItem}>
                  <Ionicons name="time-outline" size={15} color="#413F46" />
                  <Text numberOfLines={1} style={styles.detailText}>
                    {scheduledTime}
                  </Text>
                </View>
              ) : null}
              {difficulty ? (
                <View style={styles.detailItem}>
                  <DifficultyIcon width={16} height={16} />
                  <Text numberOfLines={1} style={styles.detailText}>
                    {difficulty}
                  </Text>
                </View>
              ) : null}
              {exerciseType ? (
                <View style={styles.detailItem}>
                  <Ionicons name="fitness-outline" size={15} color="#413F46" />
                  <Text numberOfLines={1} style={styles.detailText}>
                    {exerciseType}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          <View style={styles.actionRow}>
            {isInProgress ? (
              <>
                <Pressable
                  style={[styles.actionButton, styles.primaryActionButton]}
                  onPress={onComplete}
                >
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  <Text style={styles.primaryActionText}>운동 완료하기</Text>
                </Pressable>
                <Pressable style={styles.actionButton} onPress={onChat}>
                  <Ionicons
                    name="chatbubble-outline"
                    size={14}
                    color="#4C5BE2"
                  />
                  <Text style={styles.actionText}>채팅</Text>
                </Pressable>
              </>
            ) : isHost ? (
              <>
                <Pressable
                  style={styles.actionButton}
                  onPress={onViewApplicants}
                >
                  <Text style={styles.actionText}>
                    신청 {item.applicantCount ?? 0}명
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.actionButton, styles.primaryActionButton]}
                  onPress={onViewApplicants}
                >
                  <Text style={styles.primaryActionText}>신청자 보기</Text>
                </Pressable>
              </>
            ) : (
              <View style={[styles.actionButton, styles.pendingActionButton]}>
                <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                <Text style={[styles.actionText, styles.pendingActionText]}>
                  수락 대기 중
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  badge: {
    alignSelf: "flex-start",
    maxWidth: "100%",
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
    alignItems: "flex-start",
    gap: 12,
    borderRadius: 16,
    borderTopLeftRadius: 0,
    borderWidth: 1,
    borderColor: "#E3E5EC",
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
    flexShrink: 0,
  },
  content: {
    flex: 1,
    minWidth: 0,
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
    minWidth: 0,
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  name: {
    flexShrink: 0,
    fontSize: 15,
    lineHeight: 20,
    color: "#070322",
    fontWeight: "800",
  },
  department: {
    flexShrink: 1,
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
  statusPill: {
    minHeight: 24,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    flexShrink: 0,
  },
  statusPillActive: {
    backgroundColor: "#EEF2FF",
  },
  statusPillPending: {
    backgroundColor: "#F3F4F6",
  },
  statusText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "800",
  },
  statusTextActive: {
    color: "#4C5BE2",
  },
  statusTextPending: {
    color: "#6B7280",
  },
  openIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
  },
  detailBlock: {
    gap: 5,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    columnGap: 10,
    rowGap: 4,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    gap: 4,
  },
  locationItem: {
    alignItems: "flex-start",
    width: "100%",
  },
  detailText: {
    flexShrink: 1,
    fontSize: 12,
    lineHeight: 16,
    color: "#413F46",
    fontWeight: "600",
  },
  locationText: {
    flex: 1,
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 2,
  },
  actionButton: {
    flexGrow: 1,
    minHeight: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4C5BE2",
    paddingHorizontal: 10,
    flexShrink: 1,
  },
  primaryActionButton: {
    backgroundColor: "#4C5BE2",
  },
  pendingActionButton: {
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  actionText: {
    fontSize: 12,
    lineHeight: 16,
    color: "#4C5BE2",
    fontWeight: "700",
  },
  primaryActionText: {
    fontSize: 12,
    lineHeight: 16,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  pendingActionText: {
    color: "#9CA3AF",
  },
});
