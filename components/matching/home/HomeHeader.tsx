import * as React from "react";
import { Image } from "expo-image";
import { StyleSheet, Pressable, View } from "react-native";
import Frame91 from "@/assets/home/Frame-91.svg";
import Frame921 from "@/assets/home/Frame-92.svg";
import Frame110 from "@/assets/home/Frame-110.svg";
import { Height, Width, Color } from "@/constants/locofyHomeStyles";

const HomeHeader = () => {
  return (
    <View style={styles.header}>
      <Pressable style={styles.iconButton} onPress={() => {}}>
        <Image
          style={styles.imageIcon}
          contentFit="cover"
          source={require("@/assets/home/Switch-Background.png")}
        />
      </Pressable>

      <View style={styles.rightIcons}>
        <Frame91
          style={styles.svgIcon}
          width={Width.width_48}
          height={Height.height_48}
        />

        <Pressable style={styles.iconButton} onPress={() => {}}>
          <Frame921
            style={styles.svgIcon}
            width={Width.width_48}
            height={Height.height_48}
          />
        </Pressable>

        <Frame110
          style={styles.svgIcon}
          width={Width.width_48}
          height={Height.height_48}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 8,
  },
  rightIcons: {
    width: Width.width_144,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    width: Width.width_48,
    height: Height.height_48,
    justifyContent: "center",
    alignItems: "center",
  },
  imageIcon: {
    width: Width.width_48,
    height: Height.height_48,
  },
  svgIcon: {
    width: Width.width_48,
    height: Height.height_48,
  },
  primarySvgColor: {
    color: Color.labelsPrimary,
  },
});

export default HomeHeader;
