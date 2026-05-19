import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

type CreatePostCalendarModalProps = {
  visible: boolean;
  selectedDate: string;
  minDate: string;
  onClose: () => void;
  onSelectDate: (dateString: string) => void;
};

export default function CreatePostCalendarModal({
  visible,
  selectedDate,
  minDate,
  onClose,
  onSelectDate,
}: CreatePostCalendarModalProps) {
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
            <Text style={styles.title}>날짜 선택</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>닫기</Text>
            </Pressable>
          </View>

          <Calendar
            current={selectedDate}
            minDate={minDate}
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: "#4C5BE2",
              },
            }}
            onDayPress={(day) => {
              onSelectDate(day.dateString);
              onClose();
            }}
            theme={{
              calendarBackground: "#FFFFFF",
              textSectionTitleColor: "#6B7280",
              selectedDayBackgroundColor: "#4C5BE2",
              selectedDayTextColor: "#FFFFFF",
              todayTextColor: "#4C5BE2",
              dayTextColor: "#111827",
              monthTextColor: "#111827",
              arrowColor: "#4C5BE2",
              textDayFontWeight: "600",
              textMonthFontWeight: "800",
              textDayHeaderFontWeight: "700",
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(17, 24, 39, 0.32)",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  dismissLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 16,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
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
});
