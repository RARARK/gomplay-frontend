import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ChatHeader from "./ChatHeader";
import MatchInfoCard from "./MatchInfoCard";
import PostMatchReviewCard from "./PostMatchReviewCard";

export default function ChatRoomScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <ChatHeader />
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <MatchInfoCard />
          <View style={styles.chatBubbleSpace} />
          <PostMatchReviewCard />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    paddingTop: 20,
    paddingBottom: 24,
  },
  chatBubbleSpace: {
    minHeight: 360,
  },
});
