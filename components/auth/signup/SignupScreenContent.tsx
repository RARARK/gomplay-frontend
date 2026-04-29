import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import SignupField from "./SignupField";

const CLOSE_LABEL = "회원가입 닫기";
const TITLE = "회원가입";
const EMAIL_LABEL = "이메일 주소";
const EMAIL_PLACEHOLDER = "단국대 이메일 주소 입력";
const PASSWORD_LABEL = "비밀번호";
const PASSWORD_PLACEHOLDER = "영문, 숫자, 특수문자 포함 8자리 이상";
const NICKNAME_LABEL = "닉네임";
const NICKNAME_PLACEHOLDER = "닉네임";
const STUDENT_ID_LABEL = "학번";
const STUDENT_ID_PLACEHOLDER = "학번";
const SUBMIT_LABEL = "다음";

type SignupScreenContentProps = {
  email: string;
  password: string;
  nickname: string;
  studentId: string;
  onChangeEmail: (value: string) => void;
  onChangePassword: (value: string) => void;
  onChangeNickname: (value: string) => void;
  onChangeStudentId: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
};

export default function SignupScreenContent({
  email,
  password,
  nickname,
  studentId,
  onChangeEmail,
  onChangePassword,
  onChangeNickname,
  onChangeStudentId,
  onSubmit,
  onClose,
}: SignupScreenContentProps) {
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Pressable
          accessibilityLabel={CLOSE_LABEL}
          hitSlop={10}
          onPress={onClose}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={22} color="#111827" />
        </Pressable>
        <Text style={styles.title}>{TITLE}</Text>
      </View>

      <View style={styles.form}>
        <SignupField
          label={EMAIL_LABEL}
          placeholder={EMAIL_PLACEHOLDER}
          value={email}
          onChangeText={onChangeEmail}
          keyboardType="email-address"
        />
        <SignupField
          label={PASSWORD_LABEL}
          placeholder={PASSWORD_PLACEHOLDER}
          value={password}
          onChangeText={onChangePassword}
          secureTextEntry
        />
        <SignupField
          label={NICKNAME_LABEL}
          placeholder={NICKNAME_PLACEHOLDER}
          value={nickname}
          onChangeText={onChangeNickname}
        />
        <SignupField
          label={STUDENT_ID_LABEL}
          placeholder={STUDENT_ID_PLACEHOLDER}
          value={studentId}
          onChangeText={onChangeStudentId}
          keyboardType="number-pad"
        />
      </View>

      <Pressable onPress={onSubmit} style={styles.submitButton}>
        <Text style={styles.submitText}>{SUBMIT_LABEL}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flexGrow: 1,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 80,
    gap: 32,
  },
  header: {
    width: "100%",
    minHeight: 48,
    justifyContent: "center",
    paddingBottom: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#D9D9D9",
  },
  closeButton: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "600",
    letterSpacing: -0.41,
    color: "#111827",
    textAlign: "center",
    fontFamily: "System",
  },
  form: {
    gap: 18,
  },
  submitButton: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 8,
    backgroundColor: "#4C5BE2",
    justifyContent: "center",
    alignItems: "center",
  },
  submitText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "System",
  },
});
