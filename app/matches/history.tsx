import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MatchHistoryScreen from "@/components/matching/history/MatchHistoryScreen";

export default function MatchHistoryRoute() {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <MatchHistoryScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
