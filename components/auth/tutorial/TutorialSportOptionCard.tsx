import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type TutorialSportOptionCardProps = {
  icon: React.ReactNode;
  label: string;
  selected: boolean;
  onPress: () => void;
};

export default function TutorialSportOptionCard({
  icon,
  label,
  selected,
  onPress,
}: TutorialSportOptionCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.card, selected && styles.cardSelected]}
    >
      <View style={styles.content}>
        <View style={styles.iconWrapper}>{icon}</View>
        <Text style={styles.label}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    minHeight: 142,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ECECEC",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  cardSelected: {
    borderColor: "#4C5BE2",
    backgroundColor: "#F7F8FF",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  iconWrapper: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "700",
    color: "#111111",
    fontFamily: "System",
  },
});
