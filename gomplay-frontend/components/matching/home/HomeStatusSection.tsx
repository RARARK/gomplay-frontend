import * as React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import QuickMatchToggleNew from "./QuickMatchToggleNew";
import { HomeLayout } from "@/constants/locofyHomeStyles";
import type { HomeStatusVariant } from "@/types/ui/homeStatus";
import type { PartnerCardProps } from "@/types/ui/homeCards";
import DefaultMatchContent from "./DefaultMatchContent";
import MatchedContentNew from "./MatchedContentNew";
import MatchingContent from "./MatchingContent";
import NoScheduleContent from "./NoScheduleContent";

type Props = {
  state: HomeStatusVariant;
  isQuickMatchOn?: boolean;
  onToggleQuickMatch?: (value: boolean) => void;
  candidates?: PartnerCardProps[];
  newCardPartners?: PartnerCardProps[];
  isToggleDisabled?: boolean;
  noMoreCandidates?: boolean;
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

function renderContent(
  state: HomeStatusVariant,
  candidates: PartnerCardProps[],
  newCardPartners: PartnerCardProps[] | undefined,
  noMoreCandidates: boolean,
) {
  switch (state) {
    case "Matched":
      return <MatchedContentNew partners={candidates.length > 0 ? candidates : undefined} />;
    case "MatchedNew":
      return <MatchedContentNew partners={newCardPartners} />;
    case "Matching":
      return (
        <MatchingContent
          nearbyCount={candidates.length || 7}
          exhausted={noMoreCandidates}
        />
      );
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
  newCardPartners,
  isToggleDisabled,
  noMoreCandidates = false,
}: Props) {
  const isFixedSlot = FIXED_HEIGHT_VARIANTS.has(state);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const prevState = React.useRef(state);
  const content = React.useMemo(
    () => renderContent(state, candidates, newCardPartners, noMoreCandidates),
    [state, candidates, newCardPartners, noMoreCandidates],
  );
  const freeNowCount = newCardPartners?.length ?? candidates.length;

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
          disabled={isToggleDisabled}
        />
      </View>

      {state === "MatchedNew" && (
        <View style={styles.discoveryBanner}>
          <View style={styles.discoveryIcon}>
            <Ionicons name="flash" size={23} color="#FFFFFF" />
          </View>
          <Text style={styles.discoveryText}>
            현재 공강 중인 사람{" "}
            <Text style={styles.discoveryCount}>{freeNowCount}명</Text>
            {" "}발견!
          </Text>
        </View>
      )}

      <View
        style={[
          styles.contentViewport,
          isFixedSlot
            ? styles.contentViewportFixed
            : styles.contentViewportAuto,
        ]}
      >
        <Animated.View style={[styles.contentInner, { opacity: fadeAnim }]}>
          {content}
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
  discoveryBanner: {
    width: "92%",
    minHeight: 54,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#ECECF6",
    paddingLeft: 13,
    paddingRight: 18,
    marginTop: 4,
    marginBottom: -4,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  discoveryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#5B5EF2",
    alignItems: "center",
    justifyContent: "center",
  },
  discoveryText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "900",
    color: "#67677F",
  },
  discoveryCount: {
    color: "#5B5EF2",
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
