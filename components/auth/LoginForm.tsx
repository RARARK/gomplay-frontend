import React from "react";
import {
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
  email: string;
  password: string;
  onChangeEmail: (value: string) => void;
  onChangePassword: (value: string) => void;
  onLoginPress: () => void;
  onSignupPress: () => void;
  onFindAccountPress?: () => void;
};

export default function LoginForm({
  email,
  password,
  onChangeEmail,
  onChangePassword,
  onLoginPress,
  onSignupPress,
  onFindAccountPress,
}: LoginFormProps) {
  return (
    <View style={styles.loginContainer}>
      <View style={styles.inputGroup}>
        <TextInput
          style={styles.input}
          placeholder="Username or Email"
          placeholderTextColor="#676767"
          value={email}
          onChangeText={onChangeEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#676767"
          value={password}
          onChangeText={onChangePassword}
          secureTextEntry
        />
      </View>

      <View style={styles.actions}>
        <Pressable onPress={onLoginPress} style={styles.loginButtonArea}>
          <Text style={styles.login}>Login</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          disabled={!onFindAccountPress}
          onPress={onFindAccountPress}
          style={styles.findAccount}
        >
          <Text style={styles.findAccountText}>{FIND_ACCOUNT_LABEL}</Text>
        </Pressable>
      </View>

      <View style={styles.createAccountArea}>
        <View style={styles.createAccountRow}>
          <Text style={styles.createAccountPrompt}>{SIGNUP_PROMPT}</Text>
          <Pressable accessibilityRole="button" onPress={onSignupPress}>
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
