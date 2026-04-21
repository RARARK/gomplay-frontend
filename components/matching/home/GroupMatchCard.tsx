import * as React from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import FootballIcons1 from "@/assets/home/Football-Icons.svg";
import {
  Padding,
  FontFamily,
  Height,
  Color,
  Border,
  Width,
  Gap,
  LineHeight,
  LetterSpacing,
  FontSize,
  HomeLayout,
} from "@/constants/locofyHomeStyles";
import type { GroupMatchCardProps } from "@/types/ui/homeCards";

export type { GroupMatchCardProps } from "@/types/ui/homeCards";

const GroupMatchCard = ({
  imageSource,
  remainingText = "3 spots left",
  sport = "Tennis",
  date = "04-11",
  location = "Jamsil",
  capacity = "4 people",
  level = "Beginner",
}: GroupMatchCardProps) => {
  return (
    <View style={styles.card}>
      <ImageBackground
        style={styles.cardImage}
        imageStyle={styles.imageBorder}
        resizeMode="cover"
        source={imageSource}
      >
        <View style={styles.overlay}>
          <View style={styles.remainingBadge}>
            <Text style={styles.remainingText}>{remainingText}</Text>
          </View>

          <View style={styles.sportBadge}>
            <FootballIcons1
              width={Width.width_24_67}
              height={Height.height_24_67}
            />
            <Text style={styles.sportText}>{sport}</Text>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.info}>
        <Text style={styles.location} numberOfLines={1}>
          {location}
        </Text>

        <Text style={styles.meta} numberOfLines={1}>
          {date} • {capacity} • {level}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: Border.br_8,
    backgroundColor: Color.colorWhite,
    overflow: "hidden",
  },

  cardImage: {
    width: "100%",
    height: HomeLayout.groupCardImageHeight,
  },

  imageBorder: {
    borderTopLeftRadius: Border.br_8,
    borderTopRightRadius: Border.br_8,
  },

  overlay: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 8,
  },

  remainingBadge: {
    marginTop: 8,
    marginLeft: 8,
    backgroundColor: Color.colorOrangered,
    borderRadius: Border.br_8,
    paddingHorizontal: Padding.padding_10_3,
    paddingVertical: Padding.padding_5_2,
  },

  remainingText: {
    color: Color.nuetral100,
    fontFamily: FontFamily.inter,
    fontSize: FontSize.fs_11,
    lineHeight: LineHeight.lh_13,
    letterSpacing: LetterSpacing.ls_0_07,
  },

  sportBadge: {
    marginLeft: 8,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: Gap.gap_8,
    backgroundColor: Color.secondary100,
    borderRadius: Border.br_32_7,
    paddingHorizontal: Padding.padding_10_3,
    paddingVertical: Padding.padding_3,
  },

  sportText: {
    color: Color.nuetral900,
    fontFamily: FontFamily.inter,
    fontSize: FontSize.fs_15,
    fontWeight: "600",
    lineHeight: LineHeight.lh_20,
    letterSpacing: LetterSpacing.ls__0_5,
  },

  info: {
    backgroundColor: Color.nuetral100,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 4,
  },

  location: {
    fontSize: 15,
    fontWeight: "700",
    color: Color.nuetral900,
    fontFamily: FontFamily.inter,
  },

  meta: {
    fontSize: 12,
    color: "#666666",
    fontFamily: FontFamily.inter,
  },
});

export default GroupMatchCard;
