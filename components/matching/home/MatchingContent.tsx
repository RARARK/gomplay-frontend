import * as React from "react";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import {
  FontFamily,
  FontSize,
  LineHeight,
  Color,
  HomeLayout,
} from "@/constants/locofyHomeStyles";

type MatchingContentProps = {
  nearbyCount?: number;
};

const MatchingContent = ({ nearbyCount = 7 }: MatchingContentProps) => {
  return (
    <>
      <Image
        style={styles.image}
        contentFit="cover"
        source={require("@/assets/home/MatchingBear.png")}
      />

      <View style={styles.textBlock}>
        <Text style={styles.title}>Finding your partner...</Text>
        <Text style={styles.description}>
          We found <Text style={styles.highlight}>{nearbyCount}</Text> nearby
          people who match your preferences.
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    width: HomeLayout.statusIllustrationSize,
    height: HomeLayout.statusIllustrationSize,
  },

  textBlock: {
    width: "100%",
    minHeight: HomeLayout.statusContentMinHeight,
    marginTop: 24,
    paddingHorizontal: 24,
    gap: 8,
    alignItems: "center",
  },

  title: {
    textAlign: "center",
    fontFamily: FontFamily.inter,
    fontSize: FontSize.fs_15,
    letterSpacing: -0.5,
    lineHeight: LineHeight.lh_20,
    fontWeight: "600",
    color: Color.primary100,
  },

  description: {
    textAlign: "center",
    fontFamily: FontFamily.inter,
    fontSize: 13,
    letterSpacing: -0.08,
    lineHeight: 18,
    color: Color.neutral900,
  },

  highlight: {
    color: Color.primary100,
    fontWeight: "600",
  },
});

export default MatchingContent;
