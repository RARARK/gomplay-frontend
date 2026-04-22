import * as React from "react";
import {
  StyleSheet,
  Text,
  ImageBackground,
  View,
  Pressable,
  PanResponder,
} from "react-native";
import BannerImage1 from "@/assets/home/Banner-Image.svg";
import { Color, FontFamily } from "@/constants/locofyHomeStyles";
import type { Banner } from "@/types/ui/homeBanner";

type HeroBannerProps = {
  banners?: Banner[];
};

const FALLBACK_BANNER: Banner = {
  id: "fallback-banner",
  image: require("../../../assets/home/icon.png"),
  text: "Welcome to Gomplay",
};

// Receive banner data from the parent so this component only handles banner UI.
const HeroBanner = ({ banners = [] }: HeroBannerProps) => {
  const [index, setIndex] = React.useState(0);

  // Keep the current index in bounds when the banner list changes.
  React.useEffect(() => {
    if (banners.length === 0) {
      if (index !== 0) {
        setIndex(0);
      }
      return;
    }

    if (index > banners.length - 1) {
      setIndex(banners.length - 1);
    }
  }, [banners.length, index]);

  const prev = React.useCallback(() => {
    if (banners.length <= 1) {
      return;
    }

    setIndex((current) => (current === 0 ? banners.length - 1 : current - 1));
  }, [banners.length]);

  const next = React.useCallback(() => {
    if (banners.length <= 1) {
      return;
    }

    setIndex((current) => (current === banners.length - 1 ? 0 : current + 1));
  }, [banners.length]);

  // Handle horizontal swipes without interfering with vertical scrolling.
  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) > 15 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dx > 50) {
            prev();
          } else if (gestureState.dx < -50) {
            next();
          }
        },
      }),
    [prev, next],
  );

  const currentBanner = banners[index] ?? FALLBACK_BANNER;
  const bannerImageSource = currentBanner.image ?? FALLBACK_BANNER.image;

  return (
    <View {...panResponder.panHandlers}>
      <ImageBackground
        style={styles.heroBanner}
        imageStyle={styles.heroBannerImage}
        source={bannerImageSource}
      >
        <View style={styles.overlay}>
          <Pressable onPress={prev} hitSlop={10} style={styles.arrowButton}>
            <BannerImage1 style={styles.leftArrow} width={48} height={48} />
          </Pressable>

          <View style={styles.textContainer}>
            {currentBanner.text ? (
              <Text style={styles.bannerText}>{currentBanner.text}</Text>
            ) : null}
          </View>

          <Pressable onPress={next} hitSlop={10} style={styles.arrowButton}>
            <BannerImage1 style={styles.rightArrow} width={48} height={48} />
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  heroBanner: {
    width: "100%",
    aspectRatio: 402 / 209,
    overflow: "hidden",
  },
  emptyBanner: {
    backgroundColor: "#e9e9e9",
  },
  heroBannerImage: {
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  arrowButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  leftArrow: {
    width: 48,
    height: 48,
  },
  rightArrow: {
    width: 48,
    height: 48,
    transform: [{ scaleX: -1 }],
  },
  bannerText: {
    fontSize: 34,
    letterSpacing: 0.37,
    lineHeight: 41,
    fontWeight: "700",
    fontFamily: FontFamily.inter,
    color: Color.accent100,
    textAlign: "center",
    maxWidth: "100%",
  },
});

export default HeroBanner;
