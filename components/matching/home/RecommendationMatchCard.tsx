import * as React from "react";
import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import FootballIcons1 from "@/assets/home/Football-Icons.svg";
import {
  Border,
  BoxShadow,
  Color,
  FontFamily,
  FontSize,
  Gap,
  Height,
  HomeLayout,
  LetterSpacing,
  LineHeight,
  Padding,
  Width,
} from "@/constants/locofyHomeStyles";
import type { RecommendationMatchCardProps } from "@/types/ui/homeCards";

export type { RecommendationMatchCardProps } from "@/types/ui/homeCards";

const RecommendationMatchCard = ({
  imageSource,
  date = "04-03",
  sport = "Tennis",
  info = "Jamsil Court\n14:00~15:30\nBeginner\n#Friendly #Weekend",
  buttonText = "Apply",
  onPress,
}: RecommendationMatchCardProps) => {
  return (
    <View style={styles.card}>
      <ImageBackground
        style={styles.cardImage}
        imageStyle={styles.cardImageBorder}
        resizeMode="cover"
        source={imageSource}
      >
        <View style={styles.imageOverlay}>
          <View style={styles.dateBadge}>
            <Text style={styles.dateText}>{date}</Text>
          </View>

          <View style={styles.sportBadge}>
            <FootballIcons1
              width={Width.width_24_67}
              height={Height.height_24_67}
            />
            <Text style={styles.sportText} numberOfLines={1}>
              {sport}
            </Text>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.cardInfo}>
        <View style={styles.infoWrapper}>
          <Text style={styles.infoText} numberOfLines={4}>
            {info}
          </Text>
        </View>

        <Pressable style={styles.applyButton} onPress={onPress}>
          <Text style={styles.applyButtonText} numberOfLines={1}>
            {buttonText}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: HomeLayout.recommendationCardWidth,
    height: HomeLayout.recommendationCardHeight,
    borderRadius: Border.br_8,
    backgroundColor: Color.colorWhite,
    elevation: 4,
    boxShadow: BoxShadow.shadow_drop,
  },

  cardImage: {
    height: HomeLayout.recommendationCardImageHeight,
    width: "100%",
  },

  cardImageBorder: {
    borderTopLeftRadius: Border.br_8,
    borderTopRightRadius: Border.br_8,
  },

  imageOverlay: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: Padding.padding_5,
  },

  dateBadge: {
    alignSelf: "flex-start",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Color.colorOrangered,
    paddingHorizontal: Padding.padding_10_3,
    paddingTop: Padding.padding_6_9,
    paddingBottom: Padding.padding_5_2,
    borderRadius: Border.br_8,
  },

  dateText: {
    color: Color.neutral100,
    fontFamily: FontFamily.inter,
    fontSize: FontSize.fs_11,
    lineHeight: LineHeight.lh_13,
    letterSpacing: LetterSpacing.ls_0_07,
    textAlign: "center",
  },

  sportBadge: {
    alignSelf: "flex-start",
    marginLeft: 8,
    marginBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: Gap.gap_4,
    minWidth: 92,
    height: Height.height_30_7,
    paddingHorizontal: 12,
    paddingVertical: Padding.padding_3,
    borderRadius: Border.br_32_7,
    backgroundColor: Color.secondary100,
    overflow: "hidden",
  },

  sportText: {
    color: Color.neutral900,
    fontFamily: FontFamily.inter,
    fontSize: FontSize.fs_15,
    lineHeight: LineHeight.lh_20,
    letterSpacing: LetterSpacing.ls__0_5,
    fontWeight: "600",
    textAlign: "center",
  },

  cardInfo: {
    flex: 1,
    justifyContent: "space-between",
  },

  infoWrapper: {
    height: 88,
    paddingHorizontal: 14,
    paddingVertical: 8,
    justifyContent: "flex-start",
  },

  infoText: {
    color: Color.labelsPrimary,
    fontFamily: FontFamily.inter,
    fontSize: FontSize.fs_11,
    lineHeight: LineHeight.lh_13,
    letterSpacing: LetterSpacing.ls_0_06,
    fontWeight: "600",
    textAlign: "left",
  },

  applyButton: {
    width: "100%",
    height: HomeLayout.actionButtonHeight,
    borderRadius: Border.br_4,
    backgroundColor: Color.primary100,
    justifyContent: "center",
    alignItems: "center",
  },

  applyButtonText: {
    color: Color.colorWhite,
    fontFamily: FontFamily.inter,
    fontSize: FontSize.fs_15,
    lineHeight: LineHeight.lh_20,
    letterSpacing: LetterSpacing.ls__0_5,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default RecommendationMatchCard;
