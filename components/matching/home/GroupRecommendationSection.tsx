import * as React from "react";
import { StyleSheet, View, type DimensionValue } from "react-native";
import RecommendationSectionHeader from "./RecommendationSectionHeader";
import GroupMatchCard from "./GroupMatchCard";
import { Gap } from "@/constants/locofyHomeStyles";
import type { GroupMatchCardProps } from "@/types/ui/homeCards";

export type GroupRecommendationSectionProps = {
  title?: string;
  textWidth?: DimensionValue;
  cards?: GroupMatchCardProps[];
};

const GroupRecommendationSection = ({
  title,
  textWidth,
  cards = [],
}: GroupRecommendationSectionProps) => {
  return (
    <View style={styles.container}>
      <RecommendationSectionHeader title={title} />

      <View style={styles.cardList}>
        {cards.map((card, index) => (
          <GroupMatchCard key={`${card.sport ?? "group"}-${index}`} {...card} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: Gap.gap_24,
    paddingHorizontal: 16,
  },

  cardList: {
    gap: Gap.gap_14,
  },
});

export default GroupRecommendationSection;
