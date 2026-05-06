import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Animated,
  type DimensionValue,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { logout } from "@/services/auth/authService";
import { getSurvey } from "@/services/survey/surveyService";
import { getMyProfile } from "@/services/user/userService";
import { useAuthStore } from "@/stores/auth/authStore";
import { useUserStore } from "@/stores/user/userStore";
import type { Survey } from "@/types/domain/survey";

const MANNER_TEMPERATURE_COLOR = "#F59E0B";
const MANNER_TEMPERATURE_TRACK = "#FEF3C7";
const DEFAULT_PROFILE_IMAGE = require("../../assets/match/Ellipse-12.png");

type MannerTemperatureIcon =
  | {
      family: "ion";
      name: React.ComponentProps<typeof Ionicons>["name"];
    }
  | {
      family: "material";
      name: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
    };

function getMannerTemperatureIcon(temperature: number): MannerTemperatureIcon {
  if (temperature < 30) {
    return { family: "material", name: "emoticon-cry-outline" };
  }
  if (temperature < 36) {
    return { family: "material", name: "emoticon-confused-outline" };
  }
  if (temperature < 39) {
    return { family: "ion", name: "happy-outline" };
  }
  if (temperature <= 45) {
    return { family: "material", name: "emoticon-excited-outline" };
  }
  return { family: "ion", name: "sparkles-outline" };
}

const PARTNER_STYLE_LABEL: Record<string, string> = {
  각자: "조용한 파트너",
  같이: "활발한 파트너",
};
const INTENSITY_LABEL: Record<string, string> = {
  가볍게: "가볍게",
  적당히: "적당히",
  제대로: "제대로",
  한계까지: "한계까지",
};
const REASON_LABEL: Record<string, string> = {
  스트레스: "스트레스 해소",
  친해지려고: "친목",
  경쟁: "실력 향상",
  체력: "체력 관리",
};
const STYLE_SUMMARY: Record<string, { title: string; description: string }> = {
  각자: {
    title: "독립형",
    description: "각자의 페이스를 존중해요",
  },
  같이: {
    title: "외향형",
    description: "사교적이고 활동적인 편이에요",
  },
};
const INTENSITY_SUMMARY: Record<
  string,
  { title: string; description: string }
> = {
  가볍게: {
    title: "가볍게",
    description: "즐기면서 운동하는 스타일",
  },
  적당히: {
    title: "균형형",
    description: "무리 없이 꾸준히 해요",
  },
  제대로: {
    title: "집중형",
    description: "운동할 때 몰입하는 편",
  },
  한계까지: {
    title: "도전형",
    description: "강도 높은 운동을 좋아해요",
  },
};
const REASON_SUMMARY: Record<string, { title: string; description: string }> = {
  스트레스: {
    title: "스트레스 해소",
    description: "기분 전환이 중요한 목표",
  },
  친해지려고: {
    title: "친목",
    description: "함께 어울리는 시간이 좋아요",
  },
  경쟁: {
    title: "실력 향상",
    description: "더 잘하고 싶은 마음이 커요",
  },
  체력: {
    title: "체력 관리",
    description: "건강한 습관과 체력 향상이 목표",
  },
};

