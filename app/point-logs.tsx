import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PointLogsScreen from "@/components/profile/PointLogsScreen";

export default function PointLogsRoute() {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <PointLogsScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
