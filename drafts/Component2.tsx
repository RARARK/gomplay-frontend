import * as React from "react";
import { useState } from "react";
import { ScrollView, Text, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import DropDownPicker from "react-native-dropdown-picker";
import CellularConnection1 from "../assets/Cellular-Connection.svg";
import Wifi1 from "../assets/Wifi.svg";
import Cap1 from "../assets/Cap.svg";
import Frame10811 from "../assets/Frame-1081.svg";
import FrameComponent1 from "../components/FrameComponent1";
import FrameComponent2 from "../components/FrameComponent2";
import Vector21 from "../assets/Vector2.svg";
import Vector31 from "../assets/Vector3.svg";
import Vector41 from "../assets/Vector4.svg";
import Vector51 from "../assets/Vector5.svg";
import {
  Width,
  Height,
  Color,
  Border,
  MinHeight,
  LineHeight,
  LetterSpacing,
  FontSize,
  FontFamily,
  Padding,
  Gap,
} from "../GlobalStyles";

const Component2 = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterValue, setFilterValue] = useState();
  const [filter1Open, setFilter1Open] = useState(false);
  const [filter1Value, setFilter1Value] = useState();
  const [filter2Open, setFilter2Open] = useState(false);
  const [filter2Value, setFilter2Value] = useState();

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
            <View style={styles.border} />
            <Cap1 style={[styles.capIcon, styles.iconLayout]} />
            <View style={styles.capacity} />
          </View>
        </View>
      </View>
      <View style={[styles.frameParent, styles.wrapperLayout]}>
        <Frame10811
          style={[styles.frameChild, styles.childLayout]}
          width={Width.width_48}
          height={Height.height_48}
        />
        <View style={[styles.wrapper, styles.wrapperLayout]}>
          <Text style={styles.text}>매치 히스토리</Text>
        </View>
      </View>
      <Image
        style={[styles.child, styles.childLayout]}
        contentFit="cover"
        source={require("../assets/Frame-93.png")}
      />
      <View style={styles.body}>
        <View style={[styles.bodyInner, styles.filterLayout]}>
          <View style={[styles.filterParent, styles.filterLayout]}>
            <View style={[styles.filter, styles.filterLayout]}>
              <DropDownPicker
                style={[
                  styles.dropdownpicker,
                  styles.dropdownpickerLayout,
                  styles.filterdropDownContainer,
                ]}
                open={filterOpen}
                setOpen={setFilterOpen}
                value={filterValue}
                setValue={setFilterValue}
                placeholder="전체"
                items={[]}
                labelStyle={styles.filterValue}
                placeholderStyle={styles.filterValue}
                dropdownContainerStyle={styles.filterdropDownContent}
                zIndex={4000}
                zIndexInverse={0}
                dropDownDirection={"BOTTOM"}
              />
            </View>
            <View style={[styles.filter, styles.filterLayout]}>
              <DropDownPicker
                style={[
                  styles.dropdownpicker2,
                  styles.dropdownpickerLayout,
                  styles.filter1dropDownContainer,
                ]}
                open={filter1Open}
                setOpen={setFilter1Open}
                value={filter1Value}
                setValue={setFilter1Value}
                placeholder="매칭 완료"
                items={[]}
                labelStyle={styles.filter1Value}
                placeholderStyle={styles.filter1Value}
                dropdownContainerStyle={styles.filter1dropDownContent}
                zIndex={3000}
                zIndexInverse={0}
                dropDownDirection={"BOTTOM"}
              />
            </View>
            <View style={[styles.filter, styles.filterLayout]}>
              <DropDownPicker
                style={[
                  styles.dropdownpicker2,
                  styles.dropdownpickerLayout,
                  styles.filter2dropDownContainer,
                ]}
                open={filter2Open}
                setOpen={setFilter2Open}
                value={filter2Value}
                setValue={setFilter2Value}
                placeholder="매칭 취소"
                items={[]}
                labelStyle={styles.filter2Value}
                placeholderStyle={styles.filter2Value}
                dropdownContainerStyle={styles.filter2dropDownContent}
                zIndex={2000}
                zIndexInverse={0}
                dropDownDirection={"BOTTOM"}
              />
            </View>
          </View>
        </View>
        <FrameComponent1 />
        <FrameComponent2 />
      </View>
      <View style={[styles.bottomtabbar, styles.bottomtabbarFlexBox]}>
        <View
          style={[styles.bottomtabbarInner, styles.bottomtabbarInnerFlexBox]}
        >
          <View style={styles.vectorParent}>
            <Vector21
              style={styles.vectorIcon}
              width={Width.width_19}
              height={18}
            />
            <Text style={[styles.text2, styles.textTypo]}>홈</Text>
          </View>
        </View>
        <View style={styles.bottomtabbarChild}>
          <View style={styles.parent}>
            <Text style={[styles.text3, styles.textTypo]}>매칭현황</Text>
            <Vector31 style={[styles.vectorIcon2, styles.iconLayout]} />
          </View>
        </View>
        <View style={styles.frameView}>
          <View style={styles.vectorGroup}>
            <Vector41
              style={[styles.vectorIcon3, styles.vectorIconLayout]}
              width={Width.width_18}
              height={Height.height_18}
            />
            <Text style={[styles.text2, styles.textTypo]}>파트너 찾기</Text>
          </View>
        </View>
        <View
          style={[styles.bottomtabbarInner2, styles.bottomtabbarInnerFlexBox]}
        >
          <View style={styles.vectorContainer}>
            <Vector51
              style={[styles.vectorIcon4, styles.vectorIconLayout]}
              width={Width.width_18}
              height={17}
            />
            <Text style={[styles.text2, styles.textTypo]}>채팅</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  filterValue: {
    color: "#000",
    fontSize: 11,
    fontFamily: "Inter",
  },
  filterdropDownContainer: {
    paddingLeft: 29,
    paddingRight: 9,
    minHeight: 28,
    height: 28,
    backgroundColor: "#fff",
    borderStyle: "solid",
    borderColor: "#4c5be2",
    borderWidth: 1,
    borderRadius: 33,
  },
  filterdropDownContent: {
    borderColor: "#4c5be2",
    borderWidth: 1,
    borderRadius: 33,
  },
  filter1Value: {
    color: "#000",
    fontSize: 11,
    fontFamily: "Inter",
  },
  filter1dropDownContainer: {
    paddingHorizontal: 8,
    paddingVertical: 0,
    minHeight: 28,
    height: 28,
    backgroundColor: "#fff",
    borderStyle: "solid",
    borderColor: "#4c5be2",
    borderWidth: 1,
    borderRadius: 33,
  },
  filter1dropDownContent: {
    borderColor: "#4c5be2",
    borderWidth: 1,
    borderRadius: 33,
  },
  filter2Value: {
    color: "#000",
    fontSize: 11,
    fontFamily: "Inter",
  },
  filter2dropDownContainer: {
    paddingHorizontal: 8,
    paddingVertical: 0,
    minHeight: 28,
    height: 28,
    backgroundColor: "#fff",
    borderStyle: "solid",
    borderColor: "#4c5be2",
    borderWidth: 1,
    borderRadius: 33,
  },
  filter2dropDownContent: {
    borderColor: "#4c5be2",
    borderWidth: 1,
    borderRadius: 33,
  },
  scrollView1Content: {
    flexDirection: "column",
    paddingTop: 13,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 10,
    height: 874,
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
  iconLayout: {
    maxHeight: "100%",
    position: "absolute",
  },
  wrapperLayout: {
    width: 249,
    height: Height.height_22,
    flexDirection: "row",
  },
  childLayout: {
    height: Height.height_48,
    width: Width.width_48,
  },
  filterLayout: {
    height: Height.height_28,
    flexDirection: "row",
  },
  dropdownpickerLayout: {
    borderRadius: Border.br_32_71,
    borderWidth: 1,
    borderColor: Color.colorMediumslateblue,
    height: Height.height_281,
    minHeight: MinHeight.min_h_28,
    borderStyle: "solid",
    backgroundColor: Color.colorWhite,
  },
  bottomtabbarInnerFlexBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  textTypo: {
    lineHeight: LineHeight.lh_13,
    letterSpacing: LetterSpacing.ls_0_07,
    fontSize: FontSize.fs_11,
    fontFamily: FontFamily.inter,
    textAlign: "center",
    color: Color.labelsPrimary,
  },
  vectorIconLayout: {
    width: Width.width_18,
    color: Color.nuetral500,
  },
  scrollview: {
    width: "100%",
    maxWidth: "100%",
    flex: 1,
    backgroundColor: Color.colorWhite,
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
    fontFamily: FontFamily.notoSansKR,
    textAlign: "center",
    fontWeight: "600",
    lineHeight: LineHeight.lh_22,
    fontSize: FontSize.fs_17,
    color: Color.labelsPrimary,
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
    height: Height.height_13,
    width: 27,
  },
  border: {
    height: "100%",
    marginLeft: -14,
    bottom: "0%",
    borderRadius: 4,
    borderColor: Color.labelsPrimary,
    borderWidth: 1,
    width: Width.width_25,
    opacity: 0,
    borderStyle: "solid",
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
    width: Width.width_21,
    left: "50%",
    position: "absolute",
  },
  frameParent: {
    zIndex: 4,
  },
  frameChild: {
    marginTop: -24,
    top: "50%",
    left: 12,
    zIndex: 4,
    width: Width.width_48,
    position: "absolute",
    color: Color.labelsPrimary,
  },
  wrapper: {
    paddingLeft: 153,
  },
  text: {
    width: 99,
    letterSpacing: -0.41,
    fontFamily: FontFamily.inter,
    textAlign: "center",
    color: Color.labelsPrimary,
    fontWeight: "600",
    lineHeight: LineHeight.lh_22,
    fontSize: FontSize.fs_17,
    height: Height.height_22,
  },
  child: {
    width: Width.width_48,
    display: "none",
  },
  body: {
    height: 829,
    borderRadius: Border.br_16,
    backgroundColor: Color.colorAliceblue,
    paddingHorizontal: Padding.padding_16,
    paddingTop: Padding.padding_17,
    paddingBottom: 430,
    gap: 12,
    alignItems: "flex-end",
    width: Width.width_402,
  },
  bodyInner: {
    width: 367,
    justifyContent: "flex-end",
    paddingLeft: Padding.padding_0,
    paddingRight: 99,
    zIndex: null,
    height: Height.height_28,
  },
  filterParent: {
    width: 278,
    gap: Gap.gap_4,
    zIndex: null,
    height: Height.height_28,
  },
  filter: {
    width: Width.width_90,
    borderRadius: Border.br_32_7,
    overflow: "hidden",
    borderStyle: "solid",
  },
  dropdownpicker: {
    paddingLeft: 29,
    paddingRight: Padding.padding_9,
  },
  dropdownpicker2: {
    paddingHorizontal: Padding.padding_8,
    paddingVertical: Padding.padding_0,
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
  text2: {
    alignSelf: "stretch",
  },
  bottomtabbarChild: {
    paddingHorizontal: Padding.padding_3,
    paddingVertical: Padding.padding_13,
    width: Width.width_48,
  },
  parent: {
    width: Width.width_41,
    height: 38,
  },
  text3: {
    top: "65.79%",
    left: "0%",
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
    width: Width.width_56,
    paddingHorizontal: Padding.padding_0,
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
  },
  vectorContainer: {
    alignItems: "flex-end",
    width: Width.width_21,
    gap: Gap.gap_7,
  },
  vectorIcon4: {
    height: 17,
  },
});

export default Component2;
