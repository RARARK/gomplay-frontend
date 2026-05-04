import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Rect,
  Stop,
} from "react-native-svg";

import type { PartnerCardProps } from "@/types/ui/homeCards";

const DEFAULT_AVATAR = require("../../../assets/match/Ellipse-12.png");

const CARD_RADIUS = 24;
const RING_SIZE = 104;
const RING_STROKE = 10;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const SPORT_TAGS = new Set([
  "테니스",
  "배드민턴",
  "농구",
  "러닝",
  "축구",
  "풋살",
  "헬스",
  "수영",
]);
const STYLE_TAGS = new Set(["같이", "각자", "Together", "Solo"]);
const INTENSITY_TAGS = new Set([
  "가볍게",
  "적당히",
  "제대로",
  "한계까지",
  "Light",
  "Moderate",
]);
const GOAL_TAGS = new Set([
  "스트레스",
  "체력",
  "경쟁",
  "친목",
  "Stress relief",
]);

type InfoBlock = {
  color: string;
  textColor: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  values: string[];
};

const getFirstKnown = (tags: string[], known: Set<string>, fallback: string) =>
  tags.find((tag) => known.has(tag)) ?? fallback;

const getSports = (tags: string[]) => {
  const sports = tags.filter((tag) => SPORT_TAGS.has(tag)).slice(0, 2);
  return sports.length > 0 ? sports : ["테니스", "배드민턴"];
};

const getAvatarSource = (
  profileImageSource?: ImageSourcePropType,
  imageSource?: ImageSourcePropType,
) => profileImageSource ?? imageSource ?? DEFAULT_AVATAR;

function TopGradient() {
  return (
    <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
      <Defs>
        <LinearGradient id="topGradient" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#D9F0FF" />
          <Stop offset="0.55" stopColor="#EAF0FF" />
          <Stop offset="1" stopColor="#DCD7FF" />
        </LinearGradient>
      </Defs>
      <Rect
        width="100%"
        height="100%"
        rx={CARD_RADIUS}
        fill="url(#topGradient)"
      />
    </Svg>
  );
}

function MatchRing({ score }: { score: number }) {
  const normalizedScore = Math.max(0, Math.min(score, 100));
  const dashOffset = RING_CIRCUMFERENCE * (1 - normalizedScore / 100);

  return (
    <View style={styles.matchRing}>
      <Svg width={RING_SIZE} height={RING_SIZE}>
        <Defs>
          <LinearGradient id="ringGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#6D5DF6" />
            <Stop offset="1" stopColor="#8B5CF6" />
          </LinearGradient>
        </Defs>

        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          stroke="#E7E9FF"
          strokeWidth={RING_STROKE}
          fill="#FFFFFF"
        />

        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          stroke="url(#ringGradient)"
          strokeWidth={RING_STROKE}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={`${RING_CIRCUMFERENCE} ${RING_CIRCUMFERENCE}`}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
        />
      </Svg>

      <View style={styles.matchRingLabel}>
        <Text style={styles.matchPercent}>{normalizedScore}%</Text>
        <Text style={styles.matchText}>MATCH</Text>
      </View>
    </View>
  );
}

