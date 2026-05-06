import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";


const POSITIVE_TRAITS = [
  { id: "punctual",  label: "시간 약속을 잘 지켰어요" },
  { id: "manner",   label: "운동 매너가 좋았어요" },
  { id: "kind",     label: "친절하고 배려가 깊었어요" },
  { id: "again",    label: "다음에도 같이 하고 싶어요" },
] as const;

const NEGATIVE_TRAITS = [
  { id: "late",     label: "시간 약속을 지키지 않았어요" },
  { id: "badmanner", label: "운동 매너가 좋지 않았어요" },
  { id: "unkind",   label: "불친절하고 배려가 부족했어요" },
  { id: "noagain",  label: "다음엔 같이 하고 싶지 않아요" },
] as const;

const REPORT_REASONS = [
  "허위 학교 인증",
  "욕설/괴롭힘",
  "불쾌한 행동",
  "위험한 행동",
  "금전 요구 / 사기",
  "기타",
] as const;

const FIXED_TEMPERATURE = 36.5;

// Mock — replace with API response keyed by matchId
const MOCK_PARTNER = {
  name: "김단국",
  department: "컴퓨터공학과",
  studentId: "23학번",
  location: "체육관",
  scheduledTime: "오늘 19:00 ~ 21:00",
  difficulty: "초보자",
  exerciseType: "풋살",
};

type Props = { matchId: string };


