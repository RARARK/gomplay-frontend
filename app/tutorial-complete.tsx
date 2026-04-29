import { router } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TutorialCompleteScreen from "@/components/auth/tutorial/TutorialCompleteScreen";

export default function TutorialCompleteRoute() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <TutorialCompleteScreen onPressCta={() => router.replace("/(tabs)")} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
