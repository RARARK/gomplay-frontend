import { Image } from "expo-image";
import React from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

const ANALYZING_TITLE = "사용자의 성향을 분석중입니다...";
const ANALYZING_SUBTITLE = "잠시만 기다려주세요..";

export default function TutorialAnalyzingScreen() {
  const progress = React.useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();
  const logoWidth = Math.min(width * 0.48, 184);
  const logoHeight = logoWidth * (154 / 184);

  React.useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 3600,
      delay: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{ANALYZING_TITLE}</Text>

        <View style={styles.logoWrapper}>
          <Image
            source={require("@/assets/login/tutorial_logo.png")}
            style={{ width: logoWidth, height: logoHeight }}
            contentFit="contain"
          />
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[styles.progressActive, { width: progressWidth }]}
            />
          </View>
          <Text style={styles.subtitle}>{ANALYZING_SUBTITLE}</Text>
        </View>
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
    paddingHorizontal: 32,
  },
  content: {
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
    gap: 40,
  },
  title: {
    width: "100%",
    fontSize: 20,
    lineHeight: 34,
    fontWeight: "700",
    color: "#111111",
    textAlign: "center",
    fontFamily: "System",
    letterSpacing: -0.5,
  },
  logoWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  progressSection: {
    width: "100%",
    alignItems: "center",
    gap: 24,
  },
  progressTrack: {
    width: "100%",
    height: 8,
    borderRadius: 999,
    backgroundColor: "#E8E8F3",
    overflow: "hidden",
  },
  progressActive: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#4C5BE2",
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "600",
    color: "#111111",
    textAlign: "center",
    fontFamily: "System",
  },
});
