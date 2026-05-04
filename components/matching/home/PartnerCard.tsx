import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import {
  Border,
  Color,
  FontFamily,
  FontSize,
  HomeLayout,
  LineHeight,
} from "@/constants/locofyHomeStyles";
import type { PartnerCardProps } from "@/types/ui/homeCards";

export type { PartnerCardProps } from "@/types/ui/homeCards";

// ── Tag categorisation ────────────────────────────────────────────────────────
const SPORT_TAGS = new Set([
  "테니스", "배드민턴", "농구", "러닝", "축구", "풋살", "헬스", "수영",
  "Tennis", "Badminton", "Basketball", "Running", "Soccer",
]);
const STYLE_TAGS = new Set([
  "같이", "각자", "Together", "Solo", "Fair Play",
]);
const INTENSITY_TAGS = new Set([
  "가볍게", "적당히", "제대로", "한계까지",
  "Light", "Moderate", "Intense", "Beginner", "Weekend AM",
]);

type TagRow = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  tags: string[];
  bg: string;
  textColor: string;
};

function buildTagRows(tags: string[]): TagRow[] {
  const sports = tags.filter((t) => SPORT_TAGS.has(t)).slice(0, 2);
  const styles = tags.filter((t) => STYLE_TAGS.has(t)).slice(0, 2);
  const intensities = tags.filter((t) => INTENSITY_TAGS.has(t)).slice(0, 2);

  return [
    {
      icon: "barbell-outline",
      label: "운동 종목",
      tags: sports.length ? sports : ["테니스"],
      bg: "#EAF3FF",
      textColor: "#1D4ED8",
    },
    {
      icon: "people-outline",
      label: "운동 스타일",
      tags: styles.length ? styles : ["같이"],
      bg: "#F0ECFF",
      textColor: "#6D5DF6",
    },
    {
      icon: "flame-outline",
      label: "운동 강도",
      tags: intensities.length ? intensities : ["가볍게"],
      bg: "#FFF1E6",
      textColor: "#EA6F0A",
    },
  ];
}

