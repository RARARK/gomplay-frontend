import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CONFETTI = [
  { left: 62, top: 42, color: "#A9A7EF", dx: -10, dy: -10, rotate: "-22deg" },
  { left: 32, top: 86, color: "#C7C9F7", dx: -18, dy: 4, rotate: "32deg" },
  { left: 62, top: 132, color: "#DC62B1", dx: -20, dy: 16, rotate: "-36deg" },
  { right: 66, top: 44, color: "#A9A7EF", dx: 12, dy: -12, rotate: "38deg" },
  { right: 40, top: 92, color: "#D95EAE", dx: 20, dy: 8, rotate: "-28deg" },
  { right: 78, top: 144, color: "#4C5BE2", dx: 16, dy: 18, rotate: "48deg" },
  { right: 118, top: 124, color: "#CFD2FA", dx: 10, dy: 16, rotate: "-12deg" },
];

type ReviewParticipant = {
  name: string;
  profileImageUrl?: string | null;
};

type ReviewCompleteScreenProps = {
  partnerName?: string;
  partnerProfileImageUrl?: string | null;
  partnerDepartment?: string;
  partnerStudentId?: string;
  exerciseTypes?: string;
  scheduledTime?: string;
  onConfirm?: () => void;
  participants?: ReviewParticipant[];
};

