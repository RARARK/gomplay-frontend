import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TutorialAnalyzingScreen from "@/components/auth/tutorial/TutorialAnalyzingScreen";
import { TUTORIAL_ANALYZING_DELAY_MS } from "@/components/auth/tutorial/tutorialSteps";
import { login } from "@/services/auth/authService";
import { submitSurvey } from "@/services/survey/surveyService";
import { useAuthStore } from "@/stores/auth/authStore";
import { useSurveyStore } from "@/stores/survey/surveyStore";

export default function TutorialAnalyzingRoute() {
  const params = useLocalSearchParams<{
    email?: string;
    nickname?: string;
    studentId?: string;
  }>();

  useEffect(() => {
    const navParams = {
      pathname: "/tutorial-result" as const,
      params: {
        email: typeof params.email === "string" ? params.email : "",
        nickname: typeof params.nickname === "string" ? params.nickname : "",
        studentId: typeof params.studentId === "string" ? params.studentId : "",
      },
    };

    const timerPromise = new Promise<void>((resolve) =>
      setTimeout(resolve, TUTORIAL_ANALYZING_DELAY_MS)
    );

    const authAndSurveyPromise = (async () => {
      const { pendingCredentials, setAuth } = useAuthStore.getState();
      if (!pendingCredentials) return;

      try {
        const data = await login(
          pendingCredentials.schoolEmail,
          pendingCredentials.password
        );
        setAuth({
          userId: data.userId,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          matching: data.matching,
        });

        const { pendingSurvey, setPendingSurvey } = useSurveyStore.getState();
        if (pendingSurvey) {
          await submitSurvey(pendingSurvey).catch(() => {});
          setPendingSurvey(null);
        }
      } catch {
        // 로그인 실패 시 tutorial-result에서 에러 상태로 표시됨
      }
    })();

    Promise.all([timerPromise, authAndSurveyPromise]).then(() => {
      router.replace(navParams);
    });
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
