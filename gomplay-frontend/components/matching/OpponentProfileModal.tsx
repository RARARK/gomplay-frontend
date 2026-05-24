import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getSportIcon } from "@/lib/utils/sportIconMap";

const { height: SCREEN_H } = Dimensions.get("window");
const HERO_H = Math.round(SCREEN_H * 0.5);

const STYLE_VERSUS = [
  {
    key: "독립형",
    label: "독립형",
    icon: "person-outline" as const,
    desc: "혼자서도 계획적으로\n운동을 즐겨요",
    activeBg: "#F0FDF4",
    activeIcon: "#15803D",
    activeName: "#15803D",
    activeDesc: "#166534",
  },
  {
    key: "소통형",
    label: "소통형",
    icon: "people-outline" as const,
    desc: "함께 대화하며\n운동하는 걸 좋아해요",
    activeBg: "#EFF6FF",
    activeIcon: "#2563EB",
    activeName: "#1D4ED8",
    activeDesc: "#1E40AF",
  },
];

const EXERCISE_STYLE_MAP: Record<string, { title: string; desc: string }> = {
  꾸준형: {
    title: "꾸준함이 중요해요",
    desc: "주 2~3회, 계획을 세워 꾸준히 운동해요.\n정해진 약속은 꼭 지키는 편이에요.",
  },
  적당히: {
    title: "꾸준함이 중요해요",
    desc: "주 2~3회, 계획을 세워 꾸준히 운동해요.\n정해진 약속은 꼭 지키는 편이에요.",
  },
  강도형: {
    title: "강하게 밀어붙여요",
    desc: "운동할 때는 끝까지 강도 높게 집중해요.",
  },
  제대로: {
    title: "강하게 밀어붙여요",
    desc: "운동할 때는 끝까지 강도 높게 집중해요.",
  },
  한계까지: {
    title: "한계까지 밀어붙여요",
    desc: "최대 강도로 자신의 한계에 도전해요.",
  },
  가볍게: {
    title: "가볍게 즐겨요",
    desc: "무리하지 않고 즐겁게 운동하는 걸 좋아해요.",
  },
};

const EXERCISE_REASON_MAP: Record<string, { title: string; desc: string }> = {
  건강관리: {
    title: "체력 향상 & 건강 관리",
    desc: "지속 가능한 운동을 통해 체력을 올리고\n건강한 습관을 만들고 싶어요.",
  },
  체력: {
    title: "체력 향상 & 건강 관리",
    desc: "지속 가능한 운동을 통해 체력을 올리고\n건강한 습관을 만들고 싶어요.",
  },
  다이어트: {
    title: "다이어트 & 체형 관리",
    desc: "꾸준한 운동으로 원하는 체형을 만들어요.",
  },
  스트레스해소: {
    title: "스트레스 해소",
    desc: "운동으로 일상의 스트레스를 날려버려요.",
  },
  스트레스: {
    title: "스트레스 해소",
    desc: "운동으로 일상의 스트레스를 날려버려요.",
  },
  친해지려고: {
    title: "함께 즐기는 운동",
    desc: "운동을 통해 새로운 사람들과 친해지는 걸 좋아해요.",
  },
  경쟁: {
    title: "경쟁하며 성장해요",
    desc: "더 강해지기 위해 도전적인 운동을 즐겨요.",
  },
};

function getMannerLabel(score: number) {
  if (score >= 90) return "매너가 아주 좋아요! 👍";
  if (score >= 70) return "매너가 좋아요 😊";
  if (score >= 50) return "매너가 보통이에요";
  return "매너 개선이 필요해요";
}

export type OpponentProfileData = {
  name: string;
  department?: string;
  studentId?: string;
  profileImageUrl?: string | null;
  isVerified?: boolean;
  partnerStyle?: string;
  exerciseIntensity?: string;
  exerciseReason?: string;
  exerciseTypes?: string[];
  mannerTemperature?: number;
  matchCount?: number;
  noShowCount?: number;
  matchStatus?: "IN_PROGRESS" | "PENDING" | "COMPLETED";
};

type Props = {
  visible: boolean;
  onClose: () => void;
  data: OpponentProfileData;
  onComplete?: () => void;
  onChat?: () => void;
};

