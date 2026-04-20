import * as React from "react";
import { View, Image, Text, StyleSheet } from "react-native";

const DefaultMatch = () => {
  return (
    <>
      <Image
        style={styles.image}
        source={require("@/assets/home/Ellipse-8.png")}
      />

      <View style={styles.content}>
        <Text style={styles.title}>근처 공강 파트너를 찾아보세요!</Text>

        <Text style={styles.subtitle}>
          나와 같이 공강인 파트너를 찾아드려요!
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 144,
    height: 144,
  },

  content: {
    width: "100%",
    minHeight: 182,
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

export default DefaultMatch;
