import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PartnerMatchingScreen from "@/components/matching/partner/PartnerMatchingScreen";

export default function PartnerRoute() {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <PartnerMatchingScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
