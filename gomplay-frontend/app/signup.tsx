import { router } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SignupScreenContent, {
  type SignupFieldErrors,
} from "@/components/auth/signup/SignupScreenContent";
import { AuthError, signup } from "@/services/auth/authService";
import { useAuthStore } from "@/stores/auth/authStore";

const DANKOOK_EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@dankook\.ac\.kr$/i;
const PASSWORD_REGEX = /(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/;
const DANKOOK_EMAIL_ERROR = "단국대학교 이메일(@dankook.ac.kr)만 사용할 수 있습니다.";
const PASSWORD_LENGTH_ERROR = "비밀번호는 8자리 이상이어야 합니다.";
const PASSWORD_COMPLEXITY_ERROR = "영문, 숫자, 특수문자를 모두 포함해야 합니다.";
const PASSWORD_CONFIRM_ERROR = "비밀번호가 일치하지 않습니다.";

function validate(fields: {
  schoolEmail: string;
  password: string;
  passwordConfirm: string;
  name: string;
  studentId: string;
  college: string;
  department: string;
}): SignupFieldErrors {
  const errors: SignupFieldErrors = {};
  const schoolEmail = fields.schoolEmail.trim();

  if (!schoolEmail) {
    errors.schoolEmail = "이메일을 입력해주세요.";
  } else if (!DANKOOK_EMAIL_REGEX.test(schoolEmail)) {
    errors.schoolEmail = DANKOOK_EMAIL_ERROR;
  }

  if (!fields.password) {
    errors.password = "비밀번호를 입력해주세요.";
  } else if (fields.password.length < 8) {
    errors.password = PASSWORD_LENGTH_ERROR;
  } else if (!PASSWORD_REGEX.test(fields.password)) {
    errors.password = PASSWORD_COMPLEXITY_ERROR;
  }

  if (!fields.passwordConfirm) {
    errors.passwordConfirm = "비밀번호를 한 번 더 입력해주세요.";
  } else if (fields.password !== fields.passwordConfirm) {
    errors.passwordConfirm = PASSWORD_CONFIRM_ERROR;
  }

  if (!fields.name.trim()) {
    errors.name = "이름을 입력해주세요.";
  } else if (!/^[가-힣a-zA-Z\s]{2,}$/.test(fields.name.trim())) {
    errors.name = "올바른 이름을 입력해주세요. (2자 이상, 한글 또는 영문)";
  }

  if (!fields.studentId.trim()) {
    errors.studentId = "입학년도를 선택해주세요.";
  } else if (!/^\d{4}$/.test(fields.studentId.trim())) {
    errors.studentId = "올바른 입학년도를 선택해주세요.";
  }

  if (!fields.college.trim()) {
    errors.college = "단과대학을 선택해주세요.";
  }

  if (!fields.department.trim()) {
    errors.department = "학과를 선택해주세요.";
  }

  return errors;
}

export default function SignupScreen() {
  const setPendingCredentials = useAuthStore((s) => s.setPendingCredentials);

  const [schoolEmail, setSchoolEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordConfirm, setPasswordConfirm] = React.useState("");
  const [name, setName] = React.useState("");
  const [studentId, setStudentId] = React.useState("");
  const [college, setCollege] = React.useState("");
  const [department, setDepartment] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<SignupFieldErrors>({});

  const getSchoolEmailError = (value: string) => {
    const email = value.trim();
    return email && !DANKOOK_EMAIL_REGEX.test(email) ? DANKOOK_EMAIL_ERROR : undefined;
  };

  const getPasswordError = (value: string) => {
    if (!value) return undefined;
    if (value.length < 8) return PASSWORD_LENGTH_ERROR;
    return PASSWORD_REGEX.test(value) ? undefined : PASSWORD_COMPLEXITY_ERROR;
  };

  const getPasswordConfirmError = (nextPassword: string, nextPasswordConfirm: string) => {
    if (!nextPassword || !nextPasswordConfirm) return undefined;
    return nextPassword !== nextPasswordConfirm ? PASSWORD_CONFIRM_ERROR : undefined;
  };

  const validateSchoolEmailOnBlur = () => {
    setFieldErrors((e) => ({ ...e, schoolEmail: getSchoolEmailError(schoolEmail) }));
  };

  const validatePasswordConfirmOnBlur = () => {
    setFieldErrors((e) => ({
      ...e,
      passwordConfirm: getPasswordConfirmError(password, passwordConfirm),
    }));
  };

  const validatePasswordOnBlur = () => {
    setFieldErrors((e) => ({
      ...e,
      password: getPasswordError(password),
      passwordConfirm: getPasswordConfirmError(password, passwordConfirm),
    }));
  };

  const handleSubmit = async () => {
    setErrorMessage(null);

    const errors = validate({ schoolEmail, password, passwordConfirm, name, studentId, college, department });
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
        studentId: `${studentId.trim()}학번`,
        department: department.trim(),
        college: college.trim(),
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
        passwordConfirm={passwordConfirm}
        name={name}
        studentId={studentId}
        college={college}
        department={department}
        onChangeSchoolEmail={(v) => { setSchoolEmail(v); setFieldErrors((e) => ({ ...e, schoolEmail: undefined })); }}
        onBlurSchoolEmail={validateSchoolEmailOnBlur}
        onChangePassword={(v) => { setPassword(v); setFieldErrors((e) => ({ ...e, password: undefined, passwordConfirm: undefined })); }}
        onBlurPassword={validatePasswordOnBlur}
        onChangePasswordConfirm={(v) => { setPasswordConfirm(v); setFieldErrors((e) => ({ ...e, passwordConfirm: undefined })); }}
        onBlurPasswordConfirm={validatePasswordConfirmOnBlur}
        onChangeName={(v) => { setName(v); setFieldErrors((e) => ({ ...e, name: undefined })); }}
        onChangeStudentId={(v) => { setStudentId(v); setFieldErrors((e) => ({ ...e, studentId: undefined })); }}
        onChangeCollege={(v) => { setCollege(v); setDepartment(""); setFieldErrors((e) => ({ ...e, college: undefined, department: undefined })); }}
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
