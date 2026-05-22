import * as React from "react";
import { router, useFocusEffect } from "expo-router";
import { Alert, ScrollView, StyleSheet, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import HomeHeader from "@/components/matching/home/HomeHeader";
import HeroBanner from "@/components/matching/home/HeroBanner";
import { homeBanners, matchedPartners } from "@/components/matching/home/homeMockData";
import HomeStatusSection from "@/components/matching/home/HomeStatusSection";
import MatchSection from "@/components/matching/home/MatchSection";
import OpponentProfileModal from "@/components/matching/OpponentProfileModal";
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
import { getChatRooms } from "@/services/chat/chatService";
import { normalizeImageUrl } from "@/lib/utils/imageUrl";
import { getMyProfile } from "@/services/user/userService";
import { useAuthStore } from "@/stores/auth/authStore";
import { useChatStore } from "@/stores/chat/chatStore";
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
  const wsConnected = useMatchingStore((s) => s.wsConnected);

  const [isQuickMatchOn, setIsQuickMatchOn] = React.useState(storedMatching);
  const [isWorkoutCompleteTestVisible, setIsWorkoutCompleteTestVisible] =
    React.useState(false);
  const [isProfileModalVisible, setIsProfileModalVisible] = React.useState(false);
  const [banners] = React.useState<Banner[]>(homeBanners);
  const [noMoreCandidates, setNoMoreCandidates] = React.useState(false);
  const [survey, setSurvey] = React.useState<Survey | null>(null);
  const [scheduleRanges, setScheduleRanges] = React.useState<UserTimetableRange[]>([]);
  const isTogglingRef = React.useRef(false);
  const matchPollRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const [hasTimetable, setHasTimetable] = React.useState<boolean | null>(
    () => getHasScheduleCache(),
  );

  // Re-send toggle when WS connects if matching was already ON (e.g. app cold-start)
  React.useEffect(() => {
    if (!wsConnected) return;
    if (!useAuthStore.getState().matching) return;
    toggleMatching(true).catch(() => {});
  }, [wsConnected]);

  // Match accepted/rejected handling is in (tabs)/_layout.tsx (always mounted)

  // Sync local toggle state when matching is turned off externally (e.g. after match accepted)
  React.useEffect(() => {
    setIsQuickMatchOn(storedMatching);
  }, [storedMatching]);

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

  const getHomeStatusVariant = (): HomeStatusVariant => {
    if (candidates.length > 0) return "Matched";
    if (isQuickMatchOn) return "Matching";
    if (hasTimetable === null) return "Loading";
    if (!hasTimetable) return "NoSchedule";
    return "Default";
  };

  const currentState = getHomeStatusVariant();
  const reviewTestRoute = "/review-complete-test" as const;

  // Cleanup poll on unmount
  React.useEffect(() => {
    return () => {
      if (matchPollRef.current) clearInterval(matchPollRef.current);
    };
  }, []);

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

      // WS MATCH_ACCEPTED가 오지 않을 경우를 대비한 폴링 폴백.
      // 요청 시점의 채팅방 ID를 기록해두고, 새 방이 생기면 직접 이동한다.
      const knownRoomIds = new Set(
        useChatStore.getState().chatRooms.map((r) => r.id),
      );
      const expiresAtMs = expiresAt.getTime();

      if (matchPollRef.current) clearInterval(matchPollRef.current);

      matchPollRef.current = setInterval(async () => {
        // WS가 이미 처리했으면 중단
        if (!useAuthStore.getState().matching) {
          clearInterval(matchPollRef.current!);
          matchPollRef.current = null;
          return;
        }
        // 요청 만료 시 중단 (5초 여유)
        if (Date.now() > expiresAtMs + 5000) {
          clearInterval(matchPollRef.current!);
          matchPollRef.current = null;
          return;
        }
        try {
          const rooms = await getChatRooms();
          const newRoom = rooms.find((r) => !knownRoomIds.has(r.id));
          if (newRoom) {
            clearInterval(matchPollRef.current!);
            matchPollRef.current = null;
            setMatching(false);
            setCandidates([]);
            // 채팅방을 store에 먼저 추가 — ChatRoomScreen detail 로드 실패 시에도
            // 채팅 목록에 방이 즉시 노출되고, 빈 채팅방으로 진입할 수 있음
            useChatStore.getState().upsertChatRoom(newRoom);
            toggleMatching(false).catch(() => {});
            router.push(`/chat/${newRoom.id}`);
          }
        } catch {
          // 폴링 실패는 무시하고 재시도
        }
      }, 3000);
    } catch (err) {
      Alert.alert(
        "요청 실패",
        err instanceof Error ? err.message : "다시 시도해주세요.",
      );
    }
  }, [setMatching, setCandidates]);

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
            style={[styles.testButton, styles.testButtonProfile]}
            onPress={() => setIsProfileModalVisible(true)}
          >
            <Text style={[styles.testButtonText, styles.testButtonProfileText]}>
              상대 프로필
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
      <OpponentProfileModal
        visible={isProfileModalVisible}
        onClose={() => setIsProfileModalVisible(false)}
        data={{
          name: "김단국",
          department: "컴퓨터공학과",
          studentId: "20학번",
          mannerTemperature: 36.5,
          exerciseTypes: ["풋살", "헬스", "러닝", "배드민턴", "농구"],
          partnerStyle: "독립형",
          exerciseIntensity: "꾸준형",
          exerciseReason: "건강관리",
          isVerified: true,
          matchCount: 12,
          noShowCount: 0,
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
  testButtonProfile: {
    borderColor: "#0891B2",
  },
  testButtonProfileText: {
    color: "#0891B2",
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
