import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TutorialResultScreen from "@/components/auth/tutorial/TutorialResultScreen";
import { useSurveyStore } from "@/stores/survey/surveyStore";

export default function TutorialResultRoute() {
  const params = useLocalSearchParams<{
    email?: string;
    nickname?: string;
    studentId?: string;
  }>();
  const tutorialSelections = useSurveyStore((s) => s.tutorialSelections);

  const handleContinue = () => {
    router.replace({
      pathname: "/tutorial-complete",
      params: {
        email: typeof params.email === "string" ? params.email : "",
        nickname: typeof params.nickname === "string" ? params.nickname : "",
        studentId:
          typeof params.studentId === "string" ? params.studentId : "",
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TutorialResultScreen
        selections={tutorialSelections}
        onContinue={handleContinue}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
