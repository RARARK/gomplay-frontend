import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { Color } from "../GlobalStyles";

type ChatHeaderProps = {
  title?: string;
  onBackPress?: () => void;
  showBackButton?: boolean;
  onPressMenu?: () => void;
  showMenuButton?: boolean;
  /** 다른 탭(홈/탐색/매칭현황)과 같은 우측 상단 MY(마이페이지) 버튼 */
  showMyButton?: boolean;
};

export default function ChatHeader({
  title = "Chat Room",
  onBackPress,
  showBackButton = true,
  onPressMenu,
  showMenuButton = true,
  showMyButton = false,
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
    <View style={[styles.container, showMyButton && styles.tabRootContainer]}>
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
        ) : null}
        <Text pointerEvents="none" numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        {showMenuButton ? (
          <Pressable
            accessibilityLabel="Open chat menu"
            accessibilityRole="button"
            onPress={onPressMenu}
            style={styles.menuButton}
          >
            <Ionicons name="menu-outline" size={28} color="#111827" />
          </Pressable>
        ) : null}
        {showMyButton ? (
          <Pressable
            accessibilityLabel="Open profile"
            accessibilityRole="button"
            onPress={() => router.push("/mypage" as any)}
            style={styles.myButton}
          >
            <Text style={styles.myButtonText}>MY</Text>
          </Pressable>
        ) : null}
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
  // 탭 루트 화면(채팅 목록)에서는 다른 탭 헤더와 MY 버튼 위치를 맞춘다 (홈/탐색/매칭현황 paddingTop 8)
  tabRootContainer: {
    paddingTop: 8,
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
  title: {
    flex: 1,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "800",
    color: "#111827",
  },
  menuButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
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
