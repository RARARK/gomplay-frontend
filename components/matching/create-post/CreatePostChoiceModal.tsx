import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type CreatePostChoiceModalProps<T extends string> = {
  visible: boolean;
  title: string;
  options: readonly { label: string; value: T }[];
  selectedValue: T;
  onClose: () => void;
  onSelect: (value: T) => void;
};

export default function CreatePostChoiceModal<T extends string>({
  visible,
  title,
  options,
  selectedValue,
  onClose,
  onSelect,
}: CreatePostChoiceModalProps<T>) {
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
            contentContainerStyle={styles.optionList}
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
                  style={[
                    styles.optionButton,
                    isSelected && styles.optionButtonSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
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
    maxHeight: "64%",
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
  optionList: {
    gap: 10,
  },
  optionButton: {
    minHeight: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  optionButtonSelected: {
    borderColor: "#4C5BE2",
    backgroundColor: "#EEF1FF",
  },
  optionText: {
    fontSize: 15,
    lineHeight: 20,
    color: "#111827",
    fontWeight: "600",
  },
  optionTextSelected: {
    color: "#4C5BE2",
    fontWeight: "800",
  },
});
