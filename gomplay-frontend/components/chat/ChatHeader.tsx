import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Color } from "../GlobalStyles";

type ChatHeaderProps = {
  title?: string;
  onBackPress?: () => void;
  showBackButton?: boolean;
};

export default function ChatHeader({
  title = "Chat Room",
  onBackPress,
  showBackButton = true,
}: ChatHeaderProps) {
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }

    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/" as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        {showBackButton ? (
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            hitSlop={10}
            onPress={handleBackPress}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={28} color="#111111" />
          </Pressable>
        ) : (
          <View style={styles.backButtonPlaceholder} />
        )}
        <Text pointerEvents="none" numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        <Pressable
          accessibilityLabel="Open profile"
          accessibilityRole="button"
          onPress={() => router.push("/mypage" as any)}
          style={styles.myButton}
        >
          <Text style={styles.myButtonText}>MY</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.colorWhite,
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  headerRow: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  backButtonPlaceholder: {
    width: 40,
    height: 40,
  },
  title: {
    position: "absolute",
    left: 0,
    right: 0,
    alignSelf: "center",
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },
  myButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  myButtonText: {
    fontSize: 16,
    lineHeight: 18,
    color: "#111111",
    fontWeight: "900",
  },
});
