import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from "react-native-svg";

type RecommendedPartner = {
  id: string;
  matchPercentage: number;
  sharedInterests: number;
  name: string;
  studentId: string;
  studentNumber: string;
  department: string;
  activityStyle: string;
  tendencyTitle: string;
  tendencyDescription: string;
  intensityLabel: string;
  intensityDescription: string;
  workoutReason: string;
  workoutReasonDescription: string;
  tags: [string, string, string];
  interests: [PartnerInterest, PartnerInterest, PartnerInterest];
  profileImageUrl?: string | null;
};

type PartnerInterest = {
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = Math.min(SCREEN_WIDTH - 42, 380);
const PROFILE_IMAGE = require("../assets/match/Ellipse-12.png");

const RING_SIZE = 84;
const RING_STROKE = 8;
const RING_RADIUS_SVG = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS_SVG;

const RECOMMENDED_PARTNERS: RecommendedPartner[] = [
  {
    id: "partner-1",
    matchPercentage: 82,
    sharedInterests: 3,
    name: "김단국",
    studentId: "21학번",
    studentNumber: "202112345",
    department: "소프트웨어학과",
    activityStyle: "꾸준히 열심히",
    tendencyTitle: "서로 동기부여가 되는 파트너를 선호해요!",
    tendencyDescription: "함께 목표를 세우고 꾸준히 운동하고 싶어요.",
    intensityLabel: "중간~높음",
    intensityDescription: "적당히 도전적인 강도로 함께 성장하고 싶어요.",
    workoutReason: "체력 향상 & 스트레스 해소",
    workoutReasonDescription: "체력을 키우고 스트레스를 날리고 싶어요!",
    tags: ["활동적", "초보", "아웃도어"],
    interests: [
      { label: "축구", icon: "soccer" },
      { label: "헬스", icon: "dumbbell" },
      { label: "러닝", icon: "shoe-sneaker" },
    ],
  },
  {
    id: "partner-2",
    matchPercentage: 91,
    sharedInterests: 5,
    name: "이서윤",
    studentId: "23학번",
    studentNumber: "202312120",
    department: "체육교육과",
    activityStyle: "가볍게 오래",
    tendencyTitle: "편안하게 루틴을 맞춰가는 파트너를 좋아해요.",
    tendencyDescription: "무리하지 않고 오래 지속하는 운동을 선호해요.",
    intensityLabel: "낮음~중간",
    intensityDescription: "꾸준히 땀이 나는 정도의 강도가 잘 맞아요.",
    workoutReason: "건강한 생활 리듬 만들기",
    workoutReasonDescription: "아침 운동으로 하루를 산뜻하게 시작하고 싶어요.",
    tags: ["아침형", "러닝", "친화적"],
    interests: [
      { label: "러닝", icon: "shoe-sneaker" },
      { label: "요가", icon: "meditation" },
      { label: "헬스", icon: "dumbbell" },
    ],
  },
  {
    id: "partner-3",
    matchPercentage: 87,
    sharedInterests: 4,
    name: "박지훈",
    studentId: "22학번",
    studentNumber: "202212287",
    department: "컴퓨터공학과",
    activityStyle: "루틴 중심",
    tendencyTitle: "계획을 세우고 차근차근 실천하는 편이에요.",
    tendencyDescription: "정해진 시간에 만나 서로 루틴을 지켜주면 좋아요.",
    intensityLabel: "중간",
    intensityDescription: "기록을 보며 조금씩 강도를 올리고 싶어요.",
    workoutReason: "근력 향상과 자세 교정",
    workoutReasonDescription: "오래 앉아 있는 생활을 운동으로 균형 잡고 싶어요.",
    tags: ["근력", "저녁형", "꾸준함"],
    interests: [
      { label: "헬스", icon: "dumbbell" },
      { label: "농구", icon: "basketball" },
      { label: "러닝", icon: "shoe-sneaker" },
    ],
  },
];

// ── Match ring ────────────────────────────────────────────────────────────────
function MatchRing({ score }: { score: number }) {
  const normalized = Math.max(0, Math.min(score, 100));
  const dashOffset = RING_CIRCUMFERENCE * (1 - normalized / 100);

  return (
    <View style={ringStyles.wrap}>
      <Svg width={RING_SIZE} height={RING_SIZE}>
        <Defs>
          <SvgLinearGradient id="ringGrad2" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#7C6FF7" />
            <Stop offset="1" stopColor="#4F46E5" />
          </SvgLinearGradient>
        </Defs>
        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS_SVG}
          stroke="#E7E9FF"
          strokeWidth={RING_STROKE}
          fill="#FFFFFF"
        />
        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS_SVG}
          stroke="url(#ringGrad2)"
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

const ringStyles = StyleSheet.create({
  wrap: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  label: { position: "absolute", alignItems: "center" },
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

// ── Compact partner card ─────────────────────────────────────────────────────
function CompactPartnerCard({
  partner,
  onRefresh,
  onRequest,
}: {
  partner: RecommendedPartner;
  onRefresh: () => void;
  onRequest: () => void;
}) {
  const intensityLevel = (() => {
    const label = partner.intensityLabel;
    if (label.includes("높음") && label.includes("중간")) return 4;
    if (label.includes("높음")) return 5;
    if (label.includes("낮음") && label.includes("중간")) return 2;
    if (label.includes("낮음")) return 1;
    if (label.includes("중간")) return 3;
    return 3;
  })();

  const tendencyShort = (() => {
    const style = partner.activityStyle;
    if (style === "꾸준히 열심히") return "동기부여형";
    if (style === "가볍게 오래") return "루틴 지속형";
    if (style === "루틴 중심") return "계획 실천형";
    return style;
  })();

  return (
    <View style={compactStyles.card}>
      {/* Header */}
      <View style={compactStyles.header}>
        <View style={compactStyles.avatarWrap}>
          <Image
            source={
              partner.profileImageUrl
                ? { uri: partner.profileImageUrl }
                : PROFILE_IMAGE
            }
            style={compactStyles.avatar}
            contentFit="cover"
          />
          <View style={compactStyles.onlineBadge} />
        </View>

        <View style={compactStyles.profileInfo}>
          <View style={compactStyles.nameRow}>
            <Text numberOfLines={1} style={compactStyles.name}>
              {partner.name}
            </Text>
            <Text style={compactStyles.gradeText}>{partner.studentId}</Text>
          </View>
          <Text numberOfLines={1} style={compactStyles.dept}>
            {partner.department}
          </Text>
          <Text style={compactStyles.studentNum}>{partner.studentNumber}</Text>
          <View style={compactStyles.activeRow}>
            <View style={compactStyles.activeDot} />
            <Text style={compactStyles.activeText}>Active now</Text>
          </View>
        </View>

        <MatchRing score={partner.matchPercentage} />
      </View>

      {/* Body */}
      <View style={compactStyles.body}>
        {/* Interests row */}
        <View style={compactStyles.interestRow}>
          <View style={compactStyles.interestLeft}>
            <Ionicons name="heart" size={15} color="#6D5DF6" />
            <Text style={compactStyles.interestLabel}>공통 관심사</Text>
            <View style={compactStyles.interestCountBadge}>
              <Text style={compactStyles.interestCount}>
                {partner.sharedInterests}개
              </Text>
            </View>
          </View>
          <View style={compactStyles.interestChips}>
            {partner.interests.map((interest) => (
              <View key={interest.label} style={compactStyles.chip}>
                <MaterialCommunityIcons
                  name={interest.icon}
                  size={12}
                  color="#6D5DF6"
                />
                <Text style={compactStyles.chipText}>{interest.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Compact info panel */}
        <View style={compactStyles.infoPanel}>
          <View style={compactStyles.infoLeft}>
            <View style={compactStyles.infoIconRow}>
              <Ionicons name="person" size={14} color="#6D5DF6" />
              <Text style={compactStyles.infoTitle}>파트너 성향</Text>
            </View>
            <Text style={compactStyles.infoValue}>{tendencyShort}</Text>
            <Text numberOfLines={2} style={compactStyles.infoSub}>
              {partner.tendencyTitle.length > 20
                ? partner.tendencyTitle.slice(0, 20) + "…"
                : partner.tendencyTitle}
            </Text>
          </View>

          <View style={compactStyles.infoDivider} />

          <View style={compactStyles.infoRight}>
            <View style={compactStyles.infoIconRow}>
              <Ionicons name="flash" size={14} color="#22C55E" />
              <Text style={compactStyles.infoTitle}>운동 강도</Text>
            </View>
            <Text style={[compactStyles.infoValue, { color: "#22C55E" }]}>
              {partner.intensityLabel}
            </Text>
            <View style={compactStyles.intensityBars}>
              {[1, 2, 3, 4, 5].map((i) => (
                <View
                  key={i}
                  style={[
                    compactStyles.bar,
                    {
                      height: 8 + i * 3,
                      backgroundColor: i <= intensityLevel ? "#22C55E" : "#D1FAE5",
                    },
                  ]}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View style={compactStyles.buttonRow}>
          <Pressable
            accessibilityRole="button"
            onPress={onRefresh}
            style={compactStyles.nextBtn}
          >
            <Ionicons name="shuffle" size={17} color="#6D5DF6" />
            <Text style={compactStyles.nextBtnText}>다음 파트너</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={onRequest}
            style={compactStyles.applyBtn}
          >
            <LinearGradient
              colors={["#7567F5", "#4F46E5"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={compactStyles.applyGrad}
            >
              <Ionicons name="heart" size={17} color="#FFFFFF" />
              <Text style={compactStyles.applyBtnText}>파트너 신청</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>

      {/* Safety note */}
      <View style={compactStyles.safeNote}>
        <Ionicons name="lock-closed-outline" size={13} color="#9CA3AF" />
        <Text style={compactStyles.safeNoteText}>
          모든 정보는 검증된 사용자만 확인할 수 있어요.
        </Text>
      </View>
    </View>
  );
}

const compactStyles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    shadowColor: "#6D5DF6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.13,
    shadowRadius: 20,
    elevation: 8,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: "#ECEEFF",
  },
  avatarWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: { width: 64, height: 64, borderRadius: 32 },
  onlineBadge: {
    position: "absolute",
    right: 1,
    bottom: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: "#ECEEFF",
    backgroundColor: "#22C55E",
  },
  profileInfo: { flex: 1, minWidth: 0, gap: 2 },
  nameRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
  },
  name: {
    fontSize: 21,
    lineHeight: 26,
    color: "#111827",
    fontWeight: "900",
  },
  gradeText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#6B7280",
    fontWeight: "700",
    paddingBottom: 2,
  },
  dept: {
    fontSize: 13,
    lineHeight: 17,
    color: "#4B5563",
    fontWeight: "600",
  },
  studentNum: {
    fontSize: 12,
    lineHeight: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  activeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  },
  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#22C55E",
  },
  activeText: {
    fontSize: 12,
    lineHeight: 16,
    color: "#16A34A",
    fontWeight: "700",
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
  },
  interestRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    marginBottom: 12,
  },
  interestLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  interestLabel: {
    fontSize: 13,
    lineHeight: 17,
    color: "#374151",
    fontWeight: "800",
  },
  interestCountBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: "#EEF0FF",
  },
  interestCount: {
    fontSize: 11,
    lineHeight: 14,
    color: "#6D5DF6",
    fontWeight: "800",
  },
  interestChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: "#F5F3FF",
    borderWidth: 1,
    borderColor: "#E8E5FF",
  },
  chipText: {
    fontSize: 12,
    lineHeight: 16,
    color: "#6D5DF6",
    fontWeight: "700",
  },
  infoPanel: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
  },
  infoLeft: { flex: 1, gap: 4 },
  infoDivider: {
    width: 1,
    height: 56,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 14,
  },
  infoRight: { flex: 1, gap: 4 },
  infoIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoTitle: {
    fontSize: 11,
    lineHeight: 15,
    color: "#9CA3AF",
    fontWeight: "700",
  },
  infoValue: {
    fontSize: 14,
    lineHeight: 19,
    color: "#111827",
    fontWeight: "900",
  },
  infoSub: {
    fontSize: 11,
    lineHeight: 15,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  intensityBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 3,
    marginTop: 2,
  },
  bar: {
    width: 7,
    borderRadius: 999,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  nextBtn: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#6D5DF6",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  nextBtnText: {
    fontSize: 14,
    lineHeight: 18,
    color: "#6D5DF6",
    fontWeight: "800",
  },
  applyBtn: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    overflow: "hidden",
  },
  applyGrad: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  applyBtnText: {
    fontSize: 14,
    lineHeight: 18,
    color: "#FFFFFF",
    fontWeight: "800",
  },
  safeNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingBottom: 14,
    paddingTop: 2,
  },
  safeNoteText: {
    fontSize: 11,
    lineHeight: 15,
    color: "#9CA3AF",
    fontWeight: "500",
  },
});