export default function ReviewCompleteScreen({
  partnerName = "파트너",
  partnerProfileImageUrl,
  partnerDepartment,
  partnerStudentId,
  exerciseTypes,
  scheduledTime,
  onConfirm,
  participants,
}: ReviewCompleteScreenProps) {
  const burstAnim = React.useRef(new Animated.Value(0)).current;
  const checkAnim = React.useRef(new Animated.Value(0)).current;
  const pulseAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(checkAnim, {
        toValue: 1,
        friction: 5,
        tension: 120,
        useNativeDriver: true,
      }),
      Animated.timing(burstAnim, {
        toValue: 1,
        duration: 820,
        easing: Easing.out(Easing.cubic),
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
          duration: 420,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [burstAnim, checkAnim, pulseAnim]);

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text pointerEvents="none" style={styles.headerTitle}>
          평가 완료
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroArea}>
          {CONFETTI.map((piece, index) => (
            <Animated.View
              key={index}
              style={[
                styles.confetti,
                {
                  backgroundColor: piece.color,
                  left: piece.left,
                  right: piece.right,
                  top: piece.top,
                  opacity: burstAnim.interpolate({
                    inputRange: [0, 0.16, 1],
                    outputRange: [0, 1, 0.78],
                  }),
                  transform: [
                    {
                      translateX: burstAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, piece.dx],
                      }),
                    },
                    {
                      translateY: burstAnim.interpolate({
                        inputRange: [0, 0.6, 1],
                        outputRange: [0, piece.dy, piece.dy + 14],
                      }),
                    },
                    { rotate: piece.rotate },
                  ],
                },
              ]}
            />
          ))}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.ripple,
              {
                opacity: pulseAnim.interpolate({
                  inputRange: [0, 0.24, 1],
                  outputRange: [0, 0.25, 0],
                }),
                transform: [
                  {
                    scale: pulseAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.76, 1.55],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.outerGlow,
              {
                transform: [
                  {
                    scale: checkAnim.interpolate({
                      inputRange: [0, 0.75, 1],
                      outputRange: [0.62, 1.08, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.innerGlow}>
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={48} color="#FFFFFF" />
              </View>
            </View>
          </Animated.View>
        </View>

        <View style={styles.messageBlock}>
          <Text style={styles.title}>평가가 완료되었어요!</Text>
          <Text style={styles.description}>소중한 피드백 감사합니다.</Text>
        </View>

        {participants && participants.length > 0 ? (
          <View style={styles.partnerCard}>
            {participants.map((p, i) => (
              <View
                key={i}
                style={[
                  styles.participantRow,
                  i < participants.length - 1 && styles.participantRowDivider,
                ]}
              >
                <Image
                  source={
                    p.profileImageUrl
                      ? { uri: p.profileImageUrl }
                      : require("../../assets/match/Ellipse-12.png")
                  }
                  style={styles.avatar}
                  contentFit="cover"
                />
                <View style={styles.nameRow}>
                  <Text style={styles.partnerName}>{p.name}</Text>
                  <Ionicons name="checkmark-circle" size={15} color="#4C5BE2" />
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.partnerCard}>
            <View style={styles.participantRow}>
              <Image
                source={
                  partnerProfileImageUrl
                    ? { uri: partnerProfileImageUrl }
                    : require("../../assets/match/Ellipse-12.png")
                }
                style={styles.avatar}
                contentFit="cover"
              />
              <View style={styles.partnerInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.partnerName}>{partnerName}</Text>
                  <Ionicons name="checkmark-circle" size={15} color="#4C5BE2" />
                </View>
                {(partnerDepartment || partnerStudentId) ? (
                  <Text style={styles.partnerSubInfo} numberOfLines={1}>
                    {[partnerDepartment, partnerStudentId].filter(Boolean).join(" · ")}
                  </Text>
                ) : null}
                {exerciseTypes ? (
                  <Text style={styles.partnerMeta} numberOfLines={1}>
                    {exerciseTypes}
                  </Text>
                ) : null}
                {scheduledTime ? (
                  <Text style={styles.partnerMeta} numberOfLines={1}>
                    {scheduledTime}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          accessibilityRole="button"
          onPress={onConfirm ?? (() => router.replace("/(tabs)" as any))}
          style={({ pressed }) => [
            styles.homeButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.homeButtonText}>확인</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerTitle: {
    position: "absolute",
    left: 0,
    right: 0,
    alignSelf: "center",
    fontSize: 20,
    lineHeight: 28,
    color: "#111827",
    fontWeight: "800",
    textAlign: "center",
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 24,
  },
  heroArea: {
    height: 190,
    alignItems: "center",
    justifyContent: "center",
  },
  confetti: {
    position: "absolute",
    width: 7,
    height: 7,
    borderRadius: 2,
  },
  ripple: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#4C5BE2",
  },
  outerGlow: {
    width: 132,
    height: 132,
    borderRadius: 66,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(76, 91, 226, 0.08)",
  },
  innerGlow: {
    width: 94,
    height: 94,
    borderRadius: 47,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(76, 91, 226, 0.12)",
  },
  checkCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4C5BE2",
    shadowColor: "#4C5BE2",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 8,
  },
  messageBlock: {
    alignItems: "center",
    gap: 8,
    marginTop: 6,
    marginBottom: 30,
  },
  title: {
    fontSize: 19,
    lineHeight: 27,
    color: "#4C5BE2",
    fontWeight: "900",
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6B7280",
    fontWeight: "700",
    textAlign: "center",
  },
  partnerCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ECEEF6",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
  },
  participantRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
  participantRowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ECEEF6",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#EEF2FF",
  },
  partnerInfo: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  partnerName: {
    fontSize: 14,
    lineHeight: 19,
    color: "#111827",
    fontWeight: "900",
  },
  partnerSubInfo: {
    fontSize: 12,
    lineHeight: 17,
    color: "#4C5BE2",
    fontWeight: "700",
  },
  partnerMeta: {
    fontSize: 12,
    lineHeight: 17,
    color: "#6B7280",
    fontWeight: "700",
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#EEF0F6",
    backgroundColor: "#FFFFFF",
  },
  homeButton: {
    minHeight: 56,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4C5BE2",
    shadowColor: "#4C5BE2",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 4,
  },
  buttonPressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.9,
  },
  homeButtonText: {
    fontSize: 16,
    lineHeight: 22,
    color: "#FFFFFF",
    fontWeight: "900",
  },
});
