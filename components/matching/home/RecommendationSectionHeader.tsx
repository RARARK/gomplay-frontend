import * as React from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";
import Frame1052 from "@/assets/home/Frame-1052.svg";
import {
  Width,
  Padding,
  Gap,
  Height,
  FontSize,
  LetterSpacing,
  LineHeight,
  FontFamily,
  Color,
} from "@/constants/locofyHomeStyles";

export type RecommendationSectionHeaderProps = {
  title?: string;
  onPress?: () => void;
};

const RecommendationSectionHeader = ({
  title,
  onPress,
}: RecommendationSectionHeaderProps) => {
  const TitleContainer = onPress ? Pressable : View;

  return (
    <View style={styles.container}>
      <TitleContainer
        accessibilityRole={onPress ? "button" : undefined}
        onPress={onPress}
        style={styles.titleRow}
      >
        <Text style={styles.text}>{title}</Text>
        <Frame1052
          style={styles.icon}
          width={Width.width_24}
          height={Height.height_24}
        />
      </TitleContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: Padding.padding_10,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: Gap.gap_4,
  },
  text: {
    fontSize: FontSize.fs_17,
    letterSpacing: LetterSpacing.ls__0_41,
    lineHeight: LineHeight.lh_22,
    fontWeight: "600",
    fontFamily: FontFamily.inter,
    color: Color.labelsPrimary,
    textAlign: "left",
  },
  icon: {
    height: Height.height_24,
    width: Width.width_24,
  },
});

export default RecommendationSectionHeader;
