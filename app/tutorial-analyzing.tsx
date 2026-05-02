import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TutorialAnalyzingScreen from "@/components/auth/tutorial/TutorialAnalyzingScreen";
import { submitSchedule } from "@/services/schedule/scheduleService";
import { submitSurvey } from "@/services/survey/surveyService";
import { useSurveyStore } from "@/stores/survey/surveyStore";

export default function TutorialAnalyzingRoute() {
  const params = useLocalSearchParams<{
    email?: string;
    nickname?: string;
    studentId?: string;
  }>();
  const pendingSurvey = useSurveyStore((s) => s.pendingSurvey);
  const pendingSchedule = useSurveyStore((s) => s.pendingSchedule);
  const setPendingSurvey = useSurveyStore((s) => s.setPendingSurvey);
  const setPendingSchedule = useSurveyStore((s) => s.setPendingSchedule);

  React.useEffect(() => {
    if (pendingSurvey) {
      submitSurvey(pendingSurvey)
        .then(() => setPendingSurvey(null))
        .catch(() => {});
    }
    if (pendingSchedule) {
      submitSchedule(pendingSchedule)
        .then(() => setPendingSchedule(null))
        .catch(() => {});
    }

    const timeoutId = setTimeout(() => {
      router.replace({
        pathname: "/tutorial-complete",
        params: {
          email: typeof params.email === "string" ? params.email : "",
          nickname: typeof params.nickname === "string" ? params.nickname : "",
          studentId:
            typeof params.studentId === "string" ? params.studentId : "",
        },
      });
    }, 4000);

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
