import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Pressable,
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
import type { GatheringParticipant } from "@/types/domain/gathering";

const SOURCE_FILTERS = ["일반 매칭", "퀵 매치"] as const;
const STATUS_FILTERS = ["진행중", "수락 대기"] as const;

type SourceFilter = (typeof SOURCE_FILTERS)[number] | null;
type StatusFilter = (typeof STATUS_FILTERS)[number] | null;

type MatchStatusScreenProps = {
  initialMatches?: MatchItem[];
  initialApplicantsByMatch?: Record<string, Applicant[]>;
};

const MOCK_MATCHES: MatchItem[] = [
  {
    id: "1",
    sourceType: "POST",
    status: "IN_PROGRESS",
    role: "GUEST",
    partnerName: "김단국",
    partnerDepartment: "컴퓨터공학과",
    partnerStudentNumber: "20학번",
    location: "체육관",
    scheduledTime: "19:00 ~ 21:00",
    scheduledEndAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    difficulty: "초보자",
    exerciseType: "풋살",
    chatRoomId: 1,
    partnerIsVerified: true,
    partnerMannerTemperature: 92,
    partnerMatchCount: 18,
    partnerNoShowCount: 0,
    partnerStyle: "독립형",
    partnerExerciseIntensity: "꾸준형",
    partnerExerciseReason: "건강관리",
    partnerExerciseTypes: ["풋살", "헬스", "러닝", "배드민턴", "농구"],
  },
  {
    id: "2",
    sourceType: "PARTNER",
    status: "IN_PROGRESS",
    role: "GUEST",
    partnerName: "김단국",
    partnerDepartment: "컴퓨터공학과",
    partnerStudentNumber: "21학번",
    matchedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    chatRoomId: 2,
    partnerIsVerified: false,
    partnerMannerTemperature: 65,
    partnerMatchCount: 7,
    partnerNoShowCount: 1,
    partnerStyle: "소통형",
    partnerExerciseIntensity: "강도형",
    partnerExerciseReason: "다이어트",
    partnerExerciseTypes: ["헬스", "러닝"],
  },
  {
    id: "3",
    sourceType: "POST",
    status: "PENDING",
    role: "GUEST",
    partnerName: "김단국",
    partnerDepartment: "컴퓨터공학과",
    partnerStudentNumber: "20학번",
    location: "체육관",
    scheduledTime: "19:00 ~ 21:00",
    difficulty: "초보자",
    exerciseType: "풋살",
  },
  {
    id: "4",
    sourceType: "POST",
    status: "PENDING",
    role: "HOST",
    partnerName: "김단국",
    partnerDepartment: "컴퓨터공학과",
    partnerStudentNumber: "22학번",
    location: "체육관",
    scheduledTime: "19:00 ~ 21:00",
    difficulty: "초보자",
    exerciseType: "풋살",
  },
];

const MOCK_APPLICANTS: Record<string, Applicant[]> = {
  "4": [
    {
      id: "a1",
      name: "이서윤",
      department: "체육교육과",
      studentNumber: "20230042",
      tags: ["아침형", "기초체력"],
      trustScore: 42.5,
      status: "pending",
    },
    {
      id: "a2",
      name: "박지훈",
      department: "소프트웨어학과",
      studentNumber: "20220198",
      tags: ["저녁형", "다이어트"],
      trustScore: 36.0,
      status: "pending",
    },
    {
      id: "a3",
      name: "최민준",
      department: "스포츠과학과",
      studentNumber: "20210355",
      tags: ["주말형", "근력"],
      trustScore: 58.0,
      status: "pending",
    },
  ],
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

export default function MatchStatusScreen({
  initialMatches = MOCK_MATCHES,
  initialApplicantsByMatch = MOCK_APPLICANTS,
}: MatchStatusScreenProps) {
  const [sourceFilter, setSourceFilter] = React.useState<SourceFilter>(null);
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>(null);
  const [panelMatchId, setPanelMatchId] = React.useState<string | null>(null);
  const [profileModal, setProfileModal] = React.useState<{
    data: OpponentProfileData;
    item: MatchItem;
  } | null>(null);
  const [matches, setMatches] = React.useState<MatchItem[]>(initialMatches);
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

  const matchesWithApplicantCount = React.useMemo(
    () =>
      matches.map((match) =>
        match.role === "HOST"
          ? {
              ...match,
              applicantCount:
                applicantsByMatch[match.id]?.filter(
                  (a) => a.status === "pending",
                ).length ?? 0,
            }
          : match,
      ),
    [applicantsByMatch, matches],
  );

  const filtered = React.useMemo(
    () =>
      matchesWithApplicantCount.filter((m) => {
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
        [panelMatchId]: (prev[panelMatchId] ?? []).map((applicant) =>
          applicant.id === applicantId
            ? { ...applicant, status: "accepted" }
            : applicant,
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
        [panelMatchId]: (prev[panelMatchId] ?? []).map((applicant) =>
          applicant.id === applicantId
            ? { ...applicant, status: "rejected" }
            : applicant,
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
      setMatches((prev) =>
        prev.map((match) =>
          match.id === item.id ? { ...match, status: "COMPLETED" } : match,
        ),
      );
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
        {filtered.length === 0 ? (
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
                onViewApplicants={() => handleViewApplicants(item.id)}
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
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#9CA3AF",
    fontWeight: "600",
  },
});
