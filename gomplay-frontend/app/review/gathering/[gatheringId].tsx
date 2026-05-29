import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import GatheringReviewScreen from "@/components/review/GatheringReviewScreen";

export default function GatheringReviewRoute() {
  const { gatheringId } = useLocalSearchParams<{ gatheringId: string }>();
  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <GatheringReviewScreen gatheringId={Number(gatheringId) || 0} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: "#fff" } });
