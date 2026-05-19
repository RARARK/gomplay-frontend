import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Color, FontSize, LineHeight } from "../GlobalStyles";

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
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        {showBackButton ? (
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            hitSlop={8}
            onPress={handleBackPress}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={28} color="#111111" />
          </Pressable>
        ) : (
          <View style={styles.backButtonPlaceholder} />
        )}
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        <Pressable
          accessibilityLabel="Open profile"
          accessibilityRole="button"
          hitSlop={8}
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
  },
  headerRow: {
    height: 48,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonPlaceholder: {
    width: 40,
    height: 40,
  },
  title: {
    flex: 1,
    fontSize: FontSize.fs_17,
    lineHeight: LineHeight.lh_22,
    fontWeight: "700",
    color: Color.labelsPrimary,
    textAlign: "center",
  },
  myButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  myButtonText: {
    fontSize: 16,
    lineHeight: 16,
    color: "#111111",
    fontWeight: "900",
  },
});
