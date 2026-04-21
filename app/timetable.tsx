import * as React from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TimetableSelector from "@/components/common/TimetableSelector";
import type { UserTimetableRange } from "@/types/domain/user";
import { createEmptyTimetableState, DAY_OF_WEEKS } from "@/utils/timetable";

export default function TimetableScreen() {
  const [timetable, setTimetable] = React.useState(() => {
    const initialState = createEmptyTimetableState();

    initialState.MON[0] = true;
    initialState.MON[1] = true;
    initialState.MON[2] = true;

    return initialState;
  });
  const [savedRanges, setSavedRanges] = React.useState<UserTimetableRange[]>(
    [],
  );

  const handleSave = (ranges: UserTimetableRange[]) => {
    setSavedRanges(ranges);
    Alert.alert("Saved", JSON.stringify(ranges, null, 2));
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={28} color="#111111" />
        </Pressable>
      </View>

      <TimetableSelector
        value={timetable}
        onChange={setTimetable}
        onSave={handleSave}
        title="Timetable Selection"
        subtitle="Drag or tap to mark the time blocks you are available."
      />

      <View style={styles.preview}>
        <Text style={styles.previewTitle}>Compressed Output</Text>
        <Text style={styles.previewText}>
          {savedRanges.length === 0
            ? "Save to preview your selected ranges."
            : JSON.stringify(savedRanges, null, 2)}
        </Text>
        <Text style={styles.previewCaption}>
          Active days:{" "}
          {DAY_OF_WEEKS.filter((day) => timetable[day].some(Boolean)).join(
            ", ",
          ) || "None"}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  preview: {
    borderTopWidth: 1,
    borderTopColor: "#ececec",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    gap: 8,
    backgroundColor: "#fafafa",
  },
  previewTitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
    color: "#111111",
  },
  previewText: {
    fontSize: 12,
    lineHeight: 18,
    color: "#444444",
    fontFamily: "monospace",
  },
  previewCaption: {
    fontSize: 12,
    lineHeight: 16,
    color: "#666666",
  },
});
