import { router } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SignupScreenContent from "@/components/auth/signup/SignupScreenContent";

export default function SignupScreen() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [nickname, setNickname] = React.useState("");
  const [studentId, setStudentId] = React.useState("");

  const handleSubmit = () => {
    router.push({
      pathname: "/signup-verification",
      params: { email },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <SignupScreenContent
        email={email}
        password={password}
        nickname={nickname}
        studentId={studentId}
        onChangeEmail={setEmail}
        onChangePassword={setPassword}
        onChangeNickname={setNickname}
        onChangeStudentId={setStudentId}
        onSubmit={handleSubmit}
        onClose={() => router.back()}
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
