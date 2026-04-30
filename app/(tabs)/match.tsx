import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PostListScreen from "@/components/matching/posts/PostListScreen";

export default function MatchScreen() {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <PostListScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F2F7FF",
  },
});
