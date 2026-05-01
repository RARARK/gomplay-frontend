import * as React from "react";
import { Text, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import {
  Padding,
  Color,
  Border,
  Width,
  Height,
  FontSize,
  FontFamily,
  Gap,
  LetterSpacing,
  LineHeight,
} from "../GlobalStyles";

const CardDetails = () => {
  return (
    <View style={styles.cardDetails}>
      <View style={styles.filterContainer}>
        <View style={[styles.filter, styles.filterSpaceBlock]}>
          <Text style={[styles.text, styles.textFlexBox]}>
            <Text style={styles.txt}>
              <Text style={styles.text2}>{`성향 `}</Text>
              <Text style={[styles.text3, styles.textTypo]}>82%</Text>
              <Text style={styles.text2}> 일치</Text>
            </Text>
          </Text>
        </View>
        <View style={[styles.filter2, styles.filterSpaceBlock]}>
          <Text style={[styles.text5, styles.textFlexBox]}>
            <Text style={styles.txt}>
              <Text style={styles.text2}>{`공통 관심사 `}</Text>
              <Text style={styles.textTypo}>
                <Text style={styles.text8}>3</Text>
                <Text style={styles.text9}>개</Text>
              </Text>
            </Text>
          </Text>
        </View>
      </View>
      <View style={styles.profileWrapper}>
        <Image
          style={styles.profileIcon}
          contentFit="cover"
          source={require("../assets/profile.png")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  filterSpaceBlock: {
    paddingBottom: Padding.padding_5_2,
    paddingTop: Padding.padding_6_9,
    paddingHorizontal: Padding.padding_10_3,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Color.nuetral700,
    borderRadius: Border.br_32_7,
    width: Width.width_149,
    flexDirection: "row",
    height: Height.height_44,
  },
  textFlexBox: {
    display: "flex",
    textAlign: "center",
    alignItems: "center",
  },
  textTypo: {
    fontWeight: "600",
    lineHeight: 21,
    letterSpacing: -0.32,
    fontSize: FontSize.fs_16,
    fontFamily: FontFamily.inter,
  },
  cardDetails: {
    height: 210,
    width: Width.width_338,
  },
  filterContainer: {
    zIndex: 1,
    gap: Gap.gap_40,
    flexDirection: "row",
    height: Height.height_44,
    width: Width.width_338,
  },
  filter: {
    zIndex: 2,
  },
  text: {
    height: Height.height_25,
    width: 89,
  },
  txt: {
    width: "100%",
  },
  text2: {
    fontSize: FontSize.fs_13,
    letterSpacing: LetterSpacing.ls__0_08,
    lineHeight: LineHeight.lh_18,
    color: Color.colorWhite,
    fontFamily: FontFamily.inter,
  },
  text3: {
    color: Color.colorKhaki200,
  },
  filter2: {
    zIndex: 1,
  },
  text5: {
    width: 109,
  },
  text8: {
    color: Color.colorDarkseagreen,
  },
  text9: {
    color: Color.colorWhite,
  },
  profileWrapper: {
    zIndex: 2,
    width: 251,
    paddingLeft: 85,
    height: 166,
    flexDirection: "row",
  },
  profileIcon: {
    width: 166,
    height: 166,
    zIndex: 2,
  },
});

export default CardDetails;
