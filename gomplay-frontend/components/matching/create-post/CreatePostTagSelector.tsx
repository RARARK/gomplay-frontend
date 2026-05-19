import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type CreatePostTagSelectorProps = {
  options: readonly string[];
  selectedTags: string[];
  maxSelectable: number;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onToggleTag: (tag: string) => void;
};

export default function CreatePostTagSelector({
  options,
  selectedTags,
  maxSelectable,
  isExpanded,
  onToggleExpanded,
  onToggleTag,
}: CreatePostTagSelectorProps) {
  const selectedCount = selectedTags.length;

  return (
    <View style={styles.container}>
      <Pressable onPress={onToggleExpanded} style={styles.triggerButton}>
        <Text style={styles.triggerLabel}>태그 등록</Text>
        <Text style={styles.triggerCaption}>
          {selectedCount}/{maxSelectable}
        </Text>
      </Pressable>

      {selectedCount > 0 ? (
        <View style={styles.selectedTagRow}>
          {selectedTags.map((tag) => (
            <View key={tag} style={styles.selectedTagChip}>
              <Text style={styles.selectedTagText}>{tag}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {isExpanded ? (
        <View style={styles.optionWrap}>
          {options.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            const isDisabled = !isSelected && selectedCount >= maxSelectable;

            return (
              <Pressable
                key={tag}
                disabled={isDisabled}
                onPress={() => onToggleTag(tag)}
                style={[
                  styles.optionChip,
                  isSelected && styles.optionChipSelected,
                  isDisabled && styles.optionChipDisabled,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                    isDisabled && styles.optionTextDisabled,
                  ]}
                >
                  {tag}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  triggerButton: {
    alignSelf: "flex-start",
    minHeight: 38,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#4C5BE2",
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#EEF1FF",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  triggerLabel: {
    fontSize: 14,
    lineHeight: 18,
    color: "#4C5BE2",
    fontWeight: "700",
  },
  triggerCaption: {
    fontSize: 12,
    lineHeight: 16,
    color: "#6B7280",
    fontWeight: "600",
  },
  selectedTagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  selectedTagChip: {
    borderRadius: 999,
    backgroundColor: "#4C5BE2",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  selectedTagText: {
    fontSize: 12,
    lineHeight: 16,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  optionWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  optionChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#D7DCEA",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  optionChipSelected: {
    borderColor: "#4C5BE2",
    backgroundColor: "#EEF1FF",
  },
  optionChipDisabled: {
    backgroundColor: "#F3F4F6",
    borderColor: "#E5E7EB",
  },
  optionText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#374151",
    fontWeight: "600",
  },
  optionTextSelected: {
    color: "#4C5BE2",
  },
  optionTextDisabled: {
    color: "#9CA3AF",
  },
});
