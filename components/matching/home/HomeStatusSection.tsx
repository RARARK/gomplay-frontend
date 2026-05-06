import * as React from "react";
import { StyleSheet, View } from "react-native";
import QuickMatchToggleNew from "./QuickMatchToggleNew";
import { HomeLayout } from "@/constants/locofyHomeStyles";
import type { HomeStatusVariant } from "@/types/ui/homeStatus";
import DefaultMatchContent from "./DefaultMatchContent";
import MatchedContent from "./MatchedContent";
import MatchedContentNew from "./MatchedContentNew";
import MatchingContent from "./MatchingContent";
import NoScheduleContent from "./NoScheduleContent";

type Props = {
  state: HomeStatusVariant;
  onToggleQuickMatch?: (value: boolean) => void;
};

const CONTENT_BY_VARIANT: Record<HomeStatusVariant, () => React.JSX.Element> = {
  Loading: () => <View style={styles.loadingPlaceholder} />,
  Default: () => <DefaultMatchContent />,
  NoSchedule: () => <NoScheduleContent />,
  Matching: () => <MatchingContent nearbyCount={7} />,
  Matched: () => <MatchedContent />,
  MatchedNew: () => <MatchedContentNew />,
};

// States whose content fits within STATUS_SLOT_HEIGHT.
// Pinning these to the same height prevents the section below from
// jumping when the user toggles quick match or schedule state changes.
const FIXED_HEIGHT_VARIANTS = new Set<HomeStatusVariant>([
  "Loading",
  "Default",
  "NoSchedule",
  "Matching",
]);

// Tallest of the fixed variants is Matching:
//   ringWrapper(192) + textBlock marginTop(24) + textBlock minHeight(180) = 396
// Default  ≈ 324  (illustration 144 + content minHeight 180)
// NoSchedule ≈ 347  (illustration 144 + title/subtitle/button/caption)
const STATUS_SLOT_HEIGHT =
  192 +                                // ring wrapper (Matching's illustration)
  24 +                                 // textBlock marginTop in Matching
  HomeLayout.statusContentMinHeight;  // 180  →  total 396

const HomeStatusSection = ({ state, onToggleQuickMatch }: Props) => {
  const isFixedSlot = FIXED_HEIGHT_VARIANTS.has(state);

  return (
    <View style={styles.homeStatusSection}>
      <View style={styles.toggleWrapper}>
        <QuickMatchToggleNew
          state={state}
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
        <View style={styles.contentInner}>
          {CONTENT_BY_VARIANT[state]()}
        </View>
      </View>
    </View>
  );
};

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
