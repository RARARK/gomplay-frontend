import Frame91 from "@/assets/home/Frame-91.svg";
import { Image } from "expo-image";
import { router } from "expo-router";
import * as React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const HomeHeader = React.memo(() => {
  return (
    <View style={styles.header}>
      <Image
        source={require("@/assets/home/maintypo.png")}
        style={styles.logo}
        contentFit="contain"
      />

      <View style={styles.rightIcons}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open notifications"
          style={styles.iconButton}
          onPress={() => router.push("/notifications" as any)}
        >
          <Frame91 width={48} height={48} />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open profile"
          style={styles.iconButton}
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
    paddingVertical: 8,
  },
  logo: {
    width: 120,
    height: 36,
  },
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  iconButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  myButtonText: {
    fontSize: 16,
    lineHeight: 18,
    color: "#111111",
    fontWeight: "900",
  },
});

HomeHeader.displayName = "HomeHeader";

export default HomeHeader;
