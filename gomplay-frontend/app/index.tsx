import { Redirect } from "expo-router";

import { useAuthStore } from "@/stores/auth/authStore";
import LoginScreen from "@/app/login";

export default function Index() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  return <Redirect href="/(tabs)" />;
}
