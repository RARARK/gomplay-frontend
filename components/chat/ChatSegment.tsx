import { FlatList, StyleSheet, Text, View } from "react-native";

import Chatroom from "./Chatroom";
import { Color, FontFamily, FontSize } from "../GlobalStyles";

export type ChatItem = {
  id: string;
  name: string;
  previewMessage: string;
  timestamp: string;
  unreadCount: number;
};

type ChatSegmentProps = {
  items?: ChatItem[];
};

export const defaultChatItems: ChatItem[] = [
  {
    id: "room-1",
    name: "Daniel Kim",
    previewMessage: "I am heading out now!",
    timestamp: "Today 7:01 PM",
    unreadCount: 2,
  },
  {
    id: "room-2",
    name: "Minsu Lee",
    previewMessage: "See you in front of the court.",
    timestamp: "Today 5:42 PM",
    unreadCount: 0,
  },
  {
    id: "room-3",
    name: "Seojun Park",
    previewMessage: "Thanks for leaving a review.",
    timestamp: "Yesterday 9:18 PM",
    unreadCount: 1,
  },
];

export default function ChatSegment({
  items = defaultChatItems,
}: ChatSegmentProps) {
  if (items.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>No chats yet</Text>
        <Text style={styles.emptyDescription}>
          Your active conversations will show up here.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Chatroom
          id={item.id}
          name={item.name}
          previewMessage={item.previewMessage}
          timestamp={item.timestamp}
          unreadCount={item.unreadCount}
        />
      )}
      contentContainerStyle={styles.container}
      ItemSeparatorComponent={ItemSeparator}
      showsVerticalScrollIndicator={false}
    />
  );
}

function ItemSeparator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  separator: {
    height: 16,
  },
  emptyState: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Color.colorGainsboro,
    backgroundColor: Color.colorGhostwhite100,
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 8,
  },
  emptyTitle: {
    fontSize: FontSize.fs_17,
    lineHeight: 22,
    fontWeight: "600",
    fontFamily: FontFamily.inter,
    color: Color.labelsPrimary,
  },
  emptyDescription: {
    fontSize: FontSize.fs_12,
    lineHeight: 16,
    fontFamily: FontFamily.inter,
    color: Color.nuetral700,
  },
});
