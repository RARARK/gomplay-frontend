import * as React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Image } from "expo-image";
import Vector61 from "../assets/Vector6.svg";
import Materialsymbolscheck2 from "../assets/material-symbols-check.svg";
import Mdilocation1 from "../assets/mdi-location.svg";
import Vector8 from "../assets/Vector.svg";
import Heroiconschartbar16solid2 from "../assets/heroicons-chart-bar-16-solid.svg";
import Vector11 from "../assets/Vector1.svg";
import Frame10812 from "../assets/Frame-1081.svg";
import Materialsymbolsrefresh1 from "../assets/material-symbols-refresh.svg";
import Vector53 from "../assets/Vector5.svg";
import Materialsymbolslightstaroutline1 from "../assets/material-symbols-light-star-outline.svg";
import {
  Width,
  Height,
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

const FrameComponent2 = () => {
  return (
    <View style={styles.matchingmethodParent}>
      <View style={styles.matchingmethod}>
        <Vector61
          style={styles.vectorIcon}
          width={Width.width_14}
          height={Height.height_16}
        />
        <View style={[styles.wrapper, styles.wrapperFlexBox]}>
          <Text style={[styles.text, styles.textFlexBox]}>파트너 모집</Text>
        </View>
      </View>
      <View style={styles.card}>
        <View style={[styles.cardContainerTwo, styles.wrapperFlexBox]}>
          <View style={styles.ellipseParent}>
            <Image
              style={styles.frameChild}
              contentFit="cover"
              source={require("../assets/Ellipse-2.png")}
            />
            <View style={[styles.frameWrapper, styles.frameWrapperLayout]}>
              <View style={[styles.frameParent, styles.frameWrapperLayout]}>
                <View style={[styles.frameGroup, styles.parentLayout]}>
                  <View style={[styles.parent, styles.parentLayout]}>
                    <Text style={[styles.text2, styles.textTypo2]}>김단국</Text>
                    <View
                      style={[
                        styles.frameContainer,
                        styles.containerSpaceBlock,
                      ]}
                    >
                      <View style={[styles.group, styles.groupFlexBox]}>
                        <Text style={[styles.text3, styles.textTypo1]}>
                          컴퓨터공학과
                        </Text>
                        <Materialsymbolscheck2
                          style={[
                            styles.materialSymbolscheckIcon,
                            styles.iconPosition,
                          ]}
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
                    styles.negotiationLabelWrapper,
                    styles.frameWrapperLayout,
                  ]}
                >
                  <View style={[styles.negotiationLabel, styles.groupFlexBox]}>
                    <Mdilocation1
                      style={[
                        styles.mdilocationIcon,
                        styles.mdilocationIconLayout,
                      ]}
                      width={Width.width_16}
                      height={Height.height_16}
                    />
                    <View style={[styles.frame, styles.frameSpaceBlock]}>
                      <Text style={[styles.text6, styles.textTypo3]}>
                        장소 협의 |
                      </Text>
                    </View>
                    <View style={styles.vectorWrapper}>
                      <Vector8
                        style={styles.vectorIcon2}
                        width={Width.width_12}
                        height={Height.height_12}
                      />
                    </View>
                    <View style={[styles.frameView, styles.frameSpaceBlock]}>
                      <Text style={[styles.text7, styles.textTypo3]}>
                        시간 협의|
                      </Text>
                    </View>
                    <Heroiconschartbar16solid2
                      style={styles.mdilocationIconLayout}
                      width={Width.width_16}
                      height={Height.height_16}
                    />
                    <View style={styles.negotiationLabelInner}>
                      <View style={styles.parent2}>
                        <Text style={[styles.text8, styles.textTypo3]}>
                          난이도 협의|
                        </Text>
                        <View
                          style={[
                            styles.vectorContainer,
                            styles.containerSpaceBlock,
                          ]}
                        >
                          <Vector11
                            style={styles.vectorIcon3}
                            width={Width.width_8}
                            height={Height.height_8}
                          />
                        </View>
                      </View>
                    </View>
                    <View style={styles.subjectContainerWrapper}>
                      <View
                        style={[styles.subjectContainer, styles.groupFlexBox]}
                      >
                        <Text style={[styles.text9, styles.textTypo3]}>
                          종목 협의
                        </Text>
                        <Frame10812
                          style={[styles.subjectIcon, styles.iconPosition]}
                          width={Width.width_36}
                          height={Height.height_36}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.actionButtonsTwo}>
          <Pressable style={[styles.filter, styles.filterBorder]}>
            <Materialsymbolsrefresh1
              style={styles.filterChildLayout}
              width={Width.width_24}
              height={Height.height_24}
            />
            <View style={[styles.actionLabelsTwo, styles.wrapperLayout]}>
              <Text
                style={[styles.text10, styles.textTypo]}
              >{`다시 매칭하기 `}</Text>
            </View>
          </Pressable>
          <Pressable style={styles.filter2}>
            <Vector53
              style={[styles.filterChild, styles.filterChildLayout]}
              width={Width.width_24}
              height={Height.height_24}
            />
            <View style={[styles.wrapper2, styles.wrapperLayout]}>
              <Text style={[styles.text11, styles.textTypo]}>채팅 보기</Text>
            </View>
          </Pressable>
          <Pressable style={[styles.filter3, styles.filterBorder]}>
            <Materialsymbolslightstaroutline1
              style={styles.filterChildLayout}
              width={Width.width_24}
              height={Height.height_24}
            />
            <View style={[styles.wrapper3, styles.wrapperLayout]}>
              <Text style={[styles.text12, styles.textTypo]}>평가하기</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperFlexBox: {
    justifyContent: "flex-end",
    zIndex: null,
  },
  textFlexBox: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  frameWrapperLayout: {
    width: Width.width_260,
    zIndex: null,
  },
  parentLayout: {
    height: Height.height_20,
    zIndex: null,
    flexDirection: "row",
  },
  textTypo2: {
    fontWeight: "600",
    height: Height.height_20,
  },
  containerSpaceBlock: {
    paddingTop: Padding.padding_3,
    zIndex: null,
  },
  groupFlexBox: {
    zIndex: 1,
    flexDirection: "row",
  },
  textTypo1: {
    width: Width.width_65,
    color: Color.labelsPrimary,
    textAlign: "center",
    fontFamily: FontFamily.inter,
  },
  iconPosition: {
    position: "absolute",
    zIndex: 1,
  },
  textTypo: {
    lineHeight: LineHeight.lh_18,
    letterSpacing: LetterSpacing.ls__0_08,
    fontSize: FontSize.fs_13,
    height: Height.height_18,
    textAlign: "center",
    fontFamily: FontFamily.inter,
  },
  mdilocationIconLayout: {
    width: Width.width_16,
    height: Height.height_16,
  },
  frameSpaceBlock: {
    paddingTop: Padding.padding_2,
    height: Height.height_15,
  },
  textTypo3: {
    textAlign: "center",
    fontFamily: FontFamily.inter,
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
  wrapperLayout: {
    height: Height.height_21,
    paddingTop: Padding.padding_3,
    zIndex: null,
  },
  filterChildLayout: {
    width: Width.width_24,
    height: Height.height_24,
  },
  matchingmethodParent: {
    height: 162,
    zIndex: 3,
    width: Width.width_370,
  },
  matchingmethod: {
    backgroundColor: Color.colorDarkseagreen,
    paddingHorizontal: Padding.padding_9,
    paddingVertical: Padding.padding_4,
    gap: Gap.gap_8,
    zIndex: 3,
    alignItems: "flex-end",
    overflow: "hidden",
    borderRadius: Border.br_16,
    height: Height.height_24,
    flexDirection: "row",
    width: Width.width_370,
  },
  vectorIcon: {
    width: Width.width_14,
    color: Color.nuetral500,
    height: Height.height_16,
  },
  wrapper: {
    paddingBottom: Padding.padding_1,
    height: Height.height_14,
    width: Width.width_55,
  },
  text: {
    width: Width.width_58,
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
    paddingRight: 34,
    paddingBottom: Padding.padding_16,
    gap: Gap.gap_19,
    marginTop: -5,
    borderStyle: "solid",
    backgroundColor: Color.colorWhite,
    alignItems: "flex-end",
    overflow: "hidden",
    borderRadius: Border.br_16,
    width: Width.width_370,
  },
  cardContainerTwo: {
    width: 330,
    paddingRight: Padding.padding_2,
    height: Height.height_66,
    flexDirection: "row",
  },
  ellipseParent: {
    width: 328,
    gap: Gap.gap_4,
    height: Height.height_66,
    zIndex: null,
    flexDirection: "row",
  },
  frameChild: {
    height: Height.height_64,
    width: Width.width_64,
  },
  frameWrapper: {
    paddingTop: Padding.padding_1,
    height: Height.height_66,
  },
  frameParent: {
    height: 65,
    gap: 4,
  },
  frameGroup: {
    width: Width.width_241,
    gap: 58,
  },
  parent: {
    width: Width.width_106,
  },
  text2: {
    fontSize: FontSize.fs_15,
    letterSpacing: LetterSpacing.ls__0_5,
    lineHeight: LineHeight.lh_20,
    color: Color.labelsPrimary,
    width: Width.width_44,
    textAlign: "center",
    fontFamily: FontFamily.inter,
  },
  frameContainer: {
    width: Width.width_62,
    height: Height.height_16,
  },
  group: {
    width: Width.width_62,
    height: Height.height_13,
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
  negotiationLabelWrapper: {
    paddingLeft: Padding.padding_1,
    height: Height.height_16,
    flexDirection: "row",
  },
  negotiationLabel: {
    width: 259,
    height: Height.height_16,
  },
  mdilocationIcon: {
    zIndex: 1,
  },
  frame: {
    width: Width.width_51,
  },
  text6: {
    width: 54,
    color: Color.labelsPrimary,
    lineHeight: LineHeight.lh_13,
    letterSpacing: LetterSpacing.ls_0_07,
    fontSize: FontSize.fs_11,
    height: Height.height_13,
  },
  vectorWrapper: {
    width: Width.width_12,
    height: Height.height_15,
    paddingTop: Padding.padding_3,
  },
  vectorIcon2: {
    height: Height.height_12,
    color: Color.nuetral700,
    zIndex: 2,
    width: Width.width_12,
  },
  frameView: {
    width: Width.width_48,
  },
  text7: {
    width: Width.width_51,
    zIndex: 1,
    color: Color.labelsPrimary,
    lineHeight: LineHeight.lh_13,
    letterSpacing: LetterSpacing.ls_0_07,
    fontSize: FontSize.fs_11,
    height: Height.height_13,
  },
  negotiationLabelInner: {
    width: 70,
    paddingRight: Padding.padding_3,
    paddingTop: Padding.padding_1,
    height: Height.height_14,
  },
  parent2: {
    width: 67,
    height: Height.height_13,
    zIndex: null,
    flexDirection: "row",
  },
  text8: {
    width: Width.width_61,
    color: Color.labelsPrimary,
    lineHeight: LineHeight.lh_13,
    letterSpacing: LetterSpacing.ls_0_07,
    fontSize: FontSize.fs_11,
    height: Height.height_13,
  },
  vectorContainer: {
    height: Height.height_11,
    marginLeft: -2,
    width: Width.width_8,
  },
  vectorIcon3: {
    height: Height.height_8,
    width: Width.width_8,
    color: Color.labelsPrimary,
  },
  subjectContainerWrapper: {
    width: Width.width_44,
    paddingTop: Padding.padding_1,
    height: Height.height_14,
  },
  subjectContainer: {
    width: Width.width_44,
    height: Height.height_13,
  },
  text9: {
    width: Width.width_47,
    color: Color.labelsPrimary,
    lineHeight: LineHeight.lh_13,
    letterSpacing: LetterSpacing.ls_0_07,
    fontSize: FontSize.fs_11,
    height: Height.height_13,
  },
  subjectIcon: {
    height: Height.height_36,
    width: Width.width_36,
    top: -12,
    right: -29,
    zIndex: 1,
    color: Color.nuetral500,
  },
  actionButtonsTwo: {
    width: 312,
    gap: Gap.gap_12,
    height: Height.height_28,
    zIndex: null,
    flexDirection: "row",
  },
  filter: {
    width: Width.width_119,
    paddingHorizontal: Padding.padding_8,
  },
  actionLabelsTwo: {
    width: Width.width_75,
  },
  text10: {
    width: Width.width_78,
    color: Color.labelsPrimary,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  filter2: {
    width: 85,
    paddingLeft: Padding.padding_4,
    paddingBottom: Padding.padding_2,
    gap: Gap.gap_2,
    borderWidth: 1,
    borderColor: Color.colorMediumslateblue,
    borderRadius: Border.br_8,
    height: Height.height_28,
    paddingRight: Padding.padding_3,
    paddingTop: Padding.padding_2,
    borderStyle: "solid",
    backgroundColor: Color.colorWhite,
    flexDirection: "row",
    overflow: "hidden",
  },
  filterChild: {
    color: Color.nuetral500,
  },
  wrapper2: {
    width: 52,
  },
  text11: {
    color: Color.labelsPrimary,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    width: Width.width_55,
  },
  filter3: {
    width: Width.width_84,
    paddingHorizontal: Padding.padding_4,
    backgroundColor: Color.colorWhite,
    paddingVertical: Padding.padding_2,
  },
  wrapper3: {
    width: Width.width_48,
  },
  text12: {
    width: Width.width_51,
    color: Color.labelsPrimary,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
});

export default FrameComponent2;
