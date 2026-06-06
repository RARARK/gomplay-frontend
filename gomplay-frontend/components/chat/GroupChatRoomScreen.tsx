import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import ChatHeader from "./ChatHeader";
import PostMatchReviewCard from "./PostMatchReviewCard";
import WorkoutCompleteModal from "@/components/matching/WorkoutCompleteModal";
import { Color, FontFamily, FontSize } from "../GlobalStyles";
import {
  getGroupChatRoomDetails,
  GroupChatRoomAccessError,
  GroupChatNoticeError,
  GroupChatScheduleError,
  sendGroupChatNotice,
  sendGroupChatSchedule,
} from "@/services/groupChat/groupChatService";
import { completeGathering } from "@/services/gathering/gatheringService";
import { getActiveMatches } from "@/services/matching/matchingService";
import {
  connectChatWs,
  publishGroupChatMessage,
  subscribeToGroupChatRoom,
} from "@/lib/ws/chatWsClient";
import { getMyProfile } from "@/services/user/userService";
import { useUserStore } from "@/stores/user/userStore";
import { useChatStore } from "@/stores/chat/chatStore";
import { normalizeImageUrl } from "@/lib/utils/imageUrl";
import { formatDateTime, formatMessageTime } from "@/lib/utils/time";
import type {
  GroupChatMessage,
  GroupChatParticipant,
  GroupChatRoomDetails,
} from "@/types/domain/groupChatRoom";

const DEFAULT_AVATAR = require("../../assets/chat/Profileimage.png");

type GatheringCompletionInfo = {
  canComplete: boolean;
  scheduledEndAt?: string | null;
};

