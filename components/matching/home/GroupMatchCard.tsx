import * as React from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from "react-native";
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
} from "@/constants/locofyHomeStyles";

export type GroupMatchCardProps = {
  imageSource?: ImageSourcePropType;
  remainingText?: string;
  sport?: string;
  date?: string;
  location?: string;
  capacity?: string;
  level?: string;
};

const GroupMatchCard = ({
  imageSource,
  remainingText = "3명 남음",
  sport = "풋살",
  date = "04-11",
  location = "대운동장",
  capacity = "4명",
  level = "초보",
}: GroupMatchCardProps) => {
  return (
    <View style={styles.card}>
      {/* 이미지 */}
      <ImageBackground
        style={styles.cardImage}
        imageStyle={styles.imageBorder}
        resizeMode="cover"
        source={imageSource}
      >
        <View style={styles.overlay}>
          {/* 남은 인원 */}
          <View style={styles.remainingBadge}>
            <Text style={styles.remainingText}>{remainingText}</Text>
          </View>

          {/* 종목 */}
          <View style={styles.sportBadge}>
            <FootballIcons1
              width={Width.width_24_67}
              height={Height.height_24_67}
            />
            <Text style={styles.sportText}>{sport}</Text>
          </View>
        </View>
      </ImageBackground>

      {/* 🔥 하단 2줄 구조 */}
      <View style={styles.info}>
        {/* 1줄: 장소 */}
        <Text style={styles.location} numberOfLines={1}>
          {location}
        </Text>

        {/* 2줄: 메타 */}
        <Text style={styles.meta} numberOfLines={1}>
          {date} · {capacity} · {level}
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
    height: Height.height_133,
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

  /* 🔥 핵심: 하단 2줄 */
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
    color: "#666",
    fontFamily: FontFamily.inter,
  },
});

export default GroupMatchCard;
