import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import LoginScreenContent from "@/components/auth/LoginScreenContent";
import {
  endSignupTest,
  IS_SIGNUP_TEST_AVAILABLE,
  startSignupTest,
} from "@/lib/devtools/signupTestMode";
import { AuthError, login } from "@/services/auth/authService";
import { getMyProfile } from "@/services/user/userService";
import { useAuthStore } from "@/stores/auth/authStore";
import { useUserStore } from "@/stores/user/userStore";

const SAVED_LOGIN_CREDENTIALS_KEY = "savedLoginCredentials";
const MAX_SAVED_LOGIN_CREDENTIALS = 5;

type SavedLoginCredential = {
  schoolEmail: string;
  password: string;
};

const readSavedLoginCredentials = async (): Promise<SavedLoginCredential[]> => {
  const raw = await AsyncStorage.getItem(SAVED_LOGIN_CREDENTIALS_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is SavedLoginCredential =>
        item != null &&
        typeof item === "object" &&
        typeof item.schoolEmail === "string" &&
        typeof item.password === "string",
    );
  } catch {
    return [];
  }
};

const saveLoginCredential = async (
  credential: SavedLoginCredential,
  previousCredentials: SavedLoginCredential[],
) => {
  const nextCredentials = [
    credential,
    ...previousCredentials.filter(
      (item) => item.schoolEmail !== credential.schoolEmail,
    ),
  ].slice(0, MAX_SAVED_LOGIN_CREDENTIALS);

  await AsyncStorage.setItem(
    SAVED_LOGIN_CREDENTIALS_KEY,
    JSON.stringify(nextCredentials),
  );

  return nextCredentials;
};

export default function LoginScreen() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearProfile = useUserStore((state) => state.clearProfile);
  const setProfile = useUserStore((state) => state.setProfile);
  const [schoolEmail, setSchoolEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [savedCredentials, setSavedCredentials] = React.useState<
    SavedLoginCredential[]
  >([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // 회원가입 테스트 중 뒤로 가기 등으로 로그인 화면에 돌아오면 테스트 모드를 끈다.
  // (켜진 채로 두면 실제 로그인 요청까지 가짜 응답으로 처리된다)
  useFocusEffect(
    React.useCallback(() => {
      endSignupTest();
    }, []),
  );

  React.useEffect(() => {
    let isMounted = true;

    readSavedLoginCredentials()
      .then((credentials) => {
        if (!isMounted) return;

        setSavedCredentials(credentials);

        if (credentials[0]) {
          setSchoolEmail(credentials[0].schoolEmail);
          setPassword(credentials[0].password);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

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

      const profile = await getMyProfile();
      setProfile(profile);

      saveLoginCredential(
        { schoolEmail: schoolEmail.trim(), password },
        savedCredentials,
      )
        .then(setSavedCredentials)
        .catch(() => {});

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
        savedCredentials={savedCredentials}
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
      {IS_SIGNUP_TEST_AVAILABLE ? (
        <Pressable
          accessibilityRole="button"
          style={styles.signupTestButton}
          onPress={() => {
            startSignupTest();
            router.push("/signup");
          }}
        >
          <Text style={styles.signupTestTitle}>회원가입 테스트 (개발용)</Text>
          <Text style={styles.signupTestDescription}>
            아무 이메일·인증 코드로 끝까지 진행 · 서버에 저장 안 됨
          </Text>
        </Pressable>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  signupTestButton: {
    marginHorizontal: 24,
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#F59E0B",
    backgroundColor: "#FFFBEB",
    alignItems: "center",
    gap: 2,
  },
  signupTestTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#B45309",
  },
  signupTestDescription: {
    fontSize: 12,
    color: "#92400E",
  },
});
