import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import SuccessIcon from "@/assets/home/Success-Icon.svg";
import PartnerCarousel from "./PartnerCarousel";
import type { PartnerCardProps } from "./PartnerCard";
import { Color, FontFamily, FontSize, LineHeight } from "@/constants/locofyHomeStyles";

export type StateMatchedProps = {
  title?: string;
  description?: string;
  partners?: PartnerCardProps[];
  initialIndex?: number;
  onPartnerIndexChange?: (index: number) => void;
};

const DEFAULT_PARTNERS: PartnerCardProps[] = [
  {
    name: "Minjun Kim",
    age: 21,
    description: "Looking for a light weekend morning workout partner",
    tags: ["Tennis", "Beginner", "Jamsil", "Fair Play"],
    matchScore: 87,
  },
  {
    name: "Seoyoon Lee",
    age: 24,
    description: "Best matched for weekday evening rallies and steady play",
    tags: ["Badminton", "Intermediate", "Gangnam", "After Work"],
    matchScore: 82,
  },
];

const StateMatched = ({
  title = "Partner found!",
  description = "Your match is ready. Connect right away.",
  partners = DEFAULT_PARTNERS,
  initialIndex = 0,
  onPartnerIndexChange,
}: StateMatchedProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <View style={styles.textBlock}>
          <View style={styles.titleRow}>
            <SuccessIcon width={36} height={36} />
            <Text style={styles.title}>{title}</Text>
          </View>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>

      <PartnerCarousel
        partners={partners}
        initialIndex={initialIndex}
        onIndexChange={onPartnerIndexChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    gap: 20,
    paddingVertical: 14,
  },

  banner: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 24,
  },

  textBlock: {
    alignItems: "center",
    gap: 4,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  title: {
    color: Color.colorBlack,
    fontFamily: FontFamily.inter,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: "700",
    textAlign: "center",
  },

  description: {
    color: Color.nuetral700,
    fontFamily: FontFamily.inter,
    fontSize: FontSize.fs_13,
    lineHeight: LineHeight.lh_18,
    textAlign: "center",
  },
});

export default StateMatched;
