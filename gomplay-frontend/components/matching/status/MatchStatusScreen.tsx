import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import ApplicantPanel, {
  type Applicant,
} from "@/components/matching/status/ApplicantPanel";
import MatchStatusCard, {
  type MatchItem,
} from "@/components/matching/status/MatchStatusCard";
import OpponentProfileModal, {
  type OpponentProfileData,
} from "@/components/matching/OpponentProfileModal";
import WorkoutCompleteModal from "@/components/matching/WorkoutCompleteModal";
import {
  acceptParticipant,
  completeGathering,
  getGatheringParticipants,
  rejectParticipant,
} from "@/services/gathering/gatheringService";
import { getActiveMatches } from "@/services/matching/matchingService";
import { getMyProfile } from "@/services/user/userService";
import { useUserStore } from "@/stores/user/userStore";
import type { GatheringParticipant } from "@/types/domain/gathering";
import type { ActiveMatch } from "@/types/domain/match";
import type { UserProfile } from "@/types/domain/user";

const SOURCE_FILTERS = ["일반 매칭", "퀵 매치"] as const;
const STATUS_FILTERS = ["진행중", "수락 대기"] as const;

type SourceFilter = (typeof SOURCE_FILTERS)[number] | null;
type StatusFilter = (typeof STATUS_FILTERS)[number] | null;

type MatchStatusScreenProps = {
  initialMatches?: MatchItem[];
  initialApplicantsByMatch?: Record<string, Applicant[]>;
};

const normalizeMatchType = (type: ActiveMatch["type"]): MatchItem["sourceType"] =>
  String(type).toUpperCase() === "GATHERING" ? "POST" : "PARTNER";

const normalizeMatchStatus = (
  status: ActiveMatch["status"],
): MatchItem["status"] | null => {
  const normalized = String(status).toUpperCase();
  if (normalized === "PENDING") return "PENDING";
  if (normalized === "IN_PROGRESS") return "IN_PROGRESS";
  return null;
};

const normalizeMatchRole = (
  role: ActiveMatch["role"],
): MatchItem["role"] => {
  if (!role) return null;
  return String(role).toUpperCase() === "HOST" ? "HOST" : "GUEST";
};

const participantStatusToApplicantStatus = (
  status: GatheringParticipant["status"],
): Applicant["status"] => {
  if (status === "ACCEPTED") return "accepted";
  if (status === "REJECTED") return "rejected";
  return "pending";
};

const getParticipantMannerTemperature = (
  participant: GatheringParticipant,
): number => {
  return typeof participant.mannerTemperature === "number"
    ? participant.mannerTemperature
    : Number.NaN;
};

const mapParticipantToApplicant = (
  participant: GatheringParticipant,
): Applicant => ({
  id: String(participant.id),
  name: participant.userName,
  profileImageUrl: participant.userProfileImageUrl,
  department: "",
  studentNumber: "",
  tags: [],
  trustScore: getParticipantMannerTemperature(participant),
  status: participantStatusToApplicantStatus(participant.status),
});

const formatTimeRange = (
  startAt?: string | null,
  endAt?: string | null,
): string | undefined => {
  if (!startAt) return undefined;

  const formatTime = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const start = formatTime(startAt);
  const end = endAt ? formatTime(endAt) : null;

  if (!start) return undefined;
  return end ? `${start} ~ ${end}` : start;
};

const formatStudentNumber = (
  value: ActiveMatch["partnerStudentNumber"] | ActiveMatch["hostStudentNumber"],
): string | undefined => {
  if (value === null || value === undefined) return undefined;
  return String(value);
};

const isMatchItem = (item: MatchItem | null): item is MatchItem => item !== null;

const getDisplayValue = <T,>(...values: (T | null | undefined | "")[]): T | undefined => {
  const value = values.find((item) => item !== null && item !== undefined && item !== "");
  return value as T | undefined;
};

