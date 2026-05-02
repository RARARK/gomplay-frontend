import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import MatchDifficultyIcon from "@/assets/match/heroicons-chart-bar-16-solid.svg";
import { CREATE_POST_DIFFICULTY_LABELS } from "@/components/matching/create-post/createPostConfig";
import type { Post } from "@/types/domain/post";

type PostCardProps = {
  post: Post;
  onPress?: (post: Post) => void;
};

const getValidDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

const formatPostDay = (value: string) => {
  const date = getValidDate(value);

  if (!date) {
    return "";
  }

  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${month}.${day}`;
};

const formatPostTime = (value: string) => {
  const date = getValidDate(value);

  if (!date) {
    return "";
  }

  const hour = `${date.getHours()}`.padStart(2, "0");
  const minute = `${date.getMinutes()}`.padStart(2, "0");

  return `${hour}:${minute}`;
};

const formatPostTimeRange = (startAt: string, endAt: string) => {
  const startTime = formatPostTime(startAt);
  const endTime = formatPostTime(endAt);

  if (!startTime || !endTime) {
    return startTime || endTime;
  }

  return `${startTime} - ${endTime}`;
};

export default function PostCard({ post, onPress }: PostCardProps) {
  const tags = post.tags?.slice(0, 2) ?? [];

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress?.(post)}
      style={styles.card}
    >
      <Image
        source={require("../../../assets/match/Ellipse-12.png")}
        style={styles.profileImage}
        contentFit="cover"
      />

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text numberOfLines={1} style={styles.title}>
            {post.title || "같이 운동하실 분 구해요"}
          </Text>

          <View style={styles.dateBadge}>
            <Text style={styles.dateText}>
              {formatPostDay(post.scheduledStartAt)}
            </Text>
          </View>

          <Text style={styles.capacity}>{post.capacity}명</Text>

          <View style={styles.openIndicator}>
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </View>
        </View>

        <View style={styles.detailBlock}>
          <View style={[styles.detailItem, styles.locationItem]}>
            <Ionicons name="location-sharp" size={16} color="#EF4444" />
            <Text
              numberOfLines={2}
              style={[styles.detailText, styles.locationText]}
            >
              {post.location}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={15} color="#413F46" />
              <Text numberOfLines={1} style={styles.detailText}>
                {formatPostTimeRange(
                  post.scheduledStartAt,
                  post.scheduledEndAt,
                )}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <MatchDifficultyIcon width={16} height={16} />
              <Text numberOfLines={1} style={styles.detailText}>
                {CREATE_POST_DIFFICULTY_LABELS[post.difficulty]}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="fitness-outline" size={15} color="#413F46" />
              <Text numberOfLines={1} style={styles.detailText}>
                {post.exerciseType}
              </Text>
            </View>
          </View>
        </View>

        {tags.length > 0 ? (
          <View style={styles.tagRow}>
            {tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text numberOfLines={1} style={styles.tagText}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 12,
    minHeight: 112,
    borderRadius: 16,
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
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EEF2FF",
  },
  content: {
    flex: 1,
    gap: 8,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    color: "#070322",
    fontWeight: "800",
  },
  dateBadge: {
    borderRadius: 8,
    backgroundColor: "#4C5BE2",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dateText: {
    fontSize: 12,
    lineHeight: 15,
    color: "#FFFFFF",
    fontWeight: "900",
  },
  capacity: {
    borderRadius: 999,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 11,
    lineHeight: 14,
    color: "#4C5BE2",
    fontWeight: "800",
  },
  openIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
    flexShrink: 0,
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
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tag: {
    maxWidth: 92,
    borderRadius: 999,
    backgroundColor: "#4C5BE2",
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 11,
    lineHeight: 13,
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
