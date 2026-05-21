import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type WorkoutCompleteModalProps = {
  visible: boolean;
  onReviewPress: () => void;
  onLaterPress: () => void;
};

type Piece = {
  color: string;
  peakX: number;
  peakY: number;
  finalX: number;
  finalY: number;
  rotations: number;
  width: number;
  height: number;
  borderRadius: number;
  delay: number;
  duration: number;
};

// Each piece arcs upward (peakY < 0) then falls (finalY > 0)
const PIECES: Piece[] = [
  { color: "#55B8A5", peakX: -70,  peakY: -72,  finalX: -86,  finalY: 100, rotations: 2, width: 7,  height: 18, borderRadius: 2,   delay: 0,   duration: 1100 },
  { color: "#F0A33A", peakX: -50,  peakY: -96,  finalX: -58,  finalY: 120, rotations: 3, width: 5,  height: 12, borderRadius: 999, delay: 40,  duration: 1200 },
  { color: "#6366F1", peakX: -92,  peakY: -40,  finalX: -112, finalY: 72,  rotations: 2, width: 8,  height: 14, borderRadius: 0,   delay: 80,  duration: 1050 },
  { color: "#E78ABE", peakX: -36,  peakY: -84,  finalX: -42,  finalY: 136, rotations: 4, width: 6,  height: 10, borderRadius: 999, delay: 20,  duration: 1300 },
  { color: "#5B7CE2", peakX: 72,   peakY: -68,  finalX: 88,   finalY: 98,  rotations: 2, width: 7,  height: 16, borderRadius: 2,   delay: 0,   duration: 1100 },
  { color: "#FFD93D", peakX: 54,   peakY: -94,  finalX: 62,   finalY: 118, rotations: 3, width: 5,  height: 11, borderRadius: 999, delay: 60,  duration: 1200 },
  { color: "#F472B6", peakX: 98,   peakY: -36,  finalX: 118,  finalY: 68,  rotations: 2, width: 8,  height: 13, borderRadius: 0,   delay: 30,  duration: 1000 },
  { color: "#6BCB77", peakX: 38,   peakY: -86,  finalX: 44,   finalY: 128, rotations: 4, width: 6,  height: 10, borderRadius: 999, delay: 90,  duration: 1250 },
  { color: "#C9B9F9", peakX: -16,  peakY: -108, finalX: -20,  finalY: 82,  rotations: 3, width: 6,  height: 14, borderRadius: 2,   delay: 10,  duration: 1150 },
  { color: "#FF6B6B", peakX: 18,   peakY: -104, finalX: 24,   finalY: 88,  rotations: 3, width: 6,  height: 14, borderRadius: 2,   delay: 50,  duration: 1150 },
  { color: "#F0A33A", peakX: -118, peakY: -22,  finalX: -138, finalY: 58,  rotations: 2, width: 9,  height: 12, borderRadius: 0,   delay: 70,  duration: 1000 },
  { color: "#55B8A5", peakX: 120,  peakY: -20,  finalX: 140,  finalY: 54,  rotations: 2, width: 9,  height: 12, borderRadius: 0,   delay: 110, duration: 980  },
  { color: "#6366F1", peakX: -62,  peakY: -98,  finalX: -76,  finalY: 108, rotations: 3, width: 5,  height: 16, borderRadius: 2,   delay: 30,  duration: 1300 },
  { color: "#E78ABE", peakX: 64,   peakY: -94,  finalX: 78,   finalY: 110, rotations: 3, width: 5,  height: 16, borderRadius: 2,   delay: 50,  duration: 1280 },
  { color: "#FFD93D", peakX: -28,  peakY: -112, finalX: -34,  finalY: 98,  rotations: 2, width: 8,  height: 8,  borderRadius: 999, delay: 0,   duration: 1100 },
  { color: "#6BCB77", peakX: 30,   peakY: -110, finalX: 36,   finalY: 94,  rotations: 2, width: 8,  height: 8,  borderRadius: 999, delay: 40,  duration: 1080 },
];

