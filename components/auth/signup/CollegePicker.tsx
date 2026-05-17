import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { dankookJukjeon } from "./dankookDepartments";

type Props = {
  value: string;
  onChange: (college: string) => void;
  errorMessage?: string;
  disabled?: boolean;
};

export default function CollegePicker({ value, onChange, errorMessage, disabled }: Props) {
  const [visible, setVisible] = React.useState(false);

  const open = () => { if (!disabled) setVisible(true); };
  const close = () => setVisible(false);

  const handleSelect = (college: string) => {
    onChange(college);
    close();
  };

  return (
    <View style={styles.field}>
      <Text style={styles.label}>단과대학</Text>
      <Pressable
        accessibilityRole="button"
        onPress={open}
        style={[
          styles.input,
          errorMessage ? styles.inputError : null,
          disabled && styles.inputDisabled,
        ]}
      >
        <Text style={[styles.inputText, !value && styles.placeholder]} numberOfLines={1}>
          {value || "단과대학 선택"}
        </Text>
        <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
      </Pressable>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
        <View style={styles.overlay}>
          <Pressable style={styles.backdrop} onPress={close} />
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <View style={styles.sheetHeader}>
              <View style={styles.headerBtn} />
              <Text style={styles.sheetTitle}>단과대학 선택</Text>
              <Pressable hitSlop={10} onPress={close} style={styles.headerBtn}>
                <Ionicons name="close" size={20} color="#111827" />
              </Pressable>
            </View>

            <FlatList
              data={dankookJukjeon}
              keyExtractor={(item) => item.college}
              renderItem={({ item }) => {
                const selected = value === item.college;
                return (
                  <Pressable
                    style={[styles.item, selected && styles.itemSelected]}
                    onPress={() => handleSelect(item.college)}
                  >
                    <View style={styles.itemContent}>
                      <Text style={[styles.itemText, selected && styles.itemTextSelected]}>
                        {item.college}
                      </Text>
                      <Text style={styles.itemSub}>{item.departments.length}개 학과</Text>
                    </View>
                    {selected
                      ? <Ionicons name="checkmark-circle" size={20} color="#4C5BE2" />
                      : <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
                    }
                  </Pressable>
                );
              }}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { width: "100%", gap: 8 },
  label: {
    fontSize: 11,
    lineHeight: 13,
    letterSpacing: 0.07,
    color: "#111827",
    fontFamily: "System",
  },
  input: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 15,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },
  inputDisabled: { opacity: 0.5 },
  inputError: { borderColor: "#FF3B30" },
  inputText: { flex: 1, fontSize: 14, color: "#111827", fontFamily: "System", marginRight: 8 },
  placeholder: { color: "#5C5A63" },
  errorText: { fontSize: 11, lineHeight: 15, color: "#FF3B30", fontFamily: "System", marginTop: -4 },

  overlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.4)" },
  backdrop: { ...StyleSheet.absoluteFillObject },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "70%",
    paddingBottom: 32,
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: "#E5E7EB",
    alignSelf: "center",
    marginTop: 12, marginBottom: 4,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  sheetTitle: {
    flex: 1, fontSize: 16, lineHeight: 22, fontWeight: "700",
    color: "#111827", textAlign: "center",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  itemSelected: { backgroundColor: "#F0F1FF" },
  itemContent: { flex: 1 },
  itemText: { fontSize: 14, lineHeight: 20, color: "#111827", fontWeight: "500", fontFamily: "System" },
  itemTextSelected: { color: "#4C5BE2", fontWeight: "700" },
  itemSub: { fontSize: 11, lineHeight: 16, color: "#9CA3AF", marginTop: 2 },
  separator: { height: 1, backgroundColor: "#F9FAFB", marginHorizontal: 20 },
});
