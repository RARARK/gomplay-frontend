import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import { Border, Color, FontFamily, FontSize } from "../GlobalStyles";

export type ChatroomProps = {
  id: string;
  name: string;
  previewMessage: string;
  timestamp: string;
  unreadCount?: number;
  onPress?: (id: string) => void;
};

export default function Chatroom({
  id,
  name,
  previewMessage,
  timestamp,
  unreadCount = 2,
  onPress,
}: ChatroomProps) {
  const handlePress = () => {
    if (onPress) {
      onPress(id);
      return;
    }

    router.push(`/chat/${encodeURIComponent(id)}`);
  };

  const avatarLabel = getAvatarLabel(name);

  return (
    <Pressable
      accessibilityLabel={`Open chat with ${name}`}
      accessibilityRole="button"
      onPress={handlePress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.content}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{avatarLabel}</Text>
        </View>

        <View style={styles.messageBlock}>
          <Text numberOfLines={1} style={styles.name}>
            {name}
          </Text>
          <Text numberOfLines={1} style={styles.previewMessage}>
            {previewMessage}
          </Text>
        </View>
      </View>

      <View style={styles.meta}>
        <Text style={styles.timestamp}>{timestamp}</Text>
        {unreadCount > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

function getAvatarLabel(name: string) {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return "?";
  }

  return trimmedName.charAt(0).toUpperCase();
}

const styles = StyleSheet.create({
  card: {
    minHeight: 100,
    borderRadius: Border.br_8,
    borderWidth: 1,
    borderColor: Color.colorSilver,
    backgroundColor: Color.colorAliceblue,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  cardPressed: {
    opacity: 0.88,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Color.primary100,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: FontSize.fs_17,
    lineHeight: 22,
    fontWeight: "700",
    fontFamily: FontFamily.inter,
    color: Color.colorWhite,
  },
  messageBlock: {
    flex: 1,
    gap: 8,
  },
  name: {
    fontSize: FontSize.fs_17,
    lineHeight: 22,
    fontWeight: "600",
    fontFamily: FontFamily.inter,
    color: Color.labelsPrimary,
  },
  previewMessage: {
    fontSize: FontSize.fs_12,
    lineHeight: 16,
    fontFamily: FontFamily.inter,
    color: Color.nuetral700,
  },
  meta: {
    alignItems: "flex-end",
    gap: 8,
  },
  timestamp: {
    fontSize: FontSize.fs_12,
    lineHeight: 16,
    fontFamily: FontFamily.inter,
    color: Color.nuetral700,
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Color.primary100,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: FontSize.fs_12,
    lineHeight: 16,
    fontWeight: "600",
    fontFamily: FontFamily.inter,
    color: Color.colorWhite,
  },
});
