import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { TutorialSelections } from "@/utils/mapTutorialToSurvey";

type Props = {
  selections: TutorialSelections | null;
  onContinue: () => void;
};

const BLUE      = "#4C5BE2";
const BLUE_LIGHT = "#EEF2FF";

// ── 목 데이터 ──────────────────────────────────────────────────────────────────
const MOCK_SELECTIONS: TutorialSelections = {
  exerciseStyle: "talkative",
  intensity: "moderate",
  motivation: "fitness",
  sports: ["running", "fitness", "soccer"],
};

// ── 선택값 라벨 & 설명 (tutorialSteps.tsx 옵션 기준) ──────────────────────────
const EXERCISE_STYLE_INFO: Record<string, { label: string; desc: string }> = {
  quiet:     { label: "조용히 각자 운동",  desc: "혼자 집중해서 운동하는\n스타일을 선호해요" },
  talkative: { label: "대화하며 같이 운동", desc: "함께 대화하며 즐겁게\n운동하는 파트너를 원해요" },
};

const INTENSITY_INFO: Record<string, { label: string; desc: string }> = {
  light:    { label: "가볍게 몸만 풀기",  desc: "부담 없이 편하게\n몸을 움직이고 싶어요" },
  moderate: { label: "적당히 운동하기",   desc: "무리하지 않고 꾸준히\n운동할 수 있는 강도예요" },
  focused:  { label: "제대로 운동하기",   desc: "충분히 땀이 나도록\n제대로 운동하고 싶어요" },
  intense:  { label: "한계까지 도전",     desc: "최대 강도로 자신을\n극한까지 밀어붙여요" },
};

const MOTIVATION_INFO: Record<string, { label: string; desc: string }> = {
  refresh: { label: "스트레스 해소·기분 전환", desc: "운동으로 스트레스를 풀고\n기분 전환을 하고 싶어요" },
  social:  { label: "운동하며 친해지기",       desc: "함께 운동하며 좋은\n관계를 만들어 가고 싶어요" },
  skill:   { label: "실력 향상·경쟁",          desc: "더 강해지고 실력을\n키우는 것이 목표예요" },
  fitness: { label: "체력·몸매 관리",          desc: "건강한 몸과 체력을\n가꾸는 것이 목표예요" },
};

type MCIconName  = keyof typeof MaterialCommunityIcons.glyphMap;
type IonIconName = keyof typeof Ionicons.glyphMap;

const SPORT_MAP: Record<string, { label: string; mcIcon: MCIconName }> = {
  billiards:  { label: "당구",    mcIcon: "billiards-rack" },
  baseball:   { label: "야구",    mcIcon: "baseball"       },
  bowling:    { label: "볼링",    mcIcon: "bowling"        },
  bicycle:    { label: "자전거",  mcIcon: "bike"           },
  running:    { label: "러닝",    mcIcon: "run"            },
  soccer:     { label: "축구",    mcIcon: "soccer"         },
  futsal:     { label: "풋살",    mcIcon: "soccer"         },
  tennis:     { label: "테니스",  mcIcon: "tennis-ball"    },
  hiking:     { label: "등산",    mcIcon: "hiking"         },
  basketball: { label: "농구",    mcIcon: "basketball"     },
  badminton:  { label: "배드민턴", mcIcon: "badminton"     },
  fitness:    { label: "헬스",    mcIcon: "dumbbell"       },
};

// ── 결과 카드 ──────────────────────────────────────────────────────────────────
function ResultCard({
  ionIcon,
  mcIcon,
  category,
  value,
  desc,
  children,
}: {
  ionIcon?: IonIconName;
  mcIcon?: MCIconName;
  category: string;
  value: string;
  desc?: string;
  children?: React.ReactNode;
}) {
  return (
    <View style={cardSt.card}>
      <View style={cardSt.topRow}>
        <View style={cardSt.iconCircle}>
          {mcIcon ? (
            <MaterialCommunityIcons name={mcIcon} size={18} color={BLUE} />
          ) : (
            <Ionicons name={ionIcon!} size={18} color={BLUE} />
          )}
        </View>
        <Text style={cardSt.category} numberOfLines={1}>{category}</Text>
        <Ionicons name="chevron-forward" size={15} color="#D1D5DB" />
      </View>

      <Text style={cardSt.value}>{value}</Text>

      {desc ? (
        <Text style={cardSt.desc}>{desc}</Text>
      ) : (
        children
      )}
    </View>
  );
}

const cardSt = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    gap: 10,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: BLUE_LIGHT,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  category: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    color: "#374151",
  },
  value: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "900",
    color: "#111827",
    letterSpacing: -0.3,
  },
  desc: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "500",
    color: "#9CA3AF",
  },
});

