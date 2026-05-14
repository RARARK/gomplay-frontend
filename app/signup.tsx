import { router } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SignupScreenContent, {
  type SignupFieldErrors,
} from "@/components/auth/signup/SignupScreenContent";
import { AuthError, signup } from "@/services/auth/authService";
import { useAuthStore } from "@/stores/auth/authStore";

function validate(fields: {
  schoolEmail: string;
  password: string;
  name: string;
  studentId: string;
  department: string;
}): SignupFieldErrors {
  const errors: SignupFieldErrors = {};

  if (!fields.schoolEmail.trim()) {
    errors.schoolEmail = "이메일을 입력해주세요.";
  } else if (!/^[^\s@]+@dankook\.ac\.kr$/.test(fields.schoolEmail.trim())) {
    errors.schoolEmail = "단국대학교 이메일(@dankook.ac.kr)을 입력해주세요.";
  }

  if (!fields.password) {
    errors.password = "비밀번호를 입력해주세요.";
  } else if (fields.password.length < 8) {
    errors.password = "비밀번호는 8자리 이상이어야 합니다.";
  } else if (
    !/(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(
      fields.password,
    )
  ) {
    errors.password = "영문, 숫자, 특수문자를 모두 포함해야 합니다.";
  }

  if (!fields.name.trim()) {
    errors.name = "이름을 입력해주세요.";
  } else if (!/^[가-힣a-zA-Z\s]{2,}$/.test(fields.name.trim())) {
    errors.name = "올바른 이름을 입력해주세요. (2자 이상, 한글 또는 영문)";
  }

  if (!fields.studentId.trim()) {
    errors.studentId = "학번을 입력해주세요.";
  } else if (!/^\d{7,11}$/.test(fields.studentId.trim())) {
    errors.studentId = "올바른 학번을 입력해주세요. (숫자 7~11자리)";
  }

  if (!fields.department.trim()) {
    errors.department = "학과를 입력해주세요.";
  } else if (fields.department.trim().length < 2) {
    errors.department = "학과명을 2자 이상 입력해주세요.";
  }

  return errors;
}

export default function SignupScreen() {
  const setPendingCredentials = useAuthStore((s) => s.setPendingCredentials);

  const [schoolEmail, setSchoolEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [studentId, setStudentId] = React.useState("");
  const [department, setDepartment] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<SignupFieldErrors>({});

  const handleSubmit = async () => {
    setErrorMessage(null);

    const errors = validate({ schoolEmail, password, name, studentId, department });
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setIsLoading(true);

    try {
      const result = await signup({
        schoolEmail: schoolEmail.trim(),
        password,
        name: name.trim(),
        studentId: studentId.trim(),
        department: department.trim(),
      });

      setPendingCredentials({ schoolEmail: schoolEmail.trim(), password });

      router.push({
        pathname: "/signup-verification",
        params: { email: result.email },
      });
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
      <SignupScreenContent
        schoolEmail={schoolEmail}
        password={password}
        name={name}
        studentId={studentId}
        department={department}
        onChangeSchoolEmail={(v) => { setSchoolEmail(v); setFieldErrors((e) => ({ ...e, schoolEmail: undefined })); }}
        onChangePassword={(v) => { setPassword(v); setFieldErrors((e) => ({ ...e, password: undefined })); }}
        onChangeName={(v) => { setName(v); setFieldErrors((e) => ({ ...e, name: undefined })); }}
        onChangeStudentId={(v) => { setStudentId(v); setFieldErrors((e) => ({ ...e, studentId: undefined })); }}
        onChangeDepartment={(v) => { setDepartment(v); setFieldErrors((e) => ({ ...e, department: undefined })); }}
        onSubmit={handleSubmit}
        onClose={() => router.back()}
        isLoading={isLoading}
        errorMessage={errorMessage}
        fieldErrors={fieldErrors}
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
