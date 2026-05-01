import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const USER = {
  name: "김단국",
  department: "소프트웨어학과",
  studentId: "3221234",
  points: 150,
  matchCount: 12,
  mannerTemperature: 36.5,
  noShowCount: 1,
  tags: ["#활동적", "#초보", "#열정적"],
  badges: ["운동왕", "개근왕", "정산왕"],
};

const MANNER_TEMPERATURE_COLOR = "#F59E0B";
const MANNER_TEMPERATURE_TRACK = "#FEF3C7";

export default function MyPageScreen() {
  const [isMannerDescriptionVisible, setIsMannerDescriptionVisible] =
    React.useState(false);
  const mannerDescriptionProgress = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(mannerDescriptionProgress, {
      toValue: isMannerDescriptionVisible ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [isMannerDescriptionVisible, mannerDescriptionProgress]);

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
            source={require("../../assets/match/Ellipse-12.png")}
            style={styles.profileImage}
            contentFit="cover"
          />
          <View style={styles.onlineDot} />
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.name}>{USER.name}</Text>
          <Text style={styles.department}>
            {USER.department}
            {"\n"}
            {USER.studentId}
          </Text>
        </View>

        <View style={styles.statGroup}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{USER.points}P</Text>
            <Text style={styles.statLabel}>포인트</Text>
          </View>
        </View>
      </View>

      <Pressable accessibilityRole="button" style={styles.editButton}>
        <Text style={styles.editButtonText}>내 정보 편집</Text>
      </Pressable>

      </View>

      <View style={styles.bodySection}>
      <View style={styles.card}>
        <View style={styles.mannerHeaderRow}>
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              setIsMannerDescriptionVisible((isVisible) => !isVisible)
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
            {USER.mannerTemperature.toFixed(1)}°C
          </Text>
          <Ionicons name="happy-outline" size={30} color={MANNER_TEMPERATURE_COLOR} />
        </View>

        <View style={styles.temperatureTrack}>
          <View
            style={[
              styles.temperatureFill,
              { width: `${Math.min(USER.mannerTemperature, 100)}%` },
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
            <Text style={styles.mannerMetaText}>매칭 {USER.matchCount}회</Text>
          </View>
          <View style={styles.mannerMeta}>
            <Ionicons name="alert-circle-outline" size={20} color="#EF5A24" />
            <Text style={styles.mannerMetaText}>노쇼 {USER.noShowCount}회</Text>
          </View>
          <Pressable accessibilityRole="button">
            <Text style={styles.linkText}>코멘트 보기 &gt;</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>나의 성향</Text>
        <View style={styles.tagRow}>
          {USER.tags.map((tag) => (
            <View key={tag} style={styles.tagChip}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.badgeRow}>
          {USER.badges.map((badge) => (
            <View key={badge} style={styles.badgeItem}>
              <View style={styles.badgeIcon}>
                <Ionicons name="ribbon-outline" size={24} color="#C8960C" />
              </View>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>빠른 이동</Text>
        <View style={styles.quickActionRow}>
          <QuickAction
            icon={<Ionicons name="calendar-outline" size={28} color="#4C5BE2" />}
            label="출석체크"
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

      <Pressable accessibilityRole="button" style={styles.logoutButton}>
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
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.quickAction}>
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
  badgeRow: {
    flexDirection: "row",
    gap: 22,
  },
  badgeItem: {
    alignItems: "center",
    gap: 6,
  },
  badgeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF7E0",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 12,
    lineHeight: 16,
    color: "#111827",
    fontWeight: "700",
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
