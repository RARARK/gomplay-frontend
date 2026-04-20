import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={({ route }) => ({
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
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "index") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "match") {
            iconName = focused ? "flash" : "flash-outline";
          } else if (route.name === "chat") {
            iconName = focused ? "chatbubble" : "chatbubble-outline";
          } else if (route.name === "partner") {
            iconName = focused ? "people" : "people-outline";
          } else {
            iconName = "ellipse";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "홈" }} />
      <Tabs.Screen name="match" options={{ title: "매칭현황" }} />
      <Tabs.Screen name="chat" options={{ title: "채팅" }} />
      <Tabs.Screen name="partner" options={{ title: "파트너찾기" }} />
    </Tabs>
  );
}
