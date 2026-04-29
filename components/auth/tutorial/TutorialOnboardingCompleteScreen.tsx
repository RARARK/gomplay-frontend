import { Image } from "expo-image";
import React from "react";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";

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
  cardAccent: string;
  cardTone: string;
};

const SLIDES: OnboardingSlide[] = [
  {
    id: "insight",
    title: "Daily insights from world-\nclass analysts",
    description: "Our analysts made their names at the top tier\ninstitutions",
    buttonLabel: "Next",
    heroAccent: "rgba(255, 211, 116, 0.38)",
    heroAccentSecondary: "rgba(68, 110, 255, 0.88)",
    cardAccent: "rgba(255, 246, 217, 0.88)",
    cardTone: "#2944EC",
  },
  {
    id: "schedule",
    title: "Stay on top of your\nweekly workout plan",
    description: "Track sessions, manage shared schedules,\nand keep every routine in sync.",
    buttonLabel: "Next",
    heroAccent: "rgba(164, 244, 214, 0.42)",
    heroAccentSecondary: "rgba(109, 90, 255, 0.82)",
    cardAccent: "rgba(232, 255, 244, 0.92)",
    cardTone: "#16A34A",
  },
  {
    id: "partner",
    title: "Meet better-matched\npartners, faster",
    description: "We combine your style, pace, and availability\nto recommend the right people.",
    buttonLabel: "Get Started",
    heroAccent: "rgba(255, 194, 228, 0.34)",
    heroAccentSecondary: "rgba(65, 114, 255, 0.82)",
    cardAccent: "rgba(245, 238, 255, 0.92)",
    cardTone: "#7C3AED",
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
      <View style={[styles.hero, { height: heroHeight }]}>
        <View
          style={[
            styles.phoneMock,
            {
              width: phoneWidth,
              height: phoneHeight,
            },
          ]}
        >
          <View
            style={[
              styles.phoneGlowLarge,
              { backgroundColor: slide.heroAccent },
            ]}
          />
          <View
            style={[
              styles.phoneGlowSmall,
              { backgroundColor: slide.heroAccentSecondary },
            ]}
          />
          <View style={styles.dynamicIsland} />
          <View style={styles.imageCluster}>
            <View style={styles.imageCardLeft} />
            <View style={styles.imageCardCenter}>
              <Image
                source={require("@/assets/login/tutorial_logo.png")}
                style={styles.centerImage}
                contentFit="contain"
              />
            </View>
            <View style={styles.imageCardRight} />
          </View>

          <View
            style={[
              styles.notificationCard,
              styles.notificationFront,
              { backgroundColor: slide.cardAccent },
            ]}
          >
            <View
              style={[
                styles.notificationIcon,
                { backgroundColor: slide.cardTone },
              ]}
            />
            <View style={styles.notificationBars}>
              <View style={styles.notificationBarLong} />
              <View style={styles.notificationBarShort} />
            </View>
            <View style={styles.notificationMetaDot} />
          </View>

          <View
            style={[
              styles.notificationCard,
              styles.notificationBack,
              activeIndex === 1
                ? styles.notificationBackRaised
                : activeIndex === 2
                  ? styles.notificationBackWide
                  : null,
            ]}
          >
            <View
              style={[
                styles.notificationIcon,
                { backgroundColor: slide.cardTone },
              ]}
            />
            <View style={styles.notificationBars}>
              <View style={styles.notificationBarLong} />
              <View style={styles.notificationBarShort} />
            </View>
            <View style={styles.notificationMetaDot} />
          </View>
        </View>
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
    width: "82%",
    height: "82%",
  },
  imageCardRight: {
    position: "absolute",
    right: 6,
    top: 24,
    width: 90,
    height: 122,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.72)",
    transform: [{ rotate: "14deg" }],
  },
  notificationCard: {
    position: "absolute",
    left: 84,
    right: 40,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 24,
    paddingRight: 18,
    paddingVertical: 18,
  },
  notificationFront: {
    bottom: 146,
    zIndex: 2,
  },
  notificationBack: {
    bottom: 88,
    backgroundColor: "rgba(235, 240, 255, 0.62)",
    zIndex: 1,
  },
  notificationBackRaised: {
    bottom: 98,
  },
  notificationBackWide: {
    right: 24,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    marginRight: 18,
  },
  notificationBars: {
    flex: 1,
  },
  notificationBarLong: {
    width: "76%",
    height: 14,
    borderRadius: 999,
    backgroundColor: "rgba(17,17,17,0.84)",
  },
  notificationBarShort: {
    marginTop: 8,
    width: "56%",
    height: 12,
    borderRadius: 999,
    backgroundColor: "rgba(17,17,17,0.34)",
  },
  notificationMetaDot: {
    marginLeft: 12,
    width: 18,
    height: 18,
    borderRadius: 999,
    backgroundColor: "rgba(17,17,17,0.16)",
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
