import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import DifficultyIcon from "@/assets/match/heroicons-chart-bar-16-solid.svg";
import { getSportIcon } from "@/lib/utils/sportIconMap";

export type MatchSourceType = "POST" | "PARTNER";
export type MatchStatus = "IN_PROGRESS" | "PENDING" | "ACCEPTED" | "COMPLETED";
export type MatchRole = "HOST" | "GUEST";

export type MatchItem = {
  id: string;
  sourceType: MatchSourceType;
  status: MatchStatus;
  role?: MatchRole | null;
  canComplete?: boolean;
  reviewed?: boolean;
  revieweeId?: number | null;
  partnerName: string;
  partnerProfileImageUrl?: string | null;
  partnerDepartment?: string;
  partnerStudentNumber?: string;
  location?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  scheduledAt?: string;
  scheduledEndAt?: string;
  matchedAt?: string;
  difficulty?: string;
  exerciseType?: string;
  applicantCount?: number;
  chatRoomId?: number;
};

type MatchStatusCardProps = {
  item: MatchItem;
  completedByMe?: boolean;
  onComplete?: () => void;
  onChat?: () => void;
  onViewApplicants?: () => void;
};

const COMPLETE_DELAY_MS = 60 * 60 * 1000; // 1시간

export default function MatchStatusCard({
  item,
  completedByMe,
  onComplete,
  onChat,
  onViewApplicants,
}: MatchStatusCardProps) {
  const [now, setNow] = React.useState(() => Date.now());

  React.useEffect(() => {
    if (item.status !== "IN_PROGRESS") return;
    const interval = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(interval);
  }, [item.status]);

  const isInProgress = item.status === "IN_PROGRESS";
  const isAccepted = item.status === "ACCEPTED";
  const isCompleted = item.status === "COMPLETED";
  const isHost = item.role === "HOST";
  const isPost = item.sourceType === "POST";

  const badgeColor = isPost ? "#10B981" : "#4C5BE2";
  const statusLabel = isCompleted ? "완료" : isInProgress ? "진행중" : isAccepted ? "모집중" : "수락 대기";

  const location = isPost ? (item.location ?? "") : (item.location ?? "상의 후 결정");
  const scheduledDateText = item.scheduledDate ?? "";
  const scheduledDisplay = isPost
    ? (item.scheduledTime ?? "")
    : (item.scheduledTime ?? "상의 후 결정");
  const difficulty = isPost ? (item.difficulty ?? "") : (item.difficulty ?? "");
  const exerciseType = isPost
    ? (item.exerciseType ?? "")
    : (item.exerciseType ?? "상의 후 결정");

  const postCompleteEnabled =
    item.canComplete ||
    (item.scheduledEndAt ? now > new Date(item.scheduledEndAt).getTime() : false);
  const partnerCompleteEnabled =
    item.canComplete ||
    (item.matchedAt ? now > new Date(item.matchedAt).getTime() + COMPLETE_DELAY_MS : false);

  return (
    <View style={styles.container}>
      <View style={[styles.card, { borderLeftColor: badgeColor }]}>
        <Image
          source={
            item.partnerProfileImageUrl
              ? { uri: item.partnerProfileImageUrl }
              : require("../../../assets/match/Ellipse-12.png")
          }
          style={styles.avatar}
          contentFit="cover"
        />

        <View style={styles.content}>
          {/* 이름 · 날짜 */}
          <View style={styles.titleRow}>
            <View style={styles.nameBlock}>
              <Text style={styles.name} numberOfLines={1}>
                {item.partnerName}
              </Text>
              {scheduledDateText ? (
                <Text style={styles.scheduledDate} numberOfLines={1}>
                  {scheduledDateText}
                </Text>
              ) : null}
            </View>
            <View style={styles.titleMeta}>
              <View
                style={[
                  styles.statusPill,
                  isCompleted
                    ? styles.statusPillCompleted
                    : isInProgress
                      ? styles.statusPillActive
                      : isAccepted
                        ? styles.statusPillAccepted
                        : styles.statusPillPending,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    isCompleted
                      ? styles.statusTextCompleted
                      : isInProgress
                        ? styles.statusTextActive
                        : isAccepted
                          ? styles.statusTextAccepted
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

          {/* 장소 · 시간 · 난이도 · 종목 */}
          <View style={styles.detailBlock}>
            {location ? (
              <View style={[styles.detailItem, styles.locationItem]}>
                <Ionicons name="location-sharp" size={16} color="#EF4444" />
                <Text numberOfLines={2} style={[styles.detailText, styles.locationText]}>
                  {location}
                </Text>
              </View>
            ) : null}
            <View style={styles.detailRow}>
              {scheduledDisplay ? (
                <View style={styles.detailItem}>
                  <Ionicons name="time-outline" size={15} color="#413F46" />
                  <Text numberOfLines={1} style={styles.detailText}>
                    {scheduledDisplay}
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
                  {exerciseType === "상의 후 결정" ? (
                    <MaterialCommunityIcons name="swap-horizontal" size={16} color="#413F46" />
                  ) : (
                    <MaterialCommunityIcons name={getSportIcon(exerciseType)} size={16} color="#413F46" />
                  )}
                  <Text numberOfLines={1} style={styles.detailText}>
                    {exerciseType}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          {/* 액션 버튼 */}
          <View style={styles.actionRow}>
            {isCompleted ? (
              <View style={[styles.actionButton, styles.completedActionButton]}>
                <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
                <Text style={[styles.actionText, styles.completedActionText]}>운동 완료</Text>
              </View>
            ) : isInProgress ? (
              isPost ? (
                <>
                  {completedByMe ? (
                    <View style={[styles.actionButton, styles.waitingCompleteButton]}>
                      <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                      <Text style={[styles.actionText, styles.waitingCompleteText]}>다른 사람이 아직 완료하지 않았어요</Text>
                    </View>
                  ) : postCompleteEnabled && onComplete ? (
                    <Pressable
                      style={[styles.actionButton, styles.primaryActionButton]}
                      onPress={onComplete}
                    >
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                      <Text style={styles.primaryActionText}>운동 완료하기</Text>
                    </Pressable>
                  ) : null}
                  {onChat ? (
                    <Pressable style={styles.actionButton} onPress={onChat}>
                      <Ionicons name="chatbubble-outline" size={14} color="#4C5BE2" />
                      <Text style={styles.actionText}>채팅</Text>
                    </Pressable>
                  ) : null}
                </>
              ) : (
                <>
                  {partnerCompleteEnabled && onComplete ? (
                    <Pressable
                      style={[styles.actionButton, styles.primaryActionButton]}
                      onPress={onComplete}
                    >
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                      <Text style={styles.primaryActionText}>운동 완료하기</Text>
                    </Pressable>
                  ) : null}
                  <Pressable style={styles.actionButton} onPress={onChat}>
                    <Ionicons name="chatbubble-outline" size={14} color="#4C5BE2" />
                    <Text style={styles.actionText}>채팅</Text>
                  </Pressable>
                </>
              )
            ) : isAccepted ? (
              onChat ? (
                <Pressable style={styles.actionButton} onPress={onChat}>
                  <Ionicons name="chatbubble-outline" size={14} color="#4C5BE2" />
                  <Text style={styles.actionText}>채팅</Text>
                </Pressable>
              ) : (
                <View style={[styles.actionButton, styles.acceptedActionButton]}>
                  <Ionicons name="checkmark-circle-outline" size={14} color="#10B981" />
                  <Text style={[styles.actionText, styles.acceptedActionText]}>모집 확정</Text>
                </View>
              )
            ) : isHost && isPost && onViewApplicants ? (
              <Pressable
                style={[styles.actionButton, styles.applicantButton]}
                onPress={onViewApplicants}
              >
                <Ionicons name="people-outline" size={14} color="#4C5BE2" />
                <Text style={styles.actionText}>
                  신청 {item.applicantCount ?? 0}명 · 신청자 보기
                </Text>
              </Pressable>
            ) : (
              <View style={[styles.actionButton, styles.pendingActionButton]}>
                <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                <Text style={[styles.actionText, styles.pendingActionText]}>수락 대기 중...</Text>
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
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E3E5EC",
    borderLeftWidth: 4,
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
    flexWrap: "wrap",
    gap: 5,
  },
  name: {
    flexShrink: 0,
    fontSize: 15,
    lineHeight: 20,
    color: "#070322",
    fontWeight: "800",
  },
  scheduledDate: {
    flexShrink: 1,
    fontSize: 12,
    lineHeight: 16,
    color: "#4C5BE2",
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
  statusPillActive: { backgroundColor: "#EEF2FF" },
  statusPillPending: { backgroundColor: "#F3F4F6" },
  statusPillAccepted: { backgroundColor: "#ECFDF5" },
  statusPillCompleted: { backgroundColor: "#F0FDF4" },
  statusText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "800",
  },
  statusTextActive: { color: "#4C5BE2" },
  statusTextPending: { color: "#6B7280" },
  statusTextAccepted: { color: "#10B981" },
  statusTextCompleted: { color: "#16A34A" },
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
  locationText: { flex: 1 },
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
    borderColor: "#4C5BE2",
  },
  applicantButton: {
    borderColor: "#4C5BE2",
    backgroundColor: "#F5F6FF",
  },
  pendingActionButton: {
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  completedActionButton: {
    borderColor: "#BBF7D0",
    backgroundColor: "#F0FDF4",
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
  acceptedActionButton: {
    borderColor: "#BBF7D0",
    backgroundColor: "#ECFDF5",
  },
  acceptedActionText: { color: "#10B981" },
  pendingActionText: { color: "#9CA3AF" },
  completedActionText: { color: "#16A34A" },
  waitingCompleteButton: {
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  waitingCompleteText: { color: "#9CA3AF" },
});
