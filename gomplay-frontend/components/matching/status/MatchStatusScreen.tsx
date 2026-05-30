import { router, useFocusEffect } from "expo-router";
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
import WorkoutCompleteModal from "@/components/matching/WorkoutCompleteModal";
import {
  acceptParticipant,
  completeGathering,
  getGatheringParticipants,
  rejectParticipant,
} from "@/services/gathering/gatheringService";
import { getActiveMatches, patchCompleteMatch } from "@/services/matching/matchingService";
import { getMyProfile } from "@/services/user/userService";
import { useUserStore } from "@/stores/user/userStore";
import { parseToKST } from "@/lib/utils/time";
import type { GatheringParticipant } from "@/types/domain/gathering";
import type { ActiveMatch } from "@/types/domain/match";
import type { UserProfile } from "@/types/domain/user";

const SOURCE_FILTERS = ["운동 모집", "퀵 매치"] as const;
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
  if (normalized === "ACCEPTED") return "ACCEPTED";
  if (normalized === "IN_PROGRESS" || normalized === "CLOSED") return "IN_PROGRESS";
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
  department: participant.department ?? "",
  studentNumber: participant.studentNumber ?? "",
  tags: [],
  trustScore: getParticipantMannerTemperature(participant),
  status: participantStatusToApplicantStatus(participant.status),
});

