import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PartnerReviewScreen from "@/components/review/PartnerReviewScreen";

export default function ReviewRoute() {
  const { matchId, revieweeId, type, partnerName, partnerProfileImageUrl, exerciseTypes, scheduledTime } = useLocalSearchParams<{
    matchId: string;
    revieweeId?: string;
    type?: string;
    partnerName?: string;
    partnerProfileImageUrl?: string;
    exerciseTypes?: string;
    scheduledTime?: string;
  }>();

  const isGathering = type === "gathering";

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <PartnerReviewScreen
        matchResultId={isGathering ? null : Number(matchId)}
        gatheringId={isGathering ? Number(matchId) : null}
        revieweeId={Number(revieweeId) || 0}
        partnerName={partnerName}
        partnerProfileImageUrl={partnerProfileImageUrl || null}
        exerciseTypes={exerciseTypes}
        scheduledTime={scheduledTime}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
