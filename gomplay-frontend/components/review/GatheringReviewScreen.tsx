import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import PartnerReviewScreen from "@/components/review/PartnerReviewScreen";
import ReviewCompleteScreen from "@/components/review/ReviewCompleteScreen";
import { getReviewableGatheringParticipants } from "@/services/gathering/gatheringService";
import { useChatStore } from "@/stores/chat/chatStore";

// ─── Types ────────────────────────────────────────────────────────────────────

type Participant = {
  userId: number;
  name: string;
  info: string;
  profileImageUrl: string | null;
  reviewed: boolean;
};

type Screen = "list" | "review" | "allDone" | "skipped";

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ uri, size = 48 }: { uri?: string | null; size?: number }) {
  return (
    <View style={[styles.avatarWrap, { width: size, height: size, borderRadius: size / 2 }]}>
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} contentFit="cover" />
      ) : (
        <Text style={{ fontSize: size * 0.42 }}>🧑</Text>
      )}
    </View>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function GatheringReviewScreen({
  gatheringId,
}: {
  gatheringId: number;
}) {
  const dismissGatheringReview = useChatStore((s) => s.dismissGatheringReview);

  const [screen, setScreen]             = useState<Screen>("list");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selected, setSelected]         = useState<Participant | null>(null);
  const [justReviewedName, setJustReviewedName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setErrorMessage(null);

    getReviewableGatheringParticipants(gatheringId)
      .then((items) => {
        if (!mounted) return;
        const nextParticipants = items.map((participant) => ({
          userId: participant.userId,
          name: participant.name,
          info: [participant.department, participant.studentNumber]
            .filter(Boolean)
            .join(" · "),
          profileImageUrl: participant.profileImageUrl,
          reviewed: participant.reviewed,
        }));

        setParticipants(nextParticipants);
        if (nextParticipants.length === 0 || nextParticipants.every((p) => p.reviewed)) {
          setScreen("allDone");
        }
      })
      .catch((error) => {
        if (!mounted) return;
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "평가 가능한 참여자 목록을 불러올 수 없습니다.",
        );
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [gatheringId]);

  const reviewedCount = participants.filter((p) => p.reviewed).length;
  const total         = participants.length;

  const openReview = (p: Participant) => {
    setSelected(p);
    setScreen("review");
  };

  const handleReviewComplete = () => {
    if (!selected) return;
    const updated = participants.map((p) =>
      p.userId === selected.userId ? { ...p, reviewed: true } : p,
    );
    setParticipants(updated);
    setJustReviewedName(selected.name);
    const allDone = updated.every((p) => p.reviewed);
    if (allDone) dismissGatheringReview(gatheringId);
    setScreen(allDone ? "allDone" : "list");
  };

  const handleBack = () => setScreen("list");

  // ── Skipped screen ───────────────────────────────────────────────────────

  if (screen === "skipped") {
    return (
      <ReviewCompleteScreen
        participants={participants.map((p) => ({ name: p.name, profileImageUrl: p.profileImageUrl }))}
        onConfirm={() => {
          dismissGatheringReview(gatheringId);
          router.replace("/(tabs)" as any);
        }}
      />
    );
  }

  // ── Review screen (기존 PartnerReviewScreen 사용) ─────────────────────────

  if (screen === "review" && selected) {
    return (
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <PartnerReviewScreen
          gatheringId={gatheringId}
          revieweeId={selected.userId}
          partnerName={selected.name}
          partnerProfileImageUrl={selected.profileImageUrl}
          exerciseTypes={selected.info.split(" · ")[0]}
          onBack={handleBack}
          onComplete={handleReviewComplete}
        />
      </KeyboardAvoidingView>
    );
  }

  // ── All done screen ───────────────────────────────────────────────────────

  if (screen === "allDone") {
    return (
      <View style={styles.flex}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={10}>
            <Ionicons name="chevron-back" size={28} color="#111111" />
          </Pressable>
          <Text style={styles.headerTitle}>파트너 평가하기</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <View style={styles.doneCircle}>
              <Ionicons name="checkmark" size={44} color="#fff" />
            </View>
            <Text style={styles.heroTitle}>모든 파트너 평가가 완료되었어요!</Text>
            <Text style={styles.heroSub}>오늘도 좋은 운동 함께해주셔서 감사합니다 😊</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>참가자 {total}명</Text>
              <Text style={[styles.progressText, { color: "#10B981" }]}>{total}/{total}명 평가 완료</Text>
            </View>
            {participants.map((p) => (
              <ParticipantRow key={p.userId} participant={p} onPress={undefined} />
            ))}
          </View>

          <Pressable onPress={() => router.replace("/matches/history" as any)} style={styles.doneBtn}>
            <Text style={styles.doneBtnText}>매치 내역으로 이동</Text>
          </Pressable>
        </ScrollView>
      </View>
    );
  }

  // ── List screen ───────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <View style={[styles.flex, styles.centerContent]}>
        <ActivityIndicator color="#4C5BE2" />
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.flex}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={10}>
            <Ionicons name="chevron-back" size={28} color="#111111" />
          </Pressable>
          <Text style={styles.headerTitle}>파트너 평가하기</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={10}>
          <Ionicons name="chevron-back" size={28} color="#111111" />
        </Pressable>
        <Text style={styles.headerTitle}>파트너 평가하기</Text>
        <Pressable
          onPress={() => setScreen("skipped")}
          style={styles.skipHeaderBtn}
          hitSlop={10}
        >
          <Text style={styles.skipHeaderText}>건너뛰기</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroEmoji}>
            <Text style={{ fontSize: 40 }}>👏</Text>
          </View>
          <Text style={styles.heroTitle}>운동이 완료되었어요!</Text>
          <Text style={styles.heroSub}>
            {justReviewedName
              ? `${justReviewedName}님 평가가 완료되었어요!\n다른 파트너도 평가해주세요.`
              : "함께 운동한 파트너들을 평가해주세요."}
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>참가자 {total}명</Text>
            <Text style={styles.progressText}>{reviewedCount}/{total}명 평가 완료</Text>
          </View>
          {participants.map((p) => (
            <ParticipantRow
              key={p.userId}
              participant={p}
              onPress={p.reviewed ? undefined : () => openReview(p)}
            />
          ))}
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteText}>
            평가는 상호 존중하는 운동 문화를 만들어요.{"\n"}
            솔직하고 따뜻한 평가를 부탁드려요! 😊
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── ParticipantRow ───────────────────────────────────────────────────────────

