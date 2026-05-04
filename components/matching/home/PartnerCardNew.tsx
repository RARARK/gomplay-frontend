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

import { HomeLayout } from "@/constants/locofyHomeStyles";
import type { PartnerCardProps } from "@/types/ui/homeCards";

const DEFAULT_AVATAR = require("../../../assets/match/Ellipse-12.png");

const CARD_RADIUS = 24;
const RING_SIZE = 100;
const RING_STROKE = 9;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const SPORT_TAGS = new Set([
  "테니스", "배드민턴", "농구", "러닝", "축구", "풋살", "헬스", "수영",
]);
const STYLE_TAGS = new Set(["같이", "각자", "Together", "Solo"]);
const INTENSITY_TAGS = new Set([
  "가볍게", "적당히", "제대로", "한계까지", "Light", "Moderate",
]);
const GOAL_TAGS = new Set([
  "스트레스", "체력", "경쟁", "친목", "Stress relief",
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

function CardGradient() {
  return (
    <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
      <Defs>
        <LinearGradient id="cardGradient" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#D9F0FF" />
          <Stop offset="0.5" stopColor="#EAF0FF" />
          <Stop offset="1" stopColor="#DCD7FF" />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" rx={CARD_RADIUS} fill="url(#cardGradient)" />
    </Svg>
  );
}

function MatchRing({ score }: { score: number }) {
  const normalized = Math.max(0, Math.min(score, 100));
  const dashOffset = RING_CIRCUMFERENCE * (1 - normalized / 100);

  return (
    <View style={styles.matchRing}>
      <Svg width={RING_SIZE} height={RING_SIZE}>
        <Defs>
          <LinearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#7C6FF7" />
            <Stop offset="1" stopColor="#4F46E5" />
          </LinearGradient>
        </Defs>
        <Circle
          cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_RADIUS}
          stroke="#E7E9FF" strokeWidth={RING_STROKE} fill="#FFFFFF"
        />
        <Circle
          cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_RADIUS}
          stroke="url(#ringGrad)" strokeWidth={RING_STROKE} fill="transparent"
          strokeLinecap="round"
          strokeDasharray={`${RING_CIRCUMFERENCE} ${RING_CIRCUMFERENCE}`}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
        />
      </Svg>
      <View style={styles.matchRingLabel}>
        <Text style={styles.matchPercent}>{normalized}%</Text>
        <Text style={styles.matchText}>MATCH</Text>
      </View>
    </View>
  );
}

function ButtonGradient() {
  return (
    <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
      <Defs>
        <LinearGradient id="btnGrad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#7C6FF7" />
          <Stop offset="1" stopColor="#4F46E5" />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" rx={22} fill="url(#btnGrad)" />
    </Svg>
  );
}

function InfoRow({ block }: { block: InfoBlock }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoLeft}>
        <Ionicons name={block.icon} size={20} color={block.textColor} />
        <Text style={[styles.infoLabel, { color: "#374151" }]}>{block.label}</Text>
      </View>
      <View style={[styles.valuePill, { backgroundColor: block.color }]}>
        <Text numberOfLines={1} style={[styles.infoValue, { color: block.textColor }]}>
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
  const style = getFirstKnown(tags, STYLE_TAGS, "같이");
  const intensity = getFirstKnown(tags, INTENSITY_TAGS, "가볍게");
  const goal = getFirstKnown(tags, GOAL_TAGS, "스트레스");

  const infoBlocks: InfoBlock[] = [
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
    <View style={[styles.card, width != null && { width }]}>
      {/* Gradient top area */}
      <View style={styles.topArea}>
        <CardGradient />
        <View style={styles.profileRow}>
          {/* Avatar */}
          <View style={styles.avatarWrap}>
            <Image
              source={getAvatarSource(profileImageSource, imageSource)}
              style={styles.avatar}
              contentFit="cover"
            />
            <View style={styles.onlineBadge} />
          </View>

          {/* Name / dept / active */}
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text numberOfLines={1} style={styles.name}>{name}</Text>
              <Text style={styles.age}>{age}</Text>
            </View>
            <View style={styles.deptPill}>
              <Text numberOfLines={1} style={styles.deptText}>
                {department} · {studentId}
              </Text>
            </View>
            <View style={styles.activeRow}>
              <View style={styles.activeDot} />
              <Text style={styles.activeText}>Active now</Text>
            </View>
          </View>

          {/* Match ring */}
          <MatchRing score={matchScore} />
        </View>
      </View>

      {/* White body */}
      <View style={styles.body}>
        {/* One-line summary */}
        <View style={styles.summary}>
          <Text style={styles.quoteMark}>{"“"}</Text>
          <View style={styles.summaryText}>
            <Text numberOfLines={1} style={styles.summaryTitle}>
              Weekend morning · Light workout
            </Text>
            <Text numberOfLines={2} style={styles.summaryDesc}>
              {description}
            </Text>
          </View>
        </View>

        {/* Tag groups */}
        <View style={styles.infoList}>
          {infoBlocks.map((block) => (
            <InfoRow key={block.label} block={block} />
          ))}
        </View>

        <View style={styles.divider} />

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <Pressable
            accessibilityRole="button"
            onPress={onReject}
            style={styles.passButton}
          >
            <Ionicons name="close" size={24} color="#6B7280" />
            <Text style={styles.passLabel}>{rejectLabel}</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={onAccept}
            style={styles.matchButton}
          >
            <ButtonGradient />
            <Ionicons name="checkmark" size={22} color="#FFFFFF" />
            <Text style={styles.matchLabel}>{acceptLabel}</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    minHeight: HomeLayout.partnerCardMinHeight,
    borderRadius: CARD_RADIUS,
    backgroundColor: "#FFFFFF",
    shadowColor: "#1F2937",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
    overflow: "hidden",
  },

  // ── Top gradient area ──────────────────────────────────────────
  topArea: {
    height: HomeLayout.partnerCardVisualHeight,
    paddingHorizontal: 20,
    justifyContent: "center",
    overflow: "hidden",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
  },
  onlineBadge: {
    position: "absolute",
    right: 4,
    bottom: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    backgroundColor: "#22C55E",
  },
  profileInfo: {
    flex: 1,
    minWidth: 0,
    gap: 6,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
  },
  name: {
    flexShrink: 1,
    fontSize: 22,
    lineHeight: 28,
    color: "#111827",
    fontWeight: "900",
  },
  age: {
    fontSize: 16,
    lineHeight: 24,
    color: "#4B5563",
    fontWeight: "500",
    paddingBottom: 1,
  },
  deptPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  deptText: {
    fontSize: 12,
    lineHeight: 16,
    color: "#374151",
    fontWeight: "600",
  },
  activeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  activeDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#22C55E",
  },
  activeText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#16A34A",
    fontWeight: "700",
  },

  // ── Match ring ─────────────────────────────────────────────────
  matchRing: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  matchRingLabel: {
    position: "absolute",
    alignItems: "center",
  },
  matchPercent: {
    fontSize: 22,
    lineHeight: 26,
    color: "#111827",
    fontWeight: "900",
  },
  matchText: {
    fontSize: 10,
    lineHeight: 14,
    color: "#6D5DF6",
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  // ── Body ───────────────────────────────────────────────────────
  body: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
    gap: 0,
  },

  // ── Summary ────────────────────────────────────────────────────
  summary: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    gap: 4,
  },
  quoteMark: {
    fontSize: 56,
    lineHeight: 52,
    color: "#DDD8FF",
    fontWeight: "900",
    marginTop: -4,
    width: 40,
  },
  summaryText: {
    flex: 1,
    paddingTop: 4,
  },
  summaryTitle: {
    fontSize: 18,
    lineHeight: 24,
    color: "#111827",
    fontWeight: "900",
  },
  summaryDesc: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    color: "#6B7280",
    fontWeight: "500",
  },

  // ── Info rows ──────────────────────────────────────────────────
  infoList: {
    gap: 8,
  },
  infoRow: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "800",
  },
  valuePill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
    maxWidth: "58%",
  },
  infoValue: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "700",
  },

  // ── Divider + buttons ──────────────────────────────────────────
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginTop: 20,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  passButton: {
    flex: 0.8,
    height: 58,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  passLabel: {
    fontSize: 17,
    lineHeight: 22,
    color: "#374151",
    fontWeight: "700",
  },
  matchButton: {
    flex: 1.4,
    height: 58,
    borderRadius: 20,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  matchLabel: {
    fontSize: 17,
    lineHeight: 22,
    color: "#FFFFFF",
    fontWeight: "800",
  },
});
