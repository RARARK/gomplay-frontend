import * as React from "react";
import { StyleSheet, View } from "react-native";
import RecommendationSection from "./RecommendationSection";
import GroupRecommendationSection from "./GroupRecommendationSection";
import { Gap } from "@/constants/locofyHomeStyles";
import { recommendationCards, groupCards } from "./homeMockData";

const MatchSection = () => {
  return (
    <View style={styles.container}>
      <RecommendationSection
        title="Recommended matches"
        cards={recommendationCards}
      />
      <GroupRecommendationSection
        title="Group activities"
        cards={groupCards}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Gap.gap_24,
  },
});

export default MatchSection;
