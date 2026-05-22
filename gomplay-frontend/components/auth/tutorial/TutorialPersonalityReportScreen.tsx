import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getSurveyReport } from "@/services/survey/surveyService";
import type { SurveyReport } from "@/types/domain/survey";

const BLUE = "#4C5BE2";
const DEEP_BLUE = "#25258F";
const SOFT_BLUE = "#F1F2FF";
const LINE = "#ECEEF6";

type MCIconName = keyof typeof MaterialCommunityIcons.glyphMap;

const SPORT_IMAGES: Record<string, number> = {
  농구: require("../../../assets/sports/농구.jpg"),
  당구: require("../../../assets/sports/당구.jpg"),
  등산: require("../../../assets/sports/등산.jpg"),
  러닝: require("../../../assets/sports/러닝.jpg"),
  런닝: require("../../../assets/sports/러닝.jpg"),
  배드민턴: require("../../../assets/sports/베드민턴.jpg"),
  볼링: require("../../../assets/sports/볼링.jpg"),
  야구: require("../../../assets/sports/야구.jpg"),
  자전거: require("../../../assets/sports/자전거.jpg"),
  축구: require("../../../assets/sports/축구.jpg"),
  테니스: require("../../../assets/sports/테니스.jpg"),
  풋살: require("../../../assets/sports/풋살.jpg"),
  헬스: require("../../../assets/sports/헬스.jpg"),
};

const SPORT_ICONS: Record<string, MCIconName> = {
  농구: "basketball",
  당구: "billiards-rack",
  등산: "hiking",
  러닝: "run",
  런닝: "run",
  배드민턴: "badminton",
  볼링: "bowling",
  야구: "baseball",
  자전거: "bike",
  축구: "soccer",
  테니스: "tennis-ball",
  풋살: "soccer",
  헬스: "dumbbell",
  수영: "swim",
  사이클링: "bike",
  클라이밍: "terrain",
};

const DEFAULT_IMAGE = require("../../../assets/sports/러닝.jpg");

function ReportHeader() {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        onPress={() =>
          router.canGoBack() ? router.back() : router.replace("/" as any)
        }
        style={styles.headerButton}
      >
        <Ionicons name="chevron-back" size={28} color="#111827" />
      </Pressable>
      <Text pointerEvents="none" style={styles.headerTitle}>
        운동 성향 리포트
      </Text>
      <View style={styles.headerButton} />
    </View>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{label}</Text>
    </View>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function TypeCard({
  icon,
  title,
  value,
}: {
  icon: MCIconName;
  title: string;
  value: string;
}) {
  return (
    <View style={styles.typeCard}>
      <View style={styles.typeCardIcon}>
        <MaterialCommunityIcons name={icon} size={24} color={BLUE} />
      </View>
      <View style={styles.typeCardText}>
        <Text style={styles.typeCardLabel}>{title}</Text>
        <Text style={styles.typeCardValue}>{value}</Text>
      </View>
    </View>
  );
}

function SportCircle({ label }: { label: string }) {
  const icon = SPORT_ICONS[label] ?? "dumbbell";
  return (
    <View style={styles.sportItem}>
      <View style={styles.sportIcon}>
        <MaterialCommunityIcons name={icon} size={28} color={BLUE} />
      </View>
      <Text style={styles.sportLabel}>{label}</Text>
    </View>
  );
}

function DescriptionCard({
  icon,
  title,
  description,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.descCard}>
      <View style={styles.descCardHeader}>
        <View style={styles.descCardIcon}>
          <Ionicons name={icon} size={22} color={BLUE} />
        </View>
        <Text style={styles.descCardTitle}>{title}</Text>
      </View>
      <Text style={styles.descCardBody}>{description}</Text>
    </View>
  );
}

type Props = {
  onContinue?: () => void;
};

