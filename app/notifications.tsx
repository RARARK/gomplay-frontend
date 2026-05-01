import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import NotificationsScreen from "@/components/notifications/NotificationsScreen";

export default function NotificationsRoute() {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <NotificationsScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
