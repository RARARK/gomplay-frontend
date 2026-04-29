import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TutorialCompleteScreen from "@/components/auth/tutorial/TutorialCompleteScreen";
import { useAuthStore } from "@/stores/auth/authStore";
import { createMockUserFromSignup } from "@/utils/createMockUserFromSignup";

export default function TutorialCompleteRoute() {
  const params = useLocalSearchParams<{
    email?: string;
    nickname?: string;
    studentId?: string;
  }>();
  const setUser = useAuthStore((state) => state.setUser);

  const handlePressCta = () => {
    const email = typeof params.email === "string" ? params.email : "";
    const nickname = typeof params.nickname === "string" ? params.nickname : "";
    const studentId =
      typeof params.studentId === "string" ? params.studentId : "";

    if (email || nickname || studentId) {
      setUser(
        createMockUserFromSignup({
          email,
          nickname,
          studentId,
        }),
      );
    }

    router.replace("/(tabs)");
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
