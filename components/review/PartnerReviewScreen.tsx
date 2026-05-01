import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  KeyboardAvoidingView,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import DifficultyIcon from "@/assets/match/heroicons-chart-bar-16-solid.svg";
import LocationIcon from "@/assets/match/mdi-location.svg";
import ExerciseIcon from "@/assets/match/fluent-run-16-filled.svg";

const RATING_TRAITS = [
  { id: "punctual", label: "시간 약속을 잘 지켰어요" },
  { id: "manner", label: "운동 매너가 좋았어요" },
  { id: "kind", label: "친절하고 배려가 깊었어요" },
  { id: "again", label: "다음에도 같이 하고 싶어요" },
] as const;

// Mock — replace with API response keyed by matchId
const MOCK_PARTNER = {
  name: "김단국",
  department: "컴퓨터공학과",
  mannerTemperature: 36.5,
  location: "체육관",
  scheduledTime: "19:00~21:00",
  difficulty: "초보",
  exerciseType: "풋살",
};

type Props = { matchId: string };

function DetailChip({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <View style={styles.detailChip}>
      {icon}
      <Text style={styles.detailChipText} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

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
  const [comment, setComment] = React.useState("");
  const [temperature, setTemperature] = React.useState(36);
  const trackWidthRef = React.useRef(0);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const ratio = Math.max(0, Math.min(1, evt.nativeEvent.locationX / trackWidthRef.current));
        setTemperature(Math.round(ratio * 100));
      },
      onPanResponderMove: (evt) => {
        const ratio = Math.max(0, Math.min(1, evt.nativeEvent.locationX / trackWidthRef.current));
        setTemperature(Math.round(ratio * 100));
      },
    }),
  ).current;

  const toggleTrait = (id: string) => {
    setSelectedTraits((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = () => {
    // TODO: API 연동
    Alert.alert("평가 완료", "파트너 평가가 제출됐어요.", [
      { text: "확인", onPress: () => router.back() },
    ]);
  };

  const tempEmoji = temperature >= 70 ? "happy-outline" : temperature >= 40 ? "happy-outline" : temperature >= 20 ? "remove-circle-outline" : "sad-outline";

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
        <View style={styles.card}>
          <View style={styles.partnerRow}>
            <Image
              source={require("../../assets/match/Ellipse-12.png")}
              style={styles.avatar}
              contentFit="cover"
            />
            <View style={styles.partnerInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.partnerName}>{MOCK_PARTNER.name}</Text>
                <Text style={styles.partnerDept}>{MOCK_PARTNER.department}</Text>
              </View>
              <View style={styles.detailGrid}>
                <DetailChip
                  icon={<LocationIcon width={13} height={13} />}
                  label={MOCK_PARTNER.location}
                />
                <DetailChip
                  icon={<Ionicons name="time-outline" size={13} color="#413F46" />}
                  label={MOCK_PARTNER.scheduledTime}
                />
                <DetailChip
                  icon={<DifficultyIcon width={13} height={13} />}
                  label={MOCK_PARTNER.difficulty}
                />
                <DetailChip
                  icon={<ExerciseIcon width={13} height={13} />}
                  label={MOCK_PARTNER.exerciseType}
                />
              </View>
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
            <Text style={styles.tempValue}>{temperature}°C</Text>
            <Ionicons name={tempEmoji} size={30} color="#F59E0B" />
          </View>

          <View
            style={styles.tempTrack}
            onLayout={(e) => { trackWidthRef.current = e.nativeEvent.layout.width; }}
            {...panResponder.panHandlers}
          >
            <View style={[styles.tempFill, { width: `${temperature}%` }]} />
            <View style={[styles.tempThumb, { left: `${temperature}%` }]} />
          </View>
          <View style={styles.tempLabels}>
            <Text style={styles.tempLabelText}>0°C</Text>
            <Text style={styles.tempLabelText}>100°C</Text>
          </View>

          <View style={styles.traitList}>
            {RATING_TRAITS.map((trait) => (
              <TraitCheckbox
                key={trait.id}
                label={trait.label}
                checked={selectedTraits.has(trait.id)}
                onToggle={() => toggleTrait(trait.id)}
              />
            ))}
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
  partnerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EEF2FF",
  },
  partnerInfo: { flex: 1, gap: 8 },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  partnerName: { fontSize: 16, fontWeight: "800", color: "#111827" },
  partnerDept: { fontSize: 12, fontWeight: "600", color: "#6B7280" },
  detailGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  detailChip: {
    width: "48%",
    minHeight: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 8,
  },
  detailChipText: {
    flex: 1,
    fontSize: 12,
    color: "#413F46",
    fontWeight: "600",
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
  traitList: { gap: 2 },
  traitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
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
