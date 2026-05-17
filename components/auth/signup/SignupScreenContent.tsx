import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import SignupField from "./SignupField";
import CollegePicker from "./CollegePicker";
import DepartmentPicker from "./DepartmentPicker";
import AdmissionYearPicker from "./AdmissionYearPicker";

const CLOSE_LABEL = "회원가입 닫기";
const TITLE = "회원가입";
const EMAIL_LABEL = "이메일 주소";
const EMAIL_PLACEHOLDER = "단국대 이메일 주소 입력";
const PASSWORD_LABEL = "비밀번호";
const PASSWORD_PLACEHOLDER = "영문, 숫자, 특수문자 포함 8자리 이상";
const PASSWORD_CONFIRM_LABEL = "비밀번호 확인";
const PASSWORD_CONFIRM_PLACEHOLDER = "비밀번호를 한 번 더 입력";
const NAME_LABEL = "이름";
const NAME_PLACEHOLDER = "이름";
const SUBMIT_LABEL = "다음";

export type SignupFieldErrors = {
  schoolEmail?: string;
  password?: string;
  passwordConfirm?: string;
  name?: string;
  studentId?: string;
  college?: string;
  department?: string;
};

type SignupScreenContentProps = {
  schoolEmail: string;
  password: string;
  passwordConfirm: string;
  name: string;
  studentId: string;
  college: string;
  department: string;
  onChangeSchoolEmail: (value: string) => void;
  onBlurSchoolEmail: () => void;
  onChangePassword: (value: string) => void;
  onBlurPassword: () => void;
  onChangePasswordConfirm: (value: string) => void;
  onBlurPasswordConfirm: () => void;
  onChangeName: (value: string) => void;
  onChangeStudentId: (value: string) => void;
  onChangeCollege: (value: string) => void;
  onChangeDepartment: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  isLoading?: boolean;
  errorMessage?: string | null;
  fieldErrors?: SignupFieldErrors;
};

export default function SignupScreenContent({
  schoolEmail,
  password,
  passwordConfirm,
  name,
  studentId,
  college,
  department,
  onChangeSchoolEmail,
  onBlurSchoolEmail,
  onChangePassword,
  onBlurPassword,
  onChangePasswordConfirm,
  onBlurPasswordConfirm,
  onChangeName,
  onChangeStudentId,
  onChangeCollege,
  onChangeDepartment,
  onSubmit,
  onClose,
  isLoading = false,
  errorMessage,
  fieldErrors = {},
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
          disabled={isLoading}
        >
          <Ionicons name="close" size={22} color="#111827" />
        </Pressable>
        <Text style={styles.title}>{TITLE}</Text>
      </View>

      <View style={styles.form}>
        <SignupField
          label={EMAIL_LABEL}
          placeholder={EMAIL_PLACEHOLDER}
          value={schoolEmail}
          onChangeText={onChangeSchoolEmail}
          onBlur={onBlurSchoolEmail}
          keyboardType="email-address"
          editable={!isLoading}
          errorMessage={fieldErrors.schoolEmail}
        />
        <SignupField
          label={PASSWORD_LABEL}
          placeholder={PASSWORD_PLACEHOLDER}
          value={password}
          onChangeText={onChangePassword}
          onBlur={onBlurPassword}
          secureTextEntry
          editable={!isLoading}
          errorMessage={fieldErrors.password}
        />
        <SignupField
          label={PASSWORD_CONFIRM_LABEL}
          placeholder={PASSWORD_CONFIRM_PLACEHOLDER}
          value={passwordConfirm}
          onChangeText={onChangePasswordConfirm}
          onBlur={onBlurPasswordConfirm}
          secureTextEntry
          editable={!isLoading}
          errorMessage={fieldErrors.passwordConfirm}
        />
        <SignupField
          label={NAME_LABEL}
          placeholder={NAME_PLACEHOLDER}
          value={name}
          onChangeText={onChangeName}
          editable={!isLoading}
          errorMessage={fieldErrors.name}
        />
        <AdmissionYearPicker
          value={studentId}
          onChange={onChangeStudentId}
          errorMessage={fieldErrors.studentId}
          disabled={isLoading}
        />
        <CollegePicker
          value={college}
          onChange={onChangeCollege}
          errorMessage={fieldErrors.college}
          disabled={isLoading}
        />
        <DepartmentPicker
          college={college}
          value={department}
          onChange={onChangeDepartment}
          errorMessage={fieldErrors.department}
          disabled={isLoading}
        />
      </View>

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <Pressable
        onPress={onSubmit}
        style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.submitText}>{SUBMIT_LABEL}</Text>
        )}
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
});
