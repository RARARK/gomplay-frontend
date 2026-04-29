import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type ImageSourcePropType,
} from "react-native";

import ChatLocationPin from "@/assets/chat/Locationpin.png";
import ChatProfileImage from "@/assets/chat/Profileimage.png";
import HomeMatchingBear from "@/assets/home/MatchingBear.png";
import HomePartnerCardBackground from "@/assets/home/PartnerCardBackground.png";
import HomePartnerCardBackground2 from "@/assets/home/PartnerCardBackground2.png";
import HomePartnerProfileImage from "@/assets/home/PartnerProfileImage.png";
import HomeScheduleBear from "@/assets/home/ScheduleBear.png";
import LoginTutorialLogo from "@/assets/login/tutorial_logo.png";

type TutorialOnboardingCompleteScreenProps = {
  onPressCta: () => void;
};

type OnboardingSlide = {
  id: string;
  title: string;
  description: string;
  buttonLabel: string;
  heroAccent: string;
  heroAccentSecondary: string;
  leftImage: ImageSourcePropType;
  centerImage: ImageSourcePropType;
  rightImage: ImageSourcePropType;
};

const SLIDES: OnboardingSlide[] = [
  {
    id: "insight",
    title: "Find the perfect workout partner for you!",
    description: "Stay consistent more easily—and enjoy working out together.",
    buttonLabel: "Next",
    heroAccent: "rgba(255, 211, 116, 0.38)",
    heroAccentSecondary: "rgba(68, 110, 255, 0.88)",
    leftImage: HomePartnerProfileImage,
    centerImage: HomePartnerCardBackground,
    rightImage: ChatProfileImage,
  },
  {
    id: "quick match",
    title: "Get matched instantly",
    description:
      "Find a partner and start working out right away.\nNo more waiting, no more hassle.",
    buttonLabel: "Next",
    heroAccent: "rgba(164, 244, 214, 0.42)",
    heroAccentSecondary: "rgba(109, 90, 255, 0.82)",
    leftImage: HomePartnerCardBackground2,
    centerImage: HomeScheduleBear,
    rightImage: ChatLocationPin,
  },
  {
    id: "normal match",
    title: "Match with partners on a set schedule",
    description:
      "Work out at a fixed time that fits you.\nConsistency is the key to success.",
    buttonLabel: "Next",
    heroAccent: "rgba(255, 194, 228, 0.34)",
    heroAccentSecondary: "rgba(65, 114, 255, 0.82)",
    leftImage: HomeMatchingBear,
    centerImage: LoginTutorialLogo,
    rightImage: HomeScheduleBear,
  },
  {
    id: "partner match",
    title: "Find partners who match your style",
    description:
      "Get matched with partners who have similar workout styles and preferences.\nEnjoy a more personalized workout experience.",
    buttonLabel: "Get Started",
    heroAccent: "rgba(255, 225, 163, 0.36)",
    heroAccentSecondary: "rgba(44, 111, 255, 0.84)",
    leftImage: HomePartnerProfileImage,
    centerImage: HomePartnerCardBackground2,
    rightImage: ChatProfileImage,
  },
];

export default function TutorialOnboardingCompleteScreen({
  onPressCta,
}: TutorialOnboardingCompleteScreenProps) {
  const { width, height } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = React.useState(0);

  const heroHeight = Math.min(Math.max(height * 0.42, 320), 420);
  const phoneWidth = Math.min(width * 0.88, 500);
  const phoneHeight = phoneWidth * 1.18;
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
      <View style={[styles.hero, { height: heroHeight }]}></View>

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
