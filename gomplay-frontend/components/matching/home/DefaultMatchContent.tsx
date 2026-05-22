import * as React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { HomeLayout } from "@/constants/locofyHomeStyles";

const DefaultMatchContent = () => {
  return (
    <>
      <Image
        style={styles.image}
        source={require("@/assets/home/Ellipse-8.png")}
      />

      <View style={styles.content}>
        <Text style={styles.title}>내 주변 운동 파트너 찾기</Text>
        <Text style={styles.subtitle}>
          퀵 매치를 활성화하고{"\n"}
          나와 맞는 공강 시간인 파트너를 찾아보세요
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