export default function WorkoutCompleteModal({
  visible,
  onReviewPress,
  onLaterPress,
}: WorkoutCompleteModalProps) {
  const pieceAnims = React.useRef(PIECES.map(() => new Animated.Value(0))).current;
  const checkAnim = React.useRef(new Animated.Value(0)).current;
  const pulseAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (!visible) {
      pieceAnims.forEach((a) => a.setValue(0));
      checkAnim.setValue(0);
      pulseAnim.setValue(0);
      return;
    }

    const confettiAnimations = PIECES.map((piece, i) =>
      Animated.sequence([
        Animated.delay(piece.delay),
        Animated.timing(pieceAnims[i], {
          toValue: 1,
          duration: piece.duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    );

    Animated.parallel([
      ...confettiAnimations,
      Animated.spring(checkAnim, {
        toValue: 1,
        friction: 5,
        tension: 120,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 520,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 360,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onLaterPress}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.heroArea}>
            {/* Confetti — positioned relative to center via particleOrigin */}
            <View style={styles.particleOrigin} pointerEvents="none">
              {PIECES.map((piece, i) => {
                const anim = pieceAnims[i];
                return (
                  <Animated.View
                    key={i}
                    style={[
                      styles.particle,
                      {
                        width: piece.width,
                        height: piece.height,
                        borderRadius: piece.borderRadius,
                        backgroundColor: piece.color,
                        opacity: anim.interpolate({
                          inputRange: [0, 0.06, 0.62, 1],
                          outputRange: [0, 1, 0.88, 0],
                        }),
                        transform: [
                          {
                            translateX: anim.interpolate({
                              inputRange: [0, 0.38, 1],
                              outputRange: [0, piece.peakX, piece.finalX],
                            }),
                          },
                          {
                            translateY: anim.interpolate({
                              inputRange: [0, 0.38, 1],
                              outputRange: [0, piece.peakY, piece.finalY],
                            }),
                          },
                          {
                            rotate: anim.interpolate({
                              inputRange: [0, 1],
                              outputRange: ["0deg", `${piece.rotations * 360}deg`],
                            }),
                          },
                          {
                            scale: anim.interpolate({
                              inputRange: [0, 0.1, 0.5, 1],
                              outputRange: [0, 1.25, 1.0, 0.75],
                            }),
                          },
                        ],
                      },
                    ]}
                  />
                );
              })}
            </View>

            {/* Ripple ring */}
            <Animated.View
              pointerEvents="none"
              style={[
                styles.ripple,
                {
                  opacity: pulseAnim.interpolate({
                    inputRange: [0, 0.2, 1],
                    outputRange: [0, 0.32, 0],
                  }),
                  transform: [
                    {
                      scale: pulseAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.78, 1.55],
                      }),
                    },
                  ],
                },
              ]}
            />

            {/* Check circle */}
            <Animated.View
              style={[
                styles.outerGlow,
                {
                  transform: [
                    {
                      scale: checkAnim.interpolate({
                        inputRange: [0, 0.7, 1],
                        outputRange: [0.62, 1.08, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.innerGlow}>
                <Animated.View
                  style={[
                    styles.checkCircle,
                    {
                      transform: [
                        {
                          scale: checkAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.72, 1],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Ionicons name="checkmark" size={54} color="#FFFFFF" />
                </Animated.View>
              </View>
            </Animated.View>
          </View>

          <Text style={styles.title}>운동이 완료되었어요!</Text>
          <Text style={styles.description}>
            오늘의 운동은 어땠나요?{"\n"}평가를 남겨주세요.
          </Text>

          <Pressable
            accessibilityRole="button"
            onPress={onReviewPress}
            style={({ pressed }) => [
              styles.reviewButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.reviewButtonText}>평가하러 가기</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={onLaterPress}
            style={({ pressed }) => [
              styles.laterButton,
              pressed && styles.laterButtonPressed,
            ]}
          >
            <Text style={styles.laterButtonText}>나중에 할게요</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(17, 24, 39, 0.28)",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    maxWidth: 430,
    overflow: "hidden",
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 30,
    paddingTop: 34,
    paddingBottom: 28,
    alignItems: "center",
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.16,
    shadowRadius: 30,
    elevation: 10,
  },
  heroArea: {
    width: "100%",
    height: 210,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  particleOrigin: {
    position: "absolute",
    width: 0,
    height: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  particle: {
    position: "absolute",
  },
  ripple: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#4C5BE2",
  },
  outerGlow: {
    width: 148,
    height: 148,
    borderRadius: 74,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(76, 91, 226, 0.08)",
  },
  innerGlow: {
    width: 106,
    height: 106,
    borderRadius: 53,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(76, 91, 226, 0.13)",
  },
  checkCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4C5BE2",
    shadowColor: "#4C5BE2",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.34,
    shadowRadius: 14,
    elevation: 8,
  },
  title: {
    marginTop: 4,
    fontSize: 23,
    lineHeight: 31,
    color: "#111827",
    fontWeight: "900",
    textAlign: "center",
  },
  description: {
    marginTop: 18,
    fontSize: 17,
    lineHeight: 26,
    color: "#636B7A",
    fontWeight: "700",
    textAlign: "center",
  },
  reviewButton: {
    width: "100%",
    minHeight: 62,
    marginTop: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4C5BE2",
    shadowColor: "#4C5BE2",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 14,
    elevation: 4,
  },
  buttonPressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.9,
  },
  reviewButtonText: {
    fontSize: 17,
    lineHeight: 22,
    color: "#FFFFFF",
    fontWeight: "900",
  },
  laterButton: {
    minHeight: 52,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  laterButtonPressed: {
    opacity: 0.72,
  },
  laterButtonText: {
    fontSize: 16,
    lineHeight: 22,
    color: "#5F68E8",
    fontWeight: "800",
  },
});
