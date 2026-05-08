import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import LoginScreenContent from "@/components/auth/LoginScreenContent";
import { AuthError, login } from "@/services/auth/authService";
import { useAuthStore } from "@/stores/auth/authStore";

const DEV_LOGIN_EMAIL = "32201274@dankook.ac.kr";
const DEV_LOGIN_PASSWORD = "password12345";
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
  const [schoolEmail, setSchoolEmail] = React.useState(
    __DEV__ ? DEV_LOGIN_EMAIL : "",
  );
  const [password, setPassword] = React.useState(
    __DEV__ ? DEV_LOGIN_PASSWORD : "",
  );
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

      setAuth({
        userId: data.userId,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        matching: data.matching,
      });

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
