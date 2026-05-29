import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  Animated,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { normalizeImageUrl } from "@/lib/utils/imageUrl";
import { connectChatWs, getChatRooms } from "@/services/chat/chatService";
import {
  acceptMatchRequest,
  rejectMatchRequest,
  toggleMatching,
} from "@/services/matching/matchingService";
import { useAuthStore } from "@/stores/auth/authStore";
import { useChatStore } from "@/stores/chat/chatStore";
import { useMatchingStore } from "@/stores/matching/matchingStore";

import DEFAULT_AVATAR from "../../../assets/match/Ellipse-12.png";
const SLIDE_MS = 320;
const SPRING_CONFIG = { tension: 120, friction: 14, useNativeDriver: true } as const;

export default function MatchRequestToast() {
  const insets = useSafeAreaInsets();

  const pendingMatchRequest = useMatchingStore((s) => s.pendingMatchRequest);
  const setPendingMatchRequest = useMatchingStore((s) => s.setPendingMatchRequest);
  const setCandidates = useMatchingStore((s) => s.setCandidates);
  const candidates = useMatchingStore((s) => s.candidates);
  const setMatching = useAuthStore((s) => s.setMatching);

  const translateY = React.useRef(new Animated.Value(-160)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;
  const progress = React.useRef(new Animated.Value(1)).current;

  const [mounted, setMounted] = React.useState(false);
  const [isAccepting, setIsAccepting] = React.useState(false);
  const [isRejecting, setIsRejecting] = React.useState(false);
  const progressAnim = React.useRef<Animated.CompositeAnimation | null>(null);
  const dismissTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = React.useRef<number | null>(null);
  const candidateCacheRef = React.useRef<Map<number, { name: string; profileImageUrl: string | null }>>(new Map());

  const slideIn = React.useCallback(() => {
    setMounted(true);
    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, ...SPRING_CONFIG }),
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  }, [translateY, opacity]);

  const slideOut = React.useCallback((onDone?: () => void) => {
    progressAnim.current?.stop();
    if (dismissTimer.current) clearTimeout(dismissTimer.current);

    Animated.parallel([
      Animated.timing(translateY, { toValue: -160, duration: SLIDE_MS, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: SLIDE_MS, useNativeDriver: true }),
    ]).start(() => {
      setMounted(false);
      onDone?.();
    });
  }, [translateY, opacity]);

  // Cache candidates so profile info survives after candidates list is cleared
  React.useEffect(() => {
    candidates.forEach((c) => {
      candidateCacheRef.current.set(c.userProfileId, {
        name: c.name,
        profileImageUrl: c.profileImageUrl,
      });
    });
  }, [candidates]);

  React.useEffect(() => {
    if (!pendingMatchRequest) {
      if (mounted) slideOut();
      return;
    }

    // Ignore duplicate events for the same request
    if (requestIdRef.current === pendingMatchRequest.matchRequestId) return;
    requestIdRef.current = pendingMatchRequest.matchRequestId;

    const msLeft = Math.max(
      0,
      new Date(pendingMatchRequest.expiresAt).getTime() - Date.now(),
    );

    // Reset progress bar and slide in
    progress.setValue(1);
    translateY.setValue(-160);
    opacity.setValue(0);
    slideIn();

    progressAnim.current = Animated.timing(progress, {
      toValue: 0,
      duration: msLeft,
      useNativeDriver: false,
    });
    progressAnim.current.start();

    dismissTimer.current = setTimeout(() => {
      slideOut(() => setPendingMatchRequest(null));
    }, msLeft);

    return () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
      requestIdRef.current = null; // allow re-entry if effect re-runs (e.g. Strict Mode)
    };
  }, [pendingMatchRequest?.matchRequestId]);

  const handleConfirm = async () => {
    if (!pendingMatchRequest || isAccepting || isRejecting) return;

    setIsAccepting(true);
    try {
      const res = await acceptMatchRequest(pendingMatchRequest.matchRequestId);
      const roomId = res.data?.roomId;
      setMatching(false);
      setCandidates([]);
      toggleMatching(false).catch(() => {});
      connectChatWs();
      slideOut(() => {
        setPendingMatchRequest(null);
        setIsAccepting(false);
      });
      const { setChatRooms } = useChatStore.getState();
      getChatRooms()
        .then((rooms) => {
          setChatRooms(rooms);
          const targetId = roomId ?? rooms
            .filter((r) => r.status === "ACTIVE")
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]?.id;
          if (targetId) {
            router.push(`/chat/${encodeURIComponent(targetId)}`);
          } else {
            router.push("/(tabs)/chat");
          }
        })
        .catch(() => {
          if (roomId) {
            router.push(`/chat/${encodeURIComponent(roomId)}`);
          } else {
            router.push("/(tabs)/chat");
          }
        });
    } catch (error) {
      setIsAccepting(false);
      Alert.alert(
        "매칭 수락 실패",
        error instanceof Error
          ? error.message
          : "요청 시간이 만료되었거나 처리할 수 없는 요청입니다.",
      );
    }
  };

  const handleReject = async () => {
    if (!pendingMatchRequest || isAccepting || isRejecting) return;

    setIsRejecting(true);
    try {
      await rejectMatchRequest(pendingMatchRequest.matchRequestId);
      slideOut(() => {
        setPendingMatchRequest(null);
        setIsRejecting(false);
      });
    } catch (error) {
      setIsRejecting(false);
      Alert.alert(
        "매칭 거절 실패",
        error instanceof Error
          ? error.message
          : "요청 시간이 만료되었거나 처리할 수 없는 요청입니다.",
      );
    }
  };

  if (!mounted) return null;

  const cachedOpponent = candidateCacheRef.current.get(pendingMatchRequest?.opponentId ?? -1);
  const name =
    pendingMatchRequest?.opponentName ??
    pendingMatchRequest?.name ??
    cachedOpponent?.name ??
    "누군가";
  const rawImageUrl =
    pendingMatchRequest?.opponentProfileImageUrl ??
    pendingMatchRequest?.profileImageUrl ??
    cachedOpponent?.profileImageUrl;
  const avatarUri = rawImageUrl ? normalizeImageUrl(rawImageUrl) : null;
  const avatarSource = avatarUri ? { uri: avatarUri } : DEFAULT_AVATAR;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.wrapper,
        { top: insets.top + 10, opacity, transform: [{ translateY }] },
      ]}
    >
      <View style={styles.toast}>
        <View style={styles.mainRow}>
          {/* Avatar */}
          <View style={styles.avatarWrap}>
            <Image source={avatarSource} style={styles.avatar} contentFit="cover" />
            <View style={styles.onlineDot} />
          </View>

          {/* Text */}
          <View style={styles.textWrap}>
            <View style={styles.titleRow}>
              <Text style={styles.label} numberOfLines={1}>
                <Text style={styles.name}>{name}</Text>
                {"님이 함께 운동하고 싶어해요 💪"}
              </Text>
            </View>
            <Text style={styles.sub}>퀵 매치 요청이 도착했어요</Text>
          </View>
        </View>

        {/* CTA */}
        <Pressable
          style={({ pressed }) => [
            styles.rejectBtn,
            pressed && styles.rejectBtnPressed,
            (isAccepting || isRejecting) && styles.actionBtnDisabled,
          ]}
          onPress={handleReject}
          disabled={isAccepting || isRejecting}
        >
          <Text style={styles.rejectText}>{isRejecting ? "거절 중" : "거절"}</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.ctaBtn,
            pressed && styles.ctaBtnPressed,
            (isAccepting || isRejecting) && styles.actionBtnDisabled,
          ]}
          onPress={handleConfirm}
          disabled={isAccepting || isRejecting}
        >
          <Text style={styles.ctaText}>{isAccepting ? "수락 중" : "수락"}</Text>
        </Pressable>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <Animated.View
          style={[
            styles.progressBar,
            { width: progress.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }) },
          ]}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 14,
    right: 14,
    zIndex: 9999,
    elevation: 20,
    borderRadius: 22,
    overflow: "hidden",
    shadowColor: "#4C3FBF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
  },

  toast: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingLeft: 14,
    paddingRight: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: "#EDE9FF",
  },

  mainRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minWidth: 0,
  },

  // Avatar
  avatarWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EDE9FF",
    flexShrink: 0,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  onlineDot: {
    position: "absolute",
    right: 0,
    bottom: 2,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: "#22C55E",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  // Text
  textWrap: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "nowrap",
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    color: "#111827",
    flexShrink: 1,
  },
  name: {
    fontWeight: "800",
    color: "#4C5BE2",
  },
  sub: {
    fontSize: 11,
    lineHeight: 15,
    color: "#9CA3AF",
    fontWeight: "500",
  },

  // CTA
  ctaBtn: {
    flexShrink: 0,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "#4C5BE2",
  },
  ctaBtnPressed: {
    opacity: 0.82,
  },
  actionBtnDisabled: {
    opacity: 0.7,
  },
  ctaText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  rejectBtn: {
    flexShrink: 0,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },
  rejectBtnPressed: {
    opacity: 0.82,
  },
  rejectText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "800",
    color: "#6B7280",
  },

  // Progress bar
  progressTrack: {
    height: 3,
    backgroundColor: "#EDE9FF",
  },
  progressBar: {
    height: 3,
    backgroundColor: "#4C5BE2",
    borderRadius: 2,
  },
});
