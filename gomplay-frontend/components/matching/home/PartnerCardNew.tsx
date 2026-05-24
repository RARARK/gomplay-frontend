import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as React from "react";
import {
  Animated,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from "react-native";

import type { PartnerCardProps } from "@/types/ui/homeCards";

const DEFAULT_PROFILE_IMAGE = require("../../../assets/home/PartnerProfileImage.png");
const CARD_RADIUS = 28;
const DEFAULT_MATCH_INSIGHT =
  "시간표가 잘 맞고, 선호 운동 종목과 운동 성향이 비슷한 파트너예요. 매너온도와 학과, 학번 같은 친밀도 요소도 함께 반영해 추천했어요.";

type StoryPartnerCardProps = PartnerCardProps & {
  activeIndex?: number;
  totalCount?: number;
};

const getHeroSource = (
  profileImageSource?: ImageSourcePropType,
  imageSource?: ImageSourcePropType,
) => profileImageSource ?? imageSource ?? DEFAULT_PROFILE_IMAGE;

const compactStudentId = (studentId?: string) => {
  if (!studentId) return "21";
  const match = studentId.match(/\d+/);
  if (!match) return studentId;
  const digits = match[0];
  const year = digits.length >= 4 ? digits.slice(2, 4) : digits;
  return `${year}학번`;
};

const getSports = (exerciseTypes?: string[], tags?: string[]) => {
  const merged = [...(exerciseTypes ?? []), ...(tags ?? [])]
    .filter(Boolean)
    .filter((item, index, arr) => arr.indexOf(item) === index);

  return merged.length > 0 ? merged.slice(0, 3) : ["풋살", "배드민턴", "러닝"];
};

function SportChip({ label, icon }: { label: string; icon: keyof typeof Ionicons.glyphMap }) {
  return (
    <View style={styles.sportChip}>
      <Ionicons name={icon} size={17} color="#FFFFFF" />
      <Text style={styles.sportChipText} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function DetailItem({
  icon,
  label,
  value,
  accent,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <View style={styles.detailItem}>
      <View style={styles.detailLabelRow}>
        <Ionicons name={icon} size={16} color="#FFFFFF" />
        <Text style={styles.detailLabel} numberOfLines={2}>
          {label}
        </Text>
      </View>
      <Text
        style={[styles.detailValue, accent && styles.detailValueAccent]}
        numberOfLines={2}
      >
        {value}
      </Text>
    </View>
  );
}

export default function PartnerCardNew({
  imageSource,
  profileImageSource,
  name = "김단국",
  age,
  description,
  department,
  studentId,
  partnerStyle,
  exerciseReason,
  preferredPartnerLabel,
  exerciseStyleLabel,
  freeTimeLabel,
  exerciseTypes,
  tags,
  matchScore,
  matchInsight,
  width,
  onReject,
  onAccept,
}: StoryPartnerCardProps) {
  const [isInsightOpen, setIsInsightOpen] = React.useState(false);
  const insightProgress = React.useRef(new Animated.Value(0)).current;
  const sports = getSports(exerciseTypes, tags);
  const shownAge = age ?? compactStudentId(studentId);
  const partnerLabel = preferredPartnerLabel ?? partnerStyle ?? "함께 즐기는 파트너";
  const styleLabel = exerciseStyleLabel ?? exerciseReason ?? "가볍게 즐겨요";
  const insightText = DEFAULT_MATCH_INSIGHT;

  React.useEffect(() => {
    Animated.timing(insightProgress, {
      toValue: isInsightOpen ? 1 : 0,
      duration: 240,
      useNativeDriver: true,
    }).start();
  }, [insightProgress, isInsightOpen]);

  const insightTranslateX = insightProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [120, 0],
  });
  const insightOpacity = insightProgress.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0.9, 1],
  });
  const closedMatchOpacity = insightProgress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });
  const expandedMatchOpacity = insightProgress.interpolate({
    inputRange: [0, 0.45, 1],
    outputRange: [0, 0, 1],
  });
  const expandedMatchTranslateX = insightProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [36, 0],
  });

  return (
    <View style={[styles.stage, width != null && { width }]}>
      <View style={styles.shadowFrame}>
        <ImageBackground
          source={getHeroSource(profileImageSource, imageSource)}
          resizeMode="cover"
          style={styles.card}
          imageStyle={styles.cardImage}
        >
        <LinearGradient
          pointerEvents="none"
          colors={[
            "rgba(18, 36, 59, 0.14)",
            "rgba(4, 8, 12, 0.08)",
            "rgba(2, 5, 4, 0.72)",
            "rgba(1, 3, 2, 0.96)",
          ]}
          locations={[0, 0.36, 0.72, 1]}
          style={StyleSheet.absoluteFill}
        />

        {matchScore != null && (
          <>
            <Animated.View style={[styles.matchCorner, { opacity: closedMatchOpacity }]}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setIsInsightOpen(true)}
                style={styles.matchPressArea}
              >
                <Text style={styles.matchCornerValue}>{matchScore}%</Text>
                <Text style={styles.matchCornerLabel}>MATCH</Text>
              </Pressable>
            </Animated.View>
            <Animated.View
              style={[
                styles.matchExpanded,
                {
                  opacity: expandedMatchOpacity,
                  transform: [{ translateX: expandedMatchTranslateX }],
                },
              ]}
            >
              <Pressable
                accessibilityRole="button"
                onPress={() => setIsInsightOpen(false)}
                style={styles.matchPressArea}
              >
                <Text style={styles.matchExpandedValue}>{matchScore}%</Text>
                <Text style={styles.matchExpandedLabel}>match</Text>
              </Pressable>
            </Animated.View>
          </>
        )}

        <Animated.View
          pointerEvents={isInsightOpen ? "auto" : "none"}
          style={[
            styles.inlineInsightPanel,
            {
              opacity: insightOpacity,
              transform: [{ translateX: insightTranslateX }],
            },
          ]}
        >
          <Text style={styles.inlineInsightTitle}>설명</Text>
          <Text style={styles.inlineInsightText} numberOfLines={3}>
            {insightText}
          </Text>
        </Animated.View>

        <View style={styles.content}>
          <View style={styles.identityBlock}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>
                {name}
              </Text>
              <Text style={styles.age}>{shownAge}</Text>
            </View>
            {department ? (
              <Text style={styles.department} numberOfLines={1}>
                {department}
              </Text>
            ) : null}

            <View style={styles.sportRow}>
              <SportChip label={sports[0] ?? "풋살"} icon="football-outline" />
              <SportChip label={sports[1] ?? "배드민턴"} icon="tennisball-outline" />
              <SportChip label={sports[2] ?? "러닝"} icon="walk-outline" />
            </View>

            {description ? (
              <Text style={styles.quote} numberOfLines={2}>
                {description}
              </Text>
            ) : null}
          </View>

          <View style={styles.glassPanel}>
            <DetailItem
              icon="time"
              label="공강 시간"
              value={freeTimeLabel ?? "공강 없음"}
              accent
            />
            <View style={styles.panelDivider} />
            <DetailItem
              icon="people"
              label={"선호 운동\n파트너"}
              value={partnerLabel}
            />
            <View style={styles.panelDivider} />
            <DetailItem
              icon="heart"
              label="운동 스타일"
              value={styleLabel}
              accent
            />
          </View>

          <View style={styles.actionRow}>
            <Pressable
              accessibilityRole="button"
              onPress={onReject}
              style={styles.skipButton}
            >
              <Ionicons name="close" size={19} color="#6B7280" />
              <Text style={styles.skipButtonText}>스킵</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={onAccept}
              style={styles.matchButton}
            >
              <LinearGradient
                colors={["#8B7CF6", "#5B4FF0"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.matchButtonGradient}
              >
                <Ionicons name="sparkles" size={17} color="#FFFFFF" />
                <Text style={styles.matchButtonText}>매칭 신청</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </LinearGradient>
            </Pressable>
          </View>
        </View>
        </ImageBackground>
      </View>

      <Animated.View
        pointerEvents={isInsightOpen ? "auto" : "none"}
        style={[
          styles.sideInsightPanel,
          {
            opacity: insightOpacity,
            transform: [{ translateX: insightTranslateX }],
          },
        ]}
      >
        <View style={styles.sideInsightHeader}>
          <Ionicons name="sparkles" size={18} color="#8B7CFF" />
          <Text style={styles.sideInsightTitle}>추천하는 이유</Text>
        </View>
        <Text style={styles.sideInsightText}>{insightText}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    width: "100%",
    minHeight: 560,
    alignItems: "center",
    justifyContent: "center",
  },
  shadowFrame: {
    width: "100%",
    borderRadius: CARD_RADIUS,
    backgroundColor: "#111827",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  card: {
    minHeight: 560,
    borderRadius: CARD_RADIUS,
    overflow: "hidden",
    backgroundColor: "#0F172A",
  },
  cardImage: {
    borderRadius: CARD_RADIUS,
  },
  infoButton: {
    position: "absolute",
    top: 58,
    right: 24,
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3,
  },
  matchCorner: {
    position: "absolute",
    top: 56,
    right: 24,
    alignItems: "center",
    zIndex: 3,
  },
  matchPressArea: {
    alignItems: "center",
  },
  matchCornerValue: {
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  matchCornerLabel: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "900",
    color: "#8B7CFF",
  },
  matchExpanded: {
    position: "absolute",
    top: 56,
    left: 14,
    width: 70,
    minHeight: 78,
    borderRadius: 20,
    backgroundColor: "rgba(7, 10, 18, 0.36)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.14)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
  },
  matchExpandedValue: {
    fontSize: 27,
    lineHeight: 31,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  matchExpandedLabel: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "800",
    color: "#A9A1FF",
    textTransform: "uppercase",
  },
  inlineInsightPanel: {
    position: "absolute",
    top: 56,
    left: 94,
    right: 18,
    minHeight: 112,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.78)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.34)",
    paddingHorizontal: 18,
    paddingVertical: 14,
    zIndex: 4,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
  },
  inlineInsightTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "900",
    color: "#17171F",
    marginBottom: 6,
  },
  inlineInsightText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "700",
    color: "#3F3F46",
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 18,
  },
  identityBlock: {
    gap: 12,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  name: {
    flexShrink: 1,
    fontSize: 38,
    lineHeight: 44,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  age: {
    fontSize: 24,
    lineHeight: 34,
    fontWeight: "800",
    color: "#FFFFFF",
    opacity: 0.94,
  },
  verifiedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#4F6CFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 3,
  },
  metaText: {
    maxWidth: "48%",
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  department: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.72)",
    marginTop: -4,
  },
  sportRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
  },
  sportChip: {
    minHeight: 42,
    maxWidth: "48%",
    borderRadius: 999,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255, 255, 255, 0.22)",
  },
  sportChipText: {
    flexShrink: 1,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 4,
  },
  skipButton: {
    flex: 1,
    height: 50,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  skipButtonText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",
    color: "#6B7280",
  },
  matchButton: {
    flex: 2,
    height: 50,
    borderRadius: 999,
    overflow: "hidden",
  },
  matchButtonGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  matchButtonText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  quote: {
    fontSize: 18,
    lineHeight: 25,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  glassPanel: {
    minHeight: 104,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.14)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 10,
    overflow: "hidden",
  },
  detailItem: {
    flex: 1,
    gap: 5,
    paddingHorizontal: 5,
  },
  detailLabelRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 5,
    minHeight: 30,
  },
  detailLabel: {
    flexShrink: 1,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  detailValue: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  detailValueAccent: {
    color: "#7376FF",
  },
  panelDivider: {
    width: 1,
    backgroundColor: "rgba(255, 255, 255, 0.22)",
  },
  sideInsightPanel: {
    display: "none",
    position: "absolute",
    right: 0,
    top: 126,
    width: "43%",
    borderRadius: 24,
    backgroundColor: "rgba(18, 20, 30, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.16)",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    zIndex: 8,
  },
  sideInsightHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  sideInsightTitle: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  sideInsightText: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.86)",
  },
});
