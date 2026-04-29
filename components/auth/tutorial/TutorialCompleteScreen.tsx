import { Image } from "expo-image";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type TutorialCompleteScreenProps = {
  onPressCta: () => void;
};

const TITLE = "운동 파트너를 찾을 준비가 끝났어요!";
const DESCRIPTION =
  "입력한 정보와 성향을 바탕으로 잘 맞는 파트너를 추천해드릴게요.";
const CTA_LABEL = "맞춤 파트너 보러가기";

export default function TutorialCompleteScreen({
  onPressCta,
}: TutorialCompleteScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("@/assets/login/tutorial_logo.png")}
          style={styles.logo}
          contentFit="contain"
        />

        <View style={styles.copyBlock}>
          <Text style={styles.title}>{TITLE}</Text>
          <Text style={styles.description}>{DESCRIPTION}</Text>
        </View>

        <Pressable onPress={onPressCta} style={styles.ctaButton}>
          <Text style={styles.ctaText}>{CTA_LABEL}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },
  content: {
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
    gap: 36,
  },
  logo: {
    width: 184,
    height: 154,
  },
  copyBlock: {
    width: "100%",
    gap: 14,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "800",
    color: "#111111",
    textAlign: "center",
    fontFamily: "System",
    letterSpacing: -0.8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500",
    color: "#6B7280",
    textAlign: "center",
    fontFamily: "System",
  },
  ctaButton: {
    width: "100%",
    minHeight: 56,
    borderRadius: 14,
    backgroundColor: "#4C5BE2",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  ctaText: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    fontFamily: "System",
  },
});
