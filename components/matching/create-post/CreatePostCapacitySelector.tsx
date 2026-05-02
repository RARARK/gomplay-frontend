import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type CreatePostCapacitySelectorProps = {
  value: number;
  onChange: (nextValue: number) => void;
  min?: number;
};

export default function CreatePostCapacitySelector({
  value,
  onChange,
  min = 1,
}: CreatePostCapacitySelectorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-outline" size={24} color="#111827" />
        <Text style={styles.label}>모집 인원</Text>
      </View>

      <View style={styles.counter}>
        <Pressable
          accessibilityRole="button"
          onPress={() => onChange(Math.max(min, value - 1))}
          style={styles.stepButton}
        >
          <Text style={styles.stepText}>-</Text>
        </Pressable>

        <Text style={styles.value}>{value}명</Text>

        <Pressable
          accessibilityRole="button"
          onPress={() => onChange(value + 1)}
          style={styles.stepButton}
        >
          <Text style={styles.stepText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    minHeight: 74,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  label: {
    fontSize: 15,
    lineHeight: 20,
    color: "#111827",
    fontWeight: "700",
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  stepButton: {
    width: 32,
    height: 32,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  stepText: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "700",
    color: "#111827",
  },
  value: {
    minWidth: 42,
    textAlign: "center",
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "700",
    color: "#111827",
  },
});
