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
  Default: () => <DefaultMatchContent />,
  NoSchedule: () => <NoScheduleContent />,
  Matching: () => <MatchingContent nearbyCount={7} />,
  Matched: () => <MatchedContent />,
  MatchedNew: () => <MatchedContentNew />,
};

const HomeStatusSection = ({ state, onToggleQuickMatch }: Props) => {
  return (
    <View style={styles.homeStatusSection}>
      <View style={styles.toggleWrapper}>
        <QuickMatchToggleNew
          state={state}
          onChange={onToggleQuickMatch}
        />
      </View>

      <View style={styles.contentViewport}>
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
    minHeight:
      HomeLayout.statusIllustrationSize + HomeLayout.statusContentMinHeight,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  contentInner: {
    width: "100%",
    alignItems: "center",
  },
});

export default HomeStatusSection;
