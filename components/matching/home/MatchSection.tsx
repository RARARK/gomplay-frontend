import * as React from "react";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import RecommendationSectionHeader from "./RecommendationSectionHeader";
import ModernMatchCard from "./ModernMatchCard";
import { Gap } from "@/constants/locofyHomeStyles";
import { modernRecommendationCards } from "./homeMockData";
import type { ModernMatchCardProps } from "@/types/ui/homeCards";

const MatchSection = () => {
  const handleHeaderPress = () => {
    router.push("/posts" as any);
  };

  const handleCardPress = () => {
    router.push("/posts" as any);
  };

  const cards: ModernMatchCardProps[] = modernRecommendationCards.map(
    (card) => ({ ...card, onPress: handleCardPress })
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerBlock}>
        <RecommendationSectionHeader
          title="Recommended matches"
          onPress={handleHeaderPress}
        />
        <Text style={styles.subtitle}>관심 있는 운동을 선택해보세요</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        contentContainerStyle={styles.cardList}
      >
        {cards.map((card, index) => (
          <View key={`${card.date}-${index}`} style={styles.cardItem}>
            <ModernMatchCard {...card} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    gap: Gap.gap_14,
  },
  headerBlock: {
    gap: 2,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: "#9CA3AF",
    fontWeight: "500",
    marginTop: -4,
  },
  cardList: {
    flexDirection: "row",
    paddingRight: 16,
  },
  cardItem: {
    marginRight: Gap.gap_14,
  },
});

export default MatchSection;
