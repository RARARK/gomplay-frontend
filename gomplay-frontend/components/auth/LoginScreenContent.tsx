import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import LoginForm from "./LoginForm";

const SCREEN_TITLE = "로그인";

type LoginScreenContentProps = {
  schoolEmail: string;
  password: string;
  onChangeSchoolEmail: (value: string) => void;
  onChangePassword: (value: string) => void;
  savedCredentials?: { schoolEmail: string; password: string }[];
  onSelectSavedCredential?: (credential: {
    schoolEmail: string;
    password: string;
  }) => void;
  onLoginPress: () => void;
  onSignupPress: () => void;
  isLoading?: boolean;
  errorMessage?: string | null;
};

export default function LoginScreenContent({
  schoolEmail,
  password,
  onChangeSchoolEmail,
  onChangePassword,
  savedCredentials,
  onSelectSavedCredential,
  onLoginPress,
  onSignupPress,
  isLoading,
  errorMessage,
}: LoginScreenContentProps) {
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.section}>
        <Text style={styles.title}>{SCREEN_TITLE}</Text>
        <LoginForm
          schoolEmail={schoolEmail}
          password={password}
          onChangeSchoolEmail={onChangeSchoolEmail}
          onChangePassword={onChangePassword}
          savedCredentials={savedCredentials}
          onSelectSavedCredential={onSelectSavedCredential}
          onLoginPress={onLoginPress}
          onSignupPress={onSignupPress}
          isLoading={isLoading}
          errorMessage={errorMessage}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    width: "100%",
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 72,
    paddingBottom: 96,
  },
  section: {
    width: "100%",
    maxWidth: 360,
    alignSelf: "center",
    gap: 30,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700",
    letterSpacing: 0.36,
    color: "#111827",
    fontFamily: "System",
  },
});
