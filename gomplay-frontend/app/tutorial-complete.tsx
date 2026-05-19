import { router } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TutorialCompleteScreen from "@/components/auth/tutorial/TutorialCompleteScreen";
import { login } from "@/services/auth/authService";
import { useAuthStore } from "@/stores/auth/authStore";

export default function TutorialCompleteRoute() {
  const { pendingCredentials, setAuth, setPendingCredentials } = useAuthStore();

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
