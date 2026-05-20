import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import ChatHeader from "./ChatHeader";
import PostMatchReviewCard from "./PostMatchReviewCard";
import { Color, FontFamily, FontSize } from "../GlobalStyles";
import {
  connectChatWs,
  getChatRoomDetails,
  markChatRoomAsRead,
  sendChatMessage,
  subscribeToChatMessages,
  subscribeToChatRoomEvents,
} from "@/services/chat/chatService";
import { useChatStore } from "@/stores/chat/chatStore";
import type { ChatMessage } from "@/types/domain/chatMessage";
import {
  CHAT_ROOM_STATUS,
  getChatRoomParticipantDisplayName,
  type ChatRoomParticipant,
} from "@/types/domain/chatRoom";
import { MATCH_STATUS } from "@/types/domain/match";

const PARTNER_IMAGE = require("../../assets/chat/Profileimage.png");

type ChatNoticeItem = {
  id: number;
  title: string;
  content: string;
  createdAtLabel: string;
  isPinned?: boolean;
};

type ChatScheduleItem = {
  id: number;
  dateLabel: string;
  timeRangeLabel: string;
  locationName: string;
  sportName: string;
};

const NOTICE_EMPTY_CONTENT = "공지 내용이 없습니다.";
const NOTICE_NEW_TITLE_PREFIX = "공지";
const JUST_NOW_LABEL = "방금";

const SCHEDULE_FALLBACK = {
  dateLabel: "날짜 미정",
  timeRangeLabel: "시간 미정",
  locationName: "장소 미정",
  sportName: "운동종목 미정",
} satisfies Omit<ChatScheduleItem, "id">;

const EMPTY_SCHEDULE_DRAFT: ChatScheduleItem = {
  id: 0,
  ...SCHEDULE_FALLBACK,
};

const INITIAL_NOTICES: ChatNoticeItem[] = [
  {
    id: 1,
    title: "운동 전 준비 안내",
    content:
      "오늘 운동 전 10분 일찍 도착해서 준비운동하고 시작해요. 물은 각자 챙기고, 장소가 헷갈리면 채팅으로 바로 공유해주세요.",
    createdAtLabel: "오늘",
    isPinned: true,
  },
];

const INITIAL_SCHEDULES: ChatScheduleItem[] = [
  {
    id: 1,
    dateLabel: "오늘",
    timeRangeLabel: "7:00 PM - 8:00 PM",
    locationName: "OO Park",
    sportName: "Futsal",
  },
];

