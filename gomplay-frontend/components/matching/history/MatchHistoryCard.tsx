import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import DifficultyIcon from "@/assets/match/heroicons-chart-bar-16-solid.svg";
import { getSportIcon } from "@/lib/utils/sportIconMap";

export type MatchHistoryItem = {
  id: string;
  sourceType: "POST" | "PARTNER";
  partnerName: string;
  partnerProfileImageUrl?: string | null;
  partnerDepartment?: string;
  partnerStudentNumber?: string;
  partnerUserId?: number | null;
  completedAt: string;
  location?: string;
  scheduledTime?: string;
  difficulty?: string;
  exerciseType?: string;
  reviewed?: boolean;
  chatRoomId?: number | null;
  gatheringId?: number;
  matchId?: number;
  // Extended partner profile (optional)
  partnerIsVerified?: boolean;
  partnerMannerTemperature?: number;
  partnerMatchCount?: number;
  partnerNoShowCount?: number;
  partnerStyle?: string;
  partnerExerciseIntensity?: string;
  partnerExerciseReason?: string;
  partnerExerciseTypes?: string[];
};

type MatchHistoryCardProps = {
  item: MatchHistoryItem;
  onChat?: () => void;
  onReview?: () => void;
};

export default function MatchHistoryCard({
  item,
  onChat,
  onReview,
}: MatchHistoryCardProps) {
  const isPost = item.sourceType === "POST";
  const stripeColor = isPost ? "#10B981" : "#4C5BE2";

  return (
    <View style={styles.container}>
      <View style={[styles.card, { borderLeftColor: stripeColor }]}>
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
          <View style={styles.titleRow}>
            <View style={styles.nameBlock}>
              <Text style={styles.name} numberOfLines={1}>
                {item.partnerName}
              </Text>
              {item.partnerStudentNumber ? (
                <Text style={styles.studentNumber} numberOfLines={1}>
                  {item.partnerStudentNumber}
                </Text>
              ) : null}
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

          <Text style={styles.statusText}>매칭 완료</Text>

          {(item.location || item.scheduledTime || item.difficulty || item.exerciseType) ? (
            <View style={styles.detailBlock}>
              {item.location ? (
                <View style={[styles.detailItem, styles.locationItem]}>
                  <Ionicons name="location-sharp" size={16} color="#EF4444" />
                  <Text numberOfLines={2} style={[styles.detailText, styles.locationText]}>
                    {item.location}
                  </Text>
                </View>
              ) : null}
              <View style={styles.detailRow}>
                {item.scheduledTime ? (
                  <View style={styles.detailItem}>
                    <Ionicons name="time-outline" size={15} color="#413F46" />
                    <Text numberOfLines={1} style={styles.detailText}>
                      {item.scheduledTime}
                    </Text>
                  </View>
                ) : null}
                {item.difficulty ? (
                  <View style={styles.detailItem}>
                    <DifficultyIcon width={16} height={16} />
                    <Text numberOfLines={1} style={styles.detailText}>
                      {item.difficulty}
                    </Text>
                  </View>
                ) : null}
                {item.exerciseType ? (
                  <View style={styles.detailItem}>
                    <MaterialCommunityIcons
                      name={getSportIcon(item.exerciseType)}
                      size={16}
                      color="#413F46"
                    />
                    <Text numberOfLines={1} style={styles.detailText}>
                      {item.exerciseType}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          ) : null}

          <View style={styles.actionRow}>
            <Pressable
              accessibilityRole="button"
              onPress={onChat}
              style={styles.actionButton}
            >
              <Ionicons name="chatbubble-outline" size={14} color="#4C5BE2" />
              <Text style={styles.actionText}>채팅 보기</Text>
            </Pressable>
            {(onReview != null || item.reviewed) ? (
              <Pressable
                accessibilityRole="button"
                onPress={item.reviewed ? undefined : onReview}
                disabled={item.reviewed}
                style={[styles.actionButton, item.reviewed && styles.actionButtonDone]}
              >
                <Ionicons
                  name={item.reviewed ? "star" : "star-outline"}
                  size={14}
                  color={item.reviewed ? "#9CA3AF" : "#4C5BE2"}
                />
                <Text style={[styles.actionText, item.reviewed && styles.actionTextDone]}>
                  {item.reviewed ? "평가완료" : "평가하기"}
                </Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  card: {
    flexDirection: "row",
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D9D9D9",
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
  studentNumber: {
    fontSize: 12,
    lineHeight: 16,
    color: "#9CA3AF",
    fontWeight: "600",
    flexShrink: 1,
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
  actionText: {
    flexShrink: 1,
    fontSize: 10,
    lineHeight: 16,
    color: "#4C5BE2",
    fontWeight: "700",
    textAlign: "center",
  },
  actionButtonDone: {
    borderColor: "#D1D5DB",
  },
  actionTextDone: {
    color: "#9CA3AF",
  },
});
