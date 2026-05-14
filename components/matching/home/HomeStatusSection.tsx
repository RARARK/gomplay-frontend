import * as React from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import QuickMatchToggleNew from "./QuickMatchToggleNew";
import { HomeLayout } from "@/constants/locofyHomeStyles";
import type { HomeStatusVariant } from "@/types/ui/homeStatus";
import type { PartnerCardProps } from "@/types/ui/homeCards";
import DefaultMatchContent from "./DefaultMatchContent";
import MatchedContent from "./MatchedContent";
import MatchedContentNew from "./MatchedContentNew";
import MatchingContent from "./MatchingContent";
import NoScheduleContent from "./NoScheduleContent";

type Props = {
  state: HomeStatusVariant;
  isQuickMatchOn?: boolean;
  onToggleQuickMatch?: (value: boolean) => void;
  candidates?: PartnerCardProps[];
};

// States whose content fits within STATUS_SLOT_HEIGHT.
// Pinning these to the same height prevents the section below from
// jumping when the user toggles quick match or schedule state changes.
const FIXED_HEIGHT_VARIANTS = new Set<HomeStatusVariant>([
  "Loading",
  "Default",
  "NoSchedule",
  "Matching",
  "MatchingFound",
]);

// Tallest of the fixed variants is Matching:
//   ringWrapper(192) + textBlock marginTop(24) + textBlock minHeight(180) = 396
// Default  ≈ 324  (illustration 144 + content minHeight 180)
// NoSchedule ≈ 347  (illustration 144 + title/subtitle/button/caption)
const STATUS_SLOT_HEIGHT =
  192 +                                // ring wrapper (Matching's illustration)
  24 +                                 // textBlock marginTop in Matching
  HomeLayout.statusContentMinHeight;  // 180  →  total 396

function renderContent(state: HomeStatusVariant, candidates: PartnerCardProps[]) {
  switch (state) {
    case "Matched":
      return <MatchedContent partners={candidates.length > 0 ? candidates : undefined} />;
    case "MatchedNew":
      return <MatchedContentNew />;
    case "Matching":
      return <MatchingContent nearbyCount={candidates.length || 7} />;
    case "MatchingFound":
      return <MatchingContent nearbyCount={candidates.length || 7} isFound />;
    case "NoSchedule":
      return <NoScheduleContent />;
    case "Default":
      return <DefaultMatchContent />;
    default:
      return <View style={styles.loadingPlaceholder} />;
  }
}

const HomeStatusSection = React.memo(function HomeStatusSection({
  state,
  isQuickMatchOn,
  onToggleQuickMatch,
  candidates = [],
}: Props) {
  const isFixedSlot = FIXED_HEIGHT_VARIANTS.has(state);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const prevState = React.useRef(state);

  React.useEffect(() => {
    if (prevState.current === state) return;
    prevState.current = state;

    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [state, fadeAnim]);

  return (
    <View style={styles.homeStatusSection}>
      <View style={styles.toggleWrapper}>
        <QuickMatchToggleNew
          state={state}
          isOn={isQuickMatchOn}
          onChange={onToggleQuickMatch}
        />
      </View>

      <View
        style={[
          styles.contentViewport,
          isFixedSlot
            ? styles.contentViewportFixed
            : styles.contentViewportAuto,
        ]}
      >
        <Animated.View style={[styles.contentInner, { opacity: fadeAnim }]}>
          {renderContent(state, candidates)}
        </Animated.View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  homeStatusSection: {
    width: "100%",
    paddingTop: 17,
    paddingBottom: 8,
    gap: 16,
    alignItems: "center",
  },
  toggleWrapper: {
    width: "100%",
    paddingHorizontal: 16,
  },
  contentViewport: {
    width: "100%",
    alignItems: "center",
  },
  // Reserved slot for Default / NoSchedule / Matching.
  // All three fit within STATUS_SLOT_HEIGHT so the section below
  // never shifts when toggling between these states.
  contentViewportFixed: {
    height: STATUS_SLOT_HEIGHT,
    justifyContent: "flex-start",
    overflow: "hidden",
  },
  // Matched / MatchedNew contain partner cards (~500px+) — let them
  // size naturally rather than forcing an artificially tall fixed slot.
  contentViewportAuto: {
    justifyContent: "flex-start",
  },
  contentInner: {
    width: "100%",
    alignItems: "center",
  },
  loadingPlaceholder: {
    minHeight: 220,
    width: "100%",
  },
});

export default HomeStatusSection;