const mapActiveMatchToItem = (
  match: ActiveMatch,
  currentUserProfile?: UserProfile | null,
): MatchItem | null => {
  const sourceType = normalizeMatchType(match.type);
  const status = normalizeMatchStatus(match.status);
  if (!status) return null;
  const isGathering = sourceType === "POST";
  const role = normalizeMatchRole(match.role);
  const shouldUseCurrentUserAsHostFallback = isGathering && role === "HOST";
  const displayName = isGathering
    ? getDisplayValue(
        match.hostName,
        match.partnerName,
        shouldUseCurrentUserAsHostFallback ? currentUserProfile?.name : undefined,
      )
    : match.partnerName;
  const displayProfileImageUrl = isGathering
    ? getDisplayValue(
        match.hostProfileImageUrl,
        match.partnerProfileImageUrl,
        shouldUseCurrentUserAsHostFallback ? currentUserProfile?.profileImageUrl : undefined,
      )
    : match.partnerProfileImageUrl;
  const displayDepartment = isGathering
    ? getDisplayValue(
        match.hostDepartment,
        match.partnerDepartment,
        shouldUseCurrentUserAsHostFallback ? currentUserProfile?.department : undefined,
      )
    : match.partnerDepartment;
  const displayStudentNumber = isGathering
    ? getDisplayValue(
        match.hostStudentNumber,
        match.partnerStudentNumber,
        shouldUseCurrentUserAsHostFallback ? currentUserProfile?.studentId : undefined,
      )
    : match.partnerStudentNumber;

  return {
    id: String(match.id),
    sourceType,
    status,
    role,
    canComplete: match.canComplete,
    reviewed: match.reviewed,
    partnerName: displayName ?? "",
    partnerProfileImageUrl: displayProfileImageUrl,
    partnerDepartment: displayDepartment ?? undefined,
    partnerStudentNumber: formatStudentNumber(displayStudentNumber),
    location: match.location ?? undefined,
    scheduledTime:
      match.scheduledTime ??
      formatTimeRange(match.scheduledAt, match.scheduledEndAt),
    scheduledEndAt: match.scheduledEndAt ?? undefined,
    matchedAt: match.matchedAt ?? undefined,
    difficulty: match.difficulty ?? undefined,
    exerciseType: match.sportType ?? undefined,
    applicantCount: match.pendingCount,
    chatRoomId: match.chatRoomId ?? undefined,
  };
};

