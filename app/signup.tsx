import { router } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SignupScreenContent from "@/components/auth/signup/SignupScreenContent";
import { AuthError, signup } from "@/services/auth/authService";
import { useAuthStore } from "@/stores/auth/authStore";

export default function SignupScreen() {
  const setPendingCredentials = useAuthStore((s) => s.setPendingCredentials);

  const [schoolEmail, setSchoolEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [studentId, setStudentId] = React.useState("");
  const [department, setDepartment] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = async () => {
    setErrorMessage(null);
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
        onChangeSchoolEmail={setSchoolEmail}
        onChangePassword={setPassword}
        onChangeName={setName}
        onChangeStudentId={setStudentId}
        onChangeDepartment={setDepartment}
        onSubmit={handleSubmit}
        onClose={() => router.back()}
        isLoading={isLoading}
        errorMessage={errorMessage}
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
