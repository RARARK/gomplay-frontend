import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";

import {
  HOUR_OPTIONS,
  MINUTE_OPTIONS,
  formatCreatePostTimeRangeLabel,
} from "@/components/matching/create-post/createPostUtils";

type CreatePostTimeRangeModalProps = {
  visible: boolean;
  startAt: Date;
  endAt: Date;
  onClose: () => void;
  onConfirm: (
    startHour: number,
    startMinute: number,
    endHour: number,
    endMinute: number,
  ) => void;
};

export default function CreatePostTimeRangeModal({
  visible,
  startAt,
  endAt,
  onClose,
  onConfirm,
}: CreatePostTimeRangeModalProps) {
  const [startHour, setStartHour] = React.useState(startAt.getHours());
  const [startMinute, setStartMinute] = React.useState(startAt.getMinutes());
  const [endHour, setEndHour] = React.useState(endAt.getHours());
  const [endMinute, setEndMinute] = React.useState(endAt.getMinutes());

  React.useEffect(() => {
    if (!visible) {
      return;
    }

    setStartHour(startAt.getHours());
    setStartMinute(startAt.getMinutes());
    setEndHour(endAt.getHours());
    setEndMinute(endAt.getMinutes());
  }, [endAt, startAt, visible]);

  const isInvalidRange =
    endHour * 60 + endMinute <= startHour * 60 + startMinute;

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
            <Text style={styles.title}>시간 선택</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>닫기</Text>
            </Pressable>
          </View>

          <Text style={styles.previewText}>
            {formatCreatePostTimeRangeLabel(
              new Date(0, 0, 0, startHour, startMinute),
              new Date(0, 0, 0, endHour, endMinute),
            )}
          </Text>

          <View style={styles.pickerGrid}>
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>시작 시</Text>
              <Picker
                selectedValue={startHour}
                onValueChange={(value) => setStartHour(Number(value))}
              >
                {HOUR_OPTIONS.map((hour) => (
                  <Picker.Item
                    key={`start-hour-${hour}`}
                    label={`${`${hour}`.padStart(2, "0")}시`}
                    value={hour}
                  />
                ))}
              </Picker>
            </View>

            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>시작 분</Text>
              <Picker
                selectedValue={startMinute}
                onValueChange={(value) => setStartMinute(Number(value))}
              >
                {MINUTE_OPTIONS.map((minute) => (
                  <Picker.Item
                    key={`start-minute-${minute}`}
                    label={`${`${minute}`.padStart(2, "0")}분`}
                    value={minute}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.pickerGrid}>
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>종료 시</Text>
              <Picker
                selectedValue={endHour}
                onValueChange={(value) => setEndHour(Number(value))}
              >
                {HOUR_OPTIONS.map((hour) => (
                  <Picker.Item
                    key={`end-hour-${hour}`}
                    label={`${`${hour}`.padStart(2, "0")}시`}
                    value={hour}
                  />
                ))}
              </Picker>
            </View>

            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>종료 분</Text>
              <Picker
                selectedValue={endMinute}
                onValueChange={(value) => setEndMinute(Number(value))}
              >
                {MINUTE_OPTIONS.map((minute) => (
                  <Picker.Item
                    key={`end-minute-${minute}`}
                    label={`${`${minute}`.padStart(2, "0")}분`}
                    value={minute}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {isInvalidRange ? (
            <Text style={styles.errorText}>
              종료 시간은 시작 시간보다 이후여야 합니다.
            </Text>
          ) : null}

          <Pressable
            disabled={isInvalidRange}
            onPress={() => {
              onConfirm(startHour, startMinute, endHour, endMinute);
              onClose();
            }}
            style={[
              styles.confirmButton,
              isInvalidRange && styles.confirmButtonDisabled,
            ]}
          >
            <Text style={styles.confirmButtonText}>적용하기</Text>
          </Pressable>
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
  previewText: {
    fontSize: 16,
    lineHeight: 22,
    color: "#4C5BE2",
    fontWeight: "800",
    textAlign: "center",
  },
  pickerGrid: {
    flexDirection: "row",
    gap: 12,
  },
  pickerColumn: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    paddingTop: 10,
    overflow: "hidden",
  },
  pickerLabel: {
    fontSize: 13,
    lineHeight: 18,
    color: "#6B7280",
    fontWeight: "700",
    textAlign: "center",
  },
  errorText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#E53935",
    fontWeight: "600",
    textAlign: "center",
  },
  confirmButton: {
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: "#4C5BE2",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonDisabled: {
    backgroundColor: "#B5BDEB",
  },
  confirmButtonText: {
    fontSize: 16,
    lineHeight: 22,
    color: "#FFFFFF",
    fontWeight: "800",
  },
});
