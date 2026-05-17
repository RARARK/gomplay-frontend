import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useChatStore } from "@/stores/chat/chatStore";
import MatchRequestToast from "@/components/matching/toast/MatchRequestToast";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const chatRooms = useChatStore((state) => state.chatRooms);

  const totalUnread = React.useMemo(
    () => chatRooms.reduce((sum, room) => sum + room.unreadMessageCount, 0),
    [chatRooms],
  );
  const chatBadge = totalUnread > 0 ? (totalUnread > 99 ? "99+" : totalUnread) : undefined;

  const screenOptions = React.useCallback(
    ({ route }: { route: { name: string } }) => ({
      headerShown: false,
      tabBarActiveTintColor: "#4C5BE2",
      tabBarInactiveTintColor: "#999",
      tabBarStyle: {
        height: 60 + insets.bottom,
        paddingBottom: Math.max(insets.bottom, 6),
        paddingTop: 6,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        marginBottom: 2,
      },
      tabBarIcon: ({ color, size, focused }: { color: string; size: number; focused: boolean }) => {
        let iconName: keyof typeof Ionicons.glyphMap;

        if (route.name === "index") {
          iconName = focused ? "home" : "home-outline";
        } else if (route.name === "match") {
          iconName = focused ? "flash" : "flash-outline";
        } else if (route.name === "chat") {
          iconName = focused ? "chatbubble" : "chatbubble-outline";
        } else if (route.name === "partner") {
          iconName = focused ? "list" : "list-outline";
        } else {
          iconName = "ellipse";
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
    }),
    [insets.bottom],
  );

  return (
    <View style={{ flex: 1 }}>
      <Tabs screenOptions={screenOptions}>
        <Tabs.Screen name="index" options={{ title: "홈" }} />
        <Tabs.Screen name="partner" options={{ title: "모집" }} />
        <Tabs.Screen name="match" options={{ title: "매칭현황" }} />
        <Tabs.Screen name="chat" options={{ title: "채팅", tabBarBadge: chatBadge }} />
      </Tabs>
      <MatchRequestToast />
    </View>
  );
}
