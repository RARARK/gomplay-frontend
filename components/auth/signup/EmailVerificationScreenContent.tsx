import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const CLOSE_LABEL = "이메일 인증 닫기";
const HEADER_TITLE = "회원가입";
const SCREEN_TITLE = "받은 인증을 확인하세요";
const TOKEN_PLACEHOLDER = "6자리 코드";
const SUBMIT_LABEL = "다음";
const RESEND_PREFIX = "코드를 받지 못하셨나요? ";
const RESEND_LABEL = "재전송";

type EmailVerificationScreenContentProps = {
  email: string;
  token: string;
  onChangeToken: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  isLoading?: boolean;
  errorMessage?: string | null;
  onResend: () => void;
  isResending?: boolean;
  resendMessage?: string | null;
};

export default function EmailVerificationScreenContent({
  email,
  token,
  onChangeToken,
  onSubmit,
  onClose,
  isLoading = false,
  errorMessage,
  onResend,
  isResending = false,
  resendMessage,
}: EmailVerificationScreenContentProps) {
  const description = `회원가입을 완료하려면 ${email}에게\n보내드린 코드를 입력하세요`;
  const isBusy = isLoading || isResending;

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
          disabled={isBusy}
        >
          <Ionicons name="close" size={22} color="#111827" />
        </Pressable>
        <Text style={styles.headerTitle}>{HEADER_TITLE}</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.copyBlock}>
          <Text style={styles.title}>{SCREEN_TITLE}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.codeInput}
            placeholder={TOKEN_PLACEHOLDER}
            placeholderTextColor="#070322"
            value={token}
            onChangeText={onChangeToken}
            keyboardType="number-pad"
            maxLength={6}
            editable={!isBusy}
          />

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

          <Pressable
            onPress={onSubmit}
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            disabled={isBusy}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitText}>{SUBMIT_LABEL}</Text>
            )}
          </Pressable>

          <View style={styles.resendRow}>
            <Text style={styles.resendPrefix}>{RESEND_PREFIX}</Text>
            <Pressable onPress={onResend} disabled={isBusy}>
              {isResending ? (
                <ActivityIndicator size="small" color="#4C5BE2" />
              ) : (
                <Text style={styles.resendLink}>{RESEND_LABEL}</Text>
              )}
            </Pressable>
          </View>

          {resendMessage ? (
            <Text style={styles.resendMessageText}>{resendMessage}</Text>
          ) : null}
        </View>
      </View>
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
    gap: 64,
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
  headerTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "600",
    letterSpacing: -0.41,
    color: "#111827",
    textAlign: "center",
    fontFamily: "System",
  },
  body: {
    gap: 74,
  },
  copyBlock: {
    gap: 48,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: 0.36,
    color: "#111827",
    fontFamily: "System",
    fontWeight: "400",
    textAlign: "center",
  },
  description: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: "#111827",
    fontFamily: "System",
    textAlign: "center",
  },
  form: {
    gap: 33,
  },
  codeInput: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#FFFFFF",
    fontFamily: "System",
  },
  errorText: {
    fontSize: 13,
    color: "#FF3B30",
    textAlign: "center",
    fontFamily: "System",
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
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "System",
  },
  resendRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  resendPrefix: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    color: "#111827",
    fontFamily: "System",
  },
  resendLink: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.5,
    fontWeight: "600",
    color: "#4C5BE2",
    fontFamily: "System",
    textDecorationLine: "underline",
  },
  resendMessageText: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    fontFamily: "System",
  },
});
