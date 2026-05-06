import * as React from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Pressable, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import HomeHeader from "@/components/matching/home/HomeHeader";
import HeroBanner from "@/components/matching/home/HeroBanner";
import { homeBanners } from "@/components/matching/home/homeMockData";
import HomeStatusSection from "@/components/matching/home/HomeStatusSection";
import MatchSection from "@/components/matching/home/MatchSection";

import { useFocusEffect } from "expo-router";
import { Color } from "@/constants/locofyHomeStyles";
import { getSchedule } from "@/services/schedule/scheduleService";
import type { Banner } from "@/types/ui/homeBanner";
import type { HomeStatusVariant } from "@/types/ui/homeStatus";

export default function HomePage() {
  const insets = useSafeAreaInsets();

  const [isQuickMatchOn, setIsQuickMatchOn] = React.useState(false);
  const [forceMatchedContent, setForceMatchedContent] = React.useState(false);
  const [forceMatchedContentNew, setForceMatchedContentNew] = React.useState(false);
  const [banners] = React.useState<Banner[]>(homeBanners);

  const [hasTimetable, setHasTimetable] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      getSchedule()
        .then((ranges) => setHasTimetable(ranges.length > 0))
        .catch(() => {});
    }, [])
  );
  const isMatched = forceMatchedContent;
  const isMatchedNew = forceMatchedContentNew;

  // Reserve extra scroll space so the last section is not hidden behind the FAB.
  const FAB_SIZE = 56;
  const FAB_OFFSET = 20;
  const FAB_EXTRA_SPACE = 12;

  // Decide which home status content should be shown based on the current state.
  const getHomeStatusVariant = (): HomeStatusVariant => {
    if (isMatchedNew) return "MatchedNew";
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
          <View style={styles.testButtonRow}>
            <Pressable
              accessibilityRole="button"
              style={styles.testButton}
              onPress={() => setForceMatchedContent((value) => !value)}
            >
              <Text style={styles.testButtonText}>
                {forceMatchedContent ? "기존 끄기" : "기존 카드"}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              style={[styles.testButton, styles.testButtonNew]}
              onPress={() => setForceMatchedContentNew((value) => !value)}
            >
              <Text style={[styles.testButtonText, styles.testButtonNewText]}>
                {forceMatchedContentNew ? "새 카드 끄기" : "새 카드 (New)"}
              </Text>
            </Pressable>
          </View>
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
          <Ionicons name="add" size={34} color="#FFFFFF" />
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
    gap: 28,
  },
  testButtonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: -42,
    marginBottom: -42,
  },
  testButton: {
    minHeight: 34,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#4C5BE2",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  testButtonText: {
    fontSize: 12,
    lineHeight: 16,
    color: "#4C5BE2",
    fontWeight: "800",
  },
  testButtonNew: {
    borderColor: "#E24CB5",
  },
  testButtonNewText: {
    color: "#E24CB5",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4C5BE2",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    elevation: 10,
    shadowColor: "#4C5BE2",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
  },
});
