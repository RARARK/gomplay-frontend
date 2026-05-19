import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MyPageScreen from "@/components/profile/MyPageScreen";

export default function MyPageRoute() {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <MyPageScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