function PrimaryButtonGradient() {
  return (
    <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
      <Defs>
        <LinearGradient id="buttonGradient" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#6D5DF6" />
          <Stop offset="1" stopColor="#4F46E5" />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" rx={22} fill="url(#buttonGradient)" />
    </Svg>
  );
}

function InfoBlock({ block }: { block: InfoBlock }) {
  return (
    <View style={styles.infoBlock}>
      <View style={styles.infoLeft}>
        <Ionicons name={block.icon} size={22} color={block.textColor} />
        <Text style={[styles.infoLabel, { color: block.textColor }]}>
          {block.label}
        </Text>
      </View>

      <View style={[styles.valuePill, { backgroundColor: block.color }]}>
        <Text
          numberOfLines={1}
          style={[styles.infoValue, { color: block.textColor }]}
        >
          {block.values.join("  ")}
        </Text>
      </View>
    </View>
  );
}

export default function PartnerCardNew({
  imageSource,
  profileImageSource,
  name = "Minjun Kim",
  age = 21,
  department = "컴퓨터공학과",
  studentId = "22학번",
  description = "가벼운 주말 운동 파트너를 찾고 있어요!",
  tags = ["테니스", "배드민턴", "같이", "가볍게", "스트레스"],
  matchScore = 87,
  rejectLabel = "Pass",
  acceptLabel = "Match Now",
  width,
  onReject,
  onAccept,
}: PartnerCardProps) {
  const sports = getSports(tags);
  const style = getFirstKnown(tags, STYLE_TAGS, "같이 하는 스타일");
  const intensity = getFirstKnown(tags, INTENSITY_TAGS, "가볍게");
  const goal = getFirstKnown(tags, GOAL_TAGS, "스트레스 해소");

  const blocks: InfoBlock[] = [
    {
      label: "운동 종목",
      values: sports,
      icon: "footsteps-outline",
      color: "#EAF3FF",
      textColor: "#1D4ED8",
    },
    {
      label: "운동 스타일",
      values: [style === "같이" ? "같이 하는 스타일" : style],
      icon: "people",
      color: "#F0ECFF",
      textColor: "#6D5DF6",
    },
    {
      label: "운동 강도",
      values: [intensity],
      icon: "flame",
      color: "#FFF1E6",
      textColor: "#F97316",
    },
    {
      label: "운동 목적",
      values: [goal === "스트레스" ? "스트레스 해소" : goal],
      icon: "heart",
      color: "#EAFBF3",
      textColor: "#16A34A",
    },
  ];

  return (
    <View style={[styles.wrapper, width ? { width } : null]}>
      <View style={styles.pageHeader}>
        <View style={styles.titleRow}>
          <Ionicons name="sparkles-outline" size={34} color="#F6C85F" />
          <Text style={styles.pageTitle}>Partner found!</Text>
        </View>
        <Text style={styles.pageSubtitle}>
          Your match is ready. Connect right away.
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.topArea}>
          <TopGradient />

          <View style={styles.profileArea}>
            <View style={styles.avatarWrap}>
              <Image
                source={getAvatarSource(profileImageSource, imageSource)}
                style={styles.avatar}
                contentFit="cover"
              />
              <View style={styles.onlineBadge} />
            </View>

            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text numberOfLines={1} style={styles.name}>
                  {name}
                </Text>
                <Text style={styles.age}>{age}</Text>
              </View>

              <View style={styles.subInfoPill}>
                <Text numberOfLines={1} style={styles.subInfo}>
                  {department} · {studentId}
                </Text>
              </View>

              <View style={styles.activeRow}>
                <View style={styles.activeDot} />
                <Text style={styles.activeText}>Active now</Text>
              </View>
            </View>

            <MatchRing score={matchScore} />
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.summary}>
            <Text style={styles.quoteMark}>“</Text>
            <View style={styles.summaryTextBox}>
              <Text numberOfLines={1} style={styles.summaryTitle}>
                Weekend morning · Light workout
              </Text>
              <Text numberOfLines={2} style={styles.summaryDescription}>
                {description}
              </Text>
            </View>
          </View>

          <View style={styles.infoList}>
            {blocks.map((block) => (
              <InfoBlock key={block.label} block={block} />
            ))}
          </View>

          <View style={styles.divider} />

          <View style={styles.buttonRow}>
            <Pressable
              accessibilityRole="button"
              onPress={onReject}
              style={styles.passButton}
            >
              <Ionicons name="close" size={30} color="#6B7280" />
              <Text style={styles.passButtonText}>{rejectLabel}</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={onAccept}
              style={styles.matchButton}
            >
              <PrimaryButtonGradient />
              <Ionicons name="checkmark" size={26} color="#FFFFFF" />
              <Text style={styles.matchButtonText}>{acceptLabel}</Text>
              <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignItems: "center",
  },
  pageHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  pageTitle: {
    fontSize: 31,
    lineHeight: 38,
    color: "#111827",
    fontWeight: "900",
  },
  pageSubtitle: {
    marginTop: 4,
    fontSize: 16,
    lineHeight: 22,
    color: "#5B5B66",
    fontWeight: "500",
  },
  card: {
    width: "100%",
    borderRadius: CARD_RADIUS,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.16,
    shadowRadius: 28,
    elevation: 10,
  },
  topArea: {
    height: 168,
    paddingHorizontal: 22,
    paddingVertical: 24,
    overflow: "hidden",
  },
  profileArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  avatarWrap: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
  },
  onlineBadge: {
    position: "absolute",
    right: 5,
    bottom: 11,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    backgroundColor: "#22C55E",
  },
  profileInfo: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  name: {
    flexShrink: 1,
    fontSize: 26,
    lineHeight: 32,
    color: "#111827",
    fontWeight: "900",
  },
  age: {
    fontSize: 19,
    lineHeight: 27,
    color: "#4B5563",
    fontWeight: "500",
  },
  subInfoPill: {
    alignSelf: "flex-start",
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.45)",
  },
  subInfo: {
    fontSize: 14,
    lineHeight: 18,
    color: "#4B5563",
    fontWeight: "700",
  },
  activeRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  activeDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#22C55E",
  },
  activeText: {
    fontSize: 16,
    lineHeight: 20,
    color: "#16A34A",
    fontWeight: "800",
  },
  matchRing: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  matchRingLabel: {
    position: "absolute",
    alignItems: "center",
  },
  matchPercent: {
    fontSize: 34,
    lineHeight: 39,
    color: "#111827",
    fontWeight: "900",
  },
  matchText: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 18,
    color: "#6D5DF6",
    fontWeight: "900",
  },
  body: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
  },
  summary: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 28,
  },
  quoteMark: {
    width: 54,
    marginTop: -10,
    fontSize: 64,
    lineHeight: 66,
    color: "#D9D4FF",
    fontWeight: "900",
  },
  summaryTextBox: {
    flex: 1,
    paddingTop: 5,
  },
  summaryTitle: {
    fontSize: 22,
    lineHeight: 29,
    color: "#111827",
    fontWeight: "900",
  },
  summaryDescription: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 23,
    color: "#6B7280",
    fontWeight: "500",
  },
  infoList: {
    gap: 12,
  },
  infoBlock: {
    minHeight: 62,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minWidth: 118,
  },
  infoLabel: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "900",
  },
  valuePill: {
    maxWidth: "58%",
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 18,
  },
  infoValue: {
    fontSize: 15,
    lineHeight: 19,
    fontWeight: "800",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginTop: 28,
    marginBottom: 18,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 16,
  },
  passButton: {
    flex: 0.85,
    minHeight: 66,
    borderRadius: 24,
    backgroundColor: "#F2F2F7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  passButtonText: {
    fontSize: 20,
    lineHeight: 25,
    color: "#111827",
    fontWeight: "600",
  },
  matchButton: {
    flex: 1.35,
    minHeight: 66,
    borderRadius: 24,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  matchButtonText: {
    fontSize: 20,
    lineHeight: 25,
    color: "#FFFFFF",
    fontWeight: "800",
  },
});
