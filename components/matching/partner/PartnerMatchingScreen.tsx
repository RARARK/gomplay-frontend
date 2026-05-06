import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
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
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";

type RecommendedPartner = {
  id: string;
  matchPercentage: number;
  sharedInterests: number;
  name: string;
  studentId: string;
  department: string;
  activityStyle: string;
  tags: [string, string, string];
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = Math.min(SCREEN_WIDTH - 42, 380);
const CARD_RADIUS = 24;
const REFRESH_COST = 10;
const PROFILE_IMAGE = require("../../../assets/match/Ellipse-12.png");

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
    department: "소프트웨어학과",
    activityStyle: "꾸준히 열심히",
    tags: ["활동적", "초보", "아웃도어"],
  },
  {
    id: "partner-2",
    matchPercentage: 91,
    sharedInterests: 5,
    name: "이서윤",
    studentId: "23학번",
    department: "체육교육과",
    activityStyle: "가볍게 오래",
    tags: ["아침형", "러닝", "친화적"],
  },
  {
    id: "partner-3",
    matchPercentage: 87,
    sharedInterests: 4,
    name: "박지훈",
    studentId: "22학번",
    department: "컴퓨터공학과",
    activityStyle: "루틴 중심",
    tags: ["근력", "저녁형", "꾸준함"],
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
          <LinearGradient id="ringGrad2" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#7C6FF7" />
            <Stop offset="1" stopColor="#4F46E5" />
          </LinearGradient>
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

// ── Info row ──────────────────────────────────────────────────────────────────
type InfoRowData = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  values: string[];
  bg: string;
  textColor: string;
};

function InfoRow({ row }: { row: InfoRowData }) {
  return (
    <View style={infoStyles.row}>
      <View style={infoStyles.left}>
        <Ionicons name={row.icon} size={17} color={row.textColor} />
        <Text style={infoStyles.label}>{row.label}</Text>
      </View>
      <View style={infoStyles.pills}>
        {row.values.map((v) => (
          <View key={v} style={[infoStyles.pill, { backgroundColor: row.bg }]}>
            <Text style={[infoStyles.pillText, { color: row.textColor }]}>
              {v}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: {
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  left: { flexDirection: "row", alignItems: "center", gap: 7 },
  label: { fontSize: 13, lineHeight: 17, fontWeight: "800", color: "#374151" },
  pills: { flexDirection: "row", gap: 6 },
  pill: { paddingHorizontal: 11, paddingVertical: 5, borderRadius: 12 },
  pillText: { fontSize: 12, lineHeight: 16, fontWeight: "700" },
});

// ── Partner card ──────────────────────────────────────────────────────────────
function PartnerCard({
  partner,
  onRefresh,
  onRequest,
}: {
  partner: RecommendedPartner;
  onRefresh: () => void;
  onRequest: () => void;
}) {
  const infoRows: InfoRowData[] = [
    {
      icon: "heart-outline",
      label: "공통 관심사",
      values: [`${partner.sharedInterests}개`],
      bg: "#EAFBF3",
      textColor: "#16A34A",
    },
    {
      icon: "flame-outline",
      label: "운동 스타일",
      values: [partner.activityStyle],
      bg: "#F0ECFF",
      textColor: "#6D5DF6",
    },
    {
      icon: "pricetag-outline",
      label: "성향 태그",
      values: partner.tags,
      bg: "#EAF3FF",
      textColor: "#1D4ED8",
    },
  ];

  return (
    <View style={cardStyles.card}>
      {/* Top area */}
      <View style={cardStyles.topArea}>
        <View style={cardStyles.profileRow}>
          {/* Avatar */}
          <View style={cardStyles.avatarWrap}>
            <Image
              source={PROFILE_IMAGE}
              style={cardStyles.avatar}
              contentFit="cover"
            />
            <View style={cardStyles.onlineBadge} />
          </View>

          {/* Name / dept */}
          <View style={cardStyles.profileInfo}>
            <Text numberOfLines={1} style={cardStyles.name}>
              {partner.name}
            </Text>
            <View style={cardStyles.deptPill}>
              <Text numberOfLines={1} style={cardStyles.deptText}>
                {partner.department} · {partner.studentId}
              </Text>
            </View>
            <View style={cardStyles.activeRow}>
              <View style={cardStyles.activeDot} />
              <Text style={cardStyles.activeText}>Active now</Text>
            </View>
          </View>

          {/* Match ring */}
          <MatchRing score={partner.matchPercentage} />
        </View>
      </View>

      {/* White body */}
      <View style={cardStyles.body}>
        <View style={cardStyles.infoList}>
          {infoRows.map((row) => (
            <InfoRow key={row.label} row={row} />
          ))}
        </View>

        <View style={cardStyles.divider} />

        {/* Buttons */}
        <View style={cardStyles.buttonRow}>
          <Pressable
            accessibilityRole="button"
            onPress={onRefresh}
            style={cardStyles.passButton}
          >
            <MaterialCommunityIcons name="gold" size={20} color="#C8960C" />
            <Text style={cardStyles.passLabel}>다음 파트너</Text>
            <View style={cardStyles.costBadge}>
              <Text style={cardStyles.costText}>{REFRESH_COST}P</Text>
            </View>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={onRequest}
            style={cardStyles.matchButton}
          >
            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
            <Text style={cardStyles.matchLabel}>파트너 신청</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: CARD_RADIUS,
    backgroundColor: "#FFFFFF",
    shadowColor: "#1F2937",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 10,
    overflow: "hidden",
  },

  // top
  topArea: {
    height: 160,
    paddingHorizontal: 20,
    justifyContent: "center",
    backgroundColor: "#D0D9FF",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: { width: 70, height: 70, borderRadius: 35 },
  onlineBadge: {
    position: "absolute",
    right: 2,
    bottom: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    backgroundColor: "#22C55E",
  },
  profileInfo: { flex: 1, minWidth: 0, gap: 6 },
  name: { fontSize: 20, lineHeight: 25, color: "#111827", fontWeight: "900" },
  deptPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  deptText: {
    fontSize: 11,
    lineHeight: 15,
    color: "#374151",
    fontWeight: "600",
  },
  activeRow: { flexDirection: "row", alignItems: "center", gap: 5 },
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

  // body
  body: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: "#FFFFFF",
  },
  infoList: { gap: 8 },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginTop: 20,
    marginBottom: 16,
  },

  // buttons
  buttonRow: { flexDirection: "row", gap: 10 },
  passButton: {
    flex: 1,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  passLabel: {
    fontSize: 14,
    lineHeight: 18,
    color: "#374151",
    fontWeight: "700",
  },
  costBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: "#FEF3C7",
  },
  costText: {
    fontSize: 11,
    lineHeight: 14,
    color: "#C8960C",
    fontWeight: "800",
  },
  matchButton: {
    flex: 1,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#5B50E8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  matchLabel: {
    fontSize: 15,
    lineHeight: 20,
    color: "#FFFFFF",
    fontWeight: "800",
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

          <PartnerCard
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