// ── Screen ────────────────────────────────────────────────────────────────────
export default function PartnerMatchingScreen() {
  const [partnerIndex, setPartnerIndex] = React.useState(0);
  const currentPartner = RECOMMENDED_PARTNERS[partnerIndex];

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleRefresh = () => {
    setPartnerIndex((i) => (i + 1) % RECOMMENDED_PARTNERS.length);
  };

  const handleRequest = () => {
    Alert.alert(
      "파트너 신청 완료",
      `${currentPartner.name}님에게 파트너 신청을 보냈어요.`,
    );
  };

  return (
    <>
      <View style={screenStyles.headerContainer}>
        <View style={screenStyles.header}>
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            hitSlop={8}
            onPress={handleBackPress}
            style={screenStyles.backButton}
          >
            <Ionicons name="chevron-back" size={28} color="#111111" />
          </Pressable>
          <Text style={screenStyles.headerTitle}>파트너 매칭</Text>
          <Pressable
            accessibilityLabel="Open profile"
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => router.push("/mypage" as any)}
            style={screenStyles.myButton}
          >
            <Text style={screenStyles.myButtonText}>MY</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={screenStyles.screen}
        contentContainerStyle={screenStyles.screenContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={screenStyles.matchPanel}>
          <View style={screenStyles.panelHeader}>
            <View style={screenStyles.panelTitleRow}>
              <Ionicons name="sparkles" size={34} color="#F59E0B" />
              <Text style={screenStyles.panelTitle}>
                성향 일치 파트너 발견!
              </Text>
            </View>
            <Text style={screenStyles.panelSubtitle}>
              지금 바로 연결해보세요.
            </Text>
          </View>

          <CompactPartnerCard
            partner={currentPartner}
            onRefresh={handleRefresh}
            onRequest={handleRequest}
          />
        </View>
      </ScrollView>
    </>
  );
}

const screenStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
  screenContent: { flexGrow: 1, paddingTop: 16 },
  headerContainer: {
    backgroundColor: "#FFFFFF",
  },
  header: {
    height: 48,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    lineHeight: 22,
    color: "#111827",
    fontWeight: "700",
    textAlign: "center",
  },
  myButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  myButtonText: {
    fontSize: 16,
    lineHeight: 16,
    color: "#111111",
    fontWeight: "900",
  },
  matchPanel: {
    alignItems: "center",
    gap: 18,
    marginTop: 14,
    paddingHorizontal: 21,
    paddingTop: 18,
    paddingBottom: 28,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  panelHeader: { alignItems: "center", gap: 4 },
  panelTitleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  panelTitle: {
    fontSize: 20,
    lineHeight: 25,
    color: "#111827",
    fontWeight: "800",
    textAlign: "center",
  },
  panelSubtitle: {
    fontSize: 15,
    lineHeight: 20,
    color: "#6B7280",
    fontWeight: "600",
  },
});
