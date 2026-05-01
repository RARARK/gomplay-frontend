import * as React from "react";
import { ScrollView, Text, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import CellularConnection1 from "../assets/Cellular-Connection.svg";
import Wifi1 from "../assets/Wifi.svg";
import Cap1 from "../assets/Cap.svg";
import Vector6 from "../assets/Vector.svg";
import Vector11 from "../assets/Vector1.svg";
import Vector21 from "../assets/Vector2.svg";
import Vector31 from "../assets/Vector3.svg";
import Frame1081 from "../assets/Frame-1081.svg";
import Vector4 from "../assets/Vector4.svg";
import CardDetails from "../components/CardDetails";
import Content from "../components/Content";
import {
  Width,
  Height,
  Color,
  FontFamily,
  Gap,
  Border,
  Padding,
  LineHeight,
  FontSize,
  LetterSpacing,
} from "../GlobalStyles";

const Component = () => {
  return (
    <ScrollView
      style={styles.scrollview}
      contentContainerStyle={styles.scrollView1Content}
    >
      <View style={[styles.statusBarIphone, styles.bottomtabbarFlexBox]}>
        <View style={[styles.time, styles.timeFlexBox]}>
          <Text style={styles.time2}>9:41</Text>
        </View>
        <View style={[styles.levels, styles.timeFlexBox]}>
          <CellularConnection1
            style={[styles.cellularConnectionIcon, styles.iconLayout1]}
            width={19}
            height={12}
          />
          <Wifi1
            style={[styles.wifiIcon, styles.iconLayout1]}
            width={17}
            height={12}
          />
          <View style={styles.frame}>
            <View style={[styles.border, styles.borderBorder]} />
            <Cap1 style={[styles.capIcon, styles.iconLayout]} />
            <View style={styles.capacity} />
          </View>
        </View>
      </View>
      <View style={[styles.bottomtabbar, styles.bottomtabbarFlexBox]}>
        <View style={styles.bottomtabbarInner}>
          <View style={styles.vectorParent}>
            <Vector6
              style={styles.vectorIcon}
              width={Width.width_19}
              height={18}
            />
            <Text style={[styles.text, styles.textTypo1]}>홈</Text>
          </View>
        </View>
        <View style={styles.bottomtabbarChild}>
          <View style={styles.parent}>
            <Text style={[styles.text2, styles.textTypo1]}>매칭현황</Text>
            <Vector11 style={[styles.vectorIcon2, styles.iconLayout]} />
          </View>
        </View>
        <View style={styles.frameView}>
          <View style={styles.vectorGroup}>
            <Vector21
              style={[styles.vectorIcon3, styles.vectorIconLayout]}
              width={Width.width_18}
              height={Height.height_18}
            />
            <Text style={[styles.text, styles.textTypo1]}>파트너 찾기</Text>
          </View>
        </View>
        <View style={styles.bottomtabbarInner2}>
          <View style={styles.vectorContainer}>
            <Vector31
              style={[styles.vectorIcon4, styles.vectorIconLayout]}
              width={Width.width_18}
              height={17}
            />
            <Text style={[styles.text, styles.textTypo1]}>채팅</Text>
          </View>
        </View>
      </View>
      <View style={styles.inner}>
        <View style={styles.frameParent}>
          <Frame1081
            style={styles.frameChild}
            width={Width.width_48}
            height={Height.height_48}
          />
          <View style={styles.wrapper}>
            <Text style={[styles.text5, styles.textTypo1]}>파트너 매칭</Text>
          </View>
        </View>
      </View>
      <LinearGradient
        style={styles.card}
        locations={[0, 1]}
        colors={["#3a4fa3", "#6c7bff"]}
      >
        <View style={[styles.cardContainer, styles.cardContainerLayout]}>
          <View
            style={[styles.headerContentParent, styles.headerContentLayout1]}
          >
            <View style={[styles.headerContent, styles.headerContentLayout]}>
              <Vector4 style={styles.vectorIcon5} width={37} height={37} />
              <View style={[styles.partnerHeading, styles.headerContentLayout]}>
                <Text
                  style={[styles.text6, styles.textTypo]}
                >{`성향 일치 파트너 발견! `}</Text>
              </View>
            </View>
            <View style={styles.container}>
              <Text style={[styles.text7, styles.textTypo]}>
                지금 바로 연결해보세요.
              </Text>
            </View>
          </View>
        </View>
        <LinearGradient
          style={[styles.parnercard, styles.backgroundimageLayout]}
          locations={[0, 1]}
          colors={[Color.colorLightsteelblue, Color.colorWhite]}
        >
          <LinearGradient
            style={[styles.backgroundimage, styles.backgroundimageLayout]}
            locations={[0, 1]}
            colors={[Color.colorLightsteelblue, Color.colorWhite]}
          />
          <Image
            style={[styles.backgroundimageIcon, styles.backgroundimageLayout]}
            contentFit="cover"
            source={require("../assets/backgroundimage.png")}
          />
          <CardDetails />
          <Content />
        </LinearGradient>
        <View style={styles.materialSymbolsrefresh} />
      </LinearGradient>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView1Content: {
    flexDirection: "column",
    paddingTop: 62,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    height: 810,
    flex: 1,
  },
  bottomtabbarFlexBox: {
    justifyContent: "center",
    display: "none",
    alignItems: "center",
    flexDirection: "row",
    width: Width.width_402,
  },
  timeFlexBox: {
    height: Height.height_22,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
  },
  iconLayout1: {
    height: 12,
    color: Color.labelsPrimary,
  },
  borderBorder: {
    borderWidth: 1,
    borderStyle: "solid",
  },
  iconLayout: {
    maxHeight: "100%",
    position: "absolute",
  },
  textTypo1: {
    fontFamily: FontFamily.inter,
    textAlign: "center",
    color: Color.labelsPrimary,
  },
  vectorIconLayout: {
    width: Width.width_18,
    color: Color.nuetral500,
  },
  cardContainerLayout: {
    height: 67,
    zIndex: null,
  },
  headerContentLayout1: {
    gap: Gap.gap_5,
    width: 233,
  },
  headerContentLayout: {
    height: 42,
    zIndex: null,
  },
  textTypo: {
    color: Color.colorWhite,
    fontFamily: FontFamily.inter,
    textAlign: "center",
  },
  backgroundimageLayout: {
    borderRadius: Border.br_16,
    height: 560,
    width: 360,
  },
  scrollview: {
    width: "100%",
    backgroundColor: Color.colorWhite,
    maxWidth: "100%",
    flex: 1,
  },
  statusBarIphone: {
    paddingHorizontal: Padding.padding_24,
    paddingTop: 21,
    paddingBottom: Padding.padding_19,
    gap: 154,
    display: "none",
  },
  time: {
    paddingTop: 1,
  },
  time2: {
    fontFamily: FontFamily.sFPro,
    textAlign: "center",
    color: Color.labelsPrimary,
    fontWeight: "600",
    lineHeight: LineHeight.lh_22,
    fontSize: FontSize.fs_17,
  },
  levels: {
    paddingTop: Padding.padding_1,
    paddingRight: Padding.padding_1,
    gap: Gap.gap_7,
  },
  cellularConnectionIcon: {
    width: 19,
  },
  wifiIcon: {
    width: 17,
  },
  frame: {
    height: 13,
    width: 27,
  },
  border: {
    height: "100%",
    marginLeft: -14,
    bottom: "0%",
    borderRadius: 4,
    borderColor: Color.labelsPrimary,
    width: 25,
    opacity: 0,
    left: "50%",
    top: "0%",
    position: "absolute",
  },
  capIcon: {
    height: "31.54%",
    marginLeft: 12,
    top: "34.62%",
    bottom: "33.85%",
    width: 1,
    left: "50%",
    color: Color.labelsPrimary,
  },
  capacity: {
    height: "69.23%",
    marginLeft: -12,
    top: "15.38%",
    bottom: "15.38%",
    borderRadius: 3,
    backgroundColor: Color.labelsPrimary,
    width: 21,
    left: "50%",
    position: "absolute",
  },
  bottomtabbar: {
    height: Height.height_64,
    backgroundColor: Color.nuetral100,
    gap: Gap.gap_48,
    display: "none",
  },
  bottomtabbarInner: {
    paddingHorizontal: Padding.padding_14,
    paddingVertical: Padding.padding_13,
    overflow: "hidden",
    alignItems: "center",
    flexDirection: "row",
  },
  vectorParent: {
    width: Width.width_19,
    gap: Gap.gap_7,
    alignItems: "center",
  },
  vectorIcon: {
    height: 18,
    color: Color.nuetral500,
    width: Width.width_19,
  },
  text: {
    lineHeight: LineHeight.lh_13,
    letterSpacing: LetterSpacing.ls_0_07,
    fontSize: FontSize.fs_11,
    fontFamily: FontFamily.inter,
    alignSelf: "stretch",
  },
  bottomtabbarChild: {
    paddingHorizontal: Padding.padding_3,
    width: Width.width_48,
    paddingVertical: Padding.padding_13,
  },
  parent: {
    width: 41,
    height: 38,
  },
  text2: {
    top: "65.79%",
    left: "0%",
    lineHeight: LineHeight.lh_13,
    letterSpacing: LetterSpacing.ls_0_07,
    fontSize: FontSize.fs_11,
    fontFamily: FontFamily.inter,
    position: "absolute",
  },
  vectorIcon2: {
    height: "48.68%",
    width: "33.17%",
    right: "32.68%",
    bottom: "51.32%",
    left: "34.15%",
    color: Color.nuetral500,
    overflow: "hidden",
    top: "0%",
    maxWidth: "100%",
  },
  frameView: {
    width: 56,
    paddingHorizontal: 0,
    paddingVertical: Padding.padding_13,
  },
  vectorGroup: {
    alignSelf: "stretch",
    gap: Gap.gap_7,
    alignItems: "center",
  },
  vectorIcon3: {
    height: Height.height_18,
  },
  bottomtabbarInner2: {
    padding: Padding.padding_13,
    alignItems: "center",
    flexDirection: "row",
  },
  vectorContainer: {
    alignItems: "flex-end",
    width: 21,
    gap: Gap.gap_7,
  },
  vectorIcon4: {
    height: 17,
  },
  inner: {
    width: 242,
    paddingLeft: Padding.padding_12,
    height: Height.height_48,
    zIndex: null,
    flexDirection: "row",
  },
  frameParent: {
    width: 230,
    gap: 101,
    height: Height.height_48,
    zIndex: null,
    flexDirection: "row",
  },
  frameChild: {
    height: Height.height_48,
    width: Width.width_48,
    color: Color.labelsPrimary,
  },
  wrapper: {
    width: 81,
    height: 35,
    paddingTop: Padding.padding_13,
    zIndex: null,
  },
  text5: {
    width: 84,
    letterSpacing: LetterSpacing.ls__0_41,
    fontFamily: FontFamily.inter,
    fontWeight: "600",
    lineHeight: LineHeight.lh_22,
    fontSize: FontSize.fs_17,
    height: Height.height_22,
  },
  card: {
    height: 700,
    paddingHorizontal: 21,
    paddingTop: Padding.padding_14,
    paddingBottom: 41,
    gap: 18,
    backgroundColor: "transparent",
    overflow: "hidden",
    width: Width.width_402,
  },
  cardContainer: {
    width: 276,
    paddingLeft: 43,
    flexDirection: "row",
  },
  headerContentParent: {
    height: 67,
    zIndex: null,
    alignItems: "flex-end",
  },
  headerContent: {
    gap: Gap.gap_5,
    width: 233,
    flexDirection: "row",
  },
  vectorIcon5: {
    height: 37,
    width: 37,
    color: Color.colorKhaki100,
  },
  partnerHeading: {
    width: Width.width_191,
    paddingTop: 17,
  },
  text6: {
    width: 194,
    height: Height.height_25,
    fontSize: 20,
    letterSpacing: 0.38,
    lineHeight: 25,
    fontWeight: "700",
  },
  container: {
    width: 170,
    justifyContent: "flex-end",
    paddingRight: 22,
    height: Height.height_20,
    zIndex: null,
    flexDirection: "row",
  },
  text7: {
    width: 151,
    fontSize: FontSize.fs_15,
    letterSpacing: -0.24,
    lineHeight: LineHeight.lh_20,
    height: Height.height_20,
  },
  parnercard: {
    boxShadow: "0px 0px 60px rgba(193, 205, 255, 0.2)",
    elevation: 60,
    borderColor: Color.colorGray,
    paddingTop: 27,
    paddingRight: 10,
    paddingBottom: Padding.padding_24,
    gap: Gap.gap_11,
    backgroundColor: "transparent",
    paddingLeft: Padding.padding_12,
    borderWidth: 1,
    borderStyle: "solid",
  },
  backgroundimage: {
    zIndex: 0,
    backgroundColor: "transparent",
    display: "none",
  },
  backgroundimageIcon: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
    overflow: "hidden",
    maxHeight: "100%",
    position: "absolute",
    maxWidth: "100%",
  },
  materialSymbolsrefresh: {
    width: 60,
    height: Height.height_60,
    overflow: "hidden",
    display: "none",
  },
});

export default Component;