const formatScheduledDate = (value: string | null | undefined): string | undefined => {
  if (!value) return undefined;
  const date = parseToKST(value);
  if (Number.isNaN(date.getTime())) return undefined;
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}.${day}`;
};

const formatTimeRange = (
  startAt?: string | null,
  endAt?: string | null,
): string | undefined => {
  if (!startAt) return undefined;

  const formatTime = (value: string) => {
    const date = parseToKST(value);
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
  const isHost = isGathering && role === "HOST";

  // 운동 모집은 항상 HOST 기준 정보를 표시한다.
  // HOST일 때: hostName → 내 프로필 (partnerName은 게스트이므로 건너뜀)
  // GUEST일 때: hostName → partnerName (게스트 입장에서 partner = 호스트)
  const displayName = isGathering
    ? isHost
      ? getDisplayValue(match.hostName, currentUserProfile?.name)
      : getDisplayValue(match.hostName, match.partnerName)
    : match.partnerName;
  const displayProfileImageUrl = isGathering
    ? isHost
      ? getDisplayValue(match.hostProfileImageUrl, currentUserProfile?.profileImageUrl)
      : getDisplayValue(match.hostProfileImageUrl, match.partnerProfileImageUrl)
    : match.partnerProfileImageUrl;
  const displayDepartment = isGathering
    ? isHost
      ? getDisplayValue(match.hostDepartment, currentUserProfile?.department)
      : getDisplayValue(match.hostDepartment, match.partnerDepartment)
    : match.partnerDepartment;
  const displayStudentNumber = isGathering
    ? isHost
      ? getDisplayValue(match.hostStudentNumber, currentUserProfile?.studentId)
      : getDisplayValue(match.hostStudentNumber, match.partnerStudentNumber)
    : match.partnerStudentNumber;

  const revieweeId = isGathering
    ? (isHost ? (match.partnerUserId ?? null) : (match.hostUserId ?? null))
    : (match.partnerUserId ?? null);

  return {
    id: String(match.id),
    sourceType,
    status,
    role,
    canComplete: match.canComplete,
    canCompleteReason: match.canCompleteReason ?? null,
    reviewed: match.reviewed,
    revieweeId,
    partnerName: displayName ?? "",
    partnerProfileImageUrl: displayProfileImageUrl,
    partnerDepartment: displayDepartment ?? undefined,
    partnerStudentNumber: formatStudentNumber(displayStudentNumber),
    location: match.location ?? undefined,
    scheduledDate: formatScheduledDate(match.scheduledAt),
    scheduledTime:
      match.scheduledTime ??
      formatTimeRange(match.scheduledAt, match.scheduledEndAt),
    scheduledAt: match.scheduledAt ?? undefined,
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
  const [matches, setMatches] = React.useState<MatchItem[]>(
    initialMatches ?? [],
  );
  const [matchesLoading, setMatchesLoading] = React.useState(!initialMatches);
  const [matchesRefreshing, setMatchesRefreshing] = React.useState(false);
  const [matchesError, setMatchesError] = React.useState<string | null>(null);
  const [completedItem, setCompletedItem] = React.useState<MatchItem | null>(null);
  // 완료 버튼을 누른 매치 ID를 로컬에서 추적 (앱 재시작 전까지 "대기 중" 표시용)
  const [completedByMeIds, setCompletedByMeIds] = React.useState<Set<string>>(new Set());
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
        const seen = new Set<number>();
        const deduped = activeMatches.filter((m) => {
          if (seen.has(m.id)) return false;
          seen.add(m.id);
          return true;
        });
        setMatches(deduped.map((match) => mapActiveMatchToItem(match, currentUserProfile)).filter(isMatchItem));
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

  const hasMountedRef = React.useRef(false);

  useFocusEffect(
    React.useCallback(() => {
      if (initialMatches) return;
      if (!hasMountedRef.current) {
        hasMountedRef.current = true;
        void loadActiveMatches();
      } else {
        void loadActiveMatches(true);
      }
    }, [initialMatches, loadActiveMatches]),
  );

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
    () => {
      const now = Date.now();
      return matchesWithApplicantCount.filter((m) => {
        if (m.status !== "IN_PROGRESS" && m.status !== "PENDING" && m.status !== "ACCEPTED") {
          return false;
        }
        if (m.sourceType === "PARTNER" && m.status === "PENDING") {
          return false;
        }
        if (m.status === "PENDING" && m.sourceType === "POST") {
          const expiryTime =
            m.scheduledAt
              ? new Date(m.scheduledAt).getTime()
              : m.scheduledEndAt
                ? new Date(m.scheduledEndAt).getTime()
                : null;
          if (expiryTime !== null && expiryTime < now) {
            return false;
          }
        }
        if (sourceFilter === "운동 모집" && m.sourceType !== "POST") return false;
        if (sourceFilter === "퀵 매치" && m.sourceType !== "PARTNER") return false;
        if (statusFilter === "진행중" && m.status !== "IN_PROGRESS") return false;
        if (statusFilter === "수락 대기" && m.status !== "PENDING") return false;
        return true;
      }).sort((a, b) => {
        const timeA = a.matchedAt ? new Date(a.matchedAt).getTime()
          : a.scheduledAt ? new Date(a.scheduledAt).getTime()
          : Number(a.id);
        const timeB = b.matchedAt ? new Date(b.matchedAt).getTime()
          : b.scheduledAt ? new Date(b.scheduledAt).getTime()
          : Number(b.id);
        return timeB - timeA;
      });
    },
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
        [matchId]: participants
          .filter((p) => p.status === "PENDING")
          .map(mapParticipantToApplicant),
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
        setCompletedItem(item);
      } else {
        const result = await patchCompleteMatch(Number(item.id));
        if (result.status === "COMPLETED") {
          setCompletedItem(item);
        }
      }
      setCompletedByMeIds((prev) => new Set(prev).add(item.id));
      void loadActiveMatches(true);
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
            const isMint = f === "운동 모집";
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
                completedByMe={completedByMeIds.has(item.id)}
                onComplete={() => handleComplete(item)}
                onChat={
                  item.chatRoomId
                    ? () =>
                        item.sourceType === "POST"
                          ? router.push(`/group-chat/${item.chatRoomId}` as any)
                          : router.push(`/chat/${item.chatRoomId}` as any)
                    : undefined
                }
                onViewApplicants={
                  item.sourceType === "POST" && item.role === "HOST"
                    ? () => handleViewApplicants(item.id)
                    : undefined
                }
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
        visible={completedItem !== null}
        onLaterPress={() => setCompletedItem(null)}
        onReviewPress={() => {
          if (!completedItem) return;
          const item = completedItem;
          setCompletedItem(null);
          if (item.sourceType === "POST") {
            router.push(`/review/gathering/${item.id}` as any);
          } else {
            const params = new URLSearchParams({ type: "partner" });
            if (item.revieweeId) params.set("revieweeId", String(item.revieweeId));
            if (item.partnerName) params.set("partnerName", item.partnerName);
            if (item.partnerProfileImageUrl) params.set("partnerProfileImageUrl", item.partnerProfileImageUrl);
            if (item.partnerDepartment) params.set("partnerDepartment", item.partnerDepartment);
            if (item.partnerStudentNumber) params.set("partnerStudentId", item.partnerStudentNumber);
            if (item.exerciseType) params.set("exerciseTypes", item.exerciseType);
            if (item.scheduledTime) params.set("scheduledTime", item.scheduledTime);
            router.push(`/review/${item.id}?${params.toString()}` as any);
          }
        }}
      />
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
  headerTitle: {
    flex: 1,
    fontSize: 20,
    lineHeight: 28,
    color: "#111827",
    fontWeight: "800",
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
