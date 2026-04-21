import * as React from "react";
import { useRouter } from "expo-router";
import { View, Image, Text, Pressable, StyleSheet } from "react-native";
import Materialsymbolscheck from "@/assets/home/material-symbols-check.svg";

const NoScheduleContent = () => {
  const router = useRouter();

  return (
    <>
      <Image
        style={styles.image}
        source={require("@/assets/home/ScheduleBear.png")}
      />

      <View style={styles.content}>
        <Text style={styles.title}>
          시간표를 등록하고 근처 공강 파트너를 찾아보세요!
        </Text>

        <Text style={styles.subtitle}>
          나와 같이 공강인 파트너를 찾아드려요!
        </Text>

        <Pressable
          style={styles.button}
          onPress={() => router.push("/timetable")}
        >
          <Materialsymbolscheck width={24} height={24} />
          <Text style={styles.buttonText}>시간표 등록하러 가기</Text>
        </Pressable>

        <Text style={styles.caption}>지금 등록하고 바로 매칭 시작하기</Text>
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
    paddingHorizontal: 24, // 🔥 중요 (레이아웃 기준)
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

  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: "#4C5BE2",
  },

  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  caption: {
    fontSize: 11,
    textAlign: "center",
    color: "#888",
  },
});

export default NoScheduleContent;