export default function ChatRoomScreen() {
  const params = useLocalSearchParams<{ chatRoomId?: string | string[] }>();
  const chatRoomId = parseChatRoomId(params.chatRoomId);

  const chatRooms = useChatStore((state) => state.chatRooms);
  const upsertChatRoom = useChatStore((state) => state.upsertChatRoom);
  const setSelectedChatRoomId = useChatStore(
    (state) => state.setSelectedChatRoomId,
  );
  const messagesByRoomId = useChatStore((state) => state.messagesByRoomId);
  const setMessages = useChatStore((state) => state.setMessages);
  const appendMessage = useChatStore((state) => state.appendMessage);
  const draftsByRoomId = useChatStore((state) => state.draftsByRoomId);
  const setDraft = useChatStore((state) => state.setDraft);

  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [roomTitle, setRoomTitle] = useState("");
  const [roomTitleDraft, setRoomTitleDraft] = useState("");
  const [isRoomTitleEditing, setIsRoomTitleEditing] = useState(false);
  const [selectedNoticeId, setSelectedNoticeId] = useState<number | null>(null);
  const [isNoticeDetailOpen, setIsNoticeDetailOpen] = useState(false);
  const [isNoticeDetailEditing, setIsNoticeDetailEditing] = useState(false);
  const [isNoticeDetailMenuOpen, setIsNoticeDetailMenuOpen] = useState(false);
  const [noticeDraft, setNoticeDraft] = useState("");
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);
  const [isScheduleDetailOpen, setIsScheduleDetailOpen] = useState(false);
  const [isScheduleDetailEditing, setIsScheduleDetailEditing] = useState(false);
  const [isScheduleDetailMenuOpen, setIsScheduleDetailMenuOpen] = useState(false);
  const [scheduleDraft, setScheduleDraft] = useState<ChatScheduleItem>(
    EMPTY_SCHEDULE_DRAFT,
  );
  const [notices, setNotices] = useState<ChatNoticeItem[]>(INITIAL_NOTICES);
  const [schedules, setSchedules] =
    useState<ChatScheduleItem[]>(INITIAL_SCHEDULES);

  const chatRoom = useMemo(
    () => chatRooms.find((item) => item.id === chatRoomId) ?? null,
    [chatRoomId, chatRooms],
  );
  const partnerDisplayName = useMemo(
    () =>
      chatRoom
        ? getChatRoomParticipantDisplayName(chatRoom.participants)
        : "Chat Room",
    [chatRoom],
  );
  const messages = messagesByRoomId[chatRoomId] ?? [];
  const draft = draftsByRoomId[chatRoomId] ?? "";
  const isReadOnly = chatRoom?.status === CHAT_ROOM_STATUS.READ_ONLY;
  const displayRoomTitle = roomTitle.trim() || partnerDisplayName;
  const primaryNotice = notices.find((notice) => notice.isPinned) ?? null;
  const selectedNotice =
    notices.find((notice) => notice.id === selectedNoticeId) ??
    primaryNotice ??
    null;
  const selectedSchedule =
    schedules.find((schedule) => schedule.id === selectedScheduleId) ??
    schedules[0] ??
    null;

  const handleOpenNoticeDetail = (noticeId: number) => {
    setSelectedNoticeId(noticeId);
    setIsNoticeDetailOpen(true);
    setIsNoticeDetailEditing(false);
    setIsNoticeDetailMenuOpen(false);
  };

  const handleCloseNoticeDetail = () => {
    setIsNoticeDetailOpen(false);
    setIsNoticeDetailEditing(false);
    setIsNoticeDetailMenuOpen(false);
  };

  const handleStartRoomTitleEdit = () => {
    setRoomTitleDraft(displayRoomTitle);
    setIsRoomTitleEditing(true);
  };

  const handleSaveRoomTitle = () => {
    setRoomTitle(roomTitleDraft.trim());
    setIsRoomTitleEditing(false);
  };

  const handleAddNotice = () => {
    const nextNotice: ChatNoticeItem = {
      id: Date.now(),
      title: `${NOTICE_NEW_TITLE_PREFIX} ${notices.length + 1}`,
      content: "",
      createdAtLabel: JUST_NOW_LABEL,
      isPinned: notices.length === 0,
    };

    setNotices((currentNotices) => [nextNotice, ...currentNotices]);
    setNoticeDraft("");
    setSelectedNoticeId(nextNotice.id);
    setIsMenuOpen(false);
    setIsNoticeDetailOpen(true);
    setIsNoticeDetailEditing(true);
    setIsNoticeDetailMenuOpen(false);
  };

  const handleStartNoticeEdit = () => {
    if (!selectedNotice) return;

    setNoticeDraft(selectedNotice.content);
    setIsNoticeDetailMenuOpen(false);
    setIsNoticeDetailEditing(true);
  };

  const handleSaveNotice = () => {
    if (!selectedNotice) return;

    const nextContent = noticeDraft.trim() || NOTICE_EMPTY_CONTENT;

    setNotices((currentNotices) =>
      currentNotices.map((notice) =>
        notice.id === selectedNotice.id
          ? { ...notice, content: nextContent }
          : notice,
      ),
    );
    setIsNoticeDetailEditing(false);
  };

  const handleDeleteNotice = () => {
    if (!selectedNotice) return;

    setNotices((currentNotices) =>
      currentNotices.filter((notice) => notice.id !== selectedNotice.id),
    );
    setSelectedNoticeId(null);
    setIsNoticeDetailMenuOpen(false);
    setIsNoticeDetailOpen(false);
    setIsNoticeDetailEditing(false);
  };

  const handleUnpinNotice = () => {
    if (!selectedNotice) return;

    setNotices((currentNotices) =>
      currentNotices.map((notice) =>
        notice.id === selectedNotice.id ? { ...notice, isPinned: false } : notice,
      ),
    );
    setIsNoticeDetailMenuOpen(false);
  };

  const handlePinNotice = () => {
    if (!selectedNotice) return;

    setNotices((currentNotices) =>
      currentNotices.map((notice) => ({
        ...notice,
        isPinned: notice.id === selectedNotice.id,
      })),
    );
    setIsNoticeDetailMenuOpen(false);
  };

  const handleOpenScheduleDetail = (scheduleId: number) => {
    setSelectedScheduleId(scheduleId);
    setIsScheduleDetailOpen(true);
    setIsScheduleDetailEditing(false);
    setIsScheduleDetailMenuOpen(false);
  };

  const handleCloseScheduleDetail = () => {
    setIsScheduleDetailOpen(false);
    setIsScheduleDetailEditing(false);
    setIsScheduleDetailMenuOpen(false);
  };

  const handleAddSchedule = () => {
    const nextSchedule: ChatScheduleItem = {
      id: Date.now(),
      ...SCHEDULE_FALLBACK,
    };

    setSchedules((currentSchedules) => [nextSchedule, ...currentSchedules]);
    setScheduleDraft(nextSchedule);
    setSelectedScheduleId(nextSchedule.id);
    setIsMenuOpen(false);
    setIsScheduleDetailOpen(true);
    setIsScheduleDetailEditing(true);
    setIsScheduleDetailMenuOpen(false);
  };

  const handleStartScheduleEdit = () => {
    if (!selectedSchedule) return;

    setScheduleDraft(selectedSchedule);
    setIsScheduleDetailMenuOpen(false);
    setIsScheduleDetailEditing(true);
  };

  const handleSaveSchedule = () => {
    if (!selectedSchedule) return;

    setSchedules((currentSchedules) =>
      currentSchedules.map((schedule) =>
        schedule.id === selectedSchedule.id
          ? {
              ...schedule,
              dateLabel:
                scheduleDraft.dateLabel.trim() || SCHEDULE_FALLBACK.dateLabel,
              timeRangeLabel:
                scheduleDraft.timeRangeLabel.trim() ||
                SCHEDULE_FALLBACK.timeRangeLabel,
              locationName:
                scheduleDraft.locationName.trim() ||
                SCHEDULE_FALLBACK.locationName,
              sportName:
                scheduleDraft.sportName.trim() || SCHEDULE_FALLBACK.sportName,
            }
          : schedule,
      ),
    );
    setIsScheduleDetailEditing(false);
  };

  const handleDeleteSchedule = () => {
    if (!selectedSchedule) return;

    setSchedules((currentSchedules) =>
      currentSchedules.filter((schedule) => schedule.id !== selectedSchedule.id),
    );
    setSelectedScheduleId(null);
    setIsScheduleDetailMenuOpen(false);
    setIsScheduleDetailOpen(false);
    setIsScheduleDetailEditing(false);
  };

  useEffect(() => {
    connectChatWs();

    let isMounted = true;

    async function loadChatRoom() {
      setIsLoading(true);

      try {
        const details = await getChatRoomDetails(chatRoomId);

        if (!isMounted) return;

        if (!details) {
          router.replace("/(tabs)/chat");
          return;
        }

        upsertChatRoom(details.chatRoom);
        setSelectedChatRoomId(chatRoomId);
        setMessages(chatRoomId, details.messages);
        await markChatRoomAsRead(chatRoomId);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadChatRoom();

    const unsubscribeMessages = subscribeToChatMessages(chatRoomId, (message) => {
      const currentMessages =
        useChatStore.getState().messagesByRoomId[chatRoomId] ?? [];
      if (!currentMessages.some((item) => item.id === message.id)) {
        appendMessage(chatRoomId, message);
      }
    });

    return () => {
      isMounted = false;
      unsubscribeMessages();
      setSelectedChatRoomId(null);
    };
  }, [
    appendMessage,
    chatRoomId,
    upsertChatRoom,
    setMessages,
    setSelectedChatRoomId,
  ]);

  useEffect(() => {
    if (!chatRoom?.matchId) return;

    return subscribeToChatRoomEvents(chatRoom.matchId, (event) => {
      if (event.type === "MATCH_COMPLETED") {
        void getChatRoomDetails(chatRoom.id).then((details) => {
          if (details) upsertChatRoom(details.chatRoom);
        });
      }
    });
  }, [chatRoom?.matchId, chatRoom?.id, upsertChatRoom]);

  const handleSendMessage = async () => {
    const trimmedDraft = draft.trim();

    if (!trimmedDraft || isReadOnly || isSending) {
      return;
    }

    setIsSending(true);

    try {
      const sentMessage = await sendChatMessage({
        chatRoomId,
        message: trimmedDraft,
        clientMessageId: `draft-${Date.now()}`,
      });

      appendMessage(chatRoomId, sentMessage);
      setDraft(chatRoomId, "");
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading || !chatRoom) {
    return (
      <SafeAreaView
        style={styles.safeArea}
        edges={["top", "left", "right", "bottom"]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={Color.primary100} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "left", "right", "bottom"]}
    >
      <View style={styles.container}>
        <ChatHeader
          title={displayRoomTitle}
          onBackPress={() => router.replace("/(tabs)/chat")}
          onPressMenu={() => setIsMenuOpen(true)}
        />

        {primaryNotice ? (
          <ChatNotice
            notice={primaryNotice}
            onPress={() => handleOpenNoticeDetail(primaryNotice.id)}
          />
        ) : null}

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.messageList}>
            {messages.map((message) => (
              <MessageRow
                key={message.id}
                message={message}
                partnerName={partnerDisplayName}
              />
            ))}
          </View>
        </ScrollView>

        <PostMatchReviewCard
          showReviewPrompt={chatRoom.matchStatus === MATCH_STATUS.COMPLETED}
          title="Workout finished!"
          description="How was the session today? Please leave a review for your partner."
          buttonLabel="Leave review"
          onPressReview={() => {
            const opponent = chatRoom.participants[0];
            router.push(
              `/review/${chatRoom.matchId}?revieweeId=${opponent?.id ?? ""}` as any,
            );
          }}
          inputPlaceholder={
            isReadOnly ? "This chat is read-only." : "Write a message..."
          }
          inputDisabled={isReadOnly}
          messageValue={draft}
          onChangeMessage={(message) => setDraft(chatRoomId, message)}
          onPressSend={handleSendMessage}
          sendDisabled={isReadOnly || isSending || draft.trim().length === 0}
        />

        <ChatRoomSideMenu
          visible={isMenuOpen}
          roomTitle={displayRoomTitle}
          roomTitleDraft={roomTitleDraft}
          isRoomTitleEditing={isRoomTitleEditing}
          participants={chatRoom.participants}
          notices={notices}
          schedules={schedules}
          onClose={() => setIsMenuOpen(false)}
          onStartRoomTitleEdit={handleStartRoomTitleEdit}
          onChangeRoomTitleDraft={setRoomTitleDraft}
          onCancelRoomTitleEdit={() => setIsRoomTitleEditing(false)}
          onSaveRoomTitle={handleSaveRoomTitle}
          onOpenNotice={(noticeId) => {
            setIsMenuOpen(false);
            handleOpenNoticeDetail(noticeId);
          }}
          onOpenSchedule={(scheduleId) => {
            setIsMenuOpen(false);
            handleOpenScheduleDetail(scheduleId);
          }}
          onAddNotice={handleAddNotice}
          onAddSchedule={handleAddSchedule}
        />

        <NoticeDetailModal
          visible={isNoticeDetailOpen}
          notice={selectedNotice}
          draft={noticeDraft}
          isEditing={isNoticeDetailEditing}
          isMenuOpen={isNoticeDetailMenuOpen}
          onClose={handleCloseNoticeDetail}
          onToggleMenu={() => setIsNoticeDetailMenuOpen((value) => !value)}
          onStartEdit={handleStartNoticeEdit}
          onDelete={handleDeleteNotice}
          onUnpin={handleUnpinNotice}
          onPin={handlePinNotice}
          onChangeDraft={setNoticeDraft}
          onCancelEdit={() => setIsNoticeDetailEditing(false)}
          onSave={handleSaveNotice}
        />

        <ScheduleDetailModal
          visible={isScheduleDetailOpen}
          schedule={selectedSchedule}
          draft={scheduleDraft}
          isEditing={isScheduleDetailEditing}
          isMenuOpen={isScheduleDetailMenuOpen}
          onClose={handleCloseScheduleDetail}
          onToggleMenu={() => setIsScheduleDetailMenuOpen((value) => !value)}
          onStartEdit={handleStartScheduleEdit}
          onDelete={handleDeleteSchedule}
          onChangeDraft={setScheduleDraft}
          onCancelEdit={() => setIsScheduleDetailEditing(false)}
          onSave={handleSaveSchedule}
        />
      </View>
    </SafeAreaView>
  );
}

type MessageRowProps = {
  message: ChatMessage;
  partnerName: string;
};

type ChatNoticeProps = {
  notice: ChatNoticeItem;
  onPress: () => void;
};

function ChatNotice({
  notice,
  onPress,
}: ChatNoticeProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={styles.noticeBar}
    >
      <View style={styles.noticeHeader}>
        <Ionicons name="megaphone-outline" size={18} color={Color.primary100} />
        <Text style={styles.noticeTitle}>공지</Text>
      </View>
      <Text numberOfLines={2} style={styles.noticePreview}>
        {notice.content}
      </Text>
    </Pressable>
  );
}