export default function OpponentProfileModal({
  visible,
  onClose,
  data,
  onComplete,
}: Props) {
  const insets = useSafeAreaInsets();
  const styleInfo = data.exerciseIntensity
    ? EXERCISE_STYLE_MAP[data.exerciseIntensity]
    : undefined;
  const reasonInfo = data.exerciseReason
    ? EXERCISE_REASON_MAP[data.exerciseReason]
    : undefined;
  const hasSports = (data.exerciseTypes?.length ?? 0) > 0;
  const hasStats = data.mannerTemperature != null || data.matchCount != null;
  const tempPct = Math.min(Math.max(data.mannerTemperature ?? 0, 0), 100);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        {/* ─── HERO ─── */}
        <View style={[styles.hero, { height: HERO_H }]}>
          <Image
            source={
              data.profileImageUrl
                ? { uri: data.profileImageUrl }
                : require("../../assets/home/PartnerProfileImage.png")
            }
            style={StyleSheet.absoluteFill}
            contentFit="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.82)"]}
            style={[StyleSheet.absoluteFill, { top: "30%" }]}
          />

          {/* Top bar */}
          <View style={[styles.topBar, { paddingTop: insets.top + 6 }]}>
            <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={12}>
              <Ionicons name="close" size={22} color="#FFFFFF" />
            </Pressable>
            {/* spacer for symmetry */}
            <View style={styles.topBarSpacer} />
          </View>

          {/* Hero bottom info */}
          <View style={styles.heroInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.heroName}>{data.name}</Text>
            </View>
            {(data.department || data.studentId) && (
              <Text style={styles.heroDept}>
                {[data.department, data.studentId].filter(Boolean).join(" ")}
              </Text>
            )}
          </View>
        </View>

        {/* ─── WHITE CARD ─── */}
        <View style={styles.card}>
          <View style={styles.dragHandle} />

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* 성격 */}
            {data.partnerStyle && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>성격</Text>
                <View style={styles.vsCard}>
                  {STYLE_VERSUS.map((side, i) => {
                    const active = side.key === data.partnerStyle;
                    return (
                      <React.Fragment key={side.key}>
                        {i === 1 && (
                          <View style={styles.vsDivider}>
                            <Text style={styles.vsText}>VS</Text>
                          </View>
                        )}
                        <View
                          style={[
                            styles.vsSide,
                            { backgroundColor: active ? side.activeBg : "#FFFFFF" },
                          ]}
                        >
                          <Ionicons
                            name={side.icon}
                            size={22}
                            color={active ? side.activeIcon : "#9CA3AF"}
                          />
                          <Text
                            style={[
                              styles.vsName,
                              { color: active ? side.activeName : "#9CA3AF" },
                            ]}
                          >
                            {side.label}
                          </Text>
                          <Text
                            style={[
                              styles.vsDesc,
                              { color: active ? side.activeDesc : "#9CA3AF" },
                            ]}
                          >
                            {side.desc}
                          </Text>
                        </View>
                      </React.Fragment>
                    );
                  })}
                </View>
              </View>
            )}

            {/* 운동 스타일 */}
            {styleInfo && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>운동 스타일</Text>
                <View style={styles.infoCard}>
                  <View style={[styles.iconCircle, styles.iconCircleGreen]}>
                    <MaterialCommunityIcons name="shoe-sneaker" size={24} color="#15803D" />
                  </View>
                  <View style={styles.infoTextBlock}>
                    <Text style={[styles.infoCardTitle, styles.infoCardTitleGreen]}>{styleInfo.title}</Text>
                    <Text style={styles.infoCardDesc}>{styleInfo.desc}</Text>
                  </View>
                </View>
              </View>
            )}

            {/* 운동 목적 */}
            {reasonInfo && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>운동 목적</Text>
                <View style={styles.infoCard}>
                  <View style={[styles.iconCircle, styles.iconCirclePurple]}>
                    <MaterialCommunityIcons name="target" size={24} color="#7C3AED" />
                  </View>
                  <View style={styles.infoTextBlock}>
                    <Text style={[styles.infoCardTitle, styles.infoCardTitlePurple]}>
                      {reasonInfo.title}
                    </Text>
                    <Text style={styles.infoCardDesc}>{reasonInfo.desc}</Text>
                  </View>
                </View>
              </View>
            )}

            {/* 관심 종목 */}
            {hasSports && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>관심 종목</Text>
                <View style={styles.sportRow}>
                  {data.exerciseTypes!.map((sport) => (
                    <View key={sport} style={styles.sportChip}>
                      <MaterialCommunityIcons
                        name={getSportIcon(sport)}
                        size={14}
                        color="#111827"
                      />
                      <Text style={styles.sportChipText}>{sport}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* 매너온도 + 매칭 통계 */}
            {hasStats && (
              <View style={styles.statsRow}>
                {data.mannerTemperature != null && (
                  <View style={[styles.statCard, styles.statCardLeft]}>
                    <Text style={styles.statCardLabel}>매너온도</Text>
                    <Text style={styles.mannerScore}>{data.mannerTemperature}°C</Text>
                    <View style={styles.mannerBarBg}>
                      <LinearGradient
                        colors={["#A5B4FC", "#7C3AED"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.mannerBarFill, { width: `${tempPct}%` as any }]}
                      />
                      <View
                        style={[
                          styles.mannerThumb,
                          { left: `${Math.max(0, tempPct - 8)}%` as any },
                        ]}
                      />
                    </View>
                    <Text style={styles.mannerLabel}>
                      {getMannerLabel(data.mannerTemperature)}
                    </Text>
                  </View>
                )}
                {(data.matchCount != null || data.noShowCount != null) && (
                  <View style={[styles.statCard, styles.statCardRight]}>
                    {data.matchCount != null && (
                      <View style={styles.statItem}>
                        <View>
                          <Text style={styles.statItemLabel}>매칭 횟수</Text>
                          <Text style={styles.statItemValue}>{data.matchCount}회</Text>
                        </View>
                        <View style={[styles.statIconBg, styles.statIconBgBlue]}>
                          <Ionicons name="flash" size={16} color="#4C5BE2" />
                        </View>
                      </View>
                    )}
                    {data.noShowCount != null && (
                      <>
                        <View style={styles.statItemDivider} />
                        <View style={styles.statItem}>
                          <View>
                            <Text style={styles.statItemLabel}>노쇼 횟수</Text>
                            <Text style={styles.statItemValue}>{data.noShowCount}회</Text>
                          </View>
                          <View style={[styles.statIconBg, styles.statIconBgRed]}>
                            <Ionicons name="alert-circle-outline" size={16} color="#DC2626" />
                          </View>
                        </View>
                      </>
                    )}
                  </View>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000000",
  },

  /* ─── Hero ─── */
  hero: {
    overflow: "hidden",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  topBarSpacer: {
    width: 36,
  },
  heroInfo: {
    position: "absolute",
    bottom: 28,
    left: 20,
    right: 20,
    gap: 5,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  heroName: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  verifiedBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#4C5BE2",
    alignItems: "center",
    justifyContent: "center",
  },
  heroDept: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.85)",
  },

  /* ─── White card ─── */
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -22,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 20,
  },

  /* ─── Sections ─── */
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },

  /* VS card */
  vsCard: {
    flexDirection: "row",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  vsSide: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 10,
    gap: 4,
  },
  vsName: {
    fontSize: 15,
    fontWeight: "800",
  },
  vsDesc: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  vsDivider: {
    width: 1,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  vsText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9CA3AF",
    backgroundColor: "#FFFFFF",
    paddingVertical: 4,
  },

  /* Info cards */
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
    backgroundColor: "#FAFAFA",
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  iconCircleBlue: { backgroundColor: "#EEF2FF" },
  iconCircleGreen: { backgroundColor: "#DCFCE7" },
  iconCirclePurple: { backgroundColor: "#EDE9FE" },
  infoTextBlock: {
    flex: 1,
    gap: 3,
  },
  infoCardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#4C5BE2",
  },
  infoCardTitleGreen: { color: "#15803D" },
  infoCardTitlePurple: { color: "#7C3AED" },
  infoCardDesc: {
    fontSize: 12,
    lineHeight: 18,
    color: "#6B7280",
    fontWeight: "500",
  },

  /* Sports */
  sportRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  sportChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  sportChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },

  /* Stats row */
  statsRow: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
    backgroundColor: "#FFFFFF",
    gap: 8,
  },
  statCardLeft: {},
  statCardRight: {},
  statCardLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
  },
  mannerScore: {
    fontSize: 26,
    fontWeight: "900",
    color: "#7C3AED",
    letterSpacing: -0.5,
  },
  mannerBarBg: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#EDE9FE",
    overflow: "hidden",
    position: "relative",
  },
  mannerBarFill: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    borderRadius: 5,
  },
  mannerThumb: {
    position: "absolute",
    top: 1,
    width: 18,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 2,
  },
  mannerLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B7280",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statItemLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B7280",
  },
  statItemValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111827",
    letterSpacing: -0.3,
  },
  statIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  statIconBgBlue: { backgroundColor: "#EEF2FF" },
  statIconBgRed: { backgroundColor: "#FFF1F2" },
  statItemDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
  },

});
