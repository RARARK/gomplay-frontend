import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import {
  Color,
  FontSize,
  LetterSpacing,
  LineHeight,
  FontFamily,
} from "../GlobalStyles";

type ChatHeaderProps = {
  title?: string;
  onBackPress?: () => void;
};

export default function ChatHeader({
  title = "Chat Room",
  onBackPress,
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
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          hitSlop={8}
          onPress={handleBackPress}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={Color.labelsPrimary} />
        </Pressable>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      </View>
      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.colorWhite,
  },
  headerRow: {
    minHeight: 56,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    marginLeft: 8,
    fontSize: FontSize.fs_17,
    letterSpacing: LetterSpacing.ls__0_41,
    lineHeight: LineHeight.lh_22,
    fontWeight: "600",
    fontFamily: FontFamily.inter,
    color: Color.labelsPrimary,
    textAlign: "left",
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: Color.colorSilver,
  },
});
