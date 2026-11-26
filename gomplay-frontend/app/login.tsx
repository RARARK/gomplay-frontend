import { router } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import LoginScreenContent from "@/components/auth/LoginScreenContent";
import { AuthError, login } from "@/services/auth/authService";
import { getSchedule, setHasScheduleCache } from "@/services/schedule/scheduleService";
import { getMyProfile } from "@/services/user/userService";
import { useAuthStore } from "@/stores/auth/authStore";
import { useUserStore } from "@/stores/user/userStore";

/**
 * 시연용 공용 체험 계정. 로그인 화면에 항상 목록으로 보여주고,
 * 누르면 이메일·비밀번호가 채워진다. (어느 기기에서 처음 접속해도 동일하게 표시)
 */
const TEST_ACCOUNT_PASSWORD = "test1234!";
const TEST_ACCOUNTS = [1, 2, 3, 4, 5].map((n) => ({
  schoolEmail: `user${n}@dankook.ac.kr`,
  password: TEST_ACCOUNT_PASSWORD,
}));

export default function LoginScreen() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearProfile = useUserStore((state) => state.clearProfile);
  const setProfile = useUserStore((state) => state.setProfile);
  const [schoolEmail, setSchoolEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleLoginPress = async () => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const data = await login(schoolEmail.trim(), password);
      clearProfile();

      setAuth({
        userId: data.userId,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        matching: data.matching,
      });

      // 시간표도 함께 받아 캐시해 두면 홈 첫 화면이 빈 로딩 상태 없이 바로 그려진다.
      // (이전 계정의 캐시 값이 남아 잘못된 상태가 잠깐 보이는 것도 막는다)
      const [profile, schedule] = await Promise.all([
        getMyProfile(),
        getSchedule().catch(() => null),
      ]);
      setProfile(profile);
      if (schedule) setHasScheduleCache(schedule.length > 0);

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
        savedCredentials={TEST_ACCOUNTS}
        onSelectSavedCredential={(credential) => {
          setSchoolEmail(credential.schoolEmail);
          setPassword(credential.password);
          setErrorMessage(null);
        }}
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
