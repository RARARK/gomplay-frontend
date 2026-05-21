import {
  FontFamily,
  FontSize,
  HomeLayout,
  LineHeight,
} from "@/constants/locofyHomeStyles";
import type { PartnerCardProps } from "@/types/ui/homeCards";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import * as React from "react";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, {
  Circle,
  Defs,
  Stop,
  LinearGradient as SvgLinearGradient,
} from "react-native-svg";
import DEFAULT_BACKGROUND_IMAGE from "../assets/home/PartnerCardBackground.png";
import DEFAULT_PROFILE_IMAGE from "../assets/home/PartnerProfileImage.png";
import PartnerProfileModal from "../components/matching/home/PartnerProfileModal";

export type { PartnerCardProps } from "@/types/ui/homeCards";

const PHOTO_SIZE = 104;
const PHOTO_STAGE_WIDTH = 164;
const PHOTO_STAGE_HEIGHT = 126;

const CONFETTI_PIECES = [
  { top: 10, left: 18, width: 18, height: 6, borderRadius: 3, backgroundColor: "#F97316", transform: [{ rotate: "-24deg" }] },
  { top: 34, left: 4, width: 8, height: 8, borderRadius: 4, backgroundColor: "#22C55E" },
  { top: 70, left: 18, width: 12, height: 5, borderRadius: 3, backgroundColor: "#38BDF8", transform: [{ rotate: "28deg" }] },
  { top: 95, left: 40, width: 7, height: 7, borderRadius: 4, backgroundColor: "#FACC15" },
  { top: 8, right: 22, width: 7, height: 7, borderRadius: 4, backgroundColor: "#EC4899" },
  { top: 32, right: 4, width: 17, height: 6, borderRadius: 3, backgroundColor: "#4F46E5", transform: [{ rotate: "22deg" }] },
  { top: 74, right: 16, width: 9, height: 9, borderRadius: 5, backgroundColor: "#FACC15" },
  { top: 96, right: 38, width: 14, height: 5, borderRadius: 3, backgroundColor: "#22C55E", transform: [{ rotate: "-18deg" }] },
] as const;

const toArr = (v?: string): string[] => (v ? [v] : []);

// ── Match ring ────────────────────────────────────────────────────────────────
const RING_SIZE = 62;
const RING_STROKE = 6;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function MatchRing({ score }: { score: number }) {
  const normalized = Math.max(0, Math.min(score, 100));
  const dashOffset = RING_CIRCUMFERENCE * (1 - normalized / 100);

  return (
    <View style={ringStyles.wrap}>
      <Svg width={RING_SIZE} height={RING_SIZE}>
        <Defs>
          <SvgLinearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#7C6FF7" />
            <Stop offset="1" stopColor="#4F46E5" />
          </SvgLinearGradient>
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
          stroke="url(#ringGrad)"
          strokeWidth={RING_STROKE}
          fill="transparent"
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

function ConfettiBurst() {
  return (
    <View pointerEvents="none" style={S.confettiLayer}>
      {CONFETTI_PIECES.map((piece, index) => (
        <View key={index} style={[S.confettiPiece, piece]} />
      ))}
      <View style={[S.sparkle, S.sparkleLeft]}>
        <Ionicons name="sparkles" size={18} color="#FACC15" />
      </View>
      <View style={[S.sparkle, S.sparkleRight]}>
        <Ionicons name="sparkles" size={16} color="#FFFFFF" />
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
    fontSize: 14,
    lineHeight: 17,
    color: "#111827",
    fontWeight: "900",
  },
  matchText: {
    fontSize: 7,
    lineHeight: 9,
    color: "#6D5DF6",
    fontWeight: "900",
    letterSpacing: 0.4,
  },
});

// ── Info row ──────────────────────────────────────────────────────────────────
type InfoRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  label: string;
  values: string[];
  chipBg: string;
  chipTextColor: string;
  isLast?: boolean;
  scrollable?: boolean;
};

