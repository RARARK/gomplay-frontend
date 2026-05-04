import * as React from "react";
import { View, StyleSheet } from "react-native";
import QuickMatchToggle from "./QuickMatchToggle";
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

const STATUS_VARIANTS: HomeStatusVariant[] = [
  "Default",
  "NoSchedule",
  "Matching",
  "Matched",
  "MatchedNew",
];

const FALLBACK_CONTENT_HEIGHT = 520;

const CONTENT_BY_VARIANT: Record<HomeStatusVariant, () => React.JSX.Element> = {
  Default: () => <DefaultMatchContent />,
  NoSchedule: () => <NoScheduleContent />,
  Matching: () => <MatchingContent nearbyCount={7} />,
  Matched: () => <MatchedContent />,
  MatchedNew: () => <MatchedContentNew />,
};

const HomeStatusSection = ({ state, onToggleQuickMatch }: Props) => {
  const [contentHeight, setContentHeight] = React.useState(
    FALLBACK_CONTENT_HEIGHT,
  );

  const handleMeasure = (height: number) => {
    setContentHeight((previous) => Math.max(previous, Math.ceil(height)));
  };

  const renderContent = (variant: HomeStatusVariant) =>
    CONTENT_BY_VARIANT[variant]();

  return (
    <View style={styles.homeStatusSection}>
      <QuickMatchToggle
        state={state}
        onChange={(value) => onToggleQuickMatch?.(value)}
      />

      <View style={[styles.contentViewport, { minHeight: contentHeight }]}>
        <View style={styles.contentInner}>{renderContent(state)}</View>
      </View>

      <View style={styles.measureLayer} pointerEvents="none">
        {STATUS_VARIANTS.map((variant) => (
          <View
            key={variant}
            style={styles.measureItem}
            onLayout={(event) => handleMeasure(event.nativeEvent.layout.height)}
          >
            {renderContent(variant)}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  homeStatusSection: {
    width: "100%",
    paddingVertical: 17,
    gap: 16,
    alignItems: "center",
  },
  contentViewport: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  contentInner: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
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
