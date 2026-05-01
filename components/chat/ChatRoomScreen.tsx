import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import ChatHeader from "./ChatHeader";
import MatchInfoCard from "./MatchInfoCard";
import PostMatchReviewCard from "./PostMatchReviewCard";
import { Color, FontFamily, FontSize } from "../GlobalStyles";
import {
  getChatMessages,
  getChatRoom,
  getChatRooms,
  markChatRoomAsRead,
  sendChatMessage,
  subscribeToChatMessages,
} from "@/services/chat/chatService";
import { useChatStore } from "@/stores/chat/chatStore";
import type { ChatMessage } from "@/types/domain/chatMessage";
import {
  CHAT_ROOM_STATUS,
  getChatRoomParticipantDisplayName,
} from "@/types/domain/chatRoom";
import { MATCH_STATUS } from "@/types/domain/match";

const PARTNER_IMAGE = require("../../assets/chat/Profileimage.png");

export default function ChatRoomScreen() {
  const params = useLocalSearchParams<{ chatRoomId?: string | string[] }>();
  const chatRoomId = parseChatRoomId(params.chatRoomId);

  const chatRooms = useChatStore((state) => state.chatRooms);
  const setChatRooms = useChatStore((state) => state.setChatRooms);
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

  useEffect(() => {
    let isMounted = true;

    async function loadChatRoom() {
      setIsLoading(true);

      const [nextChatRoom, nextPage, nextChatRooms] = await Promise.all([
        getChatRoom(chatRoomId),
        getChatMessages({ chatRoomId }),
        getChatRooms(),
      ]);

      if (!isMounted) {
        return;
      }

      if (!nextChatRoom) {
        router.replace("/(tabs)/chat");
        return;
      }

      setChatRooms(nextChatRooms);
      setSelectedChatRoomId(chatRoomId);
      setMessages(chatRoomId, nextPage.messages);

      await markChatRoomAsRead(chatRoomId);
      const refreshedChatRooms = await getChatRooms();

      if (isMounted) {
        setChatRooms(refreshedChatRooms);
      }

      setIsLoading(false);
    }

    void loadChatRoom();

    const unsubscribe = subscribeToChatMessages(chatRoomId, (message) => {
      const currentMessages =
        useChatStore.getState().messagesByRoomId[chatRoomId] ?? [];
      const alreadyExists = currentMessages.some((item) => item.id === message.id);

      if (!alreadyExists) {
        appendMessage(chatRoomId, message);
      }

      void getChatRooms().then((nextChatRooms) => {
        setChatRooms(nextChatRooms);
      });
    });

    return () => {
      isMounted = false;
      unsubscribe();
      setSelectedChatRoomId(null);
    };
  }, [
    appendMessage,
    chatRoomId,
    setChatRooms,
    setMessages,
    setSelectedChatRoomId,
  ]);

  const handleSendMessage = async () => {
    const trimmedDraft = draft.trim();

    if (!trimmedDraft || isReadOnly || isSending) {
      return;
    }

    setIsSending(true);

    try {
      await sendChatMessage({
        chatRoomId,
        message: trimmedDraft,
        clientMessageId: `draft-${Date.now()}`,
      });

      setDraft(chatRoomId, "");
      const nextChatRooms = await getChatRooms();
      setChatRooms(nextChatRooms);
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
          title={partnerDisplayName}
          onBackPress={() => router.replace("/(tabs)/chat")}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <MatchInfoCard
            locationName="OO Park"
            timeLabel="Today 7:00 PM"
            surfaceLabel="Futsal"
            levelLabel="Beginner"
            playerCountLabel="2 players"
          />

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
          onPressReview={() => router.push(`/review/${chatRoom.matchId}` as any)}
          inputPlaceholder={
            isReadOnly ? "This chat is read-only." : "Write a message..."
          }
          inputDisabled={isReadOnly}
          messageValue={draft}
          onChangeMessage={(message) => setDraft(chatRoomId, message)}
          onPressSend={handleSendMessage}
          sendDisabled={isReadOnly || isSending || draft.trim().length === 0}
        />
      </View>
    </SafeAreaView>
  );
}

type MessageRowProps = {
  message: ChatMessage;
  partnerName: string;
};

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
    color: Color.nuetral700,
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
    color: Color.nuetral700,
  },
});
