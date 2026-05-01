import * as React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Image } from "expo-image";
import Vector12 from "../assets/Vector1.svg";
import Materialsymbolscheck2 from "../assets/material-symbols-check.svg";
import Mdilocation1 from "../assets/mdi-location.svg";
import Vector8 from "../assets/Vector.svg";
import Heroiconschartbar16solid1 from "../assets/heroicons-chart-bar-16-solid.svg";
import Frame10812 from "../assets/Frame-1081.svg";
import Materialsymbolsrefresh1 from "../assets/material-symbols-refresh.svg";
import Vector53 from "../assets/Vector5.svg";
import Materialsymbolslightstaroutline1 from "../assets/material-symbols-light-star-outline.svg";
import {
  Height,
  Width,
  Padding,
  Color,
  FontFamily,
  LineHeight,
  LetterSpacing,
  FontSize,
  Border,
  Gap,
  BoxShadow,
} from "../GlobalStyles";

const FrameComponent1 = () => {
  return (
    <View style={styles.matchingmethodParent}>
      <View style={styles.matchingmethod}>
        <Vector12
          style={[styles.vectorIcon, styles.iconLayout]}
          width={Width.width_16}
          height={Height.height_16}
        />
        <View style={styles.wrapper}>
          <Text style={[styles.text, styles.textFlexBox]}>{`운동 모집 `}</Text>
        </View>
      </View>
      <View style={styles.card}>
        <View style={[styles.cardContainer, styles.cardContainerLayout]}>
          <Image
            style={styles.cardContainerChild}
            contentFit="cover"
            source={require("../assets/Ellipse-2.png")}
          />
          <View style={styles.cardContainerInner}>
            <View style={styles.frameParent}>
              <View style={[styles.frameGroup, styles.parentLayout]}>
                <View style={[styles.parent, styles.parentLayout]}>
                  <Text style={[styles.text2, styles.textTypo2]}>김단국</Text>
                  <View style={[styles.frameWrapper, styles.frameSpaceBlock]}>
                    <View style={styles.group}>
                      <Text style={[styles.text3, styles.textTypo1]}>
                        컴퓨터공학과
                      </Text>
                      <Materialsymbolscheck2
                        style={styles.materialSymbolscheckIcon}
                        width={Width.width_32}
                        height={Height.height_32}
                      />
                    </View>
                  </View>
                </View>
                <View style={styles.container}>
                  <Text style={[styles.text4, styles.textTypo]}>
                    2026-04-04
                  </Text>
                </View>
              </View>
              <Text style={[styles.text5, styles.textTypo1]}>매칭 완료</Text>
              <View
                style={[
                  styles.difficultyLabelWrapper,
                  styles.difficultyWrapperLayout,
                ]}
              >
                <View
                  style={[
                    styles.difficultyLabel,
                    styles.difficultyWrapperLayout,
                  ]}
                >
                  <View
                    style={[
                      styles.mdilocationWrapper,
                      styles.difficultyWrapperLayout,
                    ]}
                  >
                    <Mdilocation1
                      style={[styles.mdilocationIcon, styles.iconLayout]}
                      width={Width.width_16}
                      height={Height.height_16}
                    />
                  </View>
                  <View style={[styles.frame, styles.frameSpaceBlock]}>
                    <Text style={[styles.text6, styles.textTypo3]}>
                      체육관 |
                    </Text>
                  </View>
                  <View style={styles.chartIconWrapper}>
                    <Vector8
                      style={styles.chartIcon}
                      width={Width.width_12}
                      height={Height.height_12}
                    />
                  </View>
                  <View style={[styles.frameView, styles.wrapper2SpaceBlock]}>
                    <Text style={[styles.text7, styles.textTypo3]}>19:00|</Text>
                  </View>
                  <Heroiconschartbar16solid1
                    style={[styles.mdilocationIcon, styles.iconLayout]}
                    width={Width.width_16}
                    height={Height.height_16}
                  />
                  <View style={[styles.wrapper2, styles.wrapper2SpaceBlock]}>
                    <Text style={[styles.text8, styles.textTypo3]}>초보</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View
            style={[styles.cardContainerInner2, styles.cardContainerLayout]}
          >
            <Frame10812
              style={styles.frameChild}
              width={Width.width_36}
              height={Height.height_36}
            />
          </View>
        </View>
        <View style={[styles.actionButtonsWrapper, styles.actionLayout]}>
          <View style={[styles.actionButtons, styles.actionLayout]}>
            <Pressable style={[styles.filter, styles.filterBorder]}>
              <Materialsymbolsrefresh1
                style={[
                  styles.materialSymbolsrefreshIcon,
                  styles.filterChildLayout,
                ]}
                width={Width.width_24}
                height={Height.height_24}
              />
              <View style={[styles.actionLabels, styles.wrapperLayout]}>
                <Text
                  style={[styles.text9, styles.textTypo]}
                >{`다시 매칭하기 `}</Text>
              </View>
            </Pressable>
            <Pressable style={styles.filter2}>
              <Vector53
                style={[styles.filterChild, styles.filterChildLayout]}
                width={Width.width_24}
                height={Height.height_24}
              />
              <View style={[styles.wrapper3, styles.wrapperLayout]}>
                <Text style={[styles.text10, styles.textTypo]}>채팅 보기</Text>
              </View>
            </Pressable>
            <Pressable style={[styles.filter3, styles.filterBorder]}>
              <Materialsymbolslightstaroutline1
                style={[
                  styles.materialSymbolsrefreshIcon,
                  styles.filterChildLayout,
                ]}
                width={Width.width_24}
                height={Height.height_24}
              />
              <View style={[styles.wrapper4, styles.wrapperLayout]}>
                <Text style={[styles.text11, styles.textTypo]}>평가하기</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  iconLayout: {
    height: Height.height_16,
    width: Width.width_16,
  },
  textFlexBox: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  cardContainerLayout: {
    height: 76,
    zIndex: null,
  },
  parentLayout: {
    height: Height.height_20,
    flexDirection: "row",
    zIndex: null,
  },
  textTypo2: {
    fontWeight: "600",
    height: Height.height_20,
  },
  frameSpaceBlock: {
    paddingTop: Padding.padding_3,
    height: Height.height_16,
    zIndex: null,
  },
  textTypo1: {
    width: Width.width_65,
    color: Color.labelsPrimary,
    textAlign: "center",
    fontFamily: FontFamily.inter,
  },
  textTypo: {
    lineHeight: LineHeight.lh_18,
    letterSpacing: LetterSpacing.ls__0_08,
    fontSize: FontSize.fs_13,
    height: Height.height_18,
    textAlign: "center",
    fontFamily: FontFamily.inter,
  },
  difficultyWrapperLayout: {
    height: Height.height_17,
    zIndex: null,
  },
  textTypo3: {
    textAlign: "center",
    fontFamily: FontFamily.inter,
  },
  wrapper2SpaceBlock: {
    paddingTop: Padding.padding_2,
    height: Height.height_15,
    zIndex: null,
  },
  actionLayout: {
    height: Height.height_28,
    flexDirection: "row",
    zIndex: null,
  },
  filterBorder: {
    paddingVertical: Padding.padding_2,
    borderWidth: 1,
    borderColor: Color.colorMediumslateblue,
    borderRadius: Border.br_8,
    height: Height.height_28,
    gap: Gap.gap_4,
    borderStyle: "solid",
    flexDirection: "row",
    overflow: "hidden",
  },
  filterChildLayout: {
    height: Height.height_24,
    width: Width.width_24,
  },
  wrapperLayout: {
    height: Height.height_21,
    paddingTop: Padding.padding_3,
    zIndex: null,
  },
  matchingmethodParent: {
    height: 167,
    zIndex: null,
    width: Width.width_370,
  },
  matchingmethod: {
    backgroundColor: Color.colorGoldenrod,
    paddingHorizontal: Padding.padding_9,
    paddingVertical: Padding.padding_4,
    gap: Gap.gap_6,
    alignItems: "flex-end",
    overflow: "hidden",
    borderRadius: Border.br_16,
    flexDirection: "row",
    height: Height.height_24,
    width: Width.width_370,
  },
  vectorIcon: {
    color: Color.nuetral500,
    width: Width.width_16,
  },
  wrapper: {
    height: Height.height_14,
    paddingBottom: Padding.padding_1,
    justifyContent: "flex-end",
    width: Width.width_44,
    zIndex: null,
  },
  text: {
    width: Width.width_47,
    color: Color.colorWhite,
    textAlign: "center",
    fontFamily: FontFamily.inter,
    lineHeight: LineHeight.lh_13,
    letterSpacing: LetterSpacing.ls_0_07,
    fontSize: FontSize.fs_11,
    height: Height.height_13,
  },
  card: {
    height: 143,
    boxShadow: BoxShadow.shadow_drop,
    elevation: 4,
    borderColor: Color.colorSilver,
    borderWidth: 1,
    paddingLeft: Padding.padding_6,
    paddingTop: Padding.padding_14,
    paddingRight: Padding.padding_18,
    paddingBottom: Padding.padding_16,
    gap: 9,
    borderStyle: "solid",
    backgroundColor: Color.colorWhite,
    alignItems: "flex-end",
    overflow: "hidden",
    borderRadius: Border.br_16,
    width: Width.width_370,
  },
  cardContainer: {
    width: 346,
    gap: 2,
    flexDirection: "row",
  },
  cardContainerChild: {
    height: Height.height_64,
    width: Width.width_64,
  },
  cardContainerInner: {
    height: Height.height_66,
    paddingTop: Padding.padding_1,
    width: Width.width_241,
    zIndex: null,
  },
  frameParent: {
    height: 65,
    gap: Gap.gap_4,
    width: Width.width_241,
    zIndex: null,
  },
  frameGroup: {
    gap: 58,
    width: Width.width_241,
  },
  parent: {
    width: Width.width_106,
  },
  text2: {
    fontSize: FontSize.fs_15,
    letterSpacing: LetterSpacing.ls__0_5,
    lineHeight: LineHeight.lh_20,
    color: Color.labelsPrimary,
    textAlign: "center",
    fontFamily: FontFamily.inter,
    width: Width.width_44,
  },
  frameWrapper: {
    width: Width.width_62,
  },
  group: {
    zIndex: 1,
    width: Width.width_62,
    height: Height.height_13,
    flexDirection: "row",
  },
  text3: {
    lineHeight: LineHeight.lh_13,
    letterSpacing: LetterSpacing.ls_0_07,
    fontSize: FontSize.fs_11,
    height: Height.height_13,
  },
  materialSymbolscheckIcon: {
    height: Height.height_32,
    width: Width.width_32,
    position: "absolute",
    right: 8,
    bottom: -27,
    zIndex: 1,
  },
  container: {
    width: Width.width_77,
    height: Height.height_19,
    paddingTop: Padding.padding_1,
    zIndex: null,
  },
  text4: {
    width: Width.width_80,
    color: Color.nuetral500,
  },
  text5: {
    fontSize: FontSize.fs_16,
    letterSpacing: -0.32,
    lineHeight: 21,
    fontWeight: "600",
    height: Height.height_20,
  },
  difficultyLabelWrapper: {
    width: 155,
    paddingLeft: Padding.padding_1,
    flexDirection: "row",
  },
  difficultyLabel: {
    width: 154,
    gap: 3,
    flexDirection: "row",
  },
  mdilocationWrapper: {
    paddingTop: Padding.padding_1,
    width: Width.width_16,
  },
  mdilocationIcon: {
    width: Width.width_16,
  },
  frame: {
    width: Width.width_38,
  },
  text6: {
    width: Width.width_41,
    color: Color.labelsPrimary,
    lineHeight: LineHeight.lh_13,
    letterSpacing: LetterSpacing.ls_0_07,
    fontSize: FontSize.fs_11,
    height: Height.height_13,
  },
  chartIconWrapper: {
    height: Height.height_15,
    width: Width.width_12,
    paddingTop: Padding.padding_3,
    zIndex: null,
  },
  chartIcon: {
    height: Height.height_12,
    color: Color.nuetral700,
    width: Width.width_12,
  },
  frameView: {
    width: Width.width_33,
  },
  text7: {
    width: Width.width_36,
    color: Color.labelsPrimary,
    lineHeight: LineHeight.lh_13,
    letterSpacing: LetterSpacing.ls_0_07,
    fontSize: FontSize.fs_11,
    height: Height.height_13,
  },
  wrapper2: {
    width: Width.width_21,
  },
  text8: {
    width: Width.width_24,
    color: Color.labelsPrimary,
    lineHeight: LineHeight.lh_13,
    letterSpacing: LetterSpacing.ls_0_07,
    fontSize: FontSize.fs_11,
    height: Height.height_13,
  },
  cardContainerInner2: {
    paddingTop: Padding.padding_40,
    width: Width.width_36,
  },
  frameChild: {
    height: Height.height_36,
    width: Width.width_36,
    color: Color.nuetral500,
  },
  actionButtonsWrapper: {
    width: 328,
    paddingRight: Padding.padding_16,
    justifyContent: "flex-end",
  },
  actionButtons: {
    width: 312,
    gap: Gap.gap_12,
  },
  filter: {
    width: Width.width_119,
    paddingHorizontal: Padding.padding_8,
  },
  materialSymbolsrefreshIcon: {
    width: Width.width_24,
  },
  actionLabels: {
    width: Width.width_75,
  },
  text9: {
    width: Width.width_78,
    color: Color.labelsPrimary,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  filter2: {
    width: 85,
    paddingLeft: Padding.padding_4,
    paddingRight: Padding.padding_3,
    paddingBottom: Padding.padding_2,
    gap: Gap.gap_2,
    borderWidth: 1,
    borderColor: Color.colorMediumslateblue,
    borderRadius: Border.br_8,
    height: Height.height_28,
    paddingTop: Padding.padding_2,
    borderStyle: "solid",
    backgroundColor: Color.colorWhite,
    flexDirection: "row",
    overflow: "hidden",
  },
  filterChild: {
    width: Width.width_24,
    color: Color.nuetral500,
  },
  wrapper3: {
    width: 52,
  },
  text10: {
    width: Width.width_55,
    color: Color.labelsPrimary,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  filter3: {
    width: Width.width_84,
    paddingHorizontal: Padding.padding_4,
    backgroundColor: Color.colorWhite,
    paddingVertical: Padding.padding_2,
  },
  wrapper4: {
    width: Width.width_48,
  },
  text11: {
    width: Width.width_51,
    color: Color.labelsPrimary,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
});

export default FrameComponent1;
