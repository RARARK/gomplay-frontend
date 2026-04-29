import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import LoginForm from "./LoginForm";

const SCREEN_TITLE = "로그인";

type LoginScreenContentProps = {
  email: string;
  password: string;
  onChangeEmail: (value: string) => void;
  onChangePassword: (value: string) => void;
  onLoginPress: () => void;
  onSignupPress: () => void;
};

export default function LoginScreenContent({
  email,
  password,
  onChangeEmail,
  onChangePassword,
  onLoginPress,
  onSignupPress,
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
          email={email}
          password={password}
          onChangeEmail={onChangeEmail}
          onChangePassword={onChangePassword}
          onLoginPress={onLoginPress}
          onSignupPress={onSignupPress}
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
    paddingLeft: 43,
    paddingRight: 42,
    paddingTop: 160,
    paddingBottom: 160,
  },
  section: {
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