export default function TutorialPersonalityReportScreen({ onContinue }: Props = {}) {
  const [report, setReport] = useState<SurveyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = () => {
    setError(null);
    setLoading(true);
    getSurveyReport()
      .then(setReport)
      .catch((err: Error) =>
        setError(err.message ?? "리포트를 불러오지 못했어요.")
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const heroImage =
    report && report.exerciseTypes.length > 0
      ? (SPORT_IMAGES[report.exerciseTypes[0]] ?? DEFAULT_IMAGE)
      : DEFAULT_IMAGE;

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ReportHeader />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={BLUE} />
          <Text style={styles.loadingText}>리포트를 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !report) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ReportHeader />
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={48} color="#D1D5DB" />
          <Text style={styles.errorText}>{error ?? "리포트를 불러오지 못했어요."}</Text>
          <Pressable onPress={fetchReport} style={styles.retryButton}>
            <Text style={styles.retryText}>다시 시도</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ReportHeader />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 히어로 */}
        <View style={styles.hero}>
          <Image
            source={heroImage}
            style={styles.heroImage}
            contentFit="cover"
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroGlow} />
          <Text style={styles.heroEyebrow}>MY EXERCISE TYPE</Text>
          <Text style={styles.heroTitle}>{report.personalityType}</Text>
          <View style={styles.tagRow}>
            <Tag label={report.personalityType} />
            <Tag label={report.intensityType} />
            <Tag label={report.purposeType} />
            {report.exerciseTypes.slice(0, 1).map((t) => (
              <Tag key={t} label={t} />
            ))}
          </View>
        </View>

        <View style={styles.reportBody}>
          {/* 한줄 요약 */}
          <Section label="한줄 요약">
            <View style={styles.quoteBox}>
              <Text style={styles.quoteMark}>"</Text>
              <Text style={styles.quoteText}>{report.summary}</Text>
              <Text style={styles.quoteMark}>"</Text>
            </View>
          </Section>

          {/* 운동 스타일 */}
          <Section label="운동 스타일">
            <TypeCard
              icon="account-group-outline"
              title="파트너 스타일"
              value={report.personalityType}
            />
          </Section>

          {/* 운동 강도 */}
          <Section label="운동 강도">
            <TypeCard
              icon="lightning-bolt"
              title="선호 강도"
              value={report.intensityType}
            />
          </Section>

          {/* 운동 목적 */}
          <Section label="운동 목적">
            <View style={styles.goalBlock}>
              <MaterialCommunityIcons name="heart-pulse" size={38} color={BLUE} />
              <View style={styles.goalTextBlock}>
                <Text style={styles.goalTitle}>{report.purposeType}</Text>
              </View>
            </View>
          </Section>

          {/* 관심 종목 */}
          <Section label="관심 종목">
            <Text style={styles.sectionText}>내가 좋아하는 운동이에요!</Text>
            <View style={styles.sportRow}>
              {report.exerciseTypes.map((sport) => (
                <SportCircle key={sport} label={sport} />
              ))}
            </View>
          </Section>

          {/* 추천 */}
          <View style={styles.recommendationBox}>
            <Text style={styles.recommendationTitle}>
              나에게 추천하는 운동 스타일
            </Text>

            {report.recommendedExercises.length > 0 && (
              <View style={styles.recommendedSports}>
                {report.recommendedExercises.map((sport) => (
                  <View key={sport} style={styles.recommendedSportTag}>
                    <MaterialCommunityIcons
                      name={SPORT_ICONS[sport] ?? "dumbbell"}
                      size={15}
                      color={BLUE}
                    />
                    <Text style={styles.recommendedSportText}>{sport}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.recommendationList}>
              <DescriptionCard
                icon="people-outline"
                title="추천 파트너"
                description={report.partnerStyleDescription}
              />
              <DescriptionCard
                icon="musical-notes-outline"
                title="추천 분위기"
                description={report.exerciseMoodDescription}
              />
            </View>
          </View>

          {/* CTA */}
          <Pressable
            accessibilityRole="button"
            onPress={() => (onContinue ? onContinue() : router.replace("/" as any))}
            style={({ pressed }) => [
              styles.ctaButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.ctaText}>나와 맞는 파트너 찾기</Text>
            <Ionicons name="chevron-forward" size={21} color="#FFFFFF" />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 32,
  },
  loadingText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "600",
  },
  errorText: {
    fontSize: 15,
    color: "#374151",
    fontWeight: "600",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 4,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: BLUE,
  },
  retryText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
  },
  headerButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 19,
    lineHeight: 27,
    color: "#111827",
    fontWeight: "900",
  },
  scroll: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    paddingBottom: 32,
  },
  hero: {
    minHeight: 342,
    justifyContent: "flex-end",
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 26,
    overflow: "hidden",
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.72,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(239, 240, 255, 0.76)",
  },
  heroGlow: {
    position: "absolute",
    left: -40,
    right: -40,
    bottom: -48,
    height: 160,
    backgroundColor: "rgba(255, 255, 255, 0.62)",
    transform: [{ rotate: "-3deg" }],
  },
  heroEyebrow: {
    fontSize: 13,
    lineHeight: 18,
    color: "#5D62A4",
    fontWeight: "800",
  },
  heroTitle: {
    marginTop: 15,
    fontSize: 33,
    lineHeight: 45,
    color: DEEP_BLUE,
    fontWeight: "900",
  },
  heroSubtitle: {
    marginTop: 14,
    fontSize: 16,
    lineHeight: 23,
    color: DEEP_BLUE,
    fontWeight: "700",
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 20,
  },
  tag: {
    minHeight: 34,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(216, 219, 255, 0.94)",
    paddingHorizontal: 13,
  },
  tagText: {
    fontSize: 13,
    lineHeight: 18,
    color: DEEP_BLUE,
    fontWeight: "800",
  },
  reportBody: {
    paddingHorizontal: 20,
    paddingTop: 22,
  },
  section: {
    gap: 13,
    paddingVertical: 22,
    borderBottomWidth: 1,
    borderBottomColor: LINE,
  },
  sectionLabel: {
    fontSize: 17,
    lineHeight: 24,
    color: BLUE,
    fontWeight: "900",
  },
  sectionBody: {
    minWidth: 0,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 23,
    color: "#303642",
    fontWeight: "700",
  },
  quoteBox: {
    minHeight: 92,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E0E3F0",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 8,
    backgroundColor: "#FFFFFF",
  },
  quoteMark: {
    fontSize: 35,
    lineHeight: 40,
    color: "#DAD9FF",
    fontWeight: "900",
  },
  quoteText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 25,
    color: "#11184A",
    fontWeight: "900",
    textAlign: "center",
  },
  typeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: SOFT_BLUE,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  typeCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  typeCardText: {
    flex: 1,
    gap: 4,
  },
  typeCardLabel: {
    fontSize: 12,
    lineHeight: 17,
    color: "#5D62A4",
    fontWeight: "700",
  },
  typeCardValue: {
    fontSize: 18,
    lineHeight: 26,
    color: DEEP_BLUE,
    fontWeight: "900",
  },
  goalBlock: {
    minHeight: 80,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    backgroundColor: SOFT_BLUE,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  goalTextBlock: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    lineHeight: 26,
    color: BLUE,
    fontWeight: "900",
  },
  sportRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 18,
    marginTop: 14,
  },
  sportItem: {
    alignItems: "center",
    gap: 9,
  },
  sportIcon: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: SOFT_BLUE,
  },
  sportLabel: {
    fontSize: 13,
    lineHeight: 18,
    color: "#45495A",
    fontWeight: "800",
  },
  recommendationBox: {
    marginTop: 24,
    borderRadius: 18,
    backgroundColor: SOFT_BLUE,
    paddingHorizontal: 20,
    paddingVertical: 22,
    gap: 16,
  },
  recommendationTitle: {
    fontSize: 17,
    lineHeight: 24,
    color: DEEP_BLUE,
    fontWeight: "900",
  },
  recommendedSports: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  recommendedSportTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 255, 255, 0.72)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  recommendedSportText: {
    fontSize: 13,
    lineHeight: 18,
    color: DEEP_BLUE,
    fontWeight: "800",
  },
  recommendationList: {
    gap: 12,
  },
  descCard: {
    backgroundColor: "rgba(255, 255, 255, 0.72)",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  descCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  descCardIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: SOFT_BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  descCardTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: DEEP_BLUE,
    fontWeight: "900",
  },
  descCardBody: {
    fontSize: 13,
    lineHeight: 20,
    color: "#50568B",
    fontWeight: "600",
  },
  ctaButton: {
    minHeight: 58,
    marginTop: 26,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: BLUE,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.28,
    shadowRadius: 15,
    elevation: 5,
  },
  buttonPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },
  ctaText: {
    fontSize: 15,
    lineHeight: 21,
    color: "#FFFFFF",
    fontWeight: "900",
  },
});
