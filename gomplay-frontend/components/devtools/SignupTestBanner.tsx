import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useSignupTestStore } from "@/lib/devtools/signupTestMode";

/** 회원가입 테스트 모드가 켜져 있는 동안 화면 위쪽에 표시하는 안내 배너. */
export default function SignupTestBanner() {
  const enabled = useSignupTestStore((state) => state.enabled);
  const insets = useSafeAreaInsets();

  if (!enabled) return null;

  return (
    <View pointerEvents="none" style={[styles.wrapper, { top: insets.top + 4 }]}>
      <View style={styles.badge}>
        <Text style={styles.text}>회원가입 테스트 모드 · 서버에 저장 안 됨</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 1000,
    elevation: 1000,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: "rgba(245, 158, 11, 0.92)",
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
