import * as React from "react";
import { StyleSheet, View } from "react-native";
import RecommendationSection from "./RecommendationSection";
import { Gap } from "@/constants/locofyHomeStyles";
import { recommendationCards } from "./homeMockData";

const MatchSection = () => {
  return (
    <View style={styles.container}>
      <RecommendationSection
        title="Recommended matches"
        cards={recommendationCards}
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