export default function GroupChatRoomScreen() {
  const params = useLocalSearchParams<{ roomId?: string | string[] }>();
  const roomId = parseRoomId(params.roomId);

  const currentProfileId = useUserStore((s) => s.profile?.id ?? null);
  const dismissedGatheringIds = useChatStore((s) => s.dismissedGatheringIds);
  const completedGatheringIds = useChatStore((s) => s.completedGatheringIds);
  const markGatheringCompleted = useChatStore((s) => s.markGatheringCompleted);
  const setCurrentProfile = useUserStore((s) => s.setProfile);
  const scrollViewRef = useRef<ScrollView>(null);
  const handledIdsRef = useRef(new Set<number>());
  const hasMountedRef = useRef(false);

  const [isLoading, setIsLoading] = useState(true);
  const [room, setRoom] = useState<GroupChatRoomDetails | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [realtimeMessages, setRealtimeMessages] = useState<GroupChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleteModalVisible, setIsCompleteModalVisible] = useState(false);
  const [completionInfo, setCompletionInfo] = useState<GatheringCompletionInfo | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Notice compose
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const [noticeDraft, setNoticeDraft] = useState("");
  const [isPostingNotice, setIsPostingNotice] = useState(false);

  // Schedule compose
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [schedContent, setSchedContent] = useState("");
  const [schedDate, setSchedDate] = useState("");
  const [schedTime, setSchedTime] = useState("");
  const [schedVenue, setSchedVenue] = useState("");
  const [schedSport, setSchedSport] = useState("");
  const [isPostingSchedule, setIsPostingSchedule] = useState(false);

  useEffect(() => {
    const sub = Keyboard.addListener("keyboardDidHide", () => {
      requestAnimationFrame(() =>
        requestAnimationFrame(() =>
          scrollViewRef.current?.scrollToEnd({ animated: false })
        )
      );
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (!roomId) {
      setIsLoading(false);
      setErrorMessage("잘못된 채팅방입니다.");
      return;
    }
    let mounted = true;

    connectChatWs();

    async function load() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const [details, profile, activeMatches] = await Promise.all([
          getGroupChatRoomDetails(roomId!),
          getMyProfile().catch(() => null),
          getActiveMatches().catch(() => []),
        ]);
        if (mounted) {
          if (profile) setCurrentProfile(profile);
          setRoom(details);
          const gatheringMatch = activeMatches.find(
            (match) =>
              String(match.type).toUpperCase() === "GATHERING" &&
              match.id === details?.gatheringId,
          );
          setCompletionInfo(
            gatheringMatch
              ? {
                  canComplete: gatheringMatch.canComplete,
                  scheduledEndAt: gatheringMatch.scheduledEndAt,
                }
              : null,
          );
          details?.messages.forEach((m) => handledIdsRef.current.add(m.id));
        }
      } catch (err) {
        if (!mounted) return;
        setRoom(null);
        setErrorMessage(
          err instanceof GroupChatRoomAccessError
            ? err.message
            : "채팅방을 불러올 수 없습니다.",
        );
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    void load();

    const unsub = subscribeToGroupChatRoom(roomId, (event) => {
      if (event.type === "GATHERING_COMPLETED") {
        setRoom((prev) =>
          prev ? { ...prev, gatheringStatus: "COMPLETED" } : prev,
        );
        return;
      }
      const msg = event.data;
      if (handledIdsRef.current.has(msg.id)) return;
      handledIdsRef.current.add(msg.id);
      setRealtimeMessages((prev) => [...prev, msg]);
    });

    return () => {
      mounted = false;
      unsub();
    };
  }, [roomId, setCurrentProfile]);

  useFocusEffect(
    useCallback(() => {
      if (!roomId) return;
      if (!hasMountedRef.current) {
        hasMountedRef.current = true;
        return;
      }
      getGroupChatRoomDetails(roomId)
        .then((details) => {
          if (!details) return;
          setRoom((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              reviewed: details.reviewed,
              gatheringStatus:
                prev.gatheringStatus === "COMPLETED"
                  ? "COMPLETED"
                  : details.gatheringStatus,
            };
          });
        })
        .catch(() => {});
    }, [roomId]),
  );

  useEffect(() => {
    if (!completionInfo?.scheduledEndAt || completionInfo.canComplete) return;
    const msUntilEnd = new Date(completionInfo.scheduledEndAt).getTime() - Date.now();
    if (msUntilEnd <= 0) {
      setNow(Date.now());
      return;
    }
    const timer = setTimeout(() => setNow(Date.now()), msUntilEnd);
    return () => clearTimeout(timer);
  }, [completionInfo?.canComplete, completionInfo?.scheduledEndAt]);

  const allMessages = useMemo<GroupChatMessage[]>(() => {
    const seen = new Set<number>();
    const result: GroupChatMessage[] = [];
    for (const m of [...(room?.messages ?? []), ...realtimeMessages]) {
      if (!seen.has(m.id)) {
        seen.add(m.id);
        result.push(m);
      }
    }
    return result;
  }, [room?.messages, realtimeMessages]);

  const pinnedNotice = [...allMessages].reverse().find((m) => m.messageType === "NOTICE") ?? null;
  const isCompletedGathering = room?.gatheringStatus === "COMPLETED";
  const isReadOnly = isCompletedGathering;
  const hasCompletedThisGathering = room != null && completedGatheringIds.includes(room.gatheringId);
  const canCompleteGathering =
    !isCompletedGathering &&
    !hasCompletedThisGathering &&
    (completionInfo?.canComplete ||
      (completionInfo?.scheduledEndAt
        ? now > new Date(completionInfo.scheduledEndAt).getTime()
        : false));

  const handleSend = () => {
    const trimmed = draft.trim();
    if (!trimmed || isReadOnly || isSending || !roomId) return;
    setIsSending(true);
    try {
      publishGroupChatMessage(roomId, trimmed);
      setDraft("");
    } catch {
      Alert.alert("전송 실패", "메시지를 전송할 수 없습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSending(false);
    }
  };

  const handlePostNotice = async () => {
    const trimmed = noticeDraft.trim();
    if (!trimmed || isReadOnly || isPostingNotice || !roomId) return;
    setIsPostingNotice(true);
    try {
      await sendGroupChatNotice(roomId, trimmed);
      setIsNoticeOpen(false);
      setNoticeDraft("");
      setIsMenuOpen(false);
    } catch (err) {
      Alert.alert(
        "공지 전송 실패",
        err instanceof GroupChatNoticeError ? err.message : "공지 전송에 실패했습니다.",
      );
    } finally {
      setIsPostingNotice(false);
    }
  };

  const handlePostSchedule = async () => {
    const trimmed = schedContent.trim();
    if (isReadOnly || !trimmed || !schedDate.trim() || !schedTime.trim() || isPostingSchedule || !roomId) return;
    const scheduledAt = buildScheduledAt(schedDate.trim(), schedTime.trim());
    if (!scheduledAt) {
      Alert.alert("입력 오류", "날짜는 YYYY-MM-DD, 시간은 HH:mm 형식으로 입력해 주세요.");
      return;
    }
    setIsPostingSchedule(true);
    try {
      await sendGroupChatSchedule(roomId, {
        content: trimmed,
        scheduledAt,
        venue: schedVenue.trim(),
        sportType: schedSport.trim(),
      });
      setIsScheduleOpen(false);
      setIsMenuOpen(false);
    } catch (err) {
      Alert.alert(
        "일정 전송 실패",
        err instanceof GroupChatScheduleError ? err.message : "일정 전송에 실패했습니다.",
      );
    } finally {
      setIsPostingSchedule(false);
    }
  };

  const handleOpenGatheringReview = () => {
    if (!room) return;
    router.push(`/review/gathering/${room.gatheringId}` as any);
  };

  const handleCompleteGathering = async () => {
    if (!room || isCompleting) return;

    setIsCompleting(true);
    try {
      await completeGathering(room.gatheringId);
      markGatheringCompleted(room.gatheringId);
      setRoom((prev) =>
        prev ? { ...prev, gatheringStatus: "COMPLETED" } : prev,
      );
      setCompletionInfo((prev) =>
        prev ? { ...prev, canComplete: false } : prev,
      );
      setIsCompleteModalVisible(true);
    } catch (err) {
      Alert.alert(
        "완료 처리 실패",
        err instanceof Error ? err.message : "다시 시도해 주세요.",
      );
    } finally {
      setIsCompleting(false);
    }
  };

  if (isLoading || !room) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right", "bottom"]}>
        <ChatHeader title="그룹 채팅" showMenuButton={false} />
        <View style={styles.loadingContainer}>
          {!isLoading && errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
          {isLoading ? (
            <ActivityIndicator color={Color.primary100} />
          ) : errorMessage ? null : (
            <Text style={styles.errorText}>채팅방을 불러올 수 없습니다.</Text>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right", "bottom"]}>
      <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={0}>
        <ChatHeader
          title={room.gatheringTitle}
          onPressMenu={() => setIsMenuOpen(true)}
        />

        {pinnedNotice ? (
          <View style={styles.noticeBar}>
            <View style={styles.noticeHeader}>
              <Ionicons name="megaphone-outline" size={18} color={Color.primary100} />
              <Text style={styles.noticeTitle}>공지</Text>
            </View>
            <Text numberOfLines={2} style={styles.noticePreview}>
              {pinnedNotice.content}
            </Text>
          </View>
        ) : null}

        <ScrollView
          ref={scrollViewRef}
          style={styles.messageScrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
        >
          {allMessages.map((msg) => (
            <GroupMessageRow
              key={msg.id}
              message={msg}
              isMine={currentProfileId !== null && msg.senderId === currentProfileId}
            />
          ))}
          {isCompletedGathering ? (
            <View style={styles.systemMessageWrapper}>
              <Text style={styles.systemMessageText}>운동이 완료되었습니다.</Text>
            </View>
          ) : null}
        </ScrollView>

        <PostMatchReviewCard
          showReviewPrompt={canCompleteGathering || (isCompletedGathering && !room.reviewed && !dismissedGatheringIds.includes(room.gatheringId))}
          title={canCompleteGathering ? "운동을 완료하셨나요?" : "운동이 완료되었어요!"}
          description={
            canCompleteGathering
              ? "운동이 끝났다면 완료 처리하고 참여자들에게 후기를 남길 수 있어요."
              : "오늘 운동은 어떠셨나요? 참여자들에게 평가를 남겨주세요."
          }
          buttonLabel={
            canCompleteGathering
              ? isCompleting ? "완료 처리 중..." : "운동 완료하기"
              : "평가하러 가기"
          }
          onPressReview={
            canCompleteGathering
              ? handleCompleteGathering
              : handleOpenGatheringReview
          }
          inputPlaceholder={isReadOnly ? "읽기 전용 채팅방입니다." : "메시지를 입력하세요..."}
          inputDisabled={isReadOnly}
          messageValue={draft}
          onChangeMessage={setDraft}
          onPressSend={handleSend}
          sendDisabled={isReadOnly || isSending || draft.trim().length === 0}
        />

        <WorkoutCompleteModal
          visible={isCompleteModalVisible}
          onLaterPress={() => setIsCompleteModalVisible(false)}
          onReviewPress={() => {
            setIsCompleteModalVisible(false);
            handleOpenGatheringReview();
          }}
        />

        {/* Side menu */}
        <Modal
          visible={isMenuOpen}
          animationType="slide"
          statusBarTranslucent
          onRequestClose={() => setIsMenuOpen(false)}
        >
          <SafeAreaView edges={["top", "left", "right", "bottom"]} style={styles.drawer}>
            <View style={styles.drawerHeader}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setIsMenuOpen(false)}
                style={styles.drawerBackButton}
              >
                <Ionicons name="chevron-back" size={28} color="#111827" />
              </Pressable>
            </View>

            <ScrollView
              contentContainerStyle={styles.drawerContent}
              showsVerticalScrollIndicator={false}
            >
              {/* 채팅방 제목 */}
              <View style={styles.drawerSection}>
                <Text style={styles.drawerSectionTitle}>채팅방 제목</Text>
                <View style={styles.roomTitleReadRow}>
                  <Text numberOfLines={1} style={styles.roomTitleText}>
                    {room.gatheringTitle}
                  </Text>
                </View>
              </View>

              {/* 참여자 */}
              <View style={styles.drawerSection}>
                <Text style={styles.drawerSectionTitle}>
                  참여자 {room.participantCount}명
                </Text>
                {(room.participants ?? []).map((p) => (
                  <ParticipantRow
                    key={p.id}
                    participant={p}
                    isSelf={currentProfileId !== null && p.id === currentProfileId}
                  />
                ))}
                {!room.participants ? (
                  <View style={styles.participantRow}>
                    <View style={styles.participantAvatar}>
                      <Ionicons name="people-outline" size={16} color={Color.primary100} />
                    </View>
                    <Text style={styles.participantName}>{room.participantCount}명 참여 중</Text>
                  </View>
                ) : null}
              </View>

              {/* 공지 */}
              <View style={styles.drawerSection}>
                <View style={styles.drawerSectionHeader}>
                  <Text style={styles.drawerSectionTitle}>공지</Text>
                  {room.isHost === true && !isReadOnly ? (
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => { setNoticeDraft(""); setIsNoticeOpen(true); }}
                      style={styles.addButton}
                    >
                      <Ionicons name="add" size={16} color={Color.primary100} />
                      <Text style={styles.drawerActionText}>공지 작성</Text>
                    </Pressable>
                  ) : null}
                </View>
                {allMessages.filter((m) => m.messageType === "NOTICE").slice(-3).map((m) => (
                  <View key={m.id} style={styles.drawerNoticeCard}>
                    <Ionicons name="megaphone-outline" size={18} color={Color.primary100} />
                    <View style={styles.drawerNoticeContent}>
                      <Text numberOfLines={1} style={styles.drawerNoticeTitle}>{m.senderName}</Text>
                      <Text numberOfLines={2} style={styles.drawerNoticeText}>{m.content}</Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* 일정 */}
              <View style={styles.drawerSection}>
                <View style={styles.drawerSectionHeader}>
                  <Text style={styles.drawerSectionTitle}>일정</Text>
                  {room.isHost === true && !isReadOnly ? (
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => {
                        setSchedContent("");
                        setSchedDate("");
                        setSchedTime("");
                        setSchedVenue(room.venue);
                        setSchedSport(room.sportType ?? "");
                        setIsScheduleOpen(true);
                      }}
                      style={styles.addButton}
                    >
                      <Ionicons name="add" size={16} color={Color.primary100} />
                      <Text style={styles.drawerActionText}>일정 추가</Text>
                    </Pressable>
                  ) : null}
                </View>
                {allMessages.filter((m) => m.messageType === "SCHEDULE").slice(-3).map((m) => (
                  <View key={m.id} style={styles.scheduleRow}>
                    <Ionicons name="calendar-outline" size={18} color="#6B7280" />
                    <View style={styles.scheduleContent}>
                      <Text numberOfLines={1} style={styles.scheduleTitle}>{m.content}</Text>
                      {m.scheduledAt ? (
                        <Text numberOfLines={1} style={styles.scheduleText}>
                          {formatDateTime(m.scheduledAt)}
                          {m.venue ? ` · ${m.venue}` : ""}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>

        {/* Notice compose modal */}
        <Modal visible={isNoticeOpen} animationType="slide" transparent onRequestClose={() => setIsNoticeOpen(false)}>
          <Pressable style={styles.backdrop} onPress={() => setIsNoticeOpen(false)} />
          <View style={styles.composeSheet}>
            <View style={styles.composeHeader}>
              <Ionicons name="megaphone-outline" size={18} color={Color.primary100} />
              <Text style={styles.composeTitle}>공지 작성</Text>
              <Pressable onPress={() => setIsNoticeOpen(false)} accessibilityRole="button">
                <Ionicons name="close" size={22} color="#6B7280" />
              </Pressable>
            </View>
            <TextInput
              style={styles.composeInput}
              value={noticeDraft}
              onChangeText={setNoticeDraft}
              placeholder="채팅방에 공지할 내용을 입력하세요"
              placeholderTextColor={Color.neutral700}
              multiline
              autoFocus
            />
            <View style={styles.composeActions}>
              <Pressable style={styles.composeCancelButton} onPress={() => setIsNoticeOpen(false)} accessibilityRole="button">
                <Text style={styles.composeCancelText}>취소</Text>
              </Pressable>
              <Pressable
                style={[styles.composePostButton, (noticeDraft.trim().length === 0 || isPostingNotice) && styles.composePostButtonDisabled]}
                onPress={handlePostNotice}
                disabled={noticeDraft.trim().length === 0 || isPostingNotice}
                accessibilityRole="button"
              >
                {isPostingNotice
                  ? <ActivityIndicator size="small" color="#FFF" />
                  : <Text style={styles.composePostText}>공지 전송</Text>}
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Schedule compose modal */}
        <Modal visible={isScheduleOpen} animationType="slide" transparent onRequestClose={() => setIsScheduleOpen(false)}>
          <Pressable style={styles.backdrop} onPress={() => setIsScheduleOpen(false)} />
          <KeyboardAvoidingView behavior="padding" style={styles.scheduleModalKAV}>
            <ScrollView contentContainerStyle={styles.composeSheet} keyboardShouldPersistTaps="handled">
              <View style={styles.composeHeader}>
                <Ionicons name="calendar" size={18} color={Color.primary100} />
                <Text style={styles.composeTitle}>일정 작성</Text>
                <Pressable onPress={() => setIsScheduleOpen(false)} accessibilityRole="button">
                  <Ionicons name="close" size={22} color="#6B7280" />
                </Pressable>
              </View>

              <LabeledInput label="일정 설명 *" value={schedContent} onChangeText={setSchedContent} placeholder="예: 이번 주 토요일 정기 운동" multiline />

              <View style={styles.scheduleFieldRow}>
                <View style={styles.scheduleFieldHalf}>
                  <Text style={styles.scheduleEditLabel}>날짜 *</Text>
                  <TextInput style={styles.scheduleEditInput} value={schedDate} onChangeText={setSchedDate} placeholder="2026-06-01" placeholderTextColor={Color.neutral700} keyboardType="numeric" maxLength={10} />
                </View>
                <View style={styles.scheduleFieldHalf}>
                  <Text style={styles.scheduleEditLabel}>시간 *</Text>
                  <TextInput style={styles.scheduleEditInput} value={schedTime} onChangeText={setSchedTime} placeholder="19:00" placeholderTextColor={Color.neutral700} keyboardType="numeric" maxLength={5} />
                </View>
              </View>

              <LabeledInput label="장소" value={schedVenue} onChangeText={setSchedVenue} placeholder="예: 제1체육관" />
              <LabeledInput label="운동 종목" value={schedSport} onChangeText={setSchedSport} placeholder="예: 축구" />

              <View style={styles.composeActions}>
                <Pressable style={styles.composeCancelButton} onPress={() => setIsScheduleOpen(false)} accessibilityRole="button">
                  <Text style={styles.composeCancelText}>취소</Text>
                </Pressable>
                <Pressable
                  style={[styles.composePostButton, (schedContent.trim().length === 0 || !schedDate.trim() || !schedTime.trim() || isPostingSchedule) && styles.composePostButtonDisabled]}
                  onPress={handlePostSchedule}
                  disabled={schedContent.trim().length === 0 || !schedDate.trim() || !schedTime.trim() || isPostingSchedule}
                  accessibilityRole="button"
                >
                  {isPostingSchedule
                    ? <ActivityIndicator size="small" color="#FFF" />
                    : <Text style={styles.composePostText}>일정 전송</Text>}
                </Pressable>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Message Row ──────────────────────────────────────────────────────────────

function GroupMessageRow({ message, isMine }: { message: GroupChatMessage; isMine: boolean }) {
  if (message.messageType === "NOTICE") {
    return (
      <View style={styles.noticeInlineBar}>
        <View style={styles.noticeHeader}>
          <Ionicons name="megaphone-outline" size={18} color={Color.primary100} />
          <Text style={styles.noticeTitle}>공지</Text>
          <Text style={styles.timestamp}>{formatMessageTime(message.sentAt)}</Text>
        </View>
        <Text style={styles.noticePreview}>{message.content}</Text>
      </View>
    );
  }

  if (message.messageType === "SCHEDULE") {
    return (
      <View style={styles.scheduleInlineCard}>
        <View style={styles.scheduleInlineHeader}>
          <Ionicons name="calendar" size={16} color={Color.primary100} />
          <Text style={styles.scheduleInlineTitle}>일정</Text>
          <Text style={styles.scheduleInlineSender}>{message.senderName}</Text>
          <Text style={styles.timestamp}>{formatMessageTime(message.sentAt)}</Text>
        </View>
        <Text style={styles.scheduleInlineContent}>{message.content}</Text>
        {(message.scheduledAt || message.venue || message.sportType) ? (
          <View style={styles.scheduleInlineMeta}>
            {message.scheduledAt ? <Text style={styles.scheduleInlineMetaText}>🕐 {formatDateTime(message.scheduledAt)}</Text> : null}
            {message.venue ? <Text style={styles.scheduleInlineMetaText}>📍 {message.venue}</Text> : null}
            {message.sportType ? <Text style={styles.scheduleInlineMetaText}>⚽ {message.sportType}</Text> : null}
          </View>
        ) : null}
      </View>
    );
  }

  if (isMine) {
    return (
      <View style={styles.myMessageRow}>
        <View style={styles.myMessageMeta}>
          <Text style={styles.timestamp}>{formatMessageTime(message.sentAt)}</Text>
        </View>
        <View style={styles.myBubble}>
          <Text style={styles.myBubbleText}>{message.content}</Text>
        </View>
      </View>
    );
  }

  const avatarUrl = normalizeImageUrl(message.senderProfileImageUrl ?? undefined);
  return (
    <View style={styles.partnerMessageSection}>
      <View style={styles.partnerHeaderRow}>
        <Image
          source={avatarUrl ? { uri: avatarUrl } : DEFAULT_AVATAR}
          style={styles.partnerAvatar}
        />
        <Text style={styles.partnerName}>{message.senderName}</Text>
      </View>
      <View style={styles.partnerBubbleRow}>
        <View style={styles.partnerBubble}>
          <Text style={styles.partnerBubbleText}>{message.content}</Text>
        </View>
        <Text style={styles.timestamp}>{formatMessageTime(message.sentAt)}</Text>
      </View>
    </View>
  );
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function ParticipantRow({ participant, isSelf }: { participant: GroupChatParticipant; isSelf: boolean }) {
  const avatarUrl = normalizeImageUrl(participant.profileImageUrl ?? undefined);
  const displayName = isSelf ? "나" : participant.name;
  return (
    <View style={styles.participantRow}>
      <View style={styles.participantAvatar}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.participantAvatarImage} />
        ) : (
          <Text style={styles.participantInitial}>{displayName.slice(0, 1)}</Text>
        )}
      </View>
      <Text numberOfLines={1} style={styles.participantName}>{displayName}</Text>
      {participant.isHost ? (
        <View style={styles.hostBadge}>
          <Text style={styles.hostBadgeText}>방장</Text>
        </View>
      ) : null}
    </View>
  );
}

function LabeledInput({ label, value, onChangeText, placeholder, multiline }: {
  label: string; value: string; onChangeText: (v: string) => void;
  placeholder?: string; multiline?: boolean;
}) {
  return (
    <View style={styles.scheduleEditField}>
      <Text style={styles.scheduleEditLabel}>{label}</Text>
      <TextInput
        style={styles.scheduleEditInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Color.neutral700}
        multiline={multiline}
      />
    </View>
  );
}

function parseRoomId(raw: string | string[] | undefined): number | null {
  const str = Array.isArray(raw) ? raw[0] : raw;
  const n = Number(str);
  return Number.isFinite(n) && n > 0 ? n : null;
}


function buildScheduledAt(date: string, time: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return null;
  const iso = `${date}T${time}:00+09:00`;
  return isNaN(new Date(iso).getTime()) ? null : iso;
}

// ─── Styles (mirrored from ChatRoomScreen) ────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Color.colorWhite },
  container: { flex: 1, backgroundColor: Color.colorWhite },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Color.colorWhite },
  errorText: { fontSize: FontSize.fs_12, color: Color.neutral700, fontFamily: FontFamily.inter },

  messageScrollView: { flex: 1 },
  scrollContent: { paddingTop: 20, paddingBottom: 24, gap: 20 },
  systemMessageWrapper: {
    alignSelf: "center",
    borderRadius: 999,
    backgroundColor: Color.colorGhostwhite100,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  systemMessageText: {
    fontSize: FontSize.fs_12,
    lineHeight: 16,
    fontFamily: FontFamily.inter,
    color: Color.neutral700,
  },

  // Notice bar (pinned + inline) — same as ChatRoomScreen
  noticeBar: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#EEF0F5",
    backgroundColor: "#FFFFFF",
    paddingBottom: 12,
  },
  noticeInlineBar: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#EEF0F5",
    backgroundColor: "#FFFFFF",
    paddingBottom: 12,
    marginHorizontal: 0,
  },
  noticeHeader: {
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    gap: 8,
  },
  noticeTitle: {
    flex: 1,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "800",
    fontFamily: FontFamily.inter,
    color: Color.labelsPrimary,
  },
  noticePreview: {
    paddingHorizontal: 18,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: FontFamily.inter,
    color: Color.labelsPrimary,
  },

  // Schedule inline card
  scheduleInlineCard: {
    marginHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Color.primary100,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 6,
  },
  scheduleInlineHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  scheduleInlineTitle: { fontSize: 13, fontWeight: "800", fontFamily: FontFamily.inter, color: Color.primary100 },
  scheduleInlineSender: { flex: 1, fontSize: 11, fontFamily: FontFamily.inter, color: Color.neutral700 },
  scheduleInlineContent: { fontSize: 14, lineHeight: 20, fontFamily: FontFamily.inter, color: Color.labelsPrimary },
  scheduleInlineMeta: { gap: 3, borderTopWidth: 1, borderTopColor: "#E0E3F8", paddingTop: 8 },
  scheduleInlineMetaText: { fontSize: 12, fontFamily: FontFamily.inter, color: Color.neutral700 },

  // Bubbles — same as ChatRoomScreen
  myMessageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    gap: 6,
    paddingHorizontal: 18,
  },
  myMessageMeta: { alignItems: "flex-end", gap: 4 },
  myBubble: {
    maxWidth: "70%",
    borderRadius: 20,
    borderBottomRightRadius: 4,
    backgroundColor: Color.primary100,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  myBubbleText: { fontSize: 16, lineHeight: 22, fontFamily: FontFamily.inter, color: "#FFFFFF" },
  partnerMessageSection: { gap: 6, paddingHorizontal: 18 },
  partnerHeaderRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  partnerAvatar: { width: 36, height: 36, borderRadius: 18, resizeMode: "cover" },
  partnerName: { fontSize: 13, lineHeight: 18, fontWeight: "700", fontFamily: FontFamily.inter, color: Color.labelsPrimary },
  partnerBubbleRow: { flexDirection: "row", alignItems: "flex-end", gap: 6, paddingLeft: 44 },
  partnerBubble: {
    maxWidth: "70%",
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  partnerBubbleText: { fontSize: 16, lineHeight: 22, fontFamily: FontFamily.inter, color: Color.labelsPrimary },
  timestamp: { fontSize: 11, fontFamily: FontFamily.inter, color: Color.neutral700 },

  // Drawer — same as ChatRoomScreen
  drawer: { flex: 1, backgroundColor: "#FFFFFF" },
  drawerHeader: {
    minHeight: 58,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF0F5",
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  drawerBackButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  drawerContent: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 28, gap: 26 },
  drawerSection: { gap: 12 },
  drawerSectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  drawerSectionTitle: { fontSize: 15, lineHeight: 20, fontWeight: "800", fontFamily: FontFamily.inter, color: "#111827" },
  drawerActionText: { fontSize: 13, lineHeight: 18, fontWeight: "800", fontFamily: FontFamily.inter, color: Color.primary100 },
  addButton: { minHeight: 28, flexDirection: "row", alignItems: "center", gap: 2 },
  roomTitleReadRow: {
    minHeight: 46,
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  roomTitleText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "800",
    fontFamily: FontFamily.inter,
    color: "#111827",
  },
  participantRow: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  participantAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  participantAvatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    resizeMode: "cover",
  },
  participantInitial: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "800",
    fontFamily: FontFamily.inter,
    color: Color.primary100,
  },
  participantName: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",
    fontFamily: FontFamily.inter,
    color: "#111827",
  },
  hostBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: "#EEF2FF",
  },
  hostBadgeText: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "800",
    fontFamily: FontFamily.inter,
    color: Color.primary100,
  },
  drawerNoticeCard: {
    minHeight: 58,
    borderRadius: 10,
    backgroundColor: "#F6F7FF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  drawerNoticeContent: { flex: 1, gap: 3 },
  drawerNoticeTitle: { fontSize: 14, lineHeight: 19, fontWeight: "800", fontFamily: FontFamily.inter, color: "#111827" },
  drawerNoticeText: { flex: 1, fontSize: 13, lineHeight: 19, fontFamily: FontFamily.inter, color: "#374151" },
  scheduleRow: { minHeight: 42, borderRadius: 10, backgroundColor: "#F9FAFB", paddingHorizontal: 12, paddingVertical: 10, flexDirection: "row", alignItems: "center", gap: 8 },
  scheduleContent: { flex: 1, gap: 2 },
  scheduleTitle: { fontSize: 14, lineHeight: 19, fontWeight: "800", fontFamily: FontFamily.inter, color: "#111827" },
  scheduleText: { fontSize: 13, lineHeight: 18, fontFamily: FontFamily.inter, color: "#374151" },

  // Compose modals
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)" },
  scheduleModalKAV: { justifyContent: "flex-end" },
  composeSheet: {
    backgroundColor: Color.colorWhite,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    gap: 16,
  },
  composeHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  composeTitle: { flex: 1, fontSize: FontSize.fs_17, fontWeight: "600", fontFamily: FontFamily.inter, color: Color.labelsPrimary },
  composeInput: {
    minHeight: 100,
    maxHeight: 180,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: FontSize.fs_12,
    fontFamily: FontFamily.inter,
    color: Color.labelsPrimary,
    textAlignVertical: "top",
    backgroundColor: "#F9FAFB",
  },
  composeActions: { flexDirection: "row", gap: 10 },
  composeCancelButton: { flex: 1, paddingVertical: 13, borderRadius: 12, borderWidth: 1, borderColor: "#E5E7EB", alignItems: "center" },
  composeCancelText: { fontSize: FontSize.fs_12, fontWeight: "600", fontFamily: FontFamily.inter, color: Color.neutral700 },
  composePostButton: { flex: 2, paddingVertical: 13, borderRadius: 12, backgroundColor: Color.primary100, alignItems: "center", justifyContent: "center" },
  composePostButtonDisabled: { backgroundColor: "#9CA3AF" },
  composePostText: { fontSize: FontSize.fs_12, fontWeight: "700", fontFamily: FontFamily.inter, color: "#FFFFFF" },
  scheduleFieldRow: { flexDirection: "row", gap: 10 },
  scheduleFieldHalf: { flex: 1, gap: 6 },
  scheduleEditField: { gap: 6 },
  scheduleEditLabel: { fontSize: 13, fontWeight: "600", fontFamily: FontFamily.inter, color: Color.labelsPrimary },
  scheduleEditInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: FontSize.fs_12,
    fontFamily: FontFamily.inter,
    color: Color.labelsPrimary,
    backgroundColor: "#F9FAFB",
    minHeight: 44,
  },
});
