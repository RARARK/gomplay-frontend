import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MatchStatusScreen from "@/components/matching/status/MatchStatusScreen";

export default function MatchScreen() {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <MatchStatusScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
