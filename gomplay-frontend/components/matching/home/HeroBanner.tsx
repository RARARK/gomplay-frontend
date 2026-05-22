import * as React from "react";
import { Image } from "expo-image";
import {
  Animated,
  Easing,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { Banner } from "@/types/ui/homeBanner";

type HeroBannerProps = {
  banners?: Banner[];
};

const FALLBACK_BANNER: Banner = {
  id: "fallback-banner",
  image: require("../../../assets/home/HeroBanner.png"),
  tag: "새로운 사람과",
  text: "같이 운동할 때\n더 즐거워요!",
};

const AUTO_SLIDE_MS = 5000;
const TRANSITION_MS = 350;

const HeroBanner = React.memo(({ banners = [] }: HeroBannerProps) => {
  const displayBanners = banners.length > 0 ? banners : [FALLBACK_BANNER];
  const [index, setIndex] = React.useState(0);
  const [bannerWidth, setBannerWidth] = React.useState(0);
  const translateX = React.useRef(new Animated.Value(0)).current;
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const indexRef = React.useRef(0);
  const isAnimatingRef = React.useRef(false);

  React.useEffect(() => {
    if (index > displayBanners.length - 1) {
      setIndex(displayBanners.length - 1);
      indexRef.current = displayBanners.length - 1;
    }
  }, [displayBanners.length, index]);

  React.useEffect(() => {
    if (bannerWidth <= 0) return;
    translateX.setValue(-indexRef.current * bannerWidth);
  }, [bannerWidth, translateX]);

  const clearAutoTimer = React.useCallback(() => {
    if (!timerRef.current) return;
    clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const slideTo = React.useCallback(
    (targetIndex: number) => {
      if (
        displayBanners.length <= 1 ||
        bannerWidth <= 0 ||
        isAnimatingRef.current ||
        targetIndex === indexRef.current
      ) {
        return;
      }

      clearAutoTimer();
      isAnimatingRef.current = true;

      Animated.timing(translateX, {
        toValue: -targetIndex * bannerWidth,
        duration: TRANSITION_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          indexRef.current = targetIndex;
          setIndex(targetIndex);
        }
        isAnimatingRef.current = false;
      });
    },
    [bannerWidth, clearAutoTimer, displayBanners.length, translateX],
  );

  const scheduleAutoSlide = React.useCallback(() => {
    clearAutoTimer();
    if (displayBanners.length <= 1 || bannerWidth <= 0) return;

    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      const current = indexRef.current;
      slideTo(current === displayBanners.length - 1 ? 0 : current + 1);
    }, AUTO_SLIDE_MS);
  }, [bannerWidth, clearAutoTimer, displayBanners.length, slideTo]);

  React.useEffect(() => {
    scheduleAutoSlide();
    return clearAutoTimer;
  }, [index, scheduleAutoSlide, clearAutoTimer]);

  const prev = React.useCallback(() => {
    const current = indexRef.current;
    slideTo(current === 0 ? displayBanners.length - 1 : current - 1);
  }, [displayBanners.length, slideTo]);

  const next = React.useCallback(() => {
    const current = indexRef.current;
    slideTo(current === displayBanners.length - 1 ? 0 : current + 1);
  }, [displayBanners.length, slideTo]);

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) > 15 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dx > 50) prev();
          else if (gestureState.dx < -50) next();
        },
      }),
    [prev, next],
  );

  const currentBanner = displayBanners[index] ?? FALLBACK_BANNER;

  return (
    <View style={styles.wrapper}>
      <View
        {...panResponder.panHandlers}
        style={styles.heroBanner}
        onLayout={(event) => setBannerWidth(event.nativeEvent.layout.width)}
      >
        {bannerWidth > 0 ? (
          <Animated.View
            style={[
              styles.bannerTrack,
              {
                width: bannerWidth * displayBanners.length,
                transform: [{ translateX }],
              },
            ]}
          >
            {displayBanners.map((banner) => (
              <View
                key={banner.id}
                style={[styles.bannerSlide, { width: bannerWidth }]}
              >
                <Image
                  source={banner.image}
                  style={StyleSheet.absoluteFill}
                  contentFit="cover"
                  cachePolicy="memory-disk"
                />
              </View>
            ))}
          </Animated.View>
        ) : null}

        {currentBanner.onPress ? (
          <Pressable
            accessibilityRole="button"
            onPress={currentBanner.onPress}
            style={StyleSheet.absoluteFill}
          />
        ) : null}

        {displayBanners.length > 1 ? (
          <View style={styles.dotRow}>
            {displayBanners.map((_, i) => (
              <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
            ))}
          </View>
        ) : null}

        {currentBanner.isAd ? (
          <View style={styles.adBadge}>
            <Text style={styles.adBadgeText}>AD</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
  },
  heroBanner: {
    width: "100%",
    aspectRatio: 402 / 220,
    overflow: "hidden",
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  bannerTrack: {
    height: "100%",
    flexDirection: "row",
  },
  bannerSlide: {
    height: "100%",
  },
  dotRow: {
    position: "absolute",
    bottom: 11,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  dotActive: {
    backgroundColor: "#4C5BE2",
  },
  adBadge: {
    position: "absolute",
    top: 10,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  adBadgeText: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.8,
  },
});

HeroBanner.displayName = "HeroBanner";

export default HeroBanner;
