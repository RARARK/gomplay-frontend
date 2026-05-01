import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import DifficultyIcon from "@/assets/match/heroicons-chart-bar-16-solid.svg";
import LocationIcon from "@/assets/match/mdi-location.svg";
import TimeIcon from "@/assets/match/Vector.svg";
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

  const badgeBg = isPost ? "#C8960C" : "#4E9B6A";
  const cardBg = isInProgress ? "#4C5BE2" : "#FFFFFF";
  const cardBorder = isInProgress ? "#6876E8" : "#D9D9D9";
  const primaryText = isInProgress ? "#FFFFFF" : "#111827";
  const secondaryText = isInProgress ? "rgba(255,255,255,0.7)" : "#6B7280";

  const details = isPost
    ? [
        item.location && { icon: <LocationIcon width={11} height={11} />, label: item.location },
        item.scheduledTime && { icon: <TimeIcon width={11} height={11} />, label: item.scheduledTime },
        item.difficulty && { icon: <DifficultyIcon width={11} height={11} />, label: item.difficulty },
        item.exerciseType && { icon: <ExerciseIcon width={11} height={11} />, label: item.exerciseType },
      ].filter(Boolean) as { icon: React.ReactNode; label: string }[]
    : [
        { icon: <LocationIcon width={11} height={11} />, label: "협의" },
        { icon: <TimeIcon width={11} height={11} />, label: "협의" },
        { icon: <DifficultyIcon width={11} height={11} />, label: "협의" },
        { icon: <ExerciseIcon width={11} height={11} />, label: "협의" },
      ];

  return (
    <View style={styles.container}>
      <View style={[styles.badge, { backgroundColor: badgeBg }]}>
        <View style={styles.badgeLeft}>
          {isPost
            ? <ExerciseIcon width={13} height={13} />
            : <Ionicons name="people-outline" size={13} color="#FFFFFF" />}
          <Text style={styles.badgeLabel}>{isPost ? "운동 모집" : "파트너 모집"}</Text>
        </View>
        {isInProgress ? <Text style={styles.badgeStatus}>진행중</Text> : null}
      </View>

      <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
        <Image
          source={require("../../../assets/match/Ellipse-12.png")}
          style={styles.avatar}
          contentFit="cover"
        />

        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: primaryText }]}>{item.partnerName}</Text>
            {item.partnerDepartment ? (
              <Text style={[styles.dept, { color: secondaryText }]}>{item.partnerDepartment}</Text>
            ) : null}
          </View>

          {details.length > 0 ? (
            <View style={styles.detailRow}>
              {details.map((d, i) => (
                <View key={i} style={styles.detailChip}>
                  {d.icon}
                  <Text style={[styles.detailText, { color: secondaryText }]}>{d.label}</Text>
                </View>
              ))}
            </View>
          ) : null}

          <View style={styles.actionRow}>
            {isInProgress ? (
              <>
                <Pressable style={styles.actionBtnLight} onPress={onComplete}>
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  <Text style={styles.actionBtnLightText}>운동 완료하기</Text>
                </Pressable>
                <Pressable style={styles.actionBtnLight} onPress={onChat}>
                  <Ionicons name="chatbubble-outline" size={14} color="#FFFFFF" />
                  <Text style={styles.actionBtnLightText}>채팅</Text>
                </Pressable>
              </>
            ) : isHost ? (
              <>
                <Pressable style={styles.actionBtnDark} onPress={onViewApplicants}>
                  <Text style={styles.actionBtnDarkText}>신청 {item.applicantCount ?? 0}명</Text>
                </Pressable>
                <Pressable style={styles.actionBtnDark} onPress={onViewApplicants}>
                  <Text style={styles.actionBtnDarkText}>신청자 보기</Text>
                </Pressable>
              </>
            ) : (
              <View style={[styles.actionBtnDark, styles.pendingBtn]}>
                <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                <Text style={[styles.actionBtnDarkText, styles.pendingBtnText]}>수락 대기 중 ...</Text>
              </View>
            )}
          </View>
        </View>

        <Pressable style={styles.moreBtn}>
          <Ionicons
            name="ellipsis-vertical"
            size={18}
            color={isInProgress ? "rgba(255,255,255,0.6)" : "#C4C9D4"}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 0,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  badgeLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  badgeLabel: {
    fontSize: 11,
    lineHeight: 14,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  badgeStatus: {
    fontSize: 12,
    lineHeight: 16,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 10,
    elevation: 2,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#EEF2FF",
    flexShrink: 0,
  },
  info: {
    flex: 1,
    gap: 6,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  name: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "700",
  },
  dept: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "600",
  },
  detailRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  detailChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  detailText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "500",
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 2,
  },
  actionBtnLight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  actionBtnLightText: {
    fontSize: 12,
    lineHeight: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  actionBtnDark: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#4C5BE2",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  actionBtnDarkText: {
    fontSize: 12,
    lineHeight: 16,
    color: "#4C5BE2",
    fontWeight: "600",
  },
  pendingBtn: {
    borderColor: "#E5E7EB",
  },
  pendingBtnText: {
    color: "#9CA3AF",
  },
  moreBtn: {
    padding: 2,
    marginTop: -2,
    flexShrink: 0,
  },
});
