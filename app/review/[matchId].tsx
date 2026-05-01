import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PartnerReviewScreen from "@/components/review/PartnerReviewScreen";

export default function ReviewRoute() {
  const { matchId } = useLocalSearchParams<{ matchId: string }>();

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <PartnerReviewScreen matchId={matchId ?? ""} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
