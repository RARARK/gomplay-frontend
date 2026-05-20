import * as React from "react";
import { Image } from "expo-image";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  PanResponder,
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

const HeroBanner = React.memo(({ banners = [] }: HeroBannerProps) => {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (banners.length === 0) {
      if (index !== 0) setIndex(0);
      return;
    }
    if (index > banners.length - 1) setIndex(banners.length - 1);
  }, [banners.length, index]);

  React.useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((current) => (current === banners.length - 1 ? 0 : current + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, [index, banners.length]);

  const prev = React.useCallback(() => {
    if (banners.length <= 1) return;
    setIndex((current) => (current === 0 ? banners.length - 1 : current - 1));
  }, [banners.length]);

  const next = React.useCallback(() => {
    if (banners.length <= 1) return;
    setIndex((current) => (current === banners.length - 1 ? 0 : current + 1));
  }, [banners.length]);

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

  const currentBanner = banners[index] ?? FALLBACK_BANNER;

  return (
    <View style={styles.wrapper}>
      <View {...panResponder.panHandlers} style={styles.heroBanner}>
        <Image
          source={currentBanner.image}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />

        {currentBanner.onPress ? (
          <Pressable
            accessibilityRole="button"
            onPress={currentBanner.onPress}
            style={StyleSheet.absoluteFill}
          />
        ) : null}

        {banners.length > 1 ? (
          <View style={styles.dotRow}>
            {banners.map((_, i) => (
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
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 22,
    paddingBottom: 30,
    gap: 9,
  },
  tagChip: {
    alignSelf: "flex-start",
    backgroundColor: "#4C5BE2",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  actionButton: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
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
    width: 7,
    height: 7,
    borderRadius: 4,
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
