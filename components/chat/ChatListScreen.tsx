import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ChatHeader from "./ChatHeader";
import ChatSegment from "./ChatSegment";
import { Color } from "../GlobalStyles";

export default function ChatListScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.container}>
        <ChatHeader title="Chat" />
        <View style={styles.listContainer}>
          <ChatSegment />
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
});
