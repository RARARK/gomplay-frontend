import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import type { CreatePostExerciseGridOption } from "@/components/matching/create-post/createPostExerciseOptions";

type CreatePostExerciseGridModalProps = {
  visible: boolean;
  title: string;
  options: readonly CreatePostExerciseGridOption[];
  selectedValue: string;
  onClose: () => void;
  onSelect: (value: string) => void;
};

export default function CreatePostExerciseGridModal({
  visible,
  title,
  options,
  selectedValue,
  onClose,
  onSelect,
}: CreatePostExerciseGridModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.dismissLayer} onPress={onClose} />

        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>닫기</Text>
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.grid}
            showsVerticalScrollIndicator={false}
          >
            {options.map((option) => {
              const isSelected = option.value === selectedValue;

              return (
                <Pressable
                  key={option.value}
                  onPress={() => {
                    onSelect(option.value);
                    onClose();
                  }}
                  style={[styles.card, isSelected && styles.cardSelected]}
                >
                  <View style={styles.iconWrap}>{option.icon}</View>
                  <Text
                    style={[
                      styles.cardLabel,
                      isSelected && styles.cardLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(17, 24, 39, 0.32)",
    justifyContent: "flex-end",
  },
  dismissLayer: {
    flex: 1,
  },
  sheet: {
    maxHeight: "72%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    color: "#111827",
    fontWeight: "800",
  },
  closeButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  closeText: {
    fontSize: 14,
    lineHeight: 18,
    color: "#6B7280",
    fontWeight: "700",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  card: {
    width: "48%",
    minHeight: 96,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  cardSelected: {
    borderColor: "#4C5BE2",
    backgroundColor: "#EEF1FF",
  },
  iconWrap: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  cardLabel: {
    fontSize: 15,
    lineHeight: 20,
    color: "#111827",
    fontWeight: "700",
    textAlign: "center",
  },
  cardLabelSelected: {
    color: "#4C5BE2",
  },
});
