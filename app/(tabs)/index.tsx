import * as React from "react";
import { ScrollView, StyleSheet, Pressable } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import HomeHeader from "@/components/matching/home/HomeHeader";
import HeroBanner from "@/components/matching/home/HeroBanner";
import HomeStatusSection from "@/components/matching/home/HomeStatusSection";
import MatchSection from "@/components/matching/home/MatchSection";
import CreatePostButton from "@/assets/home/CreatePostButton.svg";

import { Color, Width } from "@/constants/locofyHomeStyles";
import type { HomeStatusVariant } from "@/types/ui/homeStatus";

export default function NewHome() {
  const insets = useSafeAreaInsets();

  const [isQuickMatchOn, setIsQuickMatchOn] = React.useState(false);

  const hasTimetable = false;
  const isMatched = false;

  const FAB_SIZE = 56;
  const FAB_OFFSET = 20;
  const FAB_EXTRA_SPACE = 12;

  const getHomeStatusVariant = (): HomeStatusVariant => {
    if (isMatched) return "Matched";
    if (isQuickMatchOn) return "Matching";
    if (!hasTimetable) return "NoSchedule";
    return "Default";
  };

  const currentState = getHomeStatusVariant();

  const handleCreatePostPress = () => {
    console.log("모집글 작성 버튼 클릭");
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <>
        <ScrollView
          style={styles.homeScreen}
          contentContainerStyle={[
            styles.scrollViewContent,
            {
              paddingBottom:
                FAB_SIZE + FAB_OFFSET + FAB_EXTRA_SPACE + insets.bottom,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <HomeHeader />
          <HeroBanner />
          <HomeStatusSection
            state={currentState}
            onToggleQuickMatch={setIsQuickMatchOn}
          />
          <MatchSection />
        </ScrollView>

        <Pressable
          onPress={handleCreatePostPress}
          style={[
            styles.fab,
            {
              right: 20,
              bottom: 20 + insets.bottom,
            },
          ]}
          hitSlop={10}
        >
          <CreatePostButton width={Width.width_56} height={56} />
        </Pressable>
      </>
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
    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: 60,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    zIndex: 999,
    elevation: 10,
  },
});