// ── 운동 종목 아이콘 행 (최대 3개) ────────────────────────────────────────────
function SportIconRow({ sports }: { sports: string[] }) {
  return (
    <View style={sportRowSt.row}>
      {sports.map((sport) => {
        const info = SPORT_MAP[sport];
        return info ? (
          <View key={sport} style={sportRowSt.circle}>
            <MaterialCommunityIcons name={info.mcIcon} size={16} color={BLUE} />
          </View>
        ) : null;
      })}
    </View>
  );
}

const sportRowSt = StyleSheet.create({
  row:    { flexDirection: "row", alignItems: "center", gap: 6 },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: BLUE_LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
});

// ── 메인 스크린 ────────────────────────────────────────────────────────────────
export default function TutorialResultScreen({ selections, onContinue }: Props) {
  const data = selections ?? MOCK_SELECTIONS;

  const styleInfo    = data.exerciseStyle ? EXERCISE_STYLE_INFO[data.exerciseStyle] : null;
  const intensityInfo = data.intensity    ? INTENSITY_INFO[data.intensity]          : null;
  const motivationInfo = data.motivation  ? MOTIVATION_INFO[data.motivation]        : null;

  const sportValueText = data.sports
    .map((s) => SPORT_MAP[s]?.label ?? s)
    .join(" · ");

  const handleBack = () => {
    if (router.canGoBack()) router.back();
  };

  return (
    <View style={styles.screen}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          hitSlop={8}
          onPress={handleBack}
          style={styles.headerBtn}
        >
          <Ionicons name="chevron-back" size={26} color="#111827" />
        </Pressable>
        <Text style={styles.headerTitle}>온보딩 요약</Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 타이틀 */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>
            <Text style={styles.titleBlue}>선택한 정보</Text>{"를\n한눈에 확인해볼까요?"}
          </Text>
          <Text style={styles.subtitle}>더 정확한 매칭을 위해 아래 정보를 활용해요.</Text>
        </View>

        {/* 2 × 2 그리드 */}
        <View style={styles.grid}>
          <View style={styles.gridRow}>
            <ResultCard
              ionIcon="people-outline"
              category="파트너 스타일"
              value={styleInfo?.label ?? "-"}
              desc={styleInfo?.desc}
            />
            <ResultCard
              mcIcon="dumbbell"
              category="운동 강도"
              value={intensityInfo?.label ?? "-"}
              desc={intensityInfo?.desc}
            />
          </View>

          <View style={styles.gridRow}>
            <ResultCard
              mcIcon="target"
              category="운동 이유"
              value={motivationInfo?.label ?? "-"}
              desc={motivationInfo?.desc}
            />
            <ResultCard
              mcIcon="soccer"
              category="선호 운동 종목"
              value={data.sports.length > 0 ? sportValueText : "선택 없음"}
            >
              {data.sports.length > 0 && (
                <SportIconRow sports={data.sports} />
              )}
            </ResultCard>
          </View>
        </View>

        {/* 정보 안내 배너 */}
        <View style={styles.infoBanner}>
          <Ionicons name="shield-checkmark-outline" size={28} color="#C4C8D8" />
          <Text style={styles.infoText}>
            {"이 정보는 매칭 알고리즘에 반영되어\n나에게 딱 맞는 운동 파트너를 추천해줘요."}
          </Text>
        </View>
      </ScrollView>

      {/* 하단 CTA */}
      <View style={styles.footer}>
        <Pressable
          accessibilityRole="button"
          onPress={onContinue}
          style={({ pressed }) => [styles.ctaButton, pressed && { opacity: 0.88 }]}
        >
          <Text style={styles.ctaText}>계속하기</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </Pressable>

        <View style={styles.footerNote}>
          <Ionicons name="information-circle" size={14} color="#9CA3AF" />
          <Text style={styles.footerNoteText}>성향은 마이페이지에서 언제든지 수정할 수 있어요</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F8F9FB" },

  // 헤더
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },

  // 스크롤
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 20,
  },

  // 타이틀
  titleSection: { gap: 6 },
  title: {
    fontSize: 26,
    lineHeight: 36,
    fontWeight: "900",
    color: "#111827",
    letterSpacing: -0.5,
  },
  titleBlue: { color: BLUE },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    color: "#9CA3AF",
  },

  // 그리드
  grid: { gap: 12 },
  gridRow: { flexDirection: "row", gap: 12 },

  // 정보 배너
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "500",
    color: "#9CA3AF",
  },

  // 푸터
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    gap: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  ctaButton: {
    alignSelf: "stretch",
    height: 58,
    borderRadius: 999,
    backgroundColor: BLUE,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  ctaText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  footerNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  footerNoteText: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "500",
    color: "#9CA3AF",
  },
});
