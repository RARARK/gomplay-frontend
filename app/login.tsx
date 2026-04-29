import { router } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import LoginScreenContent from "@/components/auth/LoginScreenContent";
import { useAuthStore } from "@/stores/auth/authStore";

export default function LoginScreen() {
  const setUser = useAuthStore((state) => state.setUser);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLoginPress = () => {
    setUser({
      id: 1,
      nickname: email.trim() || "Gomplay User",
    });
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LoginScreenContent
        email={email}
        password={password}
        onChangeEmail={setEmail}
        onChangePassword={setPassword}
        onLoginPress={handleLoginPress}
        onSignupPress={() => router.push("/signup")}
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
