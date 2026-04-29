import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TutorialAnalyzingScreen from "@/components/auth/tutorial/TutorialAnalyzingScreen";

export default function TutorialAnalyzingRoute() {
  const params = useLocalSearchParams<{
    email?: string;
    nickname?: string;
    studentId?: string;
  }>();

  React.useEffect(() => {
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
  }, [params.email, params.nickname, params.studentId]);

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
