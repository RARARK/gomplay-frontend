import * as React from "react";
import { useRouter } from "expo-router";
import { View, Image, Text, Pressable, StyleSheet } from "react-native";
import Materialsymbolscheck from "@/assets/home/material-symbols-check.svg";
import { HomeLayout } from "@/constants/locofyHomeStyles";

const NoScheduleContent = () => {
  const router = useRouter();

  return (
    <>
      <Image
        style={styles.image}
        source={require("@/assets/home/ScheduleBear.png")}
      />

      <View style={styles.content}>
        <Text style={styles.title}>Add your timetable to start matching</Text>
        <Text style={styles.subtitle}>
          Set your available hours so quick match can find better partners.
        </Text>

        <Pressable
          style={styles.button}
          onPress={() => router.push("/timetable")}
        >
          <Materialsymbolscheck width={24} height={24} />
          <Text style={styles.buttonText}>Go to timetable</Text>
        </Pressable>

        <Text style={styles.caption}>
          Register now and start matching right away.
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
