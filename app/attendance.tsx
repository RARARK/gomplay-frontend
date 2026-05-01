import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AttendanceScreen from "@/components/attendance/AttendanceScreen";

export default function AttendanceRoute() {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <AttendanceScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F2F7FF",
  },
});
