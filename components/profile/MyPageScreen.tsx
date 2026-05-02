import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { logout } from "@/services/auth/authService";
import { getMyProfile } from "@/services/user/userService";
import { useAuthStore } from "@/stores/auth/authStore";
import { useUserStore } from "@/stores/user/userStore";

const MANNER_TEMPERATURE_COLOR = "#F59E0B";
const MANNER_TEMPERATURE_TRACK = "#FEF3C7";

export default function MyPageScreen() {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const { profile, setProfile } = useUserStore();

  const [isLoading, setIsLoading] = React.useState(!profile);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isMannerDescriptionVisible, setIsMannerDescriptionVisible] =
    React.useState(false);
  const mannerDescriptionProgress = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (profile) return;

    let cancelled = false;
    setIsLoading(true);
    setErrorMessage(null);

    getMyProfile()
      .then((data) => {
        if (!cancelled) setProfile(data);
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setErrorMessage(
            err instanceof Error ? err.message : "프로필을 불러올 수 없습니다."
          );
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    Animated.timing(mannerDescriptionProgress, {
      toValue: isMannerDescriptionVisible ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [isMannerDescriptionVisible, mannerDescriptionProgress]);

  const handleLogout = async () => {
    await logout();
    clearAuth();
    router.replace("/login");
  };

  const exerciseTags = (profile?.exerciseTypes ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

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
        <Pressable
          style={styles.retryButton}
          onPress={() => {
            useUserStore.getState().clearProfile();
            setErrorMessage(null);
            setIsLoading(true);
            getMyProfile()
              .then(setProfile)
              .catch((err: unknown) =>
                setErrorMessage(
                  err instanceof Error ? err.message : "프로필을 불러올 수 없습니다."
                )
              )
              .finally(() => setIsLoading(false));
          }}
        >
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
              source={
                profile?.profileImageUrl
                  ? { uri: profile.profileImageUrl }
                  : require("../../assets/match/Ellipse-12.png")
              }
              style={styles.profileImage}
              contentFit="cover"
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
              <Text style={styles.statValue}>{profile?.pointBalance ?? 0}P</Text>
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
              onPress={() =>
                setIsMannerDescriptionVisible((v) => !v)
              }
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
              <Animated.Text
                numberOfLines={2}
                style={[
                  styles.mannerInlineDescription,
                  {
                    opacity: mannerDescriptionProgress,
                    transform: [
                      {
                        translateX: mannerDescriptionProgress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-10, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                매칭 참여, 노쇼, 후기를 바탕으로 한 신뢰 지표예요.
              </Animated.Text>
            ) : null}
          </View>

          <View style={styles.temperatureRow}>
            <Text style={styles.temperature}>
              {(profile?.mannerTemperature ?? 36.5).toFixed(1)}°C
            </Text>
            <Ionicons name="happy-outline" size={30} color={MANNER_TEMPERATURE_COLOR} />
          </View>

          <View style={styles.temperatureTrack}>
            <View
              style={[
                styles.temperatureFill,
                {
                  width: `${Math.min(profile?.mannerTemperature ?? 36.5, 100)}%`,
                },
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
            <Pressable accessibilityRole="button">
              <Text style={styles.linkText}>코멘트 보기 &gt;</Text>
            </Pressable>
          </View>
        </View>

        {exerciseTags.length > 0 ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>나의 운동 종목</Text>
            <View style={styles.tagRow}>
              {exerciseTags.map((tag) => (
                <View key={tag} style={styles.tagChip}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>빠른 이동</Text>
          <View style={styles.quickActionRow}>
            <QuickAction
              icon={<Ionicons name="calendar-outline" size={28} color="#4C5BE2" />}
              label="출석체크"
              onPress={() => router.push("/attendance" as any)}
            />
            <QuickAction
              icon={<Ionicons name="chatbubble-outline" size={28} color="#4C5BE2" />}
              label="채팅"
              onPress={() => router.push("/(tabs)/chat")}
            />
            <QuickAction
              icon={<Ionicons name="time-outline" size={28} color="#4C5BE2" />}
              label="매치 내역"
              onPress={() => router.push("/matches/history")}
            />
            <QuickAction
              icon={<Ionicons name="wallet-outline" size={28} color="#4C5BE2" />}
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
    paddingBottom: 32,
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
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  mannerInlineDescription: {
    flex: 1,
    minWidth: 0,
    fontSize: 12,
    lineHeight: 16,
    color: "#92400E",
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
    justifyContent: "space-between",
    gap: 8,
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
