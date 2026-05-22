import * as React from "react";
import { router, useFocusEffect } from "expo-router";
import { Alert, ScrollView, StyleSheet, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import HomeHeader from "@/components/matching/home/HomeHeader";
import HeroBanner from "@/components/matching/home/HeroBanner";
import { homeBanners, matchedPartners } from "@/components/matching/home/homeMockData";
import HomeStatusSection from "@/components/matching/home/HomeStatusSection";
import MatchSection from "@/components/matching/home/MatchSection";
import WorkoutCompleteModal from "@/components/matching/WorkoutCompleteModal";

import { Color } from "@/constants/locofyHomeStyles";
import {
  getHasScheduleCache,
  getSchedule,
  setHasScheduleCache,
} from "@/services/schedule/scheduleService";
import { getSurvey } from "@/services/survey/surveyService";
import {
  passCandidate,
  requestPartnerMatch,
  toggleMatching,
} from "@/services/matching/matchingService";
import { normalizeImageUrl } from "@/lib/utils/imageUrl";
import { getMyProfile } from "@/services/user/userService";
import { useAuthStore } from "@/stores/auth/authStore";
import { useMatchingStore } from "@/stores/matching/matchingStore";
import { useUserStore } from "@/stores/user/userStore";
import { createNewCardPreviewPartners } from "@/utils/homeNewCard";
import type { Banner } from "@/types/ui/homeBanner";
import type { PartnerCardProps } from "@/types/ui/homeCards";
import type { HomeStatusVariant } from "@/types/ui/homeStatus";
import type { Survey } from "@/types/domain/survey";
import type { UserTimetableRange } from "@/types/domain/user";

export default function HomePage() {
  const storedMatching = useAuthStore((s) => s.matching);
  const setMatching = useAuthStore((s) => s.setMatching);
  const userProfile = useUserStore((s) => s.profile);
  const setUserProfile = useUserStore((s) => s.setProfile);

  const candidates = useMatchingStore((s) => s.candidates);
  const disconnectedCandidateIds = useMatchingStore((s) => s.disconnectedCandidateIds);
  const setCandidates = useMatchingStore((s) => s.setCandidates);
  const addCandidate = useMatchingStore((s) => s.addCandidate);
  const removeCandidate = useMatchingStore((s) => s.removeCandidate);
  const popFromBuffer = useMatchingStore((s) => s.popFromBuffer);
  const seenCandidateIds = useMatchingStore((s) => s.seenCandidateIds);
  const addSeenIds = useMatchingStore((s) => s.addSeenIds);
  const lastResolvedMatchRequest = useMatchingStore((s) => s.lastResolvedMatchRequest);
  const clearLastResolvedMatchRequest = useMatchingStore((s) => s.clearLastResolvedMatchRequest);
  const wsConnected = useMatchingStore((s) => s.wsConnected);

  const [isQuickMatchOn, setIsQuickMatchOn] = React.useState(storedMatching);
  const [forceMatchedContent, setForceMatchedContent] = React.useState(false);
  const [forceMatchedContentNew, setForceMatchedContentNew] = React.useState(false);
  const [isWorkoutCompleteTestVisible, setIsWorkoutCompleteTestVisible] =
    React.useState(false);
  const [banners] = React.useState<Banner[]>(homeBanners);
  const [noMoreCandidates, setNoMoreCandidates] = React.useState(false);
  const [survey, setSurvey] = React.useState<Survey | null>(null);
  const [scheduleRanges, setScheduleRanges] = React.useState<UserTimetableRange[]>([]);
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

  // Match request notifications are handled by MatchRequestToast in (tabs)/_layout.tsx

  // Show alert when the opponent accepts or rejects our match request via WS
  React.useEffect(() => {
    if (!lastResolvedMatchRequest) return;
    const { accepted, roomId } = lastResolvedMatchRequest;
    clearLastResolvedMatchRequest();
    if (accepted && roomId) {
      setIsQuickMatchOn(false);
      setMatching(false);
      setCandidates([]);
      toggleMatching(false).catch(() => {});
      router.push(`/chat/${encodeURIComponent(roomId)}`);
    } else if (!accepted) {
      Alert.alert("매칭 거절", "상대방이 매칭을 거절했어요.");
    }
  }, [lastResolvedMatchRequest, clearLastResolvedMatchRequest, setCandidates, setMatching]);

  useFocusEffect(
    React.useCallback(() => {
      setHasTimetable(getHasScheduleCache());

      if (!useUserStore.getState().profile) {
        getMyProfile()
          .then(setUserProfile)
          .catch(() => {});
      }

      getSurvey()
        .then(setSurvey)
        .catch(() => {});

      getSchedule()
        .then((ranges) => {
          const has = ranges.length > 0;
          setScheduleRanges(ranges);
          setHasScheduleCache(has);
          setHasTimetable(has);
        })
        .catch(() => {
          if (getHasScheduleCache() === null) {
            setHasTimetable(false);
          }
        });
    }, [setUserProfile]),
  );

  const isMatched = forceMatchedContent;
  const isMatchedNew = forceMatchedContentNew;

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
  const reviewTestRoute = "/review-complete-test" as const;

  const handleMatchRequest = React.useCallback(async (opponentId: number) => {
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
  }, []);

  const handlePass = React.useCallback(
    async (userProfileId: number) => {
      removeCandidate(userProfileId);
      setNoMoreCandidates(false);

      const next = popFromBuffer();
      if (next) {
        addCandidate(next);
        addSeenIds([next.userProfileId]);
        return;
      }

      try {
        const candidate = await passCandidate(seenCandidateIds);
        if (candidate) {
          addCandidate(candidate);
          addSeenIds([candidate.userProfileId]);
        } else {
          setNoMoreCandidates(true);
        }
      } catch {
        // 조용히 실패 — WS로 NEW_CANDIDATE가 올 수도 있음
      }
    },
    [removeCandidate, popFromBuffer, addCandidate, addSeenIds, seenCandidateIds],
  );

  const mappedCandidates = React.useMemo(
    () =>
      candidates.map((c): PartnerCardProps => {
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
          matchScore: c.compatibilityScore ?? c.matchScore,
          disconnected: disconnectedCandidateIds.includes(c.userProfileId),
          onAccept: () => handleMatchRequest(c.userProfileId),
          onReject: () => handlePass(c.userProfileId),
        };
      }),
    [candidates, disconnectedCandidateIds, handleMatchRequest, handlePass],
  );

  const newCardPreviewPartners = React.useMemo(() => {
    return createNewCardPreviewPartners({
      basePartners: matchedPartners,
      profile: userProfile,
      survey,
      scheduleRanges,
    });
  }, [scheduleRanges, survey, userProfile]);

  const handleToggleQuickMatch = React.useCallback(async (value: boolean) => {
    if (!value) {
      isTogglingRef.current = false;
      setIsQuickMatchOn(false);
      setMatching(false);
      setCandidates([]);
      setNoMoreCandidates(false);
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
  }, [setMatching, setCandidates]);

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <ScrollView
        style={styles.homeScreen}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
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
          <Pressable
            accessibilityRole="button"
            style={[styles.testButton, styles.testButtonComplete]}
            onPress={() => setIsWorkoutCompleteTestVisible(true)}
          >
            <Text style={[styles.testButtonText, styles.testButtonCompleteText]}>
              완료 테스트
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            style={[styles.testButton, styles.testButtonReview]}
            onPress={() => router.push(reviewTestRoute as any)}
          >
            <Text style={[styles.testButtonText, styles.testButtonReviewText]}>
              평가 테스트
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            style={[styles.testButton, styles.testButtonReport]}
            onPress={() => router.push("/tutorial-report-test" as any)}
          >
            <Text style={[styles.testButtonText, styles.testButtonReportText]}>
              리포트 테스트
            </Text>
          </Pressable>
        </View>
        <HeroBanner banners={banners} />



        <HomeStatusSection
          state={currentState}
          isQuickMatchOn={isQuickMatchOn}
          onToggleQuickMatch={handleToggleQuickMatch}
          candidates={mappedCandidates}
          newCardPartners={newCardPreviewPartners}
          isToggleDisabled={hasTimetable === false}
          noMoreCandidates={noMoreCandidates}
        />

        <MatchSection />
      </ScrollView>
      <WorkoutCompleteModal
        visible={isWorkoutCompleteTestVisible}
        onLaterPress={() => setIsWorkoutCompleteTestVisible(false)}
        onReviewPress={() => {
          setIsWorkoutCompleteTestVisible(false);
          router.push(reviewTestRoute as any);
        }}
      />
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
    paddingBottom: 36,
  },
  testButtonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
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
  testButtonComplete: {
    borderColor: "#16A34A",
  },
  testButtonCompleteText: {
    color: "#16A34A",
  },
  testButtonReview: {
    borderColor: "#7C3AED",
  },
  testButtonReviewText: {
    color: "#7C3AED",
  },
  testButtonReport: {
    borderColor: "#25258F",
  },
  testButtonReportText: {
    color: "#25258F",
  },
  sectionTitle: {
    paddingHorizontal: 20,
    gap: 4,
    marginTop: -8,
    marginBottom: -8,
  },
  sectionTitleText: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.4,
  },
  sectionTitleSub: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
    color: "#9CA3AF",
  },
});
