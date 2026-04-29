import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import TimetableSelector from "@/components/common/TimetableSelector";
import type {
  UserTimetableRange,
  UserTimetableState,
} from "@/types/domain/user";

type TutorialScheduleScreenContentProps = {
  value: UserTimetableState;
  onChange: React.Dispatch<React.SetStateAction<UserTimetableState>>;
  onSave: (ranges: UserTimetableRange[]) => void;
  onSkip: () => void;
  onBack: () => void;
};

const HEADER_TITLE = "시간표 입력";
const BACK_LABEL = "튜토리얼 이전 단계";
const TITLE = "언제 운동할 수 있나요?";
const DESCRIPTION =
  "강의가 있는 시간대를 선택해주시면 더 잘 맞는 파트너를\n추천해드려요. 나중에 다시 설정하실 수 있어요.";
const SAVE_LABEL = "분석 시작하기";
const SKIP_LABEL = "지금은 건너뛰기";

export default function TutorialScheduleScreenContent({
  value,
  onChange,
  onSave,
  onSkip,
  onBack,
}: TutorialScheduleScreenContentProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel={BACK_LABEL}
          hitSlop={10}
          onPress={onBack}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={32} color="#111111" />
        </Pressable>
        <Text style={styles.headerTitle}>{HEADER_TITLE}</Text>
      </View>

      <View style={styles.progressWrapper}>
        <View style={styles.progressTrack} />
        <View style={styles.progressActive} />
      </View>

      <TimetableSelector
        value={value}
        onChange={onChange}
        onSave={onSave}
        title={TITLE}
        subtitle={DESCRIPTION}
        saveLabel={SAVE_LABEL}
        secondaryActionLabel={SKIP_LABEL}
        onSecondaryAction={onSkip}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 12,
  },
  header: {
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: -2,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.5,
    fontWeight: "600",
    color: "#111827",
    fontFamily: "System",
  },
  progressWrapper: {
    marginHorizontal: 20,
    marginBottom: 20,
    height: 16,
    justifyContent: "center",
    position: "relative",
  },
  progressTrack: {
    width: "100%",
    height: 8,
    borderRadius: 999,
    backgroundColor: "#E8E8F3",
  },
  progressActive: {
    position: "absolute",
    left: 0,
    top: 4,
    width: "100%",
    height: 8,
    borderRadius: 999,
    backgroundColor: "#4C5BE2",
  },
});