function InfoRow({
  icon,
  iconColor,
  iconBg,
  label,
  values,
  chipBg,
  chipTextColor,
  isLast,
  scrollable,
}: InfoRowProps) {
  if (values.length === 0) return null;

  const chips = values.map((v) => (
    <View key={v} style={[R.chip, { backgroundColor: chipBg }]}>
      <Text style={[R.chipText, { color: chipTextColor }]} numberOfLines={1}>{v}</Text>
    </View>
  ));

  return (
    <>
      <View style={R.row}>
        <View style={R.left}>
          <View style={[R.iconCircle, { backgroundColor: iconBg }]}>
            <Ionicons name={icon} size={15} color={iconColor} />
          </View>
          <Text style={R.label}>{label}</Text>
        </View>
        {scrollable ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={R.scrollContent}
            style={R.scrollArea}
          >
            {chips}
          </ScrollView>
        ) : (
          <View style={R.valueArea}>{chips}</View>
        )}
      </View>
      {!isLast && <View style={R.divider} />}
    </>
  );
}

const R = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
    paddingHorizontal: 2,
    gap: 10,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexShrink: 0,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontFamily: FontFamily.inter,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    color: "#1F2937",
    width: 68,
  },
  valueArea: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 5,
    overflow: "hidden",
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 5,
    paddingRight: 2,
  },
  chip: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 20,
    alignItems: "center",
  },
  chipText: {
    fontFamily: FontFamily.inter,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F2FF",
  },
});