export default function MatchStatusScreen({
  initialMatches,
  initialApplicantsByMatch = {},
}: MatchStatusScreenProps) {
  const currentUserProfile = useUserStore((state) => state.profile);
  const setCurrentUserProfile = useUserStore((state) => state.setProfile);
  const [sourceFilter, setSourceFilter] = React.useState<SourceFilter>(null);
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>(null);
  const [panelMatchId, setPanelMatchId] = React.useState<string | null>(null);
  const [profileModal, setProfileModal] = React.useState<{
    data: OpponentProfileData;
    item: MatchItem;
  } | null>(null);
  const [matches, setMatches] = React.useState<MatchItem[]>(
    initialMatches ?? [],
  );
  const [matchesLoading, setMatchesLoading] = React.useState(!initialMatches);
  const [matchesRefreshing, setMatchesRefreshing] = React.useState(false);
  const [matchesError, setMatchesError] = React.useState<string | null>(null);
  const [completedGatheringId, setCompletedGatheringId] = React.useState<
    string | null
  >(null);
  const [applicantsByMatch, setApplicantsByMatch] = React.useState<
    Record<string, Applicant[]>
  >(initialApplicantsByMatch);
  const [applicantsLoading, setApplicantsLoading] = React.useState(false);
  const [applicantsError, setApplicantsError] = React.useState<string | null>(
    null,
  );

  const loadActiveMatches = React.useCallback(
    async (refreshing = false) => {
      if (refreshing) {
        setMatchesRefreshing(true);
      } else {
        setMatchesLoading(true);
      }
      setMatchesError(null);

      try {
        const activeMatches = await getActiveMatches();
        setMatches(
          activeMatches
            .map((match) => mapActiveMatchToItem(match, currentUserProfile))
            .filter(isMatchItem),
        );
      } catch (error) {
        setMatchesError(
          error instanceof Error
            ? error.message
            : "Failed to load active matches.",
        );
      } finally {
        if (refreshing) {
          setMatchesRefreshing(false);
        } else {
          setMatchesLoading(false);
        }
      }
    },
    [currentUserProfile],
  );

  React.useEffect(() => {
    if (currentUserProfile) return;

    let isMounted = true;
    getMyProfile()
      .then((profile) => {
        if (isMounted) setCurrentUserProfile(profile);
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [currentUserProfile, setCurrentUserProfile]);

  React.useEffect(() => {
    if (initialMatches) return;
    void loadActiveMatches();
  }, [initialMatches, loadActiveMatches]);

  const matchesWithApplicantCount = React.useMemo(
    () =>
      matches.map((match) =>
        match.role === "HOST"
          ? {
              ...match,
              applicantCount:
                applicantsByMatch[match.id]?.filter(
                  (a) => a.status === "pending",
                ).length ?? match.applicantCount ?? 0,
            }
          : match,
      ),
    [applicantsByMatch, matches],
  );

  const filtered = React.useMemo(
    () =>
      matchesWithApplicantCount.filter((m) => {
        if (m.status !== "IN_PROGRESS" && m.status !== "PENDING") return false;
        if (m.sourceType === "PARTNER" && m.status === "PENDING") return false;
        if (sourceFilter === "일반 매칭" && m.sourceType !== "POST") return false;
        if (sourceFilter === "퀵 매치" && m.sourceType !== "PARTNER") return false;
        if (statusFilter === "진행중" && m.status !== "IN_PROGRESS") return false;
        if (statusFilter === "수락 대기" && m.status !== "PENDING") return false;
        return true;
      }),
    [matchesWithApplicantCount, sourceFilter, statusFilter],
  );

  const isAllSelected = sourceFilter === null && statusFilter === null;

  const panelApplicants = panelMatchId
    ? (applicantsByMatch[panelMatchId] ?? [])
    : [];

  const loadApplicants = React.useCallback(async (matchId: string) => {
    const gatheringId = Number(matchId);
    if (!Number.isFinite(gatheringId)) return;

    setApplicantsLoading(true);
    setApplicantsError(null);

    try {
      const participants = await getGatheringParticipants(gatheringId);
      setApplicantsByMatch((prev) => ({
        ...prev,
        [matchId]: participants.map(mapParticipantToApplicant),
      }));
    } catch (error) {
      setApplicantsError(
        error instanceof Error
          ? error.message
          : "신청자 목록을 불러오지 못했습니다.",
      );
    } finally {
      setApplicantsLoading(false);
    }
  }, []);

  const handleViewProfile = (item: MatchItem) => {
    setProfileModal({
      item,
      data: {
        name: item.partnerName,
        department: item.partnerDepartment,
        studentId: item.partnerStudentNumber,
        profileImageUrl: item.partnerProfileImageUrl,
        isVerified: item.partnerIsVerified,
        partnerStyle: item.partnerStyle,
        exerciseIntensity: item.partnerExerciseIntensity,
        exerciseReason: item.partnerExerciseReason,
        exerciseTypes:
          item.partnerExerciseTypes ??
          (item.exerciseType ? [item.exerciseType] : undefined),
        mannerTemperature: item.partnerMannerTemperature,
        matchCount: item.partnerMatchCount,
        noShowCount: item.partnerNoShowCount,
        matchStatus: item.status,
      },
    });
  };

  const handleViewApplicants = (matchId: string) => {
    setPanelMatchId(matchId);
    void loadApplicants(matchId);
  };

  const handleAccept = async (applicantId: string) => {
    if (!panelMatchId) return;
    try {
      await acceptParticipant(Number(panelMatchId), Number(applicantId));
      setApplicantsByMatch((prev) => ({
        ...prev,
        [panelMatchId]: (prev[panelMatchId] ?? []).filter(
          (applicant) => applicant.id !== applicantId,
        ),
      }));
    } catch (error) {
      Alert.alert(
        "신청 수락 실패",
        error instanceof Error ? error.message : "다시 시도해주세요.",
      );
    }
  };

  const handleReject = async (applicantId: string) => {
    if (!panelMatchId) return;
    try {
      await rejectParticipant(Number(panelMatchId), Number(applicantId));
      setApplicantsByMatch((prev) => ({
        ...prev,
        [panelMatchId]: (prev[panelMatchId] ?? []).filter(
          (applicant) => applicant.id !== applicantId,
        ),
      }));
    } catch (error) {
      Alert.alert(
        "신청 거절 실패",
        error instanceof Error ? error.message : "다시 시도해주세요.",
      );
    }
  };

  const handleComplete = async (item: MatchItem) => {
    try {
      if (item.sourceType === "POST") {
        await completeGathering(Number(item.id));
      }
      setMatches((prev) => prev.filter((match) => match.id !== item.id));
      setCompletedGatheringId(item.id);
    } catch (error) {
      Alert.alert(
        "완료 처리 실패",
        error instanceof Error ? error.message : "다시 시도해주세요.",
      );
    }
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <View style={styles.backButton} />
          <Text pointerEvents="none" style={styles.headerTitle}>매칭 현황</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open profile"
            onPress={() => router.push("/mypage" as any)}
            style={styles.myButton}
          >
            <Text style={styles.myButtonText}>MY</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={matchesRefreshing}
            onRefresh={() => void loadActiveMatches(true)}
          />
        }
      >
        {/* 필터 */}
        <ScrollView
          horizontal
          bounces={false}
          overScrollMode="never"
          showsHorizontalScrollIndicator={false}
          style={styles.filterScrollView}
          contentContainerStyle={styles.filterRow}
        >
          <Pressable
            accessibilityRole="button"
            style={[
              styles.filterChip,
              isAllSelected && styles.filterChipActive,
            ]}
            onPress={() => {
              setSourceFilter(null);
              setStatusFilter(null);
            }}
          >
            <Text
              style={[
                styles.filterChipText,
                isAllSelected && styles.filterChipTextActive,
              ]}
            >
              전체
            </Text>
          </Pressable>
          {SOURCE_FILTERS.map((f) => {
            const selected = sourceFilter === f;
            const isMint = f === "일반 매칭";
            return (
              <Pressable
                key={f}
                accessibilityRole="button"
                style={[
                  styles.filterChip,
                  isMint ? styles.filterChipMint : null,
                  selected && (isMint ? styles.filterChipActiveMint : styles.filterChipActive),
                ]}
                onPress={() => setSourceFilter(selected ? null : f)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selected && styles.filterChipTextActive,
                  ]}
                >
                  {f}
                </Text>
              </Pressable>
            );
          })}
          {STATUS_FILTERS.map((f) => {
            const selected = statusFilter === f;
            return (
              <Pressable
                key={f}
                accessibilityRole="button"
                style={[styles.filterChip, selected && styles.filterChipActive]}
                onPress={() => setStatusFilter(selected ? null : f)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selected && styles.filterChipTextActive,
                  ]}
                >
                  {f}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* 카드 목록 */}
        {matchesLoading ? (
          <View style={styles.empty}>
            <ActivityIndicator color="#4C5BE2" />
            <Text style={styles.emptyText}>매칭 현황을 불러오고 있어요.</Text>
          </View>
        ) : matchesError ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{matchesError}</Text>
            <Pressable
              accessibilityRole="button"
              style={[styles.retryButton]}
              onPress={() => void loadActiveMatches()}
            >
              <Text style={styles.retryButtonText}>다시 시도</Text>
            </Pressable>
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>해당하는 매칭이 없어요.</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {filtered.map((item) => (
              <MatchStatusCard
                key={item.id}
                item={item}
                onComplete={
                  item.sourceType === "POST"
                    ? () => handleComplete(item)
                    : undefined
                }
                onChat={
                  item.chatRoomId
                    ? () => router.push(`/chat/${item.chatRoomId}` as any)
                    : undefined
                }
                onViewApplicants={
                  item.sourceType === "POST" && item.role === "HOST"
                    ? () => handleViewApplicants(item.id)
                    : undefined
                }
                onViewProfile={() => handleViewProfile(item)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <ApplicantPanel
        visible={panelMatchId !== null}
        applicants={panelApplicants}
        loading={applicantsLoading}
        errorMessage={applicantsError}
        onClose={() => setPanelMatchId(null)}
        onAccept={handleAccept}
        onReject={handleReject}
        onRetry={panelMatchId ? () => void loadApplicants(panelMatchId) : undefined}
      />
      <WorkoutCompleteModal
        visible={completedGatheringId !== null}
        onLaterPress={() => setCompletedGatheringId(null)}
        onReviewPress={() => {
          if (!completedGatheringId) return;
          const targetId = completedGatheringId;
          setCompletedGatheringId(null);
          router.push(`/review/${targetId}?type=gathering` as any);
        }}
      />
      {profileModal && (
        <OpponentProfileModal
          visible
          data={profileModal.data}
          onClose={() => setProfileModal(null)}
          onComplete={
            profileModal.item.sourceType === "POST" &&
            profileModal.item.status === "IN_PROGRESS"
              ? () => {
                  setProfileModal(null);
                  void handleComplete(profileModal.item);
                }
              : undefined
          }
          onChat={
            profileModal.item.chatRoomId
              ? () => {
                  setProfileModal(null);
                  router.push(`/chat/${profileModal.item.chatRoomId}` as any);
                }
              : undefined
          }
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 16,
  },

  /* 헤더 */
  headerContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  headerRow: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  headerTitle: {
    position: "absolute",
    left: 0,
    right: 0,
    alignSelf: "center",
    fontSize: 20,
    lineHeight: 28,
    color: "#111827",
    fontWeight: "800",
    textAlign: "center",
  },
  myButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  myButtonText: {
    fontSize: 16,
    lineHeight: 18,
    color: "#111111",
    fontWeight: "900",
  },

  /* 필터 */
  filterScrollView: {
    flexGrow: 0,
    marginHorizontal: -16,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  filterChip: {
    minHeight: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#4C5BE2",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 9,
  },
  filterChipActive: {
    backgroundColor: "#4C5BE2",
  },
  filterChipMint: {
    borderColor: "#10B981",
  },
  filterChipActiveMint: {
    backgroundColor: "#10B981",
  },
  filterChipText: {
    fontSize: 12,
    lineHeight: 16,
    color: "#070322",
    fontWeight: "700",
  },
  filterChipTextActive: {
    color: "#FFFFFF",
  },

  /* 목록 */
  list: {
    gap: 16,
  },
  empty: {
    alignItems: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#9CA3AF",
    fontWeight: "600",
  },
  retryButton: {
    minHeight: 36,
    borderRadius: 8,
    backgroundColor: "#4C5BE2",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  retryButtonText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#FFFFFF",
    fontWeight: "800",
  },
});
