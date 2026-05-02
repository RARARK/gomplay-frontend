import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const FIND_ACCOUNT_LABEL = "아이디/비밀번호 찾기";
const SIGNUP_PROMPT = "계정이 없으신가요?";
const SIGNUP_LABEL = "가입하기";

type LoginFormProps = {
  schoolEmail: string;
  password: string;
  onChangeSchoolEmail: (value: string) => void;
  onChangePassword: (value: string) => void;
  onLoginPress: () => void;
  onSignupPress: () => void;
  onFindAccountPress?: () => void;
  isLoading?: boolean;
  errorMessage?: string | null;
};

export default function LoginForm({
  schoolEmail,
  password,
  onChangeSchoolEmail,
  onChangePassword,
  onLoginPress,
  onSignupPress,
  onFindAccountPress,
  isLoading = false,
  errorMessage,
}: LoginFormProps) {
  return (
    <View style={styles.loginContainer}>
      <View style={styles.inputGroup}>
        <TextInput
          style={styles.input}
          placeholder="학교 이메일"
          placeholderTextColor="#676767"
          value={schoolEmail}
          onChangeText={onChangeSchoolEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!isLoading}
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          placeholderTextColor="#676767"
          value={password}
          onChangeText={onChangePassword}
          secureTextEntry
          editable={!isLoading}
        />
      </View>

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <View style={styles.actions}>
        <Pressable
          onPress={onLoginPress}
          style={[styles.loginButtonArea, isLoading && styles.loginButtonDisabled]}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.login}>로그인</Text>
          )}
        </Pressable>

        <Pressable
          accessibilityRole="button"
          disabled={!onFindAccountPress || isLoading}
          onPress={onFindAccountPress}
          style={styles.findAccount}
        >
          <Text style={styles.findAccountText}>{FIND_ACCOUNT_LABEL}</Text>
        </Pressable>
      </View>

      <View style={styles.createAccountArea}>
        <View style={styles.createAccountRow}>
          <Text style={styles.createAccountPrompt}>{SIGNUP_PROMPT}</Text>
          <Pressable accessibilityRole="button" onPress={onSignupPress} disabled={isLoading}>
            <Text style={styles.createAccountLink}>{SIGNUP_LABEL}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    width: "100%",
    gap: 28,
  },
  inputGroup: {
    gap: 18,
  },
  input: {
    width: "100%",
    height: 55,
    borderWidth: 1,
    borderColor: "#A9A9A9",
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
    fontSize: 12,
    fontWeight: "500",
    color: "#111827",
    fontFamily: "System",
  },
  errorText: {
    fontSize: 13,
    color: "#FF3B30",
    textAlign: "center",
    fontFamily: "System",
  },
  actions: {
    gap: 25,
  },
  loginButtonArea: {
    width: "100%",
    height: 55,
    borderRadius: 4,
    backgroundColor: "#4C5BE2",
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  login: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "System",
  },
  findAccount: {
    alignItems: "center",
  },
  findAccountText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    fontFamily: "System",
    textAlign: "center",
  },
  createAccountArea: {
    alignItems: "center",
  },
  createAccountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  createAccountPrompt: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "System",
    textAlign: "center",
  },
  createAccountLink: {
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
    color: "#FF3B30",
    fontFamily: "System",
    textAlign: "center",
  },
});
