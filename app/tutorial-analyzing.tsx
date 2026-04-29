import { router } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TutorialAnalyzingScreen from "@/components/auth/tutorial/TutorialAnalyzingScreen";

export default function TutorialAnalyzingRoute() {
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.replace("/tutorial-complete");
    }, 4000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <TutorialAnalyzingScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
