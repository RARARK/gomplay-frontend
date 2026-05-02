import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EmailVerificationScreenContent from "@/components/auth/signup/EmailVerificationScreenContent";
import { AuthError, resendVerification, verifyEmail } from "@/services/auth/authService";

export default function SignupVerificationScreen() {
  const params = useLocalSearchParams<{ email?: string }>();
  const [token, setToken] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isResending, setIsResending] = React.useState(false);
  const [resendMessage, setResendMessage] = React.useState<string | null>(null);

  const email =
    typeof params.email === "string" && params.email.length > 0
      ? params.email
      : "";

  const handleSubmit = async () => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      await verifyEmail(token);
      router.push({
        pathname: "/tutorial",
        params: { email },
      });
    } catch (error) {
      if (error instanceof AuthError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("알 수 없는 오류가 발생하였습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResendMessage(null);
    setIsResending(true);

    try {
      const message = await resendVerification(email);
      setResendMessage(message);
    } catch (error) {
      if (error instanceof AuthError) {
        setResendMessage(error.message);
      } else {
        setResendMessage("알 수 없는 오류가 발생하였습니다.");
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <EmailVerificationScreenContent
        email={email}
        token={token}
        onChangeToken={setToken}
        onSubmit={handleSubmit}
        onClose={() => router.back()}
        isLoading={isLoading}
        errorMessage={errorMessage}
        onResend={handleResend}
        isResending={isResending}
        resendMessage={resendMessage}
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