export default function MyPageScreen() {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const profile = useUserStore((state) => state.profile);
  const setProfile = useUserStore((state) => state.setProfile);

  const [isLoading, setIsLoading] = React.useState(!profile);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isMannerDescriptionVisible, setIsMannerDescriptionVisible] =
    React.useState(false);
  const [survey, setSurvey] = React.useState<Survey | null>(null);
  const mannerDescriptionProgress = React.useRef(new Animated.Value(0)).current;

  const loadProfile = React.useCallback(() => {
    let cancelled = false;

    setIsLoading(true);
    setErrorMessage(null);

    getMyProfile()
      .then((data) => {
        if (!cancelled) {
          setProfile(data);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setErrorMessage(
            err instanceof Error ? err.message : "프로필을 불러올 수 없습니다.",
          );
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [setProfile]);

  React.useEffect(() => {
    if (profile) return;

    return loadProfile();
  }, [loadProfile, profile]);

  React.useEffect(() => {
    Animated.timing(mannerDescriptionProgress, {
      toValue: isMannerDescriptionVisible ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [isMannerDescriptionVisible, mannerDescriptionProgress]);

  React.useEffect(() => {
    getSurvey()
      .then(setSurvey)
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await logout();
    clearAuth();
    router.replace("/login");
  };

  const profileImageSource = React.useMemo(
    () =>
      profile?.profileImageUrl
        ? { uri: profile.profileImageUrl }
        : DEFAULT_PROFILE_IMAGE,
    [profile?.profileImageUrl],
  );

  const mannerTemperature = profile?.mannerTemperature ?? 36.5;
  const mannerTemperatureWidth =
    `${Math.min(mannerTemperature, 100)}%` as DimensionValue;
  const mannerTemperatureIcon = getMannerTemperatureIcon(mannerTemperature);
  const styleSummary = survey
    ? (STYLE_SUMMARY[survey.partnerStyle] ?? {
        title: PARTNER_STYLE_LABEL[survey.partnerStyle] ?? survey.partnerStyle,
        description: "선호하는 파트너 스타일이에요",
      })
    : null;
  const intensitySummary = survey
    ? (INTENSITY_SUMMARY[survey.exerciseIntensity] ?? {
        title:
          INTENSITY_LABEL[survey.exerciseIntensity] ?? survey.exerciseIntensity,
        description: "선호하는 운동 강도예요",
      })
    : null;
  const reasonSummary = survey
    ? (REASON_SUMMARY[survey.exerciseReason] ?? {
        title: REASON_LABEL[survey.exerciseReason] ?? survey.exerciseReason,
        description: "운동을 시작하는 이유예요",
      })
    : null;
  const exerciseTypeSummary = survey?.exerciseTypes?.length
    ? survey.exerciseTypes.slice(0, 2).join(", ")
    : "아직 없음";

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4C5BE2" />
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{errorMessage}</Text>
        <Pressable style={styles.retryButton} onPress={loadProfile}>
          <Text style={styles.retryText}>다시 시도</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topSection}>
        <View style={styles.headerRow}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            style={styles.iconButton}
          >
            <Ionicons name="chevron-back" size={28} color="#111111" />
          </Pressable>
          <View style={styles.headerSpacer} />
          <Pressable accessibilityRole="button" style={styles.iconButton}>
            <Ionicons name="settings-outline" size={24} color="#111111" />
          </Pressable>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.profileImageWrap}>
            <Image
              source={profileImageSource}
              style={styles.profileImage}
              contentFit="cover"
              transition={120}
            />
            <View style={styles.onlineDot} />
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.name}>{profile?.name ?? ""}</Text>
            <Text style={styles.department}>
              {profile?.department ?? ""}
              {"\n"}
              {profile?.studentId ?? ""}
            </Text>
          </View>

          <View style={styles.statGroup}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {profile?.pointBalance ?? 0}P
              </Text>
              <Text style={styles.statLabel}>포인트</Text>
            </View>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          style={styles.editButton}
          onPress={() => router.push("/profile/edit" as any)}
        >
          <Text style={styles.editButtonText}>내 정보 편집</Text>
        </Pressable>
      </View>

      <View style={styles.bodySection}>
        <View style={styles.card}>
          <View style={styles.mannerHeaderRow}>
            <Pressable
              accessibilityRole="button"
              onPress={() => setIsMannerDescriptionVisible((v) => !v)}
              style={styles.cardHeader}
            >
              <Text style={styles.cardTitle}>매너온도</Text>
              <Ionicons
                name={
                  isMannerDescriptionVisible
                    ? "chevron-back-circle-outline"
                    : "information-circle-outline"
                }
                size={20}
                color="#111827"
              />
            </Pressable>

            {isMannerDescriptionVisible ? (
              <Animated.View
                style={[
                  styles.mannerPopover,
                  {
                    opacity: mannerDescriptionProgress,
                    transform: [
                      {
                        translateY: mannerDescriptionProgress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-6, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Text style={styles.mannerPopoverText}>
                  매칭 참여, 노쇼, 후기를 바탕으로 한 신뢰 지표예요.
                </Text>
              </Animated.View>
            ) : null}
          </View>

          <View style={styles.temperatureRow}>
            <Text style={styles.temperature}>
              {mannerTemperature.toFixed(1)}°C
            </Text>
            {mannerTemperatureIcon.family === "ion" ? (
              <Ionicons
                name={mannerTemperatureIcon.name}
                size={30}
                color={MANNER_TEMPERATURE_COLOR}
              />
            ) : (
              <MaterialCommunityIcons
                name={mannerTemperatureIcon.name}
                size={32}
                color={MANNER_TEMPERATURE_COLOR}
              />
            )}
          </View>

          <View style={styles.temperatureTrack}>
            <View
              style={[
                styles.temperatureFill,
                { width: mannerTemperatureWidth },
              ]}
            />
          </View>

          <View style={styles.mannerMetaRow}>
            <View style={styles.mannerMeta}>
              <MaterialCommunityIcons
                name="handshake-outline"
                size={20}
                color="#111827"
              />
              <Text style={styles.mannerMetaText}>
                매칭 {profile?.matchCount ?? 0}회
              </Text>
            </View>
            <View style={styles.mannerMeta}>
              <Ionicons name="alert-circle-outline" size={20} color="#EF5A24" />
              <Text style={styles.mannerMetaText}>
                노쇼 {profile?.noShowCount ?? 0}회
              </Text>
            </View>
          </View>
        </View>

        {survey && styleSummary && intensitySummary && reasonSummary ? (
          <View style={styles.preferenceCard}>
            <View style={styles.preferenceHeader}>
              <View style={styles.preferenceTitleRow}>
                <Text style={styles.preferenceTitle}>나의 성향</Text>
                <View style={styles.betaBadge}>
                  <Text style={styles.betaBadgeText}>Beta</Text>
                </View>
              </View>
              <Text style={styles.preferenceSubtitle}>
                설문을 바탕으로 분석된 나의 운동 성향이에요
              </Text>
            </View>

            <View style={styles.preferenceGrid}>
              <PreferenceBadge
                label="성격"
                title={styleSummary.title}
                description={styleSummary.description}
                icon={
                  <Ionicons
                    name={survey.partnerStyle === "같이" ? "people" : "person"}
                    size={24}
                    color="#22C55E"
                  />
                }
                tone="green"
              />
              <PreferenceBadge
                label="운동 스타일"
                title={intensitySummary.title}
                description={intensitySummary.description}
                icon={
                  <MaterialCommunityIcons
                    name="dumbbell"
                    size={24}
                    color="#A855F7"
                  />
                }
                tone="purple"
              />
              <PreferenceBadge
                label="운동 목적"
                title={reasonSummary.title}
                description={reasonSummary.description}
                icon={
                  <MaterialCommunityIcons
                    name="bullseye-arrow"
                    size={24}
                    color="#F97316"
                  />
                }
                tone="orange"
              />
              <PreferenceBadge
                label="관심 종목"
                title={exerciseTypeSummary}
                description="주로 이 종목에 관심이 있어요"
                icon={<Ionicons name="football" size={24} color="#2563EB" />}
                tone="blue"
              />
            </View>
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>빠른 이동</Text>
          <View style={styles.quickActionRow}>
            <QuickAction
              icon={
                <Ionicons name="calendar-outline" size={28} color="#4C5BE2" />
              }
              label="출석체크"
              onPress={() => router.push("/attendance" as any)}
            />
            <QuickAction
              icon={
                <Ionicons name="chatbubble-outline" size={28} color="#4C5BE2" />
              }
              label="채팅"
              onPress={() => router.push("/(tabs)/chat")}
            />
            <QuickAction
              icon={<Ionicons name="time-outline" size={28} color="#4C5BE2" />}
              label="매치 내역"
              onPress={() => router.push("/matches/history")}
            />
            <QuickAction
              icon={
                <Ionicons name="wallet-outline" size={28} color="#4C5BE2" />
              }
              label="포인트 내역"
            />
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>로그아웃</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

type PreferenceBadgeProps = {
  label: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  tone: "green" | "purple" | "orange" | "blue";
};

function PreferenceBadge({
  label,
  title,
  description,
  icon,
  tone,
}: PreferenceBadgeProps) {
  return (
    <View
      style={[
        styles.preferenceItem,
        tone === "blue" && styles.preferenceItemLast,
      ]}
    >
      <Text style={styles.preferenceItemLabel}>{label}</Text>
      <View
        style={[styles.preferenceIconWrap, styles[`preferenceIcon_${tone}`]]}
      >
        {icon}
      </View>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={styles.preferenceItemTitle}
      >
        {title}
      </Text>
      <Text style={styles.preferenceItemDescription}>{description}</Text>
    </View>
  );
}

type QuickActionProps = {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
};

function QuickAction({ icon, label, onPress }: QuickActionProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={styles.quickAction}
    >
      <View style={styles.quickActionIcon}>{icon}</View>
      <Text style={styles.quickActionText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F2F7FF",
  },
  content: {
    paddingBottom: 0,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    backgroundColor: "#F2F7FF",
  },
  errorText: {
    fontSize: 14,
    color: "#EF4444",
    textAlign: "center",
    fontFamily: "System",
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#4C5BE2",
  },
  retryText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
    fontFamily: "System",
  },
  topSection: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
    gap: 16,
  },
  bodySection: {
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 72,
    gap: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  headerSpacer: {
    width: 40,
  },
  profileCard: {
    minHeight: 120,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  profileImage: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#EEF2FF",
  },
  profileImageWrap: {
    width: 92,
    height: 92,
    justifyContent: "center",
  },
  onlineDot: {
    position: "absolute",
    right: 0,
    bottom: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 5,
    borderColor: "#FFFFFF",
    backgroundColor: "#FF4B1F",
  },
  profileInfo: {
    flex: 1,
    gap: 8,
  },
  name: {
    fontSize: 24,
    lineHeight: 32,
    color: "#111827",
    fontWeight: "800",
  },
  department: {
    fontSize: 18,
    lineHeight: 25,
    color: "#4B5563",
    fontWeight: "800",
  },
  statGroup: {
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
    lineHeight: 34,
    color: "#4C5BE2",
    fontWeight: "800",
  },
  statLabel: {
    fontSize: 16,
    lineHeight: 22,
    color: "#111827",
    fontWeight: "800",
  },
  editButton: {
    minHeight: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  editButtonText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#111827",
    fontWeight: "700",
  },
  card: {
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 14,
    position: "relative",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  mannerHeaderRow: {
    minHeight: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    position: "relative",
    zIndex: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  mannerPopover: {
    position: "absolute",
    left: 0,
    top: 28,
    maxWidth: 260,
    borderRadius: 10,
    backgroundColor: "#111827",
    paddingHorizontal: 12,
    paddingVertical: 9,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 6,
    zIndex: 10,
  },
  mannerPopoverText: {
    fontSize: 12,
    lineHeight: 17,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  cardTitle: {
    fontSize: 15,
    lineHeight: 20,
    color: "#111827",
    fontWeight: "800",
  },
  temperatureRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  temperature: {
    fontSize: 22,
    lineHeight: 28,
    color: MANNER_TEMPERATURE_COLOR,
    fontWeight: "900",
  },
  temperatureTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: MANNER_TEMPERATURE_TRACK,
    overflow: "hidden",
  },
  temperatureFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: MANNER_TEMPERATURE_COLOR,
  },
  mannerMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 16,
  },
  mannerMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  mannerMetaText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#111827",
    fontWeight: "700",
  },
  linkText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#6B7280",
    fontWeight: "700",
  },
  preferenceCard: {
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 18,
    gap: 18,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  preferenceHeader: {
    gap: 8,
  },
  preferenceTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  preferenceTitle: {
    fontSize: 18,
    lineHeight: 24,
    color: "#111827",
    fontWeight: "900",
  },
  betaBadge: {
    borderRadius: 999,
    backgroundColor: "#EDE9FE",
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  betaBadgeText: {
    fontSize: 12,
    lineHeight: 16,
    color: "#5B5CE2",
    fontWeight: "900",
  },
  preferenceSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: "#6B7280",
    fontWeight: "600",
  },
  preferenceGrid: {
    flexDirection: "row",
  },
  preferenceItem: {
    flex: 1,
    minHeight: 160,
    alignItems: "center",
    paddingHorizontal: 8,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: "#D1D5DB",
  },
  preferenceItemLast: {
    borderRightWidth: 0,
  },
  preferenceItemLabel: {
    fontSize: 13,
    lineHeight: 18,
    color: "#111827",
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 16,
  },
  preferenceIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  preferenceIcon_green: {
    backgroundColor: "#DCFCE7",
  },
  preferenceIcon_purple: {
    backgroundColor: "#F3E8FF",
  },
  preferenceIcon_orange: {
    backgroundColor: "#FFEDD5",
  },
  preferenceIcon_blue: {
    backgroundColor: "#DBEAFE",
  },
  preferenceItemTitle: {
    alignSelf: "stretch",
    fontSize: 16,
    lineHeight: 22,
    color: "#111827",
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 8,
  },
  preferenceItemDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: "#374151",
    fontWeight: "600",
    textAlign: "center",
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagChip: {
    borderRadius: 999,
    backgroundColor: "#C1CDFF",
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 12,
    lineHeight: 16,
    color: "#2A327D",
    fontWeight: "800",
  },
  quickActionRow: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    overflow: "hidden",
  },
  quickAction: {
    flex: 1,
    minHeight: 82,
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  quickActionIcon: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionText: {
    fontSize: 11,
    lineHeight: 14,
    color: "#111827",
    fontWeight: "700",
    textAlign: "center",
  },
  logoutButton: {
    alignSelf: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logoutText: {
    fontSize: 14,
    lineHeight: 18,
    color: "#6B7280",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
