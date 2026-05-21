import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BLUE = "#4C5BE2";
const DEEP_BLUE = "#25258F";
const SOFT_BLUE = "#F1F2FF";
const LINE = "#ECEEF6";

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
      <Pressable accessibilityRole="button" style={styles.headerButton}>
        <Ionicons name="share-outline" size={24} color="#111827" />
      </Pressable>
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

function PersonalitySlider() {
  return (
    <View style={styles.sliderBlock}>
      <Text style={styles.sectionText}>
        내향형이 강하고, 혼자 조용히 하는 것을 선호해요.
      </Text>
      <View style={styles.personalityScale}>
        <Text style={styles.scaleLabel}>외향형</Text>
        <View style={styles.scaleTrack}>
          <View style={styles.scaleFill} />
          <View style={styles.scaleThumb} />
        </View>
        <Text style={[styles.scaleLabel, styles.scaleLabelActive]}>내향형</Text>
      </View>
    </View>
  );
}

function IntensityScale() {
  return (
    <View style={styles.sliderBlock}>
      <Text style={styles.sectionText}>운동 강도는 중간 정도가 좋아요.</Text>
      <View style={styles.intensityLine}>
        {[0, 1, 2, 3, 4].map((item) => (
          <View
            key={item}
            style={[
              styles.intensityDot,
              item === 2 && styles.intensityDotActive,
            ]}
          />
        ))}
      </View>
      <View style={styles.intensityLabels}>
        <Text style={styles.scaleLabel}>가벼운 편</Text>
        <Text style={[styles.scaleLabel, styles.scaleLabelActive]}>중간</Text>
        <Text style={styles.scaleLabel}>강한 편</Text>
      </View>
    </View>
  );
}

function SportCircle({
  icon,
  label,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
}) {
  return (
    <View style={styles.sportItem}>
      <View style={styles.sportIcon}>
        <MaterialCommunityIcons name={icon} size={28} color={BLUE} />
      </View>
      <Text style={styles.sportLabel}>{label}</Text>
    </View>
  );
}

function RecommendationItem({
  icon,
  title,
  description,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.recommendationItem}>
      <View style={styles.recommendationIcon}>
        <Ionicons name={icon} size={27} color={BLUE} />
      </View>
      <View style={styles.recommendationTextBlock}>
        <Text style={styles.recommendationItemTitle}>{title}</Text>
        <Text style={styles.recommendationDescription}>{description}</Text>
      </View>
    </View>
  );
}

export default function TutorialPersonalityReportScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ReportHeader />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Image
            source={require("../../../assets/sports/러닝.jpg")}
            style={styles.heroImage}
            contentFit="cover"
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroGlow} />
          <Text style={styles.heroEyebrow}>MY EXERCISE TYPE</Text>
          <Text style={styles.heroTitle}>
            독립형 · 도전형 ·{"\n"}힐링 추구
          </Text>
          <Text style={styles.heroSubtitle}>
            혼자서 조용히 즐기는 스타일이에요!
          </Text>
          <View style={styles.tagRow}>
            <Tag label="내향형" />
            <Tag label="혼자 운동 선호" />
            <Tag label="중간 강도" />
            <Tag label="체력 관리 목적" />
          </View>
        </View>

        <View style={styles.reportBody}>
          <Section label="한줄 요약">
            <View style={styles.quoteBox}>
              <Text style={styles.quoteMark}>“</Text>
              <Text style={styles.quoteText}>
                혼자서 조용히 즐기는 스타일이에요!
              </Text>
              <Text style={styles.quoteMark}>”</Text>
            </View>
          </Section>

          <Section label="성격">
            <PersonalitySlider />
          </Section>

          <Section label="운동 강도">
            <IntensityScale />
          </Section>

          <Section label="운동 목적">
            <View style={styles.goalBlock}>
              <MaterialCommunityIcons
                name="heart-pulse"
                size={38}
                color={BLUE}
              />
              <View style={styles.goalTextBlock}>
                <Text style={styles.goalTitle}>체력 관리</Text>
                <Text style={styles.goalDescription}>
                  건강하고 꾸준한 나를 만들기 위해 운동해요.
                </Text>
              </View>
            </View>
          </Section>

          <Section label="관심 종목">
            <Text style={styles.sectionText}>내가 좋아하는 운동이에요!</Text>
            <View style={styles.sportRow}>
              <SportCircle icon="dumbbell" label="헬스" />
              <SportCircle icon="run" label="러닝" />
            </View>
          </Section>

          <View style={styles.recommendationBox}>
            <Text style={styles.recommendationTitle}>
              나에게 추천하는 운동 스타일
            </Text>
            <Text style={styles.recommendationLead}>
              혼자 집중할 수 있는 환경에서, 꾸준히 실천할 수 있는 운동이 잘 맞아요!
            </Text>

            <View style={styles.recommendationList}>
              <RecommendationItem
                icon="headset-outline"
                title="혼자만의 시간"
                description="조용한 환경에서 몰입하며 운동하기"
              />
              <RecommendationItem
                icon="calendar-outline"
                title="꾸준한 루틴"
                description="주 3~4회, 중간 강도의 꾸준한 운동"
              />
              <RecommendationItem
                icon="heart-outline"
                title="체력 중심"
                description="지구력과 근력 향상에 도움이 되는 운동"
              />
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace("/" as any)}
            style={({ pressed }) => [
              styles.ctaButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.ctaText}>비슷한 성향의 사람들 보기</Text>
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
    letterSpacing: 0,
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
    fontSize: 18,
    lineHeight: 27,
    color: "#11184A",
    fontWeight: "900",
    textAlign: "center",
  },
  sliderBlock: {
    gap: 20,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 23,
    color: "#303642",
    fontWeight: "700",
  },
  personalityScale: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  scaleLabel: {
    fontSize: 12,
    lineHeight: 17,
    color: "#737684",
    fontWeight: "800",
  },
  scaleLabelActive: {
    color: DEEP_BLUE,
  },
  scaleTrack: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#E3E4F6",
  },
  scaleFill: {
    width: "82%",
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#7B6AF0",
  },
  scaleThumb: {
    position: "absolute",
    right: "15%",
    top: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#5E55E8",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  intensityLine: {
    height: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
  },
  intensityLineBackground: {},
  intensityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#C8CBD4",
  },
  intensityDotActive: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#5E55E8",
  },
  intensityLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  goalBlock: {
    minHeight: 110,
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
    gap: 6,
  },
  goalTitle: {
    fontSize: 17,
    lineHeight: 24,
    color: BLUE,
    fontWeight: "900",
  },
  goalDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#303642",
    fontWeight: "700",
  },
  sportRow: {
    flexDirection: "row",
    gap: 18,
    marginTop: 18,
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
  },
  recommendationTitle: {
    fontSize: 17,
    lineHeight: 24,
    color: DEEP_BLUE,
    fontWeight: "900",
  },
  recommendationLead: {
    marginTop: 9,
    fontSize: 14,
    lineHeight: 21,
    color: DEEP_BLUE,
    fontWeight: "700",
  },
  recommendationList: {
    gap: 14,
    marginTop: 20,
  },
  recommendationItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  recommendationIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.72)",
  },
  recommendationTextBlock: {
    flex: 1,
    gap: 4,
  },
  recommendationItemTitle: {
    fontSize: 14,
    lineHeight: 19,
    color: DEEP_BLUE,
    fontWeight: "900",
  },
  recommendationDescription: {
    fontSize: 12,
    lineHeight: 17,
    color: "#50568B",
    fontWeight: "700",
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
