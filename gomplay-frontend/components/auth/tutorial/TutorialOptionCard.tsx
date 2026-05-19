import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type TutorialOptionCardProps = {
  icon: React.ReactNode;
  label: string;
  selected: boolean;
  onPress: () => void;
  centered?: boolean;
};

export default function TutorialOptionCard({
  icon,
  label,
  selected,
  onPress,
  centered = true,
}: TutorialOptionCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.card,
        centered ? styles.cardCentered : styles.cardStart,
        selected && styles.cardSelected,
      ]}
    >
      <View style={styles.iconWrapper}>{icon}</View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    minHeight: 84,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#F2F2F2",
    paddingHorizontal: 14,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "#FFFFFF",
  },
  cardCentered: {
    alignItems: "center",
    justifyContent: "center",
  },
  cardStart: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  cardSelected: {
    borderColor: "#4C5BE2",
    backgroundColor: "#F7F8FF",
  },
  iconWrapper: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    flexShrink: 1,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "600",
    color: "#111827",
    fontFamily: "System",
    textAlign: "center",
  },
});
