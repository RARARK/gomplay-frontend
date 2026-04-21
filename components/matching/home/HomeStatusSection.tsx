import * as React from "react";
import { View, StyleSheet } from "react-native";
import QuickMatchToggle from "./QuickMatchToggle";
import type { HomeStatusVariant } from "@/types/ui/homeStatus";

import NoScheduleContent from "./NoScheduleContent";
import MatchingContent from "./MatchingContent";
import DefaultMatch from "./DefaultMatchContent";
import StateMatched from "./MatchedContent";

type Props = {
  state: HomeStatusVariant;
  onToggleQuickMatch?: (value: boolean) => void;
};

const HomeStatusSection = ({ state, onToggleQuickMatch }: Props) => {
  const renderContent = () => {
    switch (state) {
      case "NoSchedule":
        return <NoScheduleContent />;

      case "Matching":
        return <MatchingContent nearbyCount={7} />;

      case "Matched":
        return <StateMatched />;

      case "Default":
        return <DefaultMatch />;

      default:
        return null;
    }
  };

  return (
    <View style={styles.homestatussection}>
      <QuickMatchToggle
        state={state}
        onChange={(value) => onToggleQuickMatch?.(value)}
      />
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  homestatussection: {
    width: "100%",
    paddingVertical: 17,
    gap: 16,
    alignItems: "center",
  },
});

export default HomeStatusSection;
