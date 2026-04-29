import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type CreatePostDetailCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  onPress?: () => void;
};

export default function CreatePostDetailCard({
  icon,
  label,
  value,
  onPress,
}: CreatePostDetailCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={!onPress}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.iconWrapper}>{icon}</View>
      <View style={styles.textBlock}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    minHeight: 76,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  textBlock: {
    flex: 1,
    gap: 4,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    color: "#6B7280",
    fontWeight: "600",
  },
  value: {
    fontSize: 15,
    lineHeight: 20,
    color: "#111827",
    fontWeight: "700",
  },
});
