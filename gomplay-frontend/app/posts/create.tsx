import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CreatePostScreen from "@/components/matching/create-post/CreatePostScreen";

export default function PostCreateRoute() {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <CreatePostScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
