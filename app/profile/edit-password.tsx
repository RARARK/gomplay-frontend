import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { changePassword } from "@/services/user/userService";

type Field = "current" | "next" | "confirm";

export default function EditPasswordRoute() {
  const [values, setValues] = React.useState({ current: "", next: "", confirm: "" });
  const [visible, setVisible] = React.useState<Record<Field, boolean>>({
    current: false,
    next: false,
    confirm: false,
  });
  const [isSaving, setIsSaving] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const set = (field: Field, value: string) => {
    setErrorMessage(null);
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const toggleVisible = (field: Field) =>
    setVisible((prev) => ({ ...prev, [field]: !prev[field] }));

  const isValid =
    values.current.length >= 8 &&
    values.next.length >= 8 &&
    values.next === values.confirm;

  const handleSave = async () => {
    if (!isValid || isSaving) return;
    setIsSaving(true);
    setErrorMessage(null);
    try {
      await changePassword(values.current, values.next);
      router.back();
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "비밀번호 변경 중 오류가 발생했습니다."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* 헤더 */}
          <View style={styles.headerRow}>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={28} color="#111111" />
            </Pressable>
            <Text style={styles.headerTitle}>비밀번호 변경</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.form}>
            <PasswordField
              label="현재 비밀번호"
              value={values.current}
              onChangeText={(v) => set("current", v)}
              isVisible={visible.current}
              onToggleVisible={() => toggleVisible("current")}
            />
            <PasswordField
              label="새 비밀번호"
              value={values.next}
              onChangeText={(v) => set("next", v)}
              isVisible={visible.next}
              onToggleVisible={() => toggleVisible("next")}
              hint="8자 이상 입력해주세요"
            />
            <PasswordField
              label="새 비밀번호 확인"
              value={values.confirm}
              onChangeText={(v) => set("confirm", v)}
              isVisible={visible.confirm}
              onToggleVisible={() => toggleVisible("confirm")}
              error={
                values.confirm.length > 0 && values.next !== values.confirm
                  ? "비밀번호가 일치하지 않아요"
                  : undefined
              }
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          {errorMessage ? (
            <Text style={styles.footerError}>{errorMessage}</Text>
          ) : null}
          <Pressable
            accessibilityRole="button"
            style={[styles.saveButton, (!isValid || isSaving) && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!isValid || isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>변경하기</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function PasswordField({
  label,
  value,
  onChangeText,
  isVisible,
  onToggleVisible,
  hint,
  error,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  isVisible: boolean;
  onToggleVisible: () => void;
  hint?: string;
  error?: string;
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.inputRow, error && styles.inputRowError]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!isVisible}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="••••••••"
          placeholderTextColor="#9CA3AF"
        />
        <Pressable
          accessibilityRole="button"
          onPress={onToggleVisible}
          style={styles.eyeButton}
        >
          <Ionicons
            name={isVisible ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#6B7280"
          />
        </Pressable>
      </View>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hintText}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F2F7FF" },
  flex: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
    gap: 28,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    lineHeight: 28,
    color: "#111827",
    fontWeight: "800",
  },
  headerSpacer: { width: 40 },

  form: { gap: 20 },
  fieldWrap: { gap: 6 },
  fieldLabel: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "700",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    height: 50,
  },
  inputRowError: {
    borderColor: "#EF4444",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
  },
  eyeButton: {
    padding: 4,
  },
  hintText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    fontWeight: "600",
  },

  footerError: {
    fontSize: 13,
    color: "#EF4444",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 12,
  },
  saveButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#4C5BE2",
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});
