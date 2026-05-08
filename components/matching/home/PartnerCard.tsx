import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import DEFAULT_BACKGROUND_IMAGE from "../../../assets/home/PartnerCardBackground2.png";
import DEFAULT_PROFILE_IMAGE from "../../../assets/home/PartnerProfileImage.png";
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

// ── Info row ──────────────────────────────────────────────────────────────────
type InfoRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  label: string;
  values: string[];
  chipBg: string;
  chipTextColor: string;
};

function InfoRow({ icon, iconColor, label, values, chipBg, chipTextColor }: InfoRowProps) {
  if (values.length === 0) return null;

  return (
    <View style={rowStyles.row}>
      <View style={rowStyles.left}>
        <Ionicons name={icon} size={17} color={iconColor} />
        <Text style={rowStyles.label}>{label}</Text>
      </View>
      <View style={rowStyles.chips}>
        {values.map((v) => (
          <View key={v} style={[rowStyles.chip, { backgroundColor: chipBg }]}>
            <Text style={[rowStyles.chipText, { color: chipTextColor }]}>{v}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 8,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    flexShrink: 0,
  },
  label: {
    fontFamily: FontFamily.inter,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "800",
    color: "#374151",
  },
  chips: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 6,
  },
  chip: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 12,
  },
  chipText: {
    fontFamily: FontFamily.inter,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
  },
});

// ── Card ──────────────────────────────────────────────────────────────────────

const PartnerCard = ({
  imageSource = DEFAULT_BACKGROUND_IMAGE,
  profileImageSource = DEFAULT_PROFILE_IMAGE,
  name = "파트너",
  department,
  studentId,
  partnerStyle,
  exerciseIntensity,
  exerciseReason,
  exerciseTypes = [],
  matchScore,
  rejectLabel = "Pass",
  acceptLabel = "Accept",
  width,
  onReject,
  onAccept,
}: PartnerCardProps) => {
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
        {matchScore != null && (
          <View style={styles.ringOverlay}>
            <MatchRing score={matchScore} />
          </View>
        )}
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

      {/* ── 4-row profile info ── */}
      <View style={styles.infoList}>
        <InfoRow
          icon="people-outline"
          iconColor="#6D5DF6"
          label="파트너 성향"
          values={partnerStyle ? [partnerStyle] : []}
          chipBg="#F0ECFF"
          chipTextColor="#6D5DF6"
        />
        <InfoRow
          icon="flame-outline"
          iconColor="#EA6F0A"
          label="운동 강도"
          values={exerciseIntensity ? [exerciseIntensity] : []}
          chipBg="#FFF1E6"
          chipTextColor="#EA6F0A"
        />
        <InfoRow
          icon="trophy-outline"
          iconColor="#1D4ED8"
          label="운동 이유"
          values={exerciseReason ? [exerciseReason] : []}
          chipBg="#EAF3FF"
          chipTextColor="#1D4ED8"
        />
        <InfoRow
          icon="barbell-outline"
          iconColor="#059669"
          label="선호 운동"
          values={exerciseTypes}
          chipBg="#ECFDF5"
          chipTextColor="#059669"
        />
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

  infoList: {
    gap: 7,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 4,
  },

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