function InfoRow({ row }: { row: TagRow }) {
  return (
    <View style={rowStyles.row}>
      <View style={rowStyles.left}>
        <Ionicons name={row.icon} size={17} color={row.textColor} />
        <Text style={rowStyles.label}>{row.label}</Text>
      </View>
      <View style={rowStyles.pills}>
        {row.tags.map((tag) => (
          <View key={tag} style={[rowStyles.pill, { backgroundColor: row.bg }]}>
            <Text style={[rowStyles.pillText, { color: row.textColor }]}>
              {tag}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  label: {
    fontFamily: FontFamily.inter,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "800",
    color: "#374151",
  },
  pills: {
    flexDirection: "row",
    gap: 6,
  },
  pill: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 12,
  },
  pillText: {
    fontFamily: FontFamily.inter,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
  },
});

// ── Match ring ────────────────────────────────────────────────────────────────
const RING_SIZE = 84;
const RING_STROKE = 8;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function MatchRing({ score }: { score: number }) {
  const normalized = Math.max(0, Math.min(score, 100));
  const dashOffset = RING_CIRCUMFERENCE * (1 - normalized / 100);

  return (
    <View style={ringStyles.wrap}>
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
      <View style={ringStyles.label}>
        <Text style={ringStyles.percent}>{normalized}%</Text>
        <Text style={ringStyles.matchText}>MATCH</Text>
      </View>
    </View>
  );
}

const ringStyles = StyleSheet.create({
  wrap: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    position: "absolute",
    alignItems: "center",
  },
  percent: {
    fontSize: 19,
    lineHeight: 23,
    color: "#111827",
    fontWeight: "900",
  },
  matchText: {
    fontSize: 9,
    lineHeight: 12,
    color: "#6D5DF6",
    fontWeight: "900",
    letterSpacing: 0.4,
  },
});

// ── Card ──────────────────────────────────────────────────────────────────────
const DEFAULT_BACKGROUND_IMAGE = require("../../../assets/home/PartnerCardBackground2.png");
const DEFAULT_PROFILE_IMAGE = require("../../../assets/home/PartnerProfileImage.png");

const PartnerCard = ({
  imageSource = DEFAULT_BACKGROUND_IMAGE,
  profileImageSource = DEFAULT_PROFILE_IMAGE,
  name = "Minjun Kim",
  department,
  studentId,
  tags = ["Tennis", "Beginner", "Weekend AM", "Fair Play"],
  matchScore = 87,
  rejectLabel = "Pass",
  acceptLabel = "Accept",
  width,
  onReject,
  onAccept,
}: PartnerCardProps) => {
  const tagRows = buildTagRows(tags);

  return (
    <View style={[styles.card, width != null && { width }]}>

      {/* ── Profile visual area ── */}
      <ImageBackground
        source={imageSource}
        resizeMode="cover"
        imageStyle={styles.visualImage}
        style={styles.visual}
      >
        <View style={styles.visualTint}>
          <Image
            source={profileImageSource}
            style={styles.profileImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.ringOverlay}>
          <MatchRing score={matchScore} />
        </View>
      </ImageBackground>

      {/* ── Name / dept ── */}
      <View style={styles.nameSection}>
        <Text style={styles.name}>{name}</Text>
        {(department || studentId) ? (
          <Text style={styles.subInfo}>
            {[department, studentId].filter(Boolean).join(" · ")}
          </Text>
        ) : null}
      </View>

      {/* ── 3-row tag info ── */}
      <View style={styles.infoList}>
        {tagRows.map((row) => (
          <InfoRow key={row.label} row={row} />
        ))}
      </View>

      {/* ── Action buttons ── */}
      <View style={styles.actionRow}>
        <Pressable
          accessibilityRole="button"
          style={[styles.actionButton, styles.rejectButton]}
          onPress={onReject}
        >
          <Text style={[styles.actionLabel, styles.rejectLabel]}>
            {rejectLabel}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          style={[styles.actionButton, styles.acceptButton]}
          onPress={onAccept}
        >
          <Text style={[styles.actionLabel, styles.acceptLabel]}>
            {acceptLabel}
          </Text>
        </Pressable>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    minHeight: HomeLayout.partnerCardMinHeight,
    borderRadius: Border.br_16,
    backgroundColor: Color.colorWhite,
    borderWidth: 1,
    borderColor: Color.colorGray,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  // ── Profile area ──────────────────────────────────────────────────────────
  visual: {
    height: HomeLayout.partnerCardVisualHeight,
    backgroundColor: Color.colorLightsteelblue,
  },
  visualImage: {
    borderTopLeftRadius: Border.br_16,
    borderTopRightRadius: Border.br_16,
  },
  visualTint: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.32)",
  },
  profileImage: {
    width: HomeLayout.partnerProfileSize,
    height: HomeLayout.partnerProfileSize,
    borderRadius: HomeLayout.partnerProfileSize / 2,
  },
  ringOverlay: {
    position: "absolute",
    top: 14,
    right: 14,
  },

  // ── Name section ──────────────────────────────────────────────────────────
  nameSection: {
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 4,
  },
  name: {
    color: Color.colorBlack,
    fontFamily: FontFamily.inter,
    fontSize: FontSize.fs_22,
    lineHeight: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  subInfo: {
    color: Color.neutral500,
    fontFamily: FontFamily.inter,
    fontSize: FontSize.fs_13,
    lineHeight: LineHeight.lh_18,
    fontWeight: "500",
    textAlign: "center",
  },

  // ── Info rows ─────────────────────────────────────────────────────────────
  infoList: {
    gap: 7,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 4,
  },

  // ── Action buttons ────────────────────────────────────────────────────────
  actionRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F5",
  },
  actionButton: {
    flex: 1,
    height: HomeLayout.actionButtonHeight,
    borderRadius: Border.br_32_7,
    alignItems: "center",
    justifyContent: "center",
  },
  rejectButton: {
    backgroundColor: Color.colorGhostwhite,
  },
  acceptButton: {
    backgroundColor: Color.colorRoyalblue,
  },
  actionLabel: {
    fontFamily: FontFamily.inter,
    fontSize: FontSize.fs_15,
    lineHeight: LineHeight.lh_20,
    fontWeight: "600",
  },
  rejectLabel: {
    color: Color.colorBlack,
  },
  acceptLabel: {
    color: Color.neutral100,
  },
});

export default PartnerCard;
