import * as React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { HomeLayout } from "@/constants/locofyHomeStyles";

const DefaultMatchContent = () => {
  return (
    <>
      <Image
        style={styles.image}
        source={require("@/assets/home/Ellipse-8.png")}
      />

      <View style={styles.content}>
        <Text style={styles.title}>Find a partner near you</Text>
        <Text style={styles.subtitle}>
          Turn on quick match and start meeting people who fit your vibe.
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    width: HomeLayout.statusIllustrationSize,
    height: HomeLayout.statusIllustrationSize,
  },

  content: {
    width: "100%",
    minHeight: HomeLayout.statusContentMinHeight,
    paddingHorizontal: 24,
    gap: 24,
    alignItems: "center",
  },

  title: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
  },

  subtitle: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
  },
});

export default DefaultMatchContent;
