import * as React from "react";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import type { HomeStatusVariant } from "@/types/ui/homeStatus";
import {
  FontFamily,
  FontSize,
  LineHeight,
  Color,
} from "@/constants/locofyHomeStyles";

type MatchingContentProps = {
  state?: HomeStatusVariant;
  nearbyCount?: number;
};

const MatchingContent = ({
  state = "Matching",
  nearbyCount = 7,
}: MatchingContentProps) => {
  return (
    <>
      <Image
        style={styles.image}
        contentFit="cover"
        source={require("@/assets/home/MatchingBear.png")}
      />

      <View style={styles.textBlock}>
        <Text style={styles.title}>파트너 찾는 중 ...</Text>

        <Text style={styles.description}>
          근처 공강 <Text style={styles.highlight}>{nearbyCount}명</Text> 탐색
          중
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 144,
    height: 144,
  },

  textBlock: {
    width: "100%",
    minHeight: 182,
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
    color: Color.nuetral900,
  },

  highlight: {
    color: Color.primary100,
    fontWeight: "600",
  },
});

export default MatchingContent;
