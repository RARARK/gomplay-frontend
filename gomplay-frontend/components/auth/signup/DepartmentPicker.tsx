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
  college: string;
  value: string;
  onChange: (value: string) => void;
  errorMessage?: string;
  disabled?: boolean;
};

export default function DepartmentPicker({
  college,
  value,
  onChange,
  errorMessage,
  disabled,
}: Props) {
  const [visible, setVisible] = React.useState(false);

  const departments =
    dankookJukjeon.find((c) => c.college === college)?.departments ?? [];

  const isLocked = !college || disabled;

  const open = () => {
    if (isLocked) return;
    setVisible(true);
  };
  const close = () => setVisible(false);

  const handleSelect = (dept: string) => {
    onChange(dept);
    close();
  };

  return (
    <View style={styles.field}>
      <Text style={styles.label}>학과</Text>
      <Pressable
        accessibilityRole="button"
        onPress={open}
        style={[
          styles.input,
          errorMessage ? styles.inputError : null,
          isLocked && styles.inputDisabled,
        ]}
      >
        <Text style={[styles.inputText, !value && styles.placeholder]} numberOfLines={1}>
          {value || (college ? "학과 선택" : "단과대학을 먼저 선택해주세요")}
        </Text>
        <Ionicons name="chevron-down" size={16} color={isLocked ? "#C9C9C9" : "#9CA3AF"} />
      </Pressable>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
        <View style={styles.overlay}>
          <Pressable style={styles.backdrop} onPress={close} />
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <View style={styles.sheetHeader}>
              <View style={styles.headerBtn} />
              <View style={styles.titleWrap}>
                <Text style={styles.sheetCollege}>{college}</Text>
                <Text style={styles.sheetTitle}>학과 선택</Text>
              </View>
              <Pressable hitSlop={10} onPress={close} style={styles.headerBtn}>
                <Ionicons name="close" size={20} color="#111827" />
              </Pressable>
            </View>

            <FlatList
              data={departments}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const selected = value === item;
                return (
                  <Pressable
                    style={[styles.item, selected && styles.itemSelected]}
                    onPress={() => handleSelect(item)}
                  >
                    <Text style={[styles.itemText, selected && styles.itemTextSelected]} numberOfLines={2}>
                      {item}
                    </Text>
                    {selected && (
                      <Ionicons name="checkmark-circle" size={20} color="#4C5BE2" />
                    )}
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
  titleWrap: { flex: 1, alignItems: "center" },
  sheetCollege: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "600",
    color: "#4C5BE2",
  },
  sheetTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "700",
    color: "#111827",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 10,
  },
  itemSelected: { backgroundColor: "#F0F1FF" },
  itemText: { flex: 1, fontSize: 14, lineHeight: 20, color: "#111827", fontWeight: "500", fontFamily: "System" },
  itemTextSelected: { color: "#4C5BE2", fontWeight: "700" },
  separator: { height: 1, backgroundColor: "#F9FAFB", marginHorizontal: 20 },
});