function TraitCheckbox({
  label,
  checked,
  onToggle,
  color = "#4C5BE2",
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
  color?: string;
}) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={onToggle}
      style={styles.traitRow}
    >
      <Ionicons
        name={checked ? "checkbox" : "square-outline"}
        size={22}
        color={checked ? color : "#9CA3AF"}
      />
      <Text style={[styles.traitLabel, checked && { color: "#111827" }]}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function PartnerReviewScreen({ matchId: _matchId }: Props) {
  const [selectedTraits, setSelectedTraits] = React.useState<Set<string>>(
    new Set(),
  );
  const [isNoShow, setIsNoShow] = React.useState(false);
  const [isReportExpanded, setIsReportExpanded] = React.useState(false);
  const [selectedReportReasons, setSelectedReportReasons] = React.useState<
    Set<(typeof REPORT_REASONS)[number]>
  >(new Set());
  const [reportDescription, setReportDescription] = React.useState("");
  const [comment, setComment] = React.useState("");

  const toggleTrait = (id: string) => {
    setSelectedTraits((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleReportReason = (reason: (typeof REPORT_REASONS)[number]) => {
    setSelectedReportReasons((prev) => {
      const next = new Set(prev);
      if (next.has(reason)) next.delete(reason);
      else next.add(reason);
      return next;
    });
  };

  const handleSubmit = () => {
    // TODO: API 연동
    if (isReportExpanded) {
      Alert.alert(
        "피드백 접수 완료",
        "남겨주신 문제 내용을 확인하고 매칭 품질 개선에 반영할게요.",
        [{ text: "확인", onPress: () => router.back() }],
      );
      return;
    }

    Alert.alert("평가 완료", "파트너 평가가 제출됐어요.", [
      { text: "확인", onPress: () => router.back() },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
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
          <Text style={styles.headerTitle}>파트너 평가하기</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* 파트너 정보 */}
        <View style={styles.partnerCard}>
          {/* 상단: 아바타 + 이름/학과/뱃지 */}
          <View style={styles.partnerTop}>
            <Image
              source={require("../../assets/match/Ellipse-12.png")}
              style={styles.avatar}
              contentFit="cover"
            />
            <View style={styles.partnerMeta}>
              <View style={styles.nameRowNew}>
                <Text style={styles.partnerName}>{MOCK_PARTNER.name}</Text>
                <View style={styles.completedBadge}>
                  <Ionicons name="checkmark" size={12} color="#16A34A" />
                  <Text style={styles.completedBadgeText}>운동 완료</Text>
                </View>
              </View>
              <Text style={styles.partnerDept}>
                {MOCK_PARTNER.department} · {MOCK_PARTNER.studentId}
              </Text>
              <View style={styles.chipRow}>
                <View style={styles.infoChip}>
                  <Text style={styles.infoChipText}>⚽ {MOCK_PARTNER.exerciseType}</Text>
                </View>
                <View style={styles.infoChip}>
                  <View style={styles.difficultyDot} />
                  <Text style={styles.infoChipText}>{MOCK_PARTNER.difficulty}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 하단: 장소 · 시간 */}
          <View style={styles.partnerDetailCol}>
            <View style={styles.partnerDetailRow}>
              <Ionicons name="location" size={15} color="#EF4444" />
              <Text style={styles.partnerDetailText}>{MOCK_PARTNER.location}</Text>
            </View>
            <View style={styles.partnerDetailRow}>
              <Ionicons name="time-outline" size={15} color="#6B7280" />
              <Text style={styles.partnerDetailText}>{MOCK_PARTNER.scheduledTime}</Text>
            </View>
          </View>
        </View>

        {/* 매너온도 */}
        <View style={styles.card}>
          <View style={styles.mannnerTitleRow}>
            <View>
              <Text style={styles.sectionTitle}>매너온도</Text>
              <Text style={styles.sectionSub}>함께 운동하기 좋았나요?</Text>
            </View>
            </View>

          <View style={styles.tempRow}>
            <Text style={styles.tempValue}>{FIXED_TEMPERATURE.toFixed(1)}°C</Text>
            <Ionicons name="happy-outline" size={30} color="#F59E0B" />
          </View>

          <View style={styles.tempTrack} pointerEvents="none">
            <View style={[styles.tempFill, { width: `${FIXED_TEMPERATURE}%` }]} />
            <View style={[styles.tempThumb, { left: `${FIXED_TEMPERATURE}%` }]} />
          </View>
          <View style={styles.tempLabels}>
            <Text style={styles.tempLabelText}>0°C</Text>
            <Text style={styles.tempLabelText}>100°C</Text>
          </View>

          {/* 호평 */}
          <View style={styles.traitGroup}>
            <View style={styles.traitGroupHeader}>
              <Ionicons name="thumbs-up" size={14} color="#4C5BE2" />
              <Text style={styles.traitGroupLabelPos}>좋았어요</Text>
            </View>
            <View style={styles.traitList}>
              {POSITIVE_TRAITS.map((trait) => (
                <TraitCheckbox
                  key={trait.id}
                  label={trait.label}
                  checked={selectedTraits.has(trait.id)}
                  onToggle={() => toggleTrait(trait.id)}
                  color="#4C5BE2"
                />
              ))}
            </View>
          </View>

          {/* 악평 */}
          <View style={styles.traitGroup}>
            <View style={styles.traitGroupHeader}>
              <Ionicons name="thumbs-down" size={14} color="#EF4444" />
              <Text style={styles.traitGroupLabelNeg}>아쉬웠어요</Text>
            </View>
            <View style={styles.traitList}>
              {NEGATIVE_TRAITS.map((trait) => (
                <TraitCheckbox
                  key={trait.id}
                  label={trait.label}
                  checked={selectedTraits.has(trait.id)}
                  onToggle={() => toggleTrait(trait.id)}
                  color="#EF4444"
                />
              ))}
            </View>
          </View>
        </View>

        {/* 노쇼 */}
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isNoShow }}
          style={styles.noShowRow}
          onPress={() => setIsNoShow((v) => !v)}
        >
          <Ionicons
            name={isNoShow ? "checkbox" : "square-outline"}
            size={22}
            color={isNoShow ? "#EF4444" : "#9CA3AF"}
          />
          <View style={styles.noShowTextCol}>
            <Text style={[styles.noShowLabel, isNoShow && styles.noShowLabelActive]}>
              상대가 약속 장소에 나타나지 않았어요.
            </Text>
            <Text style={styles.noShowHint}>
              노쇼에 체크하면 매너 온도에 반영될 수 있어요.
            </Text>
          </View>
        </Pressable>

        {/* 신고 */}
        <View
          style={[
            styles.reportCard,
            isReportExpanded && styles.reportCardExpanded,
          ]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded: isReportExpanded }}
            style={styles.reportHeader}
            onPress={() => setIsReportExpanded((v) => !v)}
          >
            <View style={styles.reportIconWrap}>
              <Ionicons name="warning-outline" size={20} color="#B45309" />
            </View>
            <View style={styles.reportHeaderText}>
              <Text style={styles.reportTitle}>문제가 있었나요?</Text>
              <Text style={styles.reportSubtitle}>
                부적절한 행동이나 허위 인증 등을 신고할 수 있어요.
              </Text>
            </View>
            <View style={styles.reportToggleButton}>
              <Ionicons
                name={isReportExpanded ? "chevron-up" : "chevron-down"}
                size={18}
                color="#6B7280"
              />
            </View>
          </Pressable>

          {isReportExpanded ? (
            <View style={styles.reportContent}>
              <View style={styles.reportDivider} />
              <View style={styles.reportReasonWrap}>
                {REPORT_REASONS.map((reason) => {
                  const selected = selectedReportReasons.has(reason);

                  return (
                    <Pressable
                      key={reason}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: selected }}
                      onPress={() => toggleReportReason(reason)}
                      style={[
                        styles.reportReasonChip,
                        selected && styles.reportReasonChipSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.reportReasonText,
                          selected && styles.reportReasonTextSelected,
                        ]}
                      >
                        {reason}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <TextInput
                style={styles.reportInput}
                placeholder="상황을 자세히 설명해주세요."
                placeholderTextColor="#9CA3AF"
                value={reportDescription}
                onChangeText={setReportDescription}
                multiline
                textAlignVertical="top"
              />
            </View>
          ) : null}
        </View>

        {/* 한 줄 후기 */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            한 줄 후기{" "}
            <Text style={styles.optional}>(선택)</Text>
          </Text>
          <TextInput
            style={styles.commentInput}
            placeholder="같이 운동해 본 느낌을 남길 수 있어요."
            placeholderTextColor="#9CA3AF"
            value={comment}
            onChangeText={setComment}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* 버튼 */}
        <View style={styles.buttonRow}>
          <Pressable
            accessibilityRole="button"
            style={styles.skipButton}
            onPress={() => router.back()}
          >
            <Text style={styles.skipButtonText}>건너뛰기</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>평가 완료</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flex: 1, backgroundColor: "#FFFFFF" },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
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
  headerSpacer: { width: 40 },

  /* 공통 카드 */
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    gap: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },

  /* 파트너 정보 */
  partnerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  partnerTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EEF2FF",
  },
  partnerMeta: {
    flex: 1,
    gap: 6,
    minWidth: 0,
  },
  nameRowNew: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  partnerName: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "800",
    color: "#111827",
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#DCFCE7",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  completedBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#16A34A",
  },
  partnerDept: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  chipRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 2,
  },
  infoChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#F3F4F6",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  difficultyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22C55E",
  },
  infoChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
  },
  partnerDetailCol: {
    gap: 6,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  partnerDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  partnerDetailText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },

  /* 매너온도 */
  mannnerTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },
  sectionSub: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
    marginTop: 2,
  },
  tempRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tempValue: {
    fontSize: 24,
    fontWeight: "900",
    color: "#F59E0B",
  },
  tempTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: "#FEF3C7",
    marginVertical: 10,
  },
  tempFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#F59E0B",
  },
  tempThumb: {
    position: "absolute",
    top: -7,
    marginLeft: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#F59E0B",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  tempLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  tempLabelText: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  traitGroup: {
    gap: 4,
  },
  traitGroupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingBottom: 2,
  },
  traitGroupLabelPos: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4C5BE2",
  },
  traitGroupLabelNeg: {
    fontSize: 12,
    fontWeight: "700",
    color: "#EF4444",
  },
  traitList: { gap: 2 },
  traitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 7,
  },
  traitLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },

  /* 노쇼 */
  noShowRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  noShowTextCol: {
    flex: 1,
    gap: 2,
  },
  noShowLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#9CA3AF",
    lineHeight: 18,
  },
  noShowLabelActive: { color: "#EF4444" },
  noShowHint: {
    fontSize: 11,
    fontWeight: "500",
    color: "#D1D5DB",
    lineHeight: 16,
  },

  /* 신고 */
  reportCard: {
    backgroundColor: "#FFFCF7",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FDE8C7",
    padding: 14,
    elevation: 2,
    shadowColor: "#92400E",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  reportCardExpanded: {
    borderColor: "#F6D7A8",
  },
  reportHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  reportIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
  },
  reportHeaderText: {
    flex: 1,
    gap: 3,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#78350F",
  },
  reportSubtitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#78716C",
    lineHeight: 17,
  },
  reportToggleButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F3E4D0",
  },
  reportContent: {
    gap: 12,
    paddingTop: 12,
  },
  reportDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#F1DFC4",
  },
  reportReasonWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  reportReasonChip: {
    minHeight: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#E7D8C5",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  reportReasonChipSelected: {
    borderColor: "#B45309",
    backgroundColor: "#FFF7ED",
  },
  reportReasonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#57534E",
  },
  reportReasonTextSelected: {
    color: "#92400E",
  },
  reportInput: {
    minHeight: 88,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E7D8C5",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 14,
    color: "#111827",
    lineHeight: 20,
  },

  /* 한 줄 후기 */
  optional: {
    fontSize: 13,
    fontWeight: "500",
    color: "#9CA3AF",
  },
  commentInput: {
    minHeight: 80,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 14,
    color: "#111827",
    lineHeight: 20,
  },

  /* 버튼 */
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  skipButton: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  skipButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#6B7280",
  },
  submitButton: {
    flex: 2,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#4C5BE2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    elevation: 3,
    shadowColor: "#4C5BE2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});