function ParticipantRow({
  participant: p,
  onPress,
}: {
  participant: Participant;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={[styles.participantRow, p.reviewed && styles.participantRowDone]}
    >
      <Avatar uri={p.profileImageUrl} size={48} />
      <View style={styles.participantInfo}>
        <Text style={styles.participantName}>{p.name}</Text>
        <Text style={styles.participantMeta}>{p.info}</Text>
      </View>
      {p.reviewed ? (
        <View style={styles.doneBadge}>
          <Ionicons name="checkmark" size={13} color="#10B981" />
          <Text style={styles.doneBadgeText}>평가 완료</Text>
        </View>
      ) : (
        <View style={styles.pendingBadge}>
          <Text style={styles.pendingBadgeText}>운동 완료</Text>
          <Ionicons name="chevron-forward" size={14} color="#F59E0B" />
        </View>
      )}
    </Pressable>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#fff" },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    color: "#6B7280",
    textAlign: "center",
  },

  /* 헤더 — PartnerReviewScreen 동일 스타일 */
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    lineHeight: 28,
    color: "#111827",
    fontWeight: "800",
    textAlign: "left",
  },
  headerSpacer: { width: 40 },
  skipHeaderBtn: {
    width: 64,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  skipHeaderText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#9CA3AF",
  },

  /* List */
  listContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40, gap: 24 },

  hero: { alignItems: "center", gap: 10 },
  heroEmoji: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: "#FEF3C7",
    alignItems: "center", justifyContent: "center",
    marginBottom: 4,
  },
  heroTitle: { fontSize: 20, fontWeight: "900", color: "#111827", textAlign: "center" },
  heroSub:   { fontSize: 14, fontWeight: "500", color: "#6B7280", textAlign: "center", lineHeight: 20 },

  doneCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: "#10B981",
    alignItems: "center", justifyContent: "center",
    marginBottom: 4,
  },

  section:       { gap: 10 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle:  { fontSize: 15, fontWeight: "800", color: "#111827" },
  progressText:  { fontSize: 13, fontWeight: "700", color: "#9CA3AF" },

  participantRow: {
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingHorizontal: 14, paddingVertical: 14,
    borderRadius: 14, borderWidth: 1, borderColor: "#E5E7EB",
    backgroundColor: "#fff",
  },
  participantRowDone: { backgroundColor: "#F9FAFB" },
  participantInfo:    { flex: 1 },
  participantName:    { fontSize: 15, fontWeight: "800", color: "#111827" },
  participantMeta:    { fontSize: 12, fontWeight: "500", color: "#9CA3AF", marginTop: 2 },

  pendingBadge:     { flexDirection: "row", alignItems: "center", gap: 2 },
  pendingBadgeText: { fontSize: 12, fontWeight: "700", color: "#F59E0B" },

  doneBadge:     { flexDirection: "row", alignItems: "center", gap: 3 },
  doneBadgeText: { fontSize: 12, fontWeight: "700", color: "#10B981" },

  noteCard: {
    backgroundColor: "#F9FAFB", borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 14,
  },
  noteText: { fontSize: 13, fontWeight: "500", color: "#6B7280", textAlign: "center", lineHeight: 20 },

  avatarWrap: { backgroundColor: "#EEF2FF", alignItems: "center", justifyContent: "center" },

  doneBtn: {
    height: 52, borderRadius: 14, backgroundColor: "#4C5BE2",
    alignItems: "center", justifyContent: "center",
  },
  doneBtnText: { fontSize: 16, fontWeight: "900", color: "#fff" },
});
