import * as React from "react";
import { StyleSheet, View } from "react-native";
import RecommendationSection from "./RecommendationSection";
import GroupRecommendationSection from "./GroupRecommendationSection";
import { Gap } from "@/constants/locofyHomeStyles";
import { recommendationCards, groupCards } from "@/constants/mockData";

const MatchSection = () => {
  return (
    <View style={styles.container}>
      {/* 추천 매칭 */}
      <RecommendationSection
        title="김단국님 맞춤 추천 매칭"
        cards={recommendationCards}
      />

      {/* 다수 모임 */}
      <GroupRecommendationSection title="다수 모임" cards={groupCards} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Gap.gap_24,
  },
});

export default MatchSection;
