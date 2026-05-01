import * as React from "react";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Pressable, Text } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import HomeHeader from "@/components/matching/home/HomeHeader";
import HeroBanner from "@/components/matching/home/HeroBanner";
import { homeBanners } from "@/components/matching/home/homeMockData";
import HomeStatusSection from "@/components/matching/home/HomeStatusSection";
import MatchSection from "@/components/matching/home/MatchSection";
import CreatePostButton from "@/assets/home/CreatePostButton.svg";

import { Color, Width } from "@/constants/locofyHomeStyles";
import type { Banner } from "@/types/ui/homeBanner";
import type { HomeStatusVariant } from "@/types/ui/homeStatus";

export default function HomePage() {
  const insets = useSafeAreaInsets();

  const [isQuickMatchOn, setIsQuickMatchOn] = React.useState(false);
  const [forceMatchedContent, setForceMatchedContent] = React.useState(false);
  const [banners] = React.useState<Banner[]>(homeBanners);

  const hasTimetable = false;
  const isMatched = forceMatchedContent;

  // Reserve extra scroll space so the last section is not hidden behind the FAB.
  const FAB_SIZE = 56;
  const FAB_OFFSET = 20;
  const FAB_EXTRA_SPACE = 12;

  // Decide which home status content should be shown based on the current state.
  const getHomeStatusVariant = (): HomeStatusVariant => {
    if (isMatched) return "Matched";
    if (isQuickMatchOn) return "Matching";
    if (!hasTimetable) return "NoSchedule";
    return "Default";
  };

  const currentState = getHomeStatusVariant();

  const handleCreatePostPress = () => {
    router.push("/posts/create");
  };

  return (
    // Keep the home screen content inside the top safe area.
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
          <Pressable
            accessibilityRole="button"
            style={styles.testButton}
            onPress={() => setForceMatchedContent((value) => !value)}
          >
            <Text style={styles.testButtonText}>
              {forceMatchedContent
                ? "MatchedContent 끄기"
                : "MatchedContent 테스트"}
            </Text>
          </Pressable>
          <HeroBanner banners={banners} />

          {/* Render the status-specific content without changing the page layout. */}
          <HomeStatusSection
            state={currentState}
            onToggleQuickMatch={setIsQuickMatchOn}
          />

          <MatchSection />
        </ScrollView>

        {/* Floating action button for creating a new recruitment post. */}
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
  testButton: {
    alignSelf: "center",
    minHeight: 34,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#4C5BE2",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    marginTop: -42,
    marginBottom: -42,
  },
  testButtonText: {
    fontSize: 12,
    lineHeight: 16,
    color: "#4C5BE2",
    fontWeight: "800",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    zIndex: 999,
    elevation: 10,
  },
});
