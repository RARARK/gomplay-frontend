import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TutorialAnalyzingScreen from "@/components/auth/tutorial/TutorialAnalyzingScreen";
import { TUTORIAL_ANALYZING_DELAY_MS } from "@/components/auth/tutorial/tutorialSteps";

export default function TutorialAnalyzingRoute() {
  const params = useLocalSearchParams<{
    email?: string;
    nickname?: string;
    studentId?: string;
  }>();

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.replace({
        pathname: "/tutorial-result",
        params: {
          email: typeof params.email === "string" ? params.email : "",
          nickname: typeof params.nickname === "string" ? params.nickname : "",
          studentId:
            typeof params.studentId === "string" ? params.studentId : "",
        },
      });
    }, TUTORIAL_ANALYZING_DELAY_MS);

    return () => clearTimeout(timeoutId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
