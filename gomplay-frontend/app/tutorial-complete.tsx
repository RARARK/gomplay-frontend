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
    if (pendingCredentials) {
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

        const { pendingSurvey, pendingSchedule, setPendingSurvey, setPendingSchedule } = useSurveyStore.getState();
        if (pendingSurvey) {
          await submitSurvey(pendingSurvey).catch(() => {});
          setPendingSurvey(null);
        }
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
        setPendingCredentials(null);
        router.replace("/(tabs)");
        return;
      } catch {
        // credentials 만료 또는 오류 시 로그인 화면으로
      }
    }
    router.replace("/login");
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