type ChatRoomSideMenuProps = {
  visible: boolean;
  roomTitle: string;
  roomTitleDraft: string;
  isRoomTitleEditing: boolean;
  participants: ChatRoomParticipant[];
  notices: ChatNoticeItem[];
  schedules: ChatScheduleItem[];
  onClose: () => void;
  onStartRoomTitleEdit: () => void;
  onChangeRoomTitleDraft: (value: string) => void;
  onCancelRoomTitleEdit: () => void;
  onSaveRoomTitle: () => void;
  onOpenNotice: (noticeId: number) => void;
  onOpenSchedule: (scheduleId: number) => void;
  onAddNotice: () => void;
  onAddSchedule: () => void;
};

function ChatRoomSideMenu({
  visible,
  roomTitle,
  roomTitleDraft,
  isRoomTitleEditing,
  participants,
  notices,
  schedules,
  onClose,
  onStartRoomTitleEdit,
  onChangeRoomTitleDraft,
  onCancelRoomTitleEdit,
  onSaveRoomTitle,
  onOpenNotice,
  onOpenSchedule,
  onAddNotice,
  onAddSchedule,
}: ChatRoomSideMenuProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView edges={["top", "left", "right", "bottom"]} style={styles.drawer}>
        <View style={styles.drawerHeader}>
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            onPress={onClose}
            style={styles.drawerBackButton}
          >
            <Ionicons name="chevron-back" size={28} color="#111827" />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.drawerContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.roomTitleSection}>
            <Text style={styles.drawerSectionTitle}>채팅방 제목</Text>
            {isRoomTitleEditing ? (
              <View style={styles.roomTitleEditArea}>
                <TextInput
                  value={roomTitleDraft}
                  onChangeText={onChangeRoomTitleDraft}
                  placeholder="채팅방 제목"
                  placeholderTextColor={Color.neutral700}
                  style={styles.roomTitleInput}
                />
                <View style={styles.roomTitleActions}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={onCancelRoomTitleEdit}
                    style={styles.roomTitleSecondaryButton}
                  >
                    <Text style={styles.roomTitleSecondaryText}>취소</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    onPress={onSaveRoomTitle}
                    style={styles.roomTitlePrimaryButton}
                  >
                    <Text style={styles.roomTitlePrimaryText}>저장</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={styles.roomTitleReadRow}>
                <Text numberOfLines={1} style={styles.roomTitleText}>
                  {roomTitle}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={onStartRoomTitleEdit}
                  style={styles.roomTitleEditButton}
                >
                  <Text style={styles.drawerActionText}>수정</Text>
                </Pressable>
              </View>
            )}
          </View>

          <View style={styles.drawerSection}>
            <Text style={styles.drawerSectionTitle}>대화상대</Text>
            {participants.map((participant) => (
              <View key={participant.id} style={styles.participantRow}>
                <View style={styles.participantAvatar}>
                  <Text style={styles.participantInitial}>
                    {(participant.isSelf ? "나" : participant.name).slice(0, 1)}
                  </Text>
                </View>
                <Text numberOfLines={1} style={styles.participantName}>
                  {participant.isSelf ? "나" : participant.name}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.drawerSection}>
            <View style={styles.drawerSectionHeader}>
              <Text style={styles.drawerSectionTitle}>공지</Text>
              <Pressable
                accessibilityRole="button"
                onPress={onAddNotice}
                style={styles.addScheduleButton}
              >
                <Ionicons name="add" size={16} color={Color.primary100} />
                <Text style={styles.drawerActionText}>공지 작성</Text>
              </Pressable>
            </View>
            {notices.map((notice) => (
              <Pressable
                key={notice.id}
                accessibilityRole="button"
                onPress={() => onOpenNotice(notice.id)}
                style={styles.drawerNoticeCard}
              >
                <Ionicons
                  name="megaphone-outline"
                  size={18}
                  color={Color.primary100}
                />
                <View style={styles.drawerNoticeContent}>
                  <Text numberOfLines={1} style={styles.drawerNoticeTitle}>
                    {notice.title}
                  </Text>
                  <Text numberOfLines={2} style={styles.drawerNoticeText}>
                    {notice.content}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          <View style={styles.drawerSection}>
            <View style={styles.drawerSectionHeader}>
              <Text style={styles.drawerSectionTitle}>일정</Text>
              <Pressable
                accessibilityRole="button"
                onPress={onAddSchedule}
                style={styles.addScheduleButton}
              >
                <Ionicons name="add" size={16} color={Color.primary100} />
                <Text style={styles.drawerActionText}>일정 추가</Text>
              </Pressable>
            </View>
            {schedules.map((schedule) => (
              <Pressable
                key={schedule.id}
                accessibilityRole="button"
                onPress={() => onOpenSchedule(schedule.id)}
                style={styles.scheduleRow}
              >
                <Ionicons name="calendar-outline" size={18} color="#6B7280" />
                <View style={styles.scheduleContent}>
                  <Text numberOfLines={1} style={styles.scheduleTitle}>
                    {schedule.dateLabel} · {schedule.timeRangeLabel}
                  </Text>
                  <Text numberOfLines={1} style={styles.scheduleText}>
                    {schedule.locationName} · {schedule.sportName}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

type NoticeDetailModalProps = {
  visible: boolean;
  notice: ChatNoticeItem | null;
  draft: string;
  isEditing: boolean;
  isMenuOpen: boolean;
  onClose: () => void;
  onToggleMenu: () => void;
  onStartEdit: () => void;
  onDelete: () => void;
  onUnpin: () => void;
  onPin: () => void;
  onChangeDraft: (value: string) => void;
  onCancelEdit: () => void;
  onSave: () => void;
};

function NoticeDetailModal({
  visible,
  notice,
  draft,
  isEditing,
  isMenuOpen,
  onClose,
  onToggleMenu,
  onStartEdit,
  onDelete,
  onUnpin,
  onPin,
  onChangeDraft,
  onCancelEdit,
  onSave,
}: NoticeDetailModalProps) {
  if (!notice) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView edges={["top", "left", "right", "bottom"]} style={styles.detailOverlay}>
        <View style={styles.detailSheet}>
          <View style={styles.detailHeader}>
            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              style={styles.detailIconButton}
            >
              <Ionicons name="chevron-back" size={26} color="#111827" />
            </Pressable>
            <Text style={styles.detailHeaderTitle}>공지</Text>
            <Pressable
              accessibilityRole="button"
              onPress={onToggleMenu}
              style={styles.detailIconButton}
            >
              <Ionicons name="ellipsis-vertical" size={22} color="#111827" />
            </Pressable>
          </View>

          {isMenuOpen && !isEditing ? (
            <View style={styles.detailMenu}>
              <DetailMenuAction label="수정하기" onPress={onStartEdit} />
              <DetailMenuAction label="삭제하기" onPress={onDelete} danger />
              <DetailMenuAction label="공지 내리기" onPress={onUnpin} />
              <DetailMenuAction
                label="현재 채팅방에 공지 고정하기"
                onPress={onPin}
              />
            </View>
          ) : null}

          <ScrollView
            contentContainerStyle={styles.detailContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.detailTitle}>{notice.title}</Text>
            <Text style={styles.detailDate}>{notice.createdAtLabel}</Text>

            {isEditing ? (
              <>
                <TextInput
                  multiline
                  value={draft}
                  onChangeText={onChangeDraft}
                  placeholder="채팅방 공지를 입력하세요"
                  placeholderTextColor={Color.neutral700}
                  style={styles.detailInput}
                />
                <View style={styles.noticeActions}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={onCancelEdit}
                    style={styles.noticeSecondaryButton}
                  >
                    <Text style={styles.noticeSecondaryButtonText}>취소</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    onPress={onSave}
                    style={styles.noticePrimaryButton}
                  >
                    <Text style={styles.noticePrimaryButtonText}>저장</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <Text style={styles.detailText}>{notice.content}</Text>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

type ScheduleDetailModalProps = {
  visible: boolean;
  schedule: ChatScheduleItem | null;
  draft: ChatScheduleItem;
  isEditing: boolean;
  isMenuOpen: boolean;
  onClose: () => void;
  onToggleMenu: () => void;
  onStartEdit: () => void;
  onDelete: () => void;
  onChangeDraft: (value: ChatScheduleItem) => void;
  onCancelEdit: () => void;
  onSave: () => void;
};

function ScheduleDetailModal({
  visible,
  schedule,
  draft,
  isEditing,
  isMenuOpen,
  onClose,
  onToggleMenu,
  onStartEdit,
  onDelete,
  onChangeDraft,
  onCancelEdit,
  onSave,
}: ScheduleDetailModalProps) {
  if (!schedule) return null;

  const updateDraft = (key: keyof ChatScheduleItem, value: string) => {
    onChangeDraft({ ...draft, [key]: value });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView edges={["top", "left", "right", "bottom"]} style={styles.detailOverlay}>
        <View style={styles.detailSheet}>
          <View style={styles.detailHeader}>
            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              style={styles.detailIconButton}
            >
              <Ionicons name="chevron-back" size={26} color="#111827" />
            </Pressable>
            <Text style={styles.detailHeaderTitle}>일정</Text>
            <Pressable
              accessibilityRole="button"
              onPress={onToggleMenu}
              style={styles.detailIconButton}
            >
              <Ionicons name="ellipsis-vertical" size={22} color="#111827" />
            </Pressable>
          </View>

          {isMenuOpen && !isEditing ? (
            <View style={styles.detailMenu}>
              <DetailMenuAction label="수정하기" onPress={onStartEdit} />
              <DetailMenuAction label="삭제하기" onPress={onDelete} danger />
            </View>
          ) : null}

          <ScrollView
            contentContainerStyle={styles.detailContent}
            showsVerticalScrollIndicator={false}
          >
            {isEditing ? (
              <>
                <ScheduleEditField
                  label="날짜"
                  value={draft.dateLabel}
                  onChangeText={(value) => updateDraft("dateLabel", value)}
                />
                <ScheduleEditField
                  label="진행 시간대"
                  value={draft.timeRangeLabel}
                  onChangeText={(value) => updateDraft("timeRangeLabel", value)}
                />
                <ScheduleEditField
                  label="장소"
                  value={draft.locationName}
                  onChangeText={(value) => updateDraft("locationName", value)}
                />
                <ScheduleEditField
                  label="운동종목"
                  value={draft.sportName}
                  onChangeText={(value) => updateDraft("sportName", value)}
                />
                <View style={styles.noticeActions}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={onCancelEdit}
                    style={styles.noticeSecondaryButton}
                  >
                    <Text style={styles.noticeSecondaryButtonText}>취소</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    onPress={onSave}
                    style={styles.noticePrimaryButton}
                  >
                    <Text style={styles.noticePrimaryButtonText}>저장</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.detailTitle}>
                  {schedule.dateLabel} · {schedule.timeRangeLabel}
                </Text>
                <View style={styles.scheduleDetailList}>
                  <ScheduleDetailRow
                    icon="calendar-outline"
                    label="날짜"
                    value={schedule.dateLabel}
                  />
                  <ScheduleDetailRow
                    icon="time-outline"
                    label="진행 시간대"
                    value={schedule.timeRangeLabel}
                  />
                  <ScheduleDetailRow
                    icon="location-outline"
                    label="장소"
                    value={schedule.locationName}
                  />
                  <ScheduleDetailRow
                    icon="fitness-outline"
                    label="운동종목"
                    value={schedule.sportName}
                  />
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

type ScheduleDetailRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
};

function ScheduleDetailRow({ icon, label, value }: ScheduleDetailRowProps) {
  return (
    <View style={styles.scheduleDetailRow}>
      <Ionicons name={icon} size={20} color="#6B7280" />
      <View style={styles.scheduleDetailTextArea}>
        <Text style={styles.scheduleDetailLabel}>{label}</Text>
        <Text style={styles.scheduleDetailValue}>{value}</Text>
      </View>
    </View>
  );
}

type ScheduleEditFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
};

function ScheduleEditField({ label, value, onChangeText }: ScheduleEditFieldProps) {
  return (
    <View style={styles.scheduleEditField}>
      <Text style={styles.scheduleEditLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor={Color.neutral700}
        style={styles.scheduleEditInput}
      />
    </View>
  );
}

type DetailMenuActionProps = {
  label: string;
  onPress: () => void;
  danger?: boolean;
};

function DetailMenuAction({ label, onPress, danger = false }: DetailMenuActionProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={styles.detailMenuItem}
    >
      <Text style={[styles.detailMenuText, danger && styles.detailMenuDangerText]}>
        {label}
      </Text>
    </Pressable>
  );
}

function MessageRow({ message, partnerName }: MessageRowProps) {
  if (message.type === "SYSTEM") {
    return (
      <View style={styles.systemMessageWrapper}>
        <Text style={styles.systemMessageText}>{message.message}</Text>
      </View>
    );
  }

  if (message.isMine) {
    return (
      <View style={styles.myMessageRow}>
        <View style={styles.myMessageMeta}>
          <Text style={styles.timestamp}>{formatMessageTime(message.createdAt)}</Text>
        </View>
        <View style={styles.myBubble}>
          <Text style={styles.myBubbleText}>{message.message}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.partnerMessageSection}>
      <View style={styles.partnerHeaderRow}>
        <Image source={PARTNER_IMAGE} style={styles.partnerAvatar} />
        <Text style={styles.partnerName}>{partnerName}</Text>
      </View>
      <View style={styles.partnerBubbleRow}>
        <View style={styles.partnerBubble}>
          <Text style={styles.partnerBubbleText}>{message.message}</Text>
        </View>
        <Text style={styles.timestamp}>{formatMessageTime(message.createdAt)}</Text>
      </View>
    </View>
  );
}

function parseChatRoomId(value?: string | string[]) {
  const normalizedValue = Array.isArray(value) ? value[0] : value;
  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) ? parsedValue : 1;
}

function formatMessageTime(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Color.colorWhite,
  },
  container: {
    flex: 1,
    backgroundColor: Color.colorWhite,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Color.colorWhite,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 24,
    gap: 20,
  },
  noticeBar: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#EEF0F5",
    backgroundColor: "#FFFFFF",
    paddingBottom: 12,
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
  noticeActions: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  noticeSecondaryButton: {
    minHeight: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  noticeSecondaryButtonText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
    fontFamily: FontFamily.inter,
    color: "#374151",
  },
  noticePrimaryButton: {
    minHeight: 34,
    borderRadius: 8,
    backgroundColor: Color.primary100,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  noticePrimaryButtonText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "800",
    fontFamily: FontFamily.inter,
    color: Color.colorWhite,
  },
  drawer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  drawerHeader: {
    minHeight: 58,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF0F5",
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  drawerBackButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  drawerContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28,
    gap: 26,
  },
  drawerSection: {
    gap: 12,
  },
  roomTitleSection: {
    gap: 12,
  },
  roomTitleReadRow: {
    minHeight: 46,
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  roomTitleText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "800",
    fontFamily: FontFamily.inter,
    color: "#111827",
  },
  roomTitleEditButton: {
    minHeight: 36,
    justifyContent: "center",
  },
  roomTitleEditArea: {
    gap: 10,
  },
  roomTitleInput: {
    minHeight: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: FontFamily.inter,
    color: "#111827",
  },
  roomTitleActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  roomTitleSecondaryButton: {
    minHeight: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  roomTitleSecondaryText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
    fontFamily: FontFamily.inter,
    color: "#374151",
  },
  roomTitlePrimaryButton: {
    minHeight: 34,
    borderRadius: 8,
    backgroundColor: Color.primary100,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  roomTitlePrimaryText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "800",
    fontFamily: FontFamily.inter,
    color: Color.colorWhite,
  },
  drawerSectionHeader: {
    minHeight: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  drawerSectionTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "800",
    fontFamily: FontFamily.inter,
    color: "#111827",
  },
  drawerActionText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "800",
    fontFamily: FontFamily.inter,
    color: Color.primary100,
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
  drawerNoticeContent: {
    flex: 1,
    gap: 3,
  },
  drawerNoticeTitle: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "800",
    fontFamily: FontFamily.inter,
    color: "#111827",
  },
  drawerNoticeText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    fontFamily: FontFamily.inter,
    color: "#374151",
  },
  detailOverlay: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  detailSheet: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  detailHeader: {
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF0F5",
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailIconButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  detailHeaderTitle: {
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "800",
    fontFamily: FontFamily.inter,
    color: "#111827",
  },
  detailMenu: {
    position: "absolute",
    top: 50,
    right: 12,
    zIndex: 2,
    width: 240,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 6,
  },
  detailMenuItem: {
    minHeight: 44,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailMenuText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "700",
    fontFamily: FontFamily.inter,
    color: "#111827",
  },
  detailMenuDangerText: {
    color: "#EF4444",
  },
  detailContent: {
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 40,
  },
  detailTitle: {
    fontSize: 22,
    lineHeight: 29,
    fontWeight: "800",
    fontFamily: FontFamily.inter,
    color: "#111827",
  },
  detailDate: {
    marginTop: 6,
    marginBottom: 24,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: FontFamily.inter,
    color: "#9CA3AF",
  },
  detailText: {
    fontSize: 16,
    lineHeight: 25,
    fontFamily: FontFamily.inter,
    color: "#111827",
  },
  detailInput: {
    minHeight: 220,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: FontFamily.inter,
    color: Color.labelsPrimary,
    textAlignVertical: "top",
  },
  addScheduleButton: {
    minHeight: 28,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  scheduleRow: {
    minHeight: 42,
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  scheduleContent: {
    flex: 1,
    gap: 2,
  },
  scheduleTitle: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "800",
    fontFamily: FontFamily.inter,
    color: "#111827",
  },
  scheduleText: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: FontFamily.inter,
    color: "#374151",
  },
  scheduleDetailList: {
    marginTop: 24,
    gap: 14,
  },
  scheduleDetailRow: {
    minHeight: 58,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  scheduleDetailTextArea: {
    flex: 1,
    gap: 2,
  },
  scheduleDetailLabel: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "700",
    fontFamily: FontFamily.inter,
    color: "#9CA3AF",
  },
  scheduleDetailValue: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "800",
    fontFamily: FontFamily.inter,
    color: "#111827",
  },
  scheduleEditField: {
    gap: 8,
    marginBottom: 16,
  },
  scheduleEditLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "800",
    fontFamily: FontFamily.inter,
    color: "#374151",
  },
  scheduleEditInput: {
    minHeight: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: FontFamily.inter,
    color: "#111827",
  },
  messageList: {
    paddingHorizontal: 20,
    gap: 24,
  },
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
  partnerMessageSection: {
    gap: 8,
  },
  partnerHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  partnerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    resizeMode: "cover",
  },
  partnerName: {
    fontSize: FontSize.fs_17,
    lineHeight: 22,
    fontWeight: "600",
    fontFamily: FontFamily.inter,
    color: Color.labelsPrimary,
  },
  partnerBubbleRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    paddingLeft: 58,
  },
  partnerBubble: {
    maxWidth: "72%",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 22,
    borderBottomRightRadius: 22,
    borderBottomLeftRadius: 22,
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  partnerBubbleText: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: FontFamily.inter,
    color: Color.labelsPrimary,
  },
  myMessageRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    gap: 8,
  },
  myMessageMeta: {
    paddingBottom: 6,
  },
  myBubble: {
    maxWidth: "76%",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 22,
    borderBottomLeftRadius: 22,
    backgroundColor: Color.primary100,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  myBubbleText: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: FontFamily.inter,
    color: Color.colorWhite,
  },
  timestamp: {
    fontSize: FontSize.fs_12,
    lineHeight: 16,
    fontFamily: FontFamily.inter,
    color: Color.neutral700,
  },
});
