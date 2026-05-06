import * as React from "react";
import { Image } from "expo-image";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import Svg, { Polygon } from "react-native-svg";
import { Color, HomeLayout } from "@/constants/locofyHomeStyles";

type MatchingContentProps = {
  nearbyCount?: number;
  isFound?: boolean;
};

const BEAR_SIZE = HomeLayout.statusIllustrationSize; // 144
const RING_WRAPPER = 192;
const RING_VISUAL = 182;
const DOT_SIZE = 7;

// Ring center within wrapper: (96, 96)
// Dot centers on ring edge (screen coords, y-down):
//   Top    (270°): x=96,  y=96-91=5   → { top: 5 - 3.5=1.5,  left: 96 - 3.5=92.5 }
//   Right  (0°):   x=187, y=96        → { top: 92.5,          left: 187 - 3.5=183.5 }
//   BottomLeft(150°): x=96+91*cos(150)=96-78.8=17.2, y=96+91*sin(150)=96+45.5=141.5
const DOT_POSITIONS = [
  { top: 2, left: 93 },   // top
  { top: 93, left: 184 }, // right
  { top: 138, left: 14 }, // bottom-left
] as const;

function FourPointStar() {
  return (
    <Svg width={14} height={14} viewBox="0 0 20 20">
      <Polygon
        points="10,0 13.2,6.8 20,10 13.2,13.2 10,20 6.8,13.2 0,10 6.8,6.8"
        fill="#FCD34D"
      />
    </Svg>
  );
}

export default function MatchingContent({
  nearbyCount = 7,
  isFound = false,
}: MatchingContentProps) {
  const spinValue = React.useRef(new Animated.Value(0)).current;
  const dotOpacities = React.useRef(
    DOT_POSITIONS.map(() => new Animated.Value(0.25))
  ).current;
  const [ellipsis, setEllipsis] = React.useState("...");

  // Loading-only animations
  React.useEffect(() => {
    if (isFound) return;

    const anims: Animated.CompositeAnimation[] = [];

    // Rotating arc
    const spinAnim = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spinAnim.start();
    anims.push(spinAnim);

    // Staggered sparkle dots
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    dotOpacities.forEach((opacity, i) => {
      const t = setTimeout(() => {
        const dotAnim = Animated.loop(
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 1,
              duration: 520,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.15,
              duration: 780,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
          ])
        );
        dotAnim.start();
        anims.push(dotAnim);
      }, i * 380);
      timeouts.push(t);
    });

    // Ellipsis cycling
    let count = 3;
    const ellipsisTimer = setInterval(() => {
      count = count >= 3 ? 1 : count + 1;
      setEllipsis(".".repeat(count));
    }, 480);

    return () => {
      anims.forEach((a) => a.stop());
      timeouts.forEach((t) => clearTimeout(t));
      clearInterval(ellipsisTimer);
      spinValue.setValue(0);
    };
  }, [isFound, spinValue, dotOpacities]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <>
      <View style={styles.ringWrapper}>
        {/* Faint background track */}
        <View style={styles.ringTrack} />

        {/* Rotating arc (loading) */}
        {!isFound && (
          <Animated.View
            style={[styles.ringArc, { transform: [{ rotate: spin }] }]}
          />
        )}

        {/* Full ring (success) */}
        {isFound && <View style={styles.ringSuccess} />}

        {/* Bear image */}
        <Image
          style={styles.bearImage}
          contentFit="cover"
          source={require("@/assets/home/MatchingBear.png")}
        />

        {/* Sparkle dots (loading) */}
        {!isFound &&
          DOT_POSITIONS.map((pos, i) => (
            <Animated.View
              key={i}
              style={[styles.dot, pos, { opacity: dotOpacities[i] }]}
            />
          ))}
      </View>

      <View style={styles.textBlock}>
        {isFound ? (
          <>
            <Text style={styles.titleSuccess}>
              {nearbyCount}명의 추천 파트너를 찾았어요!
            </Text>
            <Text style={styles.description}>
              조건에 맞는 파트너를 확인해보세요
            </Text>
          </>
        ) : (
          <>
            <View style={styles.titleRow}>
              <FourPointStar />
              <Text style={styles.title}>Finding your partner</Text>
              <View style={styles.ellipsisBox}>
                <Text style={styles.title}>{ellipsis}</Text>
              </View>
            </View>
            <Text style={styles.description}>
              주변 공강 파트너를 찾고 있어요
            </Text>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  ringWrapper: {
    width: RING_WRAPPER,
    height: RING_WRAPPER,
    alignItems: "center",
    justifyContent: "center",
  },

  ringTrack: {
    position: "absolute",
    width: RING_VISUAL,
    height: RING_VISUAL,
    borderRadius: RING_VISUAL / 2,
    borderWidth: 1.5,
    borderColor: "rgba(76, 91, 226, 0.14)",
  },

  // Two-tone arc: solid leading edge fading to transparent tail
  ringArc: {
    position: "absolute",
    width: RING_VISUAL,
    height: RING_VISUAL,
    borderRadius: RING_VISUAL / 2,
    borderWidth: 2,
    borderTopColor: "#4C5BE2",
    borderRightColor: "rgba(76, 91, 226, 0.35)",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
  },

  ringSuccess: {
    position: "absolute",
    width: RING_VISUAL,
    height: RING_VISUAL,
    borderRadius: RING_VISUAL / 2,
    borderWidth: 2,
    borderColor: "rgba(76, 91, 226, 0.45)",
  },

  bearImage: {
    width: BEAR_SIZE,
    height: BEAR_SIZE,
  },

  dot: {
    position: "absolute",
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: "#4C5BE2",
  },

  textBlock: {
    width: "100%",
    minHeight: HomeLayout.statusContentMinHeight,
    marginTop: 24,
    paddingHorizontal: 24,
    gap: 8,
    alignItems: "center",
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },

  ellipsisBox: {
    width: 22,
  },

  title: {
    textAlign: "center",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",
    color: Color.primary100,
    letterSpacing: -0.3,
  },

  titleSuccess: {
    textAlign: "center",
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "700",
    color: Color.primary100,
    letterSpacing: -0.3,
  },

  description: {
    textAlign: "center",
    fontSize: 13,
    lineHeight: 18,
    color: Color.neutral700,
    letterSpacing: -0.08,
  },
});
