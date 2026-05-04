import * as React from "react";
import { LayoutAnimation, Platform, UIManager, StyleSheet, View } from "react-native";
import QuickMatchToggle from "./QuickMatchToggle";
import type { HomeStatusVariant } from "@/types/ui/homeStatus";
import DefaultMatchContent from "./DefaultMatchContent";
import MatchedContent from "./MatchedContent";
import MatchedContentNew from "./MatchedContentNew";
import MatchingContent from "./MatchingContent";
import NoScheduleContent from "./NoScheduleContent";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
  state: HomeStatusVariant;
  onToggleQuickMatch?: (value: boolean) => void;
};

const STATUS_VARIANTS: HomeStatusVariant[] = [
  "Default",
  "NoSchedule",
  "Matching",
  "Matched",
  "MatchedNew",
];

const FALLBACK_HEIGHT = 500;

const CONTENT_BY_VARIANT: Record<HomeStatusVariant, () => React.JSX.Element> = {
  Default: () => <DefaultMatchContent />,
  NoSchedule: () => <NoScheduleContent />,
  Matching: () => <MatchingContent nearbyCount={7} />,
  Matched: () => <MatchedContent />,
  MatchedNew: () => <MatchedContentNew />,
};

const HomeStatusSection = ({ state, onToggleQuickMatch }: Props) => {
  const [variantHeights, setVariantHeights] = React.useState<Record<HomeStatusVariant, number>>(
    () =>
      Object.fromEntries(
        STATUS_VARIANTS.map((v) => [v, FALLBACK_HEIGHT])
      ) as Record<HomeStatusVariant, number>
  );

  const contentHeight = variantHeights[state];
  const prevHeightRef = React.useRef(contentHeight);

  // Configure LayoutAnimation in render before the native layout change applies.
  if (contentHeight !== prevHeightRef.current) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    prevHeightRef.current = contentHeight;
  }

  const handleMeasure = React.useCallback(
    (variant: HomeStatusVariant, height: number) => {
      const ceiled = Math.ceil(height);
      setVariantHeights((prev) => {
        if (ceiled <= prev[variant]) return prev;
        return { ...prev, [variant]: ceiled };
      });
    },
    []
  );

  return (
    <View style={styles.homeStatusSection}>
      <QuickMatchToggle
        state={state}
        onChange={(value) => onToggleQuickMatch?.(value)}
      />

      <View style={[styles.contentViewport, { minHeight: contentHeight }]}>
        <View style={styles.contentInner}>
          {CONTENT_BY_VARIANT[state]()}
        </View>
      </View>

      {/* Invisible layer that measures each variant independently */}
      <View style={styles.measureLayer} pointerEvents="none">
        {STATUS_VARIANTS.map((variant) => (
          <View
            key={variant}
            style={styles.measureItem}
            onLayout={(e) =>
              handleMeasure(variant, e.nativeEvent.layout.height)
            }
          >
            {CONTENT_BY_VARIANT[variant]()}
          </View>
        ))}
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
  contentViewport: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  contentInner: {
    width: "100%",
    alignItems: "center",
  },
  measureLayer: {
    position: "absolute",
    opacity: 0,
    zIndex: -1,
  },
  measureItem: {
    width: "100%",
    alignItems: "center",
  },
});

export default HomeStatusSection;