// ── Card ──────────────────────────────────────────────────────────────────────
const PartnerCard = ({
  imageSource = DEFAULT_BACKGROUND_IMAGE,
  profileImageSource = DEFAULT_PROFILE_IMAGE,
  name = "파트너",
  department,
  studentId,
  isActiveNow,
  sharedInterests,
  partnerStyle,
  exerciseIntensity,
  exerciseReason,
  exerciseTypes = [],
  matchScore,
  matchInsight,
  rejectLabel = "Pass",
  acceptLabel = "Accept",
  width,
  disconnected = false,
  onReject,
  onAccept,
}: PartnerCardProps) => {
  const hasMeta = Boolean(department || studentId);
  const [infoExpanded, setInfoExpanded] = React.useState(false);
  const [showProfile, setShowProfile] = React.useState(false);

  return (
    <View style={[S.card, width != null && { width }]}>
      {/* ── Visual header ── */}
      <ImageBackground source={imageSource} resizeMode="cover" style={S.visual}>
        {matchScore != null && (
          <View style={S.ringOverlay}>
            <MatchRing score={matchScore} />
          </View>
        )}

        <View style={S.photoStage}>
          <ConfettiBurst />
          <View style={S.photoGlow} />
          <Pressable
            accessibilityRole="button"
            onPress={() => setShowProfile(true)}
            style={S.photoRing}
          >
            <Image
              source={profileImageSource}
              style={S.photo}
              contentFit="cover"
              placeholder={DEFAULT_PROFILE_IMAGE}
            />
          </Pressable>
        </View>

        {hasMeta && (
          <View style={S.metaPill}>
            <Ionicons name="school-outline" size={13} color="#7C6FF7" />
            <Text style={S.metaText} numberOfLines={1}>
              {[department, studentId].filter(Boolean).join("  ·  ")}
            </Text>
          </View>
        )}

        <Text style={S.name}>{name}</Text>
        {isActiveNow && (
          <View style={S.activeRow}>
            <View style={S.activeDot} />
            <Text style={S.activeText}>Active now</Text>
          </View>
        )}
        <View style={S.nameDivider} />
      </ImageBackground>

      {/* ── Match Insight ── */}
      <View style={S.insightCard}>
        <View style={S.insightHeader}>
          <View style={S.insightIconWrap}>
            <Ionicons name="sparkles" size={14} color="#7C6FF7" />
          </View>
          <Text style={S.insightTitle}>Match Insight</Text>
          <View style={S.insightBadge}>
            <Text style={S.insightBadgeText}>추천 이유</Text>
          </View>
        </View>
        <View style={S.insightBody}>
          <Text style={S.insightQuote}>{"“"}</Text>
          <Text style={S.insightText} numberOfLines={3}>
            {matchInsight ?? "운동 스타일과 강도가 잘 맞고, 선호하는 종목도 겹쳐요. 함께라면 꾸준히 운동할 수 있을 거예요!"}
          </Text>
        </View>
      </View>

      {/* ── Info section ── */}
      <View style={S.infoCard}>
        <Pressable
          accessibilityRole="button"
          style={S.infoToggleRow}
          onPress={() => setInfoExpanded((v) => !v)}
        >
          <Text style={S.infoToggleLabel}>파트너 성향 상세</Text>
          <Ionicons
            name={infoExpanded ? "chevron-up" : "chevron-down"}
            size={16}
            color="#7C6FF7"
          />
        </Pressable>

        {infoExpanded && (
          <>
            {sharedInterests != null && (
              <InfoRow
                icon="heart-outline"
                iconColor="#16A34A"
                iconBg="#DCFCE7"
                label="공통 관심사"
                values={[`${sharedInterests}개`]}
                chipBg="#DCFCE7"
                chipTextColor="#16A34A"
              />
            )}
            <InfoRow
              icon="people-outline"
              iconColor="#7C6FF7"
              iconBg="#EDE9FF"
              label="파트너 성향"
              values={toArr(partnerStyle)}
              chipBg="#EDE9FF"
              chipTextColor="#7C6FF7"
            />
            <InfoRow
              icon="flame-outline"
              iconColor="#EA6F0A"
              iconBg="#FEF3E2"
              label="운동 강도"
              values={toArr(exerciseIntensity)}
              chipBg="#FFF1E6"
              chipTextColor="#EA6F0A"
            />
            <InfoRow
              icon="trophy-outline"
              iconColor="#2563EB"
              iconBg="#EFF6FF"
              label="운동 이유"
              values={toArr(exerciseReason)}
              chipBg="#EFF6FF"
              chipTextColor="#2563EB"
            />
            <InfoRow
              icon="barbell-outline"
              iconColor="#059669"
              iconBg="#ECFDF5"
              label="선호 운동"
              values={exerciseTypes}
              chipBg="#ECFDF5"
              chipTextColor="#059669"
              isLast
              scrollable
            />
          </>
        )}
      </View>

      {/* ── Buttons ── */}
      <View style={S.buttonCard}>
        <Pressable
          accessibilityRole="button"
          style={S.passButton}
          onPress={onReject}
        >
          <Text style={S.passLabel}>{rejectLabel}</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          style={S.acceptButton}
          onPress={onAccept}
        >
          <LinearGradient
            colors={["#8B7CF6", "#5B4FF0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={S.acceptGradient}
          >
            <Text style={S.acceptLabel}>{acceptLabel}</Text>
          </LinearGradient>
        </Pressable>
      </View>

      {disconnected && (
        <View style={S.disconnectedOverlay}>
          <View style={S.disconnectedBadge}>
            <Ionicons name="wifi-outline" size={28} color="#9CA3AF" />
            <Text style={S.disconnectedTitle}>자리를 비웠어요</Text>
            <Text style={S.disconnectedDesc}>퀵매치 연결을 끊었습니다</Text>
          </View>
        </View>
      )}

      <PartnerProfileModal
        visible={showProfile}
        onClose={() => setShowProfile(false)}
        profileImageSource={profileImageSource}
        name={name}
        department={department}
        studentId={studentId}
        matchScore={matchScore}
        partnerStyle={partnerStyle}
        exerciseIntensity={exerciseIntensity}
        exerciseReason={exerciseReason}
        exerciseTypes={exerciseTypes}
      />
    </View>
  );
};

const S = StyleSheet.create({
  card: {
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    elevation: 12,
    shadowColor: "#4C5BE2",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },

  // ── Visual header ──
  visual: {
    backgroundColor: "#c1cdff",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 18,
    paddingHorizontal: 16,
  },
  ringOverlay: {
    position: "absolute",
    top: 14,
    right: 14,
    zIndex: 1,
  },
  photoStage: {
    width: PHOTO_STAGE_WIDTH,
    height: PHOTO_STAGE_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  confettiLayer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 0,
  },
  confettiPiece: {
    position: "absolute",
  },
  sparkle: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  sparkleLeft: {
    left: 36,
    top: 22,
    transform: [{ rotate: "-10deg" }],
  },
  sparkleRight: {
    right: 28,
    bottom: 22,
    transform: [{ rotate: "16deg" }],
    opacity: 0.9,
  },
  photoGlow: {
    position: "absolute",
    width: PHOTO_SIZE + 26,
    height: PHOTO_SIZE + 26,
    borderRadius: (PHOTO_SIZE + 26) / 2,
    backgroundColor: "rgba(255, 255, 255, 0.34)",
    zIndex: 1,
  },
  photoRing: {
    width: PHOTO_SIZE + 6,
    height: PHOTO_SIZE + 6,
    borderRadius: (PHOTO_SIZE + 6) / 2,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    elevation: 4,
    shadowColor: "#7C6FF7",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  photo: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: PHOTO_SIZE / 2,
  },
  metaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  metaText: {
    fontFamily: FontFamily.inter,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    color: "#4B4B6B",
  },
  name: {
    fontFamily: FontFamily.inter,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },
  activeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 6,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22C55E",
  },
  activeText: {
    fontSize: 12,
    lineHeight: 16,
    color: "#16A34A",
    fontWeight: "700",
  },
  nameDivider: {
    width: 32,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#C7CAFF",
    marginTop: 8,
  },

  // ── Match Insight ──
  insightCard: {
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 0,
    backgroundColor: "#F5F3FF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#DDD8FF",
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 14,
    gap: 10,
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  insightIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#EDE9FF",
    alignItems: "center",
    justifyContent: "center",
  },
  insightTitle: {
    flex: 1,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "800",
    color: "#4C3FBF",
    letterSpacing: 0.2,
  },
  insightBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 20,
    backgroundColor: "#DDD8FF",
  },
  insightBadgeText: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "700",
    color: "#5B4FF0",
  },
  insightBody: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 2,
  },
  insightQuote: {
    fontSize: 44,
    lineHeight: 36,
    color: "#C4B8FF",
    fontWeight: "900",
    marginTop: -4,
    width: 28,
    flexShrink: 0,
  },
  insightText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "500",
    color: "#4B4B6B",
    paddingTop: 4,
  },

  // ── Info card ──
  infoCard: {
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 4,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#EEEEFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    elevation: 2,
    shadowColor: "#4C5BE2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
  },

  infoToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 2,
  },
  infoToggleLabel: {
    fontFamily: FontFamily.inter,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "700",
    color: "#5B4FF0",
  },

  // ── Buttons ──
  buttonCard: {
    flexDirection: "row",
    gap: 10,
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#EEEEFF",
    paddingHorizontal: 12,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: "#4C5BE2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
  },
  passButton: {
    flex: 1,
    height: HomeLayout.actionButtonHeight,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  passLabel: {
    fontFamily: FontFamily.inter,
    fontSize: FontSize.fs_15,
    lineHeight: LineHeight.lh_20,
    fontWeight: "600",
    color: "#6B7280",
  },
  acceptButton: {
    flex: 2,
    height: HomeLayout.actionButtonHeight,
    borderRadius: 999,
    overflow: "hidden",
  },
  acceptGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptLabel: {
    fontFamily: FontFamily.inter,
    fontSize: FontSize.fs_15,
    lineHeight: LineHeight.lh_20,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  disconnectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(243, 244, 246, 0.92)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  disconnectedBadge: {
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 28,
    paddingVertical: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  disconnectedTitle: {
    fontFamily: FontFamily.inter,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "700",
    color: "#374151",
    textAlign: "center",
  },
  disconnectedDesc: {
    fontFamily: FontFamily.inter,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
    color: "#9CA3AF",
    textAlign: "center",
  },
});

export default PartnerCard;
