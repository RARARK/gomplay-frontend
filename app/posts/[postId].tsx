import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PostApplyScreen from "@/components/matching/posts/PostApplyScreen";

export default function PostDetailRoute() {
  const params = useLocalSearchParams<{ postId?: string }>();
  const postId = Number(params.postId);

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <PostApplyScreen postId={Number.isNaN(postId) ? 0 : postId} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
