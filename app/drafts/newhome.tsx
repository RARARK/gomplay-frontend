import * as React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import HomeHeader from "@/components/matching/home/HomeHeader";
import HeroBanner from "@/components/matching/home/HeroBanner";
import HomeStatusSection from "@/components/matching/home/HomeStatusSection";
import MatchSection from "@/components/matching/home/MatchSection";
import CreatePostButton from "@/assets/home/CreatePostButton.svg";

import { Color, Width } from "@/constants/locofyHomeStyles";
import type { HomeStatusVariant } from "@/types/ui/homeStatus";

export default function NewHome() {
  // 👉 여기서 상태 정의 (나중엔 zustand로 바꿔도 됨)
  const hasTimetable = false;
  const isQuickMatchOn = false;
  const isMatched = false;

  // 👉 상태 → UI variant 변환 함수
  const getHomeStatusVariant = (): HomeStatusVariant => {
    if (isMatched) return "Matched";
    if (isQuickMatchOn) return "Matching";
    if (!hasTimetable) return "Default"; // NoSchedule
    return "Default";
  };

  const currentState = getHomeStatusVariant();

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <ScrollView
        style={styles.homeScreen}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader />
        <HeroBanner />

        <View style={styles.homeStatusArea}>
          <HomeStatusSection state={currentState} />

          <CreatePostButton
            style={styles.createPostButtonIcon}
            width={Width.width_56}
            height={56}
          />
        </View>

        <MatchSection />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  homeScreen: {
    flex: 1,
    width: "100%",
    backgroundColor: Color.colorWhite,
    maxWidth: "100%",
  },
  scrollViewContent: {
    flexDirection: "column",
    paddingBottom: 56,
    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: 60,
  },
  homeStatusArea: {
    width: Width.width_402,
    height: 371,
    position: "relative",
  },
  createPostButtonIcon: {
    position: "absolute",
    top: 297,
    left: 331,
    width: Width.width_56,
    height: 56,
    zIndex: 1,
  },
});
