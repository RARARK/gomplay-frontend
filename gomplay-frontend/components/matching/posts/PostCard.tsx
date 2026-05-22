import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

const RAINBOW_COLORS: readonly [string, string, ...string[]] = [
  "#FF2D8F",
  "#FF8A00",
  "#FFE600",
  "#18D26E",
  "#22D3EE",
  "#4C5BE2",
  "#D946EF",
  "#FF2D8F",
];

import MatchDifficultyIcon from "@/assets/match/heroicons-chart-bar-16-solid.svg";
import { useBoostStore } from "@/stores/gathering/boostStore";
import { getSportIcon } from "@/lib/utils/sportIconMap";
import type { GatheringListItem } from "@/types/domain/gathering";

type PostCardProps = {
  post: GatheringListItem;
  onPress?: (post: GatheringListItem) => void;
};

const BOOSTING_LABEL = "\uBD80\uC2A4\uD305 \uC911";
const DEFAULT_TITLE =
  "\uAC19\uC774 \uC6B4\uB3D9\uD558\uC2E4 \uBD84 \uAD6C\uD574\uC694";

const getValidDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatPostDay = (value: string) => {
  const date = getValidDate(value);
  if (!date) return "";
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${month}.${day}`;
};

const formatPostTime = (value: string) => {
  const date = getValidDate(value);
  if (!date) return "";
  return `${`${date.getHours()}`.padStart(2, "0")}:${`${date.getMinutes()}`.padStart(2, "0")}`;
};

const formatPostTimeRange = (startAt: string, endAt: string) => {
  const startTime = formatPostTime(startAt);
  const endTime = formatPostTime(endAt);
  if (!startTime || !endTime) return startTime || endTime;
  return `${startTime} - ${endTime}`;
};

const parseTags = (tags: string | null | undefined): string[] => {
  if (!tags) return [];
  return tags.split(" ").filter(Boolean);
};

export default function PostCard({ post, onPress }: PostCardProps) {
  const tags = parseTags(post.tags).slice(0, 2);
  const localBoostExpiresAt = useBoostStore((state) =>
    state.getBoostExpiresAt(post.id),
  );
  const boostExpiredAt = post.boostExpiredAt ?? localBoostExpiresAt;
  const isBoosted =
    Boolean(post.isBoosted || localBoostExpiresAt) &&
    (!boostExpiredAt || new Date(boostExpiredAt).getTime() > Date.now());
  const spinValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (!isBoosted) {
      spinValue.stopAnimation();
      spinValue.setValue(0);
      return;
    }

    const animation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 9000,
        useNativeDriver: true,
      }),
    );
    animation.start();

    return () => {
      animation.stop();
    };
  }, [isBoosted, spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress?.(post)}
      style={[styles.cardFrame, isBoosted && styles.boostedFrame]}
    >
      {isBoosted ? (
        <Animated.View style={[styles.rainbowBorder, { transform: [{ rotate: spin }] }]}>
          <LinearGradient
            colors={RAINBOW_COLORS}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      ) : null}

      <View style={[styles.card, isBoosted && styles.boostedCard]}>
        {isBoosted ? (
          <View style={styles.boostingBadge}>
            <Ionicons name="flash" size={16} color="#F43F5E" />
            <Text style={styles.boostingBadgeText}>{BOOSTING_LABEL}</Text>
          </View>
        ) : null}

        <View style={styles.mainRow}>
          <Image
            source={
              post.hostProfileImageUrl
                ? { uri: post.hostProfileImageUrl }
                : require("../../../assets/match/Ellipse-12.png")
            }
            style={styles.profileImage}
            contentFit="cover"
          />

          <View style={styles.content}>
            <View style={styles.titleRow}>
              <Text numberOfLines={1} style={styles.title}>
                {post.title || DEFAULT_TITLE}
              </Text>

              <View style={[styles.dateBadge, isBoosted && styles.boostedPill]}>
                <Text style={[styles.dateText, isBoosted && styles.boostedPillText]}>
                  {formatPostDay(post.scheduledAt)}
                </Text>
              </View>

              <Text
                style={[styles.capacity, isBoosted && styles.boostedCapacity]}
              >
                {`${post.maxParticipants}\uBA85`}
              </Text>

              <View style={styles.openIndicator}>
                <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
              </View>
            </View>

            <View style={styles.detailBlock}>
              <View style={[styles.detailItem, styles.locationItem]}>
                <Ionicons name="location-sharp" size={16} color="#EF4444" />
                <Text numberOfLines={2} style={[styles.detailText, styles.locationText]}>
                  {post.venue}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Ionicons name="time-outline" size={15} color="#413F46" />
                  <Text numberOfLines={1} style={styles.detailText}>
                    {formatPostTimeRange(post.scheduledAt, post.scheduledEndAt)}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <MatchDifficultyIcon width={16} height={16} />
                  <Text numberOfLines={1} style={styles.detailText}>
                    {post.difficulty}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <MaterialCommunityIcons
                    name={getSportIcon(post.sportType)}
                    size={15}
                    color="#413F46"
                  />
                  <Text numberOfLines={1} style={styles.detailText}>
                    {post.sportType}
                  </Text>
                </View>
              </View>
            </View>

            {tags.length > 0 ? (
              <View style={styles.tagRow}>
                {tags.map((tag) => (
                  <View key={tag} style={[styles.tag, isBoosted && styles.boostedPill]}>
                    <Text
                      numberOfLines={1}
                      style={[styles.tagText, isBoosted && styles.boostedPillText]}
                    >
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardFrame: {
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  boostedFrame: {
    overflow: "hidden",
    padding: 2,
    shadowColor: "#EC4899",
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 5,
  },
  rainbowBorder: {
    position: "absolute",
    left: "-45%",
    top: "-150%",
    width: "190%",
    height: "400%",
    opacity: 0.9,
  },
  card: {
    minHeight: 112,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E3E5EC",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  boostedCard: {
    borderWidth: 0,
    backgroundColor: "#FFFFFF",
    gap: 16,
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  mainRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  boostingBadge: {
    alignSelf: "flex-start",
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#FDA4AF",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
  },
  boostingBadgeText: {
    fontSize: 14,
    lineHeight: 18,
    color: "#F43F5E",
    fontWeight: "800",
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EEF2FF",
    flexShrink: 0,
  },
  content: {
    flex: 1,
    gap: 8,
    minWidth: 0,
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
    flexShrink: 0,
  },
  boostedPill: {
    backgroundColor: "#F43F5E",
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
    flexShrink: 0,
  },
  boostedCapacity: {
    backgroundColor: "#FFF1F2",
    color: "#F43F5E",
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
  boostedPillText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
});
