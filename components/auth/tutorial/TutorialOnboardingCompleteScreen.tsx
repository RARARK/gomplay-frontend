import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type ImageSourcePropType,
} from "react-native";
import { Image } from "expo-image";

import OnboardingImage1 from "@/assets/login/onboarding1.png";
import OnboardingImage2 from "@/assets/login/onboarding2.png";
import OnboardingImage3 from "@/assets/login/onboarding3.png";
import OnboardingImage4 from "@/assets/login/onboarding4.png";

type TutorialOnboardingCompleteScreenProps = {
  onPressCta: () => void;
};

type OnboardingSlide = {
  id: string;
  title: string;
  description: string;
  buttonLabel: string;
  heroImage: ImageSourcePropType;
};

const SLIDES: OnboardingSlide[] = [
  {
    id: "insight",
    title: "나에게 딱 맞는\n운동 파트너를 찾아보세요!",
    description: "함께 운동하면 꾸준함이 달라져요.",
    buttonLabel: "다음",
    heroImage: OnboardingImage1,
  },
  {
    id: "quick match",
    title: "지금 바로 매칭해보세요!",
    description: "기다림 없이 파트너를 찾고\n바로 운동을 시작해보세요.",
    buttonLabel: "다음",
    heroImage: OnboardingImage2,
  },
  {
    id: "normal match",
    title: "정해진 일정으로\n함께 운동해요",
    description: "나에게 맞는 시간에 고정 파트너와\n꾸준히 운동할 수 있어요.",
    buttonLabel: "다음",
    heroImage: OnboardingImage3,
  },
  {
    id: "partner match",
    title: "운동 스타일이 맞는\n파트너와 매칭해보세요!",
    description:
      "비슷한 운동 성향과 취향을 가진 파트너와\n더 즐거운 운동을 경험해보세요.",
    buttonLabel: "시작하기",
    heroImage: OnboardingImage4,
  },
];

export default function TutorialOnboardingCompleteScreen({
  onPressCta,
}: TutorialOnboardingCompleteScreenProps) {
  const { height } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = React.useState(0);

  const heroHeight = Math.min(Math.max(height * 0.42, 320), 420);
  const slide = SLIDES[activeIndex];

  const handlePress = () => {
    if (activeIndex === SLIDES.length - 1) {
      onPressCta();
      return;
    }

    setActiveIndex((current) => current + 1);
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.hero, { height: heroHeight }]}>
        <Image
          source={slide.heroImage}
          style={styles.heroImage}
          contentFit="cover"
          transition={180}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.copyBlock}>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.description}>{slide.description}</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.pageIndicator}>
            {SLIDES.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.pageDot,
                  index === activeIndex && styles.pageDotActive,
                ]}
              />
            ))}
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={handlePress}
            style={styles.ctaButton}
          >
            <Text style={styles.ctaText}>{slide.buttonLabel}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  hero: {
    backgroundColor: "#2F43E8",
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  phoneMock: {
    position: "absolute",
    right: -58,
    top: 64,
    borderRadius: 40,
    backgroundColor: "#59AEE8",
    overflow: "hidden",
    transform: [{ rotate: "14deg" }],
  },
  phoneGlowLarge: {
    position: "absolute",
    width: "120%",
    height: "120%",
    left: "-12%",
    top: "8%",
    borderRadius: 999,
  },
  phoneGlowSmall: {
    position: "absolute",
    width: "66%",
    height: "66%",
    right: "-10%",
    bottom: "-4%",
    borderRadius: 999,
  },
  dynamicIsland: {
    position: "absolute",
    top: 28,
    right: 42,
    width: 182,
    height: 34,
    borderRadius: 999,
    backgroundColor: "#050505",
  },
  imageCluster: {
    position: "absolute",
    top: 118,
    left: 116,
    right: 92,
    height: 196,
    alignItems: "center",
    justifyContent: "center",
  },
  imageCardLeft: {
    position: "absolute",
    left: 0,
    top: 18,
    width: 92,
    height: 128,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.78)",
    overflow: "hidden",
    transform: [{ rotate: "-16deg" }],
  },
  imageCardCenter: {
    width: 148,
    height: 178,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.45)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  centerImage: {
    width: "100%",
    height: "100%",
  },
  imageCardRight: {
    position: "absolute",
    right: 6,
    top: 24,
    width: 90,
    height: 122,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.72)",
    overflow: "hidden",
    transform: [{ rotate: "14deg" }],
  },
  sideImage: {
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 34,
    paddingHorizontal: 32,
    paddingBottom: 28,
  },
  copyBlock: {
    gap: 22,
  },
  title: {
    fontSize: 32,
    lineHeight: 44,
    fontWeight: "800",
    color: "#17171F",
    letterSpacing: -1.2,
  },
  description: {
    fontSize: 20,
    lineHeight: 30,
    fontWeight: "500",
    color: "#25252D",
    letterSpacing: -0.3,
  },
  footer: {
    paddingTop: 18,
  },
  pageIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginBottom: 46,
  },
  pageDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: "#C9C9CE",
  },
  pageDotActive: {
    backgroundColor: "#1D1D1F",
  },
  ctaButton: {
    height: 86,
    borderRadius: 999,
    backgroundColor: "#2F43E8",
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.4,
  },
});
