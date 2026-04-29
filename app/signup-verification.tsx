import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EmailVerificationScreenContent from "@/components/auth/signup/EmailVerificationScreenContent";

const DEFAULT_EMAIL = "abcdefk@dankook.com";
const RESEND_COUNTDOWN_TEXT = "다음 시간 후 코드 재전송 29";

export default function SignupVerificationScreen() {
  const params = useLocalSearchParams<{
    email?: string;
    nickname?: string;
    studentId?: string;
  }>();
  const [code, setCode] = React.useState("");

  const email =
    typeof params.email === "string" && params.email.length > 0
      ? params.email
      : DEFAULT_EMAIL;

  const nickname =
    typeof params.nickname === "string" ? params.nickname : "";
  const studentId =
    typeof params.studentId === "string" ? params.studentId : "";

  return (
    <SafeAreaView style={styles.safeArea}>
      <EmailVerificationScreenContent
        email={email}
        code={code}
        countdownText={RESEND_COUNTDOWN_TEXT}
        onChangeCode={setCode}
        onSubmit={() =>
          router.push({
            pathname: "/tutorial",
            params: { email, nickname, studentId },
          })
        }
        onClose={() => router.back()}
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
