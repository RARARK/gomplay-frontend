import { router } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TutorialCompleteScreen from "@/components/auth/tutorial/TutorialCompleteScreen";
import { login } from "@/services/auth/authService";
import { submitSchedule, setHasScheduleCache } from "@/services/schedule/scheduleService";
import { submitSurvey } from "@/services/survey/surveyService";
import { uploadProfileImage, updateMyProfile } from "@/services/user/userService";
import { useAuthStore } from "@/stores/auth/authStore";
import { useSurveyStore } from "@/stores/survey/surveyStore";

export default function TutorialCompleteRoute() {
  const { pendingCredentials, setAuth, setPendingCredentials, setPendingProfileImageUri } = useAuthStore();

  const handlePressCta = async () => {
    try {
      // 이미 tutorial-analyzing에서 로그인 완료된 경우 토큰이 있음
      const currentToken = useAuthStore.getState().accessToken;

      if (!currentToken) {
        // fallback: analyzing에서 로그인 실패한 경우 재시도
        if (!pendingCredentials) {
          router.replace("/login");
          return;
        }
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
      }

      const { pendingSchedule, setPendingSchedule } = useSurveyStore.getState();
      if (pendingSchedule && pendingSchedule.length > 0) {
        await submitSchedule(pendingSchedule).catch(() => {});
        setPendingSchedule(null);
        setHasScheduleCache(true);
      }

      const pendingUri = useAuthStore.getState().pendingProfileImageUri;
      if (pendingUri) {
        const profileImageUrl = await uploadProfileImage(pendingUri, {
          fileName: "profile.jpg",
          mimeType: "image/jpeg",
        }).catch(() => null);
        if (profileImageUrl) {
          await updateMyProfile({ profileImageUrl }).catch(() => {});
        }
        setPendingProfileImageUri(null);
      }

      if (pendingCredentials) setPendingCredentials(null);
      router.replace("/(tabs)");
    } catch {
      router.replace("/login");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TutorialCompleteScreen onPressCta={handlePressCta} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
