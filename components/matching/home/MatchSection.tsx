import * as React from "react";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import RecommendationSection from "./RecommendationSection";
import { Gap } from "@/constants/locofyHomeStyles";
import { recommendationCards } from "./homeMockData";

const MatchSection = () => {
  const handleRecommendationHeaderPress = () => {
    router.push("/posts" as any);
  };

  const handleCardPress = () => {
    router.push("/posts" as any);
  };

  const cardsWithPress = recommendationCards.map((card) => ({
    ...card,
    onPress: handleCardPress,
  }));

  return (
    <View style={styles.container}>
      <RecommendationSection
        title="Recommended matches"
        cards={cardsWithPress}
        onHeaderPress={handleRecommendationHeaderPress}
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
