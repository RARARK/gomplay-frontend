import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import ApplicantPanel, {
  type Applicant,
} from "@/components/matching/status/ApplicantPanel";
import MatchStatusCard, {
  type MatchItem,
} from "@/components/matching/status/MatchStatusCard";

const SOURCE_FILTERS = ["운동 모집", "파트너 모집"] as const;
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
    location: "체육관",
    scheduledTime: "19:00",
    difficulty: "초보자",
    exerciseType: "풋살",
  },
  {
    id: "2",
    sourceType: "PARTNER",
    status: "IN_PROGRESS",
    role: "GUEST",
    partnerName: "김단국",
    partnerDepartment: "컴퓨터공학과",
    location: "장소 협의",
    scheduledTime: "시간 협의",
    difficulty: "입문자",
    exerciseType: "종목 협의",
  },
  {
    id: "3",
    sourceType: "POST",
    status: "PENDING",
    role: "GUEST",
    partnerName: "김단국",
    partnerDepartment: "컴퓨터공학과",
    location: "체육관",
    scheduledTime: "19:00",
    difficulty: "초보자",
    exerciseType: "풋살",
  },
  {
    id: "4",
    sourceType: "PARTNER",
    status: "PENDING",
    role: "HOST",
    partnerName: "김단국",
    partnerDepartment: "컴퓨터공학과",
    location: "장소 협의",
    scheduledTime: "시간 협의",
    difficulty: "입문자",
    exerciseType: "종목 협의",
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

export default function MatchStatusScreen({
  initialMatches = MOCK_MATCHES,
  initialApplicantsByMatch = MOCK_APPLICANTS,
}: MatchStatusScreenProps) {
  const [sourceFilter, setSourceFilter] = React.useState<SourceFilter>(null);
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>(null);
  const [panelMatchId, setPanelMatchId] = React.useState<string | null>(null);
  const [matches] = React.useState<MatchItem[]>(initialMatches);
  const [applicantsByMatch, setApplicantsByMatch] = React.useState<
    Record<string, Applicant[]>
  >(initialApplicantsByMatch);

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
        if (sourceFilter === "운동 모집" && m.sourceType !== "POST")
          return false;
        if (sourceFilter === "파트너 모집" && m.sourceType !== "PARTNER")
          return false;
        if (statusFilter === "진행중" && m.status !== "IN_PROGRESS")
          return false;
        if (statusFilter === "수락 대기" && m.status !== "PENDING")
          return false;
        return true;
      }),
    [matchesWithApplicantCount, sourceFilter, statusFilter],
  );

  const isAllSelected = sourceFilter === null && statusFilter === null;

  const panelApplicants = panelMatchId
    ? (applicantsByMatch[panelMatchId] ?? [])
    : [];

  const handleAccept = (applicantId: string) => {
    if (!panelMatchId) return;
    setApplicantsByMatch((prev) => ({
      ...prev,
      [panelMatchId]: (prev[panelMatchId] ?? []).filter(
        (a) => a.id !== applicantId,
      ),
    }));
  };

  const handleReject = (applicantId: string) => {
    if (!panelMatchId) return;
    setApplicantsByMatch((prev) => ({
      ...prev,
      [panelMatchId]: (prev[panelMatchId] ?? []).filter(
        (a) => a.id !== applicantId,
      ),
    }));
  };

  return (
    <>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View style={styles.headerRow}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={28} color="#111111" />
          </Pressable>
          <Text style={styles.headerTitle}>매칭 현황</Text>
          <View style={styles.headerSpacer} />
        </View>

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
            return (
              <Pressable
                key={f}
                accessibilityRole="button"
                style={[styles.filterChip, selected && styles.filterChipActive]}
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
                onComplete={() => {}}
                onChat={() => {}}
                onViewApplicants={() => setPanelMatchId(item.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <ApplicantPanel
        visible={panelMatchId !== null}
        applicants={panelApplicants}
        onClose={() => setPanelMatchId(null)}
        onAccept={handleAccept}
        onReject={handleReject}
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
    paddingTop: 8,
    paddingBottom: 32,
    gap: 16,
  },

  /* 헤더 */
  headerRow: {
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
  },
  headerTitle: {
    fontSize: 20,
    lineHeight: 28,
    color: "#111827",
    fontWeight: "800",
  },
  headerSpacer: {
    width: 40,
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
