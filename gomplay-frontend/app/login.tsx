import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import LoginScreenContent from "@/components/auth/LoginScreenContent";
import { AuthError, login } from "@/services/auth/authService";
import { getMyProfile } from "@/services/user/userService";
import { useAuthStore } from "@/stores/auth/authStore";
import { useUserStore } from "@/stores/user/userStore";

const SAVED_LOGIN_CREDENTIALS_KEY = "savedLoginCredentials";
const MAX_SAVED_LOGIN_CREDENTIALS = 5;

/**
 * "최근 테스트 계정" 목록에는 공용 테스트 계정(user1~4)만 기기에 저장한다.
 * 실제 사용자 계정은 로그인에 성공해도 이메일·비밀번호를 기기에 남기지 않는다.
 */
const TEST_ACCOUNT_EMAIL_REGEX = /^user[1-4]@dankook\.ac\.kr$/i;

const isTestAccount = (schoolEmail: string) =>
  TEST_ACCOUNT_EMAIL_REGEX.test(schoolEmail.trim());

type SavedLoginCredential = {
  schoolEmail: string;
  password: string;
};

const readSavedLoginCredentials = async (): Promise<SavedLoginCredential[]> => {
  const raw = await AsyncStorage.getItem(SAVED_LOGIN_CREDENTIALS_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      await AsyncStorage.removeItem(SAVED_LOGIN_CREDENTIALS_KEY);
      return [];
    }

    const credentials = parsed.filter(
      (item): item is SavedLoginCredential =>
        item != null &&
        typeof item === "object" &&
        typeof item.schoolEmail === "string" &&
        typeof item.password === "string",
    );
    const testCredentials = credentials.filter((item) =>
      isTestAccount(item.schoolEmail),
    );

    // 이전 버전에서 저장된 실제 사용자 계정(또는 잘못된 항목)이 있으면 기기에서 지운다.
    if (testCredentials.length !== parsed.length) {
      await AsyncStorage.setItem(
        SAVED_LOGIN_CREDENTIALS_KEY,
        JSON.stringify(testCredentials),
      );
    }

    return testCredentials;
  } catch {
    await AsyncStorage.removeItem(SAVED_LOGIN_CREDENTIALS_KEY).catch(() => {});
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

      // 공용 테스트 계정만 기기에 저장한다 (실제 사용자 계정은 남기지 않음).
      if (isTestAccount(schoolEmail)) {
        saveLoginCredential(
          { schoolEmail: schoolEmail.trim(), password },
          savedCredentials,
        )
          .then(setSavedCredentials)
          .catch(() => {});
      }

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
