import * as React from "react";
import { Text, StyleSheet, View, Pressable } from "react-native";
import Boxiconsdumbbell from "../assets/boxicons-dumbbell.svg";
import Tablercoins from "../assets/tabler-coins.svg";
import Vector5 from "../assets/Vector5.svg";
import Mdipartnershipoutline from "../assets/mdi-partnership-outline.svg";
import Mingcuteinviteline from "../assets/mingcute-invite-line.svg";
import {
  FontFamily,
  Padding,
  Width,
  Color,
  Height,
  Border,
  Gap,
  LineHeight,
  LetterSpacing,
  FontSize,
  BoxShadow,
} from "../GlobalStyles";

const Content = () => {
  return (
    <View style={styles.content}>
      <View style={styles.infoContainer}>
        <View style={styles.nameContainer}>
          <Text style={[styles.text, styles.textFlexBox]}>김단국</Text>
        </View>
        <Text
          style={[styles.text2, styles.textFlexBox]}
        >{`소프트웨어학과 21학번 `}</Text>
      </View>
      <View style={styles.userFilters}>
        <View style={[styles.filter, styles.filterSpaceBlock]}>
          <Text style={[styles.text3, styles.textFlexBox]}>활동적</Text>
        </View>
        <View style={[styles.filter, styles.filterSpaceBlock]}>
          <Text style={[styles.text3, styles.textFlexBox]}>초보</Text>
        </View>
        <View style={[styles.filter, styles.filterSpaceBlock]}>
          <Text style={[styles.text3, styles.textFlexBox]}>아웃도어</Text>
        </View>
      </View>
      <View style={styles.footerContent}>
        <View style={styles.separatorContentWrapper}>
          <View style={styles.separatorContent}>
            <View style={styles.lineParent}>
              <View style={[styles.frameChild, styles.frameChildLayout]} />
              <View style={[styles.frameItem, styles.frameChildLayout]} />
            </View>
            <View style={styles.activityDetailsWrapper}>
              <View style={styles.activityDetails}>
                <Boxiconsdumbbell
                  style={styles.boxiconsdumbbell}
                  width={Width.width_32}
                  height={Height.height_32}
                />
                <View style={styles.activityLabel}>
                  <Text style={[styles.text6, styles.textFlexBox]}>
                    운동 스타일: 꾸준히 열심히
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.frameChildLayout} />
          </View>
        </View>
        <Pressable style={styles.filterWrapper}>
          <View style={[styles.filter4, styles.filterFlexBox]}>
            <Tablercoins
              style={styles.tablercoinsIcon}
              width={Width.width_28}
              height={Height.height_28}
            />
            <Text style={[styles.p, styles.textFlexBox]}>
              더 잘 맞는 파트너 찾기 10p
            </Text>
            <Vector5
              style={styles.vectorIcon}
              width={Width.width_20}
              height={Height.height_20}
            />
          </View>
        </Pressable>
        <Pressable style={styles.filterContainer}>
          <View style={[styles.filter5, styles.filterFlexBox]}>
            <Mdipartnershipoutline
              style={styles.boxiconsdumbbell}
              width={Width.width_32}
              height={Height.height_32}
            />
            <Text style={[styles.text7, styles.textFlexBox]}>
              파트너 신청 보내기
            </Text>
            <Mingcuteinviteline
              style={styles.boxiconsdumbbell}
              width={Width.width_32}
              height={Height.height_32}
            />
          </View>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textFlexBox: {
    justifyContent: "center",
    display: "flex",
    textAlign: "center",
    fontFamily: FontFamily.inter,
    alignItems: "center",
  },
  filterSpaceBlock: {
    paddingBottom: Padding.padding_5_2,
    paddingTop: Padding.padding_6_9,
    paddingHorizontal: Padding.padding_10_3,
    justifyContent: "center",
  },
  frameChildLayout: {
    width: Width.width_191,
    borderTopWidth: 1,
    borderColor: Color.nuetral100,
    borderStyle: "solid",
    height: Height.height_1,
  },
  filterFlexBox: {
    elevation: 4,
    alignSelf: "stretch",
    borderRadius: Border.br_32_7,
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    width: Width.width_338,
    paddingHorizontal: 17,
    paddingVertical: 0,
    gap: 13,
    zIndex: 3,
    alignItems: "center",
  },
  infoContainer: {
    height: Height.height_60,
    paddingVertical: Padding.padding_5,
    gap: Gap.gap_10,
    paddingHorizontal: 33,
    width: 206,
  },
  nameContainer: {
    width: 90,
    paddingLeft: 49,
    flexDirection: "row",
    height: Height.height_20,
    zIndex: null,
  },
  text: {
    width: 44,
    color: Color.nuetral900,
    fontWeight: "600",
    lineHeight: LineHeight.lh_20,
    letterSpacing: LetterSpacing.ls__0_5,
    fontSize: FontSize.fs_15,
    display: "flex",
    textAlign: "center",
    fontFamily: FontFamily.inter,
    height: Height.height_20,
  },
  text2: {
    width: 142,
    color: Color.nuetral700,
    fontWeight: "600",
    lineHeight: LineHeight.lh_20,
    letterSpacing: LetterSpacing.ls__0_5,
    fontSize: FontSize.fs_15,
    display: "flex",
    textAlign: "center",
    fontFamily: FontFamily.inter,
    height: Height.height_20,
  },
  userFilters: {
    width: 170,
    gap: Gap.gap_4,
    height: Height.height_16,
    flexDirection: "row",
  },
  filter: {
    width: Width.width_54,
    backgroundColor: Color.colorLightsteelblue,
    borderRadius: Border.br_32_7,
    paddingBottom: Padding.padding_5_2,
    paddingTop: Padding.padding_6_9,
    paddingHorizontal: Padding.padding_10_3,
    height: Height.height_16,
    flexDirection: "row",
    alignItems: "center",
  },
  text3: {
    height: Height.height_14_6,
    width: Width.width_91_6,
    fontSize: FontSize.fs_11,
    letterSpacing: LetterSpacing.ls_0_07,
    lineHeight: LineHeight.lh_13,
    color: Color.primary900,
  },
  footerContent: {
    height: 186,
    paddingHorizontal: Padding.padding_2,
    paddingBottom: Padding.padding_18,
    gap: Gap.gap_15,
    alignSelf: "stretch",
  },
  separatorContentWrapper: {
    width: 253,
    paddingLeft: 47,
    height: 50,
    flexDirection: "row",
  },
  separatorContent: {
    alignItems: "flex-end",
    paddingLeft: Padding.padding_6,
    paddingRight: Padding.padding_8,
    gap: 8,
    height: 50,
    width: 206,
  },
  lineParent: {
    width: 192,
    height: Height.height_1,
    zIndex: null,
  },
  frameChild: {
    left: 2,
    top: 0,
    position: "absolute",
    borderTopWidth: 1,
    borderColor: Color.nuetral100,
    borderStyle: "solid",
  },
  frameItem: {
    left: 0,
    top: 0,
    position: "absolute",
    borderTopWidth: 1,
    borderColor: Color.nuetral100,
    borderStyle: "solid",
  },
  activityDetailsWrapper: {
    width: 189,
    justifyContent: "flex-end",
    paddingRight: Padding.padding_1,
    height: Height.height_32,
    flexDirection: "row",
    zIndex: null,
  },
  activityDetails: {
    width: 188,
    height: Height.height_32,
    flexDirection: "row",
    zIndex: null,
    gap: Gap.gap_10,
  },
  boxiconsdumbbell: {
    width: Width.width_32,
    height: Height.height_32,
  },
  activityLabel: {
    width: 146,
    paddingTop: 7,
    height: Height.height_25,
    zIndex: null,
  },
  text6: {
    width: Width.width_149,
    height: Height.height_18,
    fontSize: FontSize.fs_13,
    letterSpacing: LetterSpacing.ls__0_08,
    lineHeight: LineHeight.lh_18,
    color: Color.labelsPrimary,
  },
  filterWrapper: {
    width: 300,
    zIndex: 3,
  },
  filter4: {
    height: Height.height_44,
    boxShadow: BoxShadow.shadow_drop,
    backgroundColor: Color.colorGoldenrod,
    gap: Gap.gap_6,
    paddingBottom: Padding.padding_5_2,
    paddingTop: Padding.padding_6_9,
    paddingHorizontal: Padding.padding_10_3,
    justifyContent: "center",
  },
  tablercoinsIcon: {
    height: Height.height_28,
    width: Width.width_28,
  },
  p: {
    width: 166,
    color: Color.colorWhite,
    height: Height.height_25,
    fontWeight: "600",
    lineHeight: LineHeight.lh_20,
    letterSpacing: LetterSpacing.ls__0_5,
    fontSize: FontSize.fs_15,
    display: "flex",
    textAlign: "center",
    fontFamily: FontFamily.inter,
  },
  vectorIcon: {
    width: Width.width_20,
    color: Color.colorWhite,
    height: Height.height_20,
  },
  filterContainer: {
    zIndex: 2,
    width: 300,
  },
  filter5: {
    boxShadow: BoxShadow.shadow_drop1,
    backgroundColor: Color.colorSalmon,
    paddingVertical: Padding.padding_6,
    gap: Gap.gap_28,
    paddingHorizontal: 33,
  },
  text7: {
    width: 117,
    color: Color.colorWhite,
    fontWeight: "600",
    lineHeight: LineHeight.lh_20,
    letterSpacing: LetterSpacing.ls__0_5,
    fontSize: FontSize.fs_15,
    display: "flex",
    textAlign: "center",
    fontFamily: FontFamily.inter,
    height: Height.height_20,
  },
});

export default Content;
