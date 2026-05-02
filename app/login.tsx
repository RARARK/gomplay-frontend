import { router } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import LoginScreenContent from "@/components/auth/LoginScreenContent";
import { AuthError, login } from "@/services/auth/authService";
import { useAuthStore } from "@/stores/auth/authStore";

const DEV_LOGIN_EMAIL = "32201274@dankook.ac.kr";
const DEV_LOGIN_PASSWORD = "password12345";

export default function LoginScreen() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const [schoolEmail, setSchoolEmail] = React.useState(
    __DEV__ ? DEV_LOGIN_EMAIL : "",
  );
  const [password, setPassword] = React.useState(
    __DEV__ ? DEV_LOGIN_PASSWORD : "",
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleLoginPress = async () => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const data = await login(schoolEmail.trim(), password);

      setAuth({
        userId: data.userId,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        matching: data.matching,
      });

      router.replace("/(tabs)");
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <LoginScreenContent
        schoolEmail={schoolEmail}
        password={password}
        onChangeSchoolEmail={setSchoolEmail}
        onChangePassword={setPassword}
        onLoginPress={handleLoginPress}
        onSignupPress={() => router.push("/signup")}
        isLoading={isLoading}
        errorMessage={errorMessage}
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
