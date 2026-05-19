import { FlatList, StyleSheet, Text, View } from "react-native";

import Chatroom from "./Chatroom";
import { Color, FontFamily, FontSize } from "../GlobalStyles";
import type { ChatRoom } from "@/types/domain/chatRoom";

type ChatSegmentProps = {
  items?: ChatRoom[];
};

export default function ChatSegment({
  items = [],
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
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <Chatroom chatRoom={item} />
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
    color: Color.neutral700,
  },
});
