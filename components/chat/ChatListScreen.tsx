import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ChatHeader from "./ChatHeader";
import ChatSegment from "./ChatSegment";
import { Color } from "../GlobalStyles";
import { getChatRooms } from "@/services/chat/chatService";
import { useChatStore } from "@/stores/chat/chatStore";

export default function ChatListScreen() {
  const chatRooms = useChatStore((state) => state.chatRooms);
  const setChatRooms = useChatStore((state) => state.setChatRooms);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadChatRooms() {
      const nextChatRooms = await getChatRooms();

      if (!isMounted) {
        return;
      }

      setChatRooms(nextChatRooms);
      setIsLoading(false);
    }

    void loadChatRooms();

    return () => {
      isMounted = false;
    };
  }, [setChatRooms]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <ChatHeader title="Chat" />
        <View style={styles.listContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={Color.primary100} />
            </View>
          ) : (
            <ChatSegment items={chatRooms} />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
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
  listContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
