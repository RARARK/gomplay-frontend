import * as React from "react";
import { Text, StyleSheet, View, Switch } from "react-native";
import MatchingIcon from "@/assets/home/Matching-Icon.svg";
import {
  Width,
  Border,
  Color,
  Padding,
  Gap,
  Height,
  FontSize,
  LetterSpacing,
  LineHeight,
  FontFamily,
  BoxShadow,
} from "@/constants/locofyHomeStyles";
import type { HomeStatusVariant } from "@/types/ui/homeStatus";

type Props = {
  state?: HomeStatusVariant;
  onChange?: (value: boolean) => void;
};

const QuickMatchToggle = ({ state, onChange }: Props) => {
  const isOn = state === "Matching";

  return (
    <View
      style={[
        styles.quickmatchtoggle,
        {
          backgroundColor: isOn ? "#4C5BE2" : Color.primary900,
        },
      ]}
    >
      <View style={styles.offParent}>
        <Text style={styles.offContainer}>
          <Text style={styles.off}>
            {isOn ? "퀵매칭 On\n" : "퀵매칭 Off\n"}
          </Text>
          <Text style={styles.text}>공강 중 · 파트너 탐색 가능</Text>
        </Text>

        <MatchingIcon
          style={styles.matchingIcon}
          width={Width.width_10}
          height={Height.height_12}
        />
      </View>

      <Switch
        style={styles.toggleSwitch}
        value={isOn}
        onValueChange={(value) => {
          onChange?.(value);
        }}
        thumbColor="#fff"
        trackColor={{
          false: "#5c5a63",
          true: "#A5B4FC",
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  quickmatchtoggle: {
    width: Width.width_316,
    borderRadius: Border.br_16,
    borderStyle: "solid",
    borderColor: Color.primary100,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: Padding.padding_21,
    paddingVertical: Padding.padding_29,
    gap: Gap.gap_20,
    overflow: "hidden",
  },
  offParent: {
    height: Height.height_27,
    width: Width.width_121,
  },
  offContainer: {
    top: 1,
    left: 0,
    fontSize: FontSize.fs_11,
    letterSpacing: LetterSpacing.ls_0_07,
    lineHeight: LineHeight.lh_13,
    fontFamily: FontFamily.inter,
    textAlign: "center",
    position: "absolute",
  },
  off: {
    color: Color.colorWhite,
  },
  text: {
    color: Color.neutral300,
  },
  matchingIcon: {
    marginTop: -13,
    marginLeft: -39,
    top: "50%",
    left: "50%",
    width: Width.width_10,
    height: Height.height_12,
    position: "absolute",
  },
  toggleSwitch: {
    height: Height.height_24,
    width: Width.width_40,
    boxShadow: BoxShadow.shadow_drop,
    borderRadius: Border.br_100,
    overflow: "hidden",
  },
});

export default QuickMatchToggle;
