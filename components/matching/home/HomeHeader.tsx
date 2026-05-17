import { MaterialCommunityIcons } from "@expo/vector-icons";
import Frame91 from "@/assets/home/Frame-91.svg";
import { Height, Width } from "@/constants/locofyHomeStyles";
import { Image } from "expo-image";
import { router } from "expo-router";
import * as React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const HomeHeader = React.memo(() => {
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
      <View style={[styles.rightIcons, { width: Width.width_48 * 4 }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open tutorial result preview"
          style={styles.iconButton}
          onPress={() => router.push("/tutorial-result" as any)}
        >
          <MaterialCommunityIcons
            name="clipboard-list-outline"
            size={26}
            color="#22C55E"
          />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open onboarding preview"
          style={styles.iconButton}
          onPress={() => router.push("/onboarding" as any)}
        >
          <MaterialCommunityIcons
            name="rocket-launch"
            size={26}
            color="#4C5BE2"
          />
        </Pressable>

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
      </View>
    </View>
  );
});

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
    width: Width.width_48 * 3,
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

HomeHeader.displayName = "HomeHeader";

export default HomeHeader;
