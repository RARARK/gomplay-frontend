import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TimetableSelector from "@/components/common/TimetableSelector";
import { getSchedule, updateSchedule } from "@/services/schedule/scheduleService";
import type { UserTimetableRange, UserTimetableState } from "@/types/domain/user";
import {
  compressTimetableState,
  createEmptyTimetableState,
  expandTimetableRanges,
} from "@/utils/timetable";

export default function EditTimetableRoute() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [timetable, setTimetable] = React.useState<UserTimetableState>(() =>
    createEmptyTimetableState(),
  );

  React.useEffect(() => {
    getSchedule()
      .then((ranges) => setTimetable(expandTimetableRanges(ranges)))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async (ranges: UserTimetableRange[]) => {
    const toSubmit = ranges.length > 0 ? ranges : compressTimetableState(timetable);
    setIsSaving(true);
    try {
      await updateSchedule(toSubmit);
      Alert.alert("저장 완료", "시간표가 저장됐어요.", [
        { text: "확인", onPress: () => router.back() },
      ]);
    } catch (err) {
      Alert.alert(
        "저장 실패",
        err instanceof Error ? err.message : "저장 중 오류가 발생했습니다.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safe}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#111111" />
        </Pressable>
        <Text style={styles.headerTitle}>시간표 수정</Text>
        <View style={styles.headerSpacer} />
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#4C5BE2" />
        </View>
      ) : (
        <TimetableSelector
          value={timetable}
          onChange={setTimetable}
          onSave={isSaving ? () => {} : handleSave}
          title="언제 운동할 수 있나요?"
          subtitle="강의가 있는 시간대를 선택하면 더 잘 맞는 파트너를 추천해드려요."
          saveLabel={isSaving ? "저장 중..." : "저장하기"}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    lineHeight: 26,
    color: "#111827",
    fontWeight: "800",
  },
  headerSpacer: {
    width: 40,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
