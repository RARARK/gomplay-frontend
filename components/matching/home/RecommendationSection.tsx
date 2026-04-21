import * as React from "react";
import {
  StyleSheet,
  View,
  type DimensionValue,
  ScrollView,
} from "react-native";
import RecommendationSectionHeader from "./RecommendationSectionHeader";
import RecommendationMatchCard from "./RecommendationMatchCard";
import { Gap } from "@/constants/locofyHomeStyles";
import type { RecommendationMatchCardProps } from "@/types/ui/homeCards";

export type RecommendationSectionProps = {
  title?: string;
  textWidth?: DimensionValue;
  cards?: RecommendationMatchCardProps[];
};

const RecommendationSection = ({
  title,
  textWidth,
  cards = [],
}: RecommendationSectionProps) => {
  return (
    <View style={styles.container}>
      <RecommendationSectionHeader title={title} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        contentContainerStyle={styles.cardList}
      >
        {cards.map((card, index) => (
          <View
            key={`${card.date ?? "card"}-${card.sport ?? "sport"}-${index}`}
            style={styles.cardItem}
          >
            <RecommendationMatchCard {...card} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: Gap.gap_14,
    paddingHorizontal: 16,
  },

  cardList: {
    flexDirection: "row",
    paddingRight: 16,
  },

  cardItem: {
    marginRight: Gap.gap_14,
  },
});

export default RecommendationSection;
