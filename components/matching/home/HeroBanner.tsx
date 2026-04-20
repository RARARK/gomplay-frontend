import * as React from "react";
import { useMemo, useState } from "react";
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

const banners = [
  {
    image: require("@/assets/home/HeroBanner.png"),
    text: "just do it!",
  },
  {
    image: require("@/assets/home/adaptive-icon.png"),
    text: null,
  },
  {
    image: require("@/assets/home/icon.png"),
    text: null,
  },
];

const HeroBanner = () => {
  const [index, setIndex] = useState(0);

  const prev = () => {
    setIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const next = () => {
    setIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
          return (
            Math.abs(gestureState.dx) > 15 &&
            Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
          );
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dx > 50) {
            prev();
          } else if (gestureState.dx < -50) {
            next();
          }
        },
      }),
    [],
  );

  const currentBanner = banners[index];

  return (
    <View {...panResponder.panHandlers}>
      <ImageBackground
        style={styles.heroBanner}
        imageStyle={styles.heroBannerImage}
        source={currentBanner.image}
      >
        <View style={styles.overlay}>
          <Pressable onPress={prev} hitSlop={10}>
            <BannerImage1 style={styles.leftArrow} width={48} height={48} />
          </Pressable>

          {currentBanner.text ? (
            <Text style={styles.justDoIt}>{currentBanner.text}</Text>
          ) : (
            <View />
          )}

          <Pressable onPress={next} hitSlop={10}>
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
  heroBannerImage: {
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
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
  justDoIt: {
    fontSize: 34,
    letterSpacing: 0.37,
    lineHeight: 41,
    fontWeight: "700",
    fontFamily: FontFamily.inter,
    color: Color.accent100,
    textAlign: "center",
  },
});

export default HeroBanner;
