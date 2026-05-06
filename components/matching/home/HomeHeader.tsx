import Frame110 from "@/assets/home/Frame-110.svg";
import Frame91 from "@/assets/home/Frame-91.svg";
import { Height, Width } from "@/constants/locofyHomeStyles";
import { Image } from "expo-image";
import { router } from "expo-router";
import * as React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const HomeHeader = () => {
  return (
    <View style={styles.header}>
      {/* Toggle the home mode from the leading action button. */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Toggle home mode"
        style={styles.iconButton}
        onPress={() => {}}
      >
        <Image
          style={styles.imageIcon}
          contentFit="cover"
          source={require("@/assets/home/Switch-Background.png")}
        />
      </Pressable>

      {/* Keep the secondary actions grouped on the right side of the header. */}
      <View style={styles.rightIcons}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open notifications"
          style={styles.iconButton}
          onPress={() => router.push("/notifications" as any)}
        >
          <Frame91
            style={styles.svgIcon}
            width={Width.width_48}
            height={Height.height_48}
          />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open profile"
          style={styles.myButton}
          onPress={() => router.push("/mypage" as any)}
        >
          <Text style={styles.myButtonText}>MY</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open settings"
          style={styles.iconButton}
          onPress={() => {}}
        >
          <Frame110
            style={styles.svgIcon}
            width={Width.width_48}
            height={Height.height_48}
          />
        </Pressable>
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
  myButton: {
    width: Width.width_48,
    height: Height.height_48,
    justifyContent: "center",
    alignItems: "center",
  },
  myButtonText: {
    fontSize: 16,
    lineHeight: 18,
    color: "#111111",
    fontWeight: "900",
  },
  imageIcon: {
    width: Width.width_48,
    height: Height.height_48,
  },
  svgIcon: {
    width: Width.width_48,
    height: Height.height_48,
  },
});

export default HomeHeader;
