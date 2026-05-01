import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TimetableSelector from "@/components/common/TimetableSelector";
import type { UserTimetableRange, UserTimetableState } from "@/types/domain/user";
import { createEmptyTimetableState } from "@/utils/timetable";

export default function EditTimetableRoute() {
  const [timetable, setTimetable] = React.useState<UserTimetableState>(() =>
    createEmptyTimetableState(),
  );

  const handleSave = (_ranges: UserTimetableRange[]) => {
    // TODO: API 연동
    Alert.alert("저장 완료", "시간표가 저장됐어요.", [
      { text: "확인", onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
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

      <TimetableSelector
        value={timetable}
        onChange={setTimetable}
        onSave={handleSave}
        title="언제 운동할 수 있나요?"
        subtitle="강의가 있는 시간대를 선택하면 더 잘 맞는 파트너를 추천해드려요."
        saveLabel="저장하기"
      />
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
});
