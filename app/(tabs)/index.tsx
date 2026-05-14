import * as React from "react";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { Alert, ScrollView, StyleSheet, Pressable, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import HomeHeader from "@/components/matching/home/HomeHeader";
import HeroBanner from "@/components/matching/home/HeroBanner";
import { homeBanners } from "@/components/matching/home/homeMockData";
import HomeStatusSection from "@/components/matching/home/HomeStatusSection";
import MatchSection from "@/components/matching/home/MatchSection";

import { Color } from "@/constants/locofyHomeStyles";
import {
  getHasScheduleCache,
  getSchedule,
  setHasScheduleCache,
} from "@/services/schedule/scheduleService";
import {
  acceptMatchRequest,
  rejectMatchRequest,
  requestPartnerMatch,
  toggleMatching,
} from "@/services/matching/matchingService";
import { normalizeImageUrl } from "@/lib/utils/imageUrl";
import { useAuthStore } from "@/stores/auth/authStore";
import { useMatchingStore } from "@/stores/matching/matchingStore";
import type { MatchCandidate } from "@/types/domain/match";
import type { Banner } from "@/types/ui/homeBanner";
import type { PartnerCardProps } from "@/types/ui/homeCards";
import type { HomeStatusVariant } from "@/types/ui/homeStatus";

export default function HomePage() {
  const insets = useSafeAreaInsets();

  const storedMatching = useAuthStore((s) => s.matching);
  const setMatching = useAuthStore((s) => s.setMatching);

  const candidates = useMatchingStore((s) => s.candidates);
  const setCandidates = useMatchingStore((s) => s.setCandidates);
  const removeCandidate = useMatchingStore((s) => s.removeCandidate);
  const pendingMatchRequest = useMatchingStore((s) => s.pendingMatchRequest);
  const setPendingMatchRequest = useMatchingStore((s) => s.setPendingMatchRequest);
  const lastResolvedMatchRequest = useMatchingStore((s) => s.lastResolvedMatchRequest);
  const clearLastResolvedMatchRequest = useMatchingStore((s) => s.clearLastResolvedMatchRequest);
  const wsConnected = useMatchingStore((s) => s.wsConnected);

  const [isQuickMatchOn, setIsQuickMatchOn] = React.useState(storedMatching);
  const [forceMatchedContent, setForceMatchedContent] = React.useState(false);
  const [forceMatchedContentNew, setForceMatchedContentNew] = React.useState(false);
  const [banners] = React.useState<Banner[]>(homeBanners);
  const isTogglingRef = React.useRef(false);

  const [hasTimetable, setHasTimetable] = React.useState<boolean | null>(
    () => getHasScheduleCache(),
  );

  // Re-send toggle when WS connects if matching was already ON (e.g. app cold-start)
  React.useEffect(() => {
    if (!wsConnected) return;
    if (!useAuthStore.getState().matching) return;
    toggleMatching(true).catch(() => {});
  }, [wsConnected]);

  // Show alert when another user sends us a match request via WS
  React.useEffect(() => {
    if (!pendingMatchRequest) return;
    const { matchRequestId, expiresAt } = pendingMatchRequest;
    const secondsLeft = Math.max(
      0,
      Math.round((new Date(expiresAt).getTime() - Date.now()) / 1000),
    );
    Alert.alert(
      "매칭 요청",
      `상대방이 매칭을 요청했어요. ${secondsLeft}초 안에 수락하시겠어요?`,
      [
        {
          text: "거절",
          style: "cancel",
          onPress: () => {
            rejectMatchRequest(matchRequestId).catch(() => {});
            setPendingMatchRequest(null);
          },
        },
        {
          text: "수락",
          onPress: () => {
            acceptMatchRequest(matchRequestId).catch(() => {});
            setPendingMatchRequest(null);
          },
        },
      ],
    );
  }, [pendingMatchRequest, setPendingMatchRequest]);

  // Show alert when the opponent accepts or rejects our match request via WS
  React.useEffect(() => {
    if (!lastResolvedMatchRequest) return;
    const { accepted } = lastResolvedMatchRequest;
    Alert.alert(
      accepted ? "매칭 성사!" : "매칭 거절",
      accepted
        ? "상대방이 매칭을 수락했어요. 운동을 즐겨보세요!"
        : "상대방이 매칭을 거절했어요.",
    );
    clearLastResolvedMatchRequest();
  }, [lastResolvedMatchRequest, clearLastResolvedMatchRequest]);

  useFocusEffect(
    React.useCallback(() => {
      setHasTimetable(getHasScheduleCache());

      getSchedule()
        .then((ranges) => {
          const has = ranges.length > 0;
          setHasScheduleCache(has);
          setHasTimetable(has);
        })
        .catch(() => {
          if (getHasScheduleCache() === null) {
            setHasTimetable(false);
          }
        });
    }, []),
  );

  const isMatched = forceMatchedContent;
  const isMatchedNew = forceMatchedContentNew;

  const FAB_SIZE = 56;
  const FAB_OFFSET = 20;
  const FAB_EXTRA_SPACE = 12;

  const getHomeStatusVariant = (): HomeStatusVariant => {
    if (isMatchedNew) return "MatchedNew";
    if (isMatched) return "Matched";
    if (candidates.length > 0) return "Matched";
    if (isQuickMatchOn) return "Matching";
    if (hasTimetable === null) return "Loading";
    if (!hasTimetable) return "NoSchedule";
    return "Default";
  };

  const currentState = getHomeStatusVariant();

  const handleMatchRequest = async (opponentId: number) => {
    try {
      const res = await requestPartnerMatch(opponentId);
      const expiresAt = new Date(res.data.expiresAt);
      const secondsLeft = Math.max(
        0,
        Math.round((expiresAt.getTime() - Date.now()) / 1000),
      );
      Alert.alert(
        "매칭 요청 완료",
        `매칭 요청을 보냈어요. ${secondsLeft}초 안에 상대방이 수락하면 매칭이 시작돼요.`,
      );
    } catch (err) {
      Alert.alert(
        "요청 실패",
        err instanceof Error ? err.message : "다시 시도해주세요.",
      );
    }
  };

  const mapCandidateToCard = (c: MatchCandidate): PartnerCardProps => {
    const imageUrl = normalizeImageUrl(c.profileImageUrl);
    return {
      userProfileId: c.userProfileId,
      profileImageSource: imageUrl ? { uri: imageUrl } : undefined,
      name: c.name,
      department: c.department,
      studentId: c.studentId,
      partnerStyle: c.partnerStyle,
      exerciseIntensity: c.exerciseIntensity,
      exerciseReason: c.exerciseReason,
      exerciseTypes: c.exerciseTypes,
      matchScore: c.compatibilityScore,
      onAccept: () => handleMatchRequest(c.userProfileId),
      onReject: () => removeCandidate(c.userProfileId),
    };
  };

  const handleToggleQuickMatch = async (value: boolean) => {
    if (!value) {
      isTogglingRef.current = false;
      setIsQuickMatchOn(false);
      setMatching(false);
      setCandidates([]);
      toggleMatching(false).catch(() => {});
      return;
    }

    if (isTogglingRef.current) return;
    isTogglingRef.current = true;

    try {
      const res = await toggleMatching(true);
      if (!res.data.isMatching) {
        isTogglingRef.current = false;
        return;
      }
      setIsQuickMatchOn(true);
      setMatching(true);
      isTogglingRef.current = false;
    } catch (err) {
      isTogglingRef.current = false;
      Alert.alert(
        "매칭 오류",
        err instanceof Error ? err.message : "다시 시도해주세요.",
      );
    }
  };

  const handleCreatePostPress = () => {
    router.push("/posts/create");
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <>
        <ScrollView
          style={styles.homeScreen}
          contentContainerStyle={[
            styles.scrollViewContent,
            {
              paddingBottom:
                FAB_SIZE + FAB_OFFSET + FAB_EXTRA_SPACE + insets.bottom,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <HomeHeader />
          <View style={styles.testButtonRow}>
            <Pressable
              accessibilityRole="button"
              style={styles.testButton}
              onPress={() => setForceMatchedContent((value) => !value)}
            >
              <Text style={styles.testButtonText}>
                {forceMatchedContent ? "기존 끄기" : "기존 카드"}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              style={[styles.testButton, styles.testButtonNew]}
              onPress={() => setForceMatchedContentNew((value) => !value)}
            >
              <Text style={[styles.testButtonText, styles.testButtonNewText]}>
                {forceMatchedContentNew ? "새 카드 끄기" : "새 카드 (New)"}
              </Text>
            </Pressable>
          </View>
          <HeroBanner banners={banners} />

          <HomeStatusSection
            state={currentState}
            isQuickMatchOn={isQuickMatchOn}
            onToggleQuickMatch={handleToggleQuickMatch}
            candidates={candidates.map(mapCandidateToCard)}
          />

          <MatchSection />
        </ScrollView>

        <Pressable
          onPress={handleCreatePostPress}
          style={[
            styles.fab,
            {
              right: 20,
              bottom: 20 + insets.bottom,
            },
          ]}
          hitSlop={10}
        >
          <Ionicons name="add" size={34} color="#FFFFFF" />
        </Pressable>
      </>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  homeScreen: {
    flex: 1,
    width: "100%",
    backgroundColor: Color.colorWhite,
    maxWidth: "100%",
  },
  scrollViewContent: {
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: 28,
  },
  testButtonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: -42,
    marginBottom: -42,
  },
  testButton: {
    minHeight: 34,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#4C5BE2",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  testButtonText: {
    fontSize: 12,
    lineHeight: 16,
    color: "#4C5BE2",
    fontWeight: "800",
  },
  testButtonNew: {
    borderColor: "#E24CB5",
  },
  testButtonNewText: {
    color: "#E24CB5",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4C5BE2",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    elevation: 10,
    shadowColor: "#4C5BE2",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
  },
});
