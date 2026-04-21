import * as React from "react";
import {
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type {
  DayOfWeek,
  UserTimetableRange,
  UserTimetableState,
} from "@/types/domain/user";
import {
  compressTimetableState,
  DAY_LABELS,
  DAY_OF_WEEKS,
  TIME_SLOTS,
  updateTimetableCell,
} from "@/utils/timetable";

type TimetableSelectorProps = {
  value: UserTimetableState;
  onChange: React.Dispatch<React.SetStateAction<UserTimetableState>>;
  onSave?: (ranges: UserTimetableRange[]) => void;
  title?: string;
  subtitle?: string;
  saveLabel?: string;
};

type TimetableCell = {
  dayOfWeek: DayOfWeek;
  slotIndex: number;
};

const GRID_GAP = 8;
const HORIZONTAL_PADDING = 16;
const FALLBACK_CELL_SIZE = 48;

const getTrackIndex = (
  coordinate: number,
  startOffset: number,
  size: number,
  gap: number,
  count: number
) => {
  if (coordinate < startOffset) {
    return null;
  }

  const step = size + gap;
  const offset = coordinate - startOffset;
  const index = Math.floor(offset / step);

  if (index < 0 || index >= count) {
    return null;
  }

  const withinCell = offset - index * step;
  return withinCell <= size ? index : null;
};

const TimetableSelector = ({
  value,
  onChange,
  onSave,
  title = "Timetable Selection",
  subtitle = "Tap or drag to select your available time blocks.",
  saveLabel = "Save",
}: TimetableSelectorProps) => {
  const [gridWidth, setGridWidth] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);

  const dragSession = React.useRef<{
    nextValue: boolean;
    visitedKeys: Set<string>;
  } | null>(null);

  const cellSize = React.useMemo(() => {
    if (gridWidth === 0) {
      return FALLBACK_CELL_SIZE;
    }

    return Math.floor((gridWidth - GRID_GAP * DAY_OF_WEEKS.length) / 6);
  }, [gridWidth]);

  const timeColumnWidth = cellSize;
  const headerHeight = cellSize;

  const getCellFromPoint = React.useCallback(
    (x: number, y: number): TimetableCell | null => {
      const slotIndex = getTrackIndex(
        y,
        headerHeight + GRID_GAP,
        cellSize,
        GRID_GAP,
        TIME_SLOTS.length
      );
      const dayIndex = getTrackIndex(
        x,
        timeColumnWidth + GRID_GAP,
        cellSize,
        GRID_GAP,
        DAY_OF_WEEKS.length
      );

      if (slotIndex === null || dayIndex === null) {
        return null;
      }

      return {
        dayOfWeek: DAY_OF_WEEKS[dayIndex],
        slotIndex,
      };
    },
    [cellSize, headerHeight, timeColumnWidth]
  );

  const applyCellValue = React.useCallback(
    (dayOfWeek: DayOfWeek, slotIndex: number, nextValue: boolean) => {
      onChange((previous) =>
        updateTimetableCell(previous, dayOfWeek, slotIndex, nextValue)
      );
    },
    [onChange]
  );

  const beginSelection = React.useCallback(
    (cell: TimetableCell) => {
      const nextValue = !value[cell.dayOfWeek][cell.slotIndex];
      dragSession.current = {
        nextValue,
        visitedKeys: new Set([`${cell.dayOfWeek}-${cell.slotIndex}`]),
      };
      setIsDragging(true);
      applyCellValue(cell.dayOfWeek, cell.slotIndex, nextValue);
    },
    [applyCellValue, value]
  );

  const extendSelection = React.useCallback(
    (cell: TimetableCell) => {
      const session = dragSession.current;

      if (!session) {
        return;
      }

      const key = `${cell.dayOfWeek}-${cell.slotIndex}`;
      if (session.visitedKeys.has(key)) {
        return;
      }

      session.visitedKeys.add(key);
      applyCellValue(cell.dayOfWeek, cell.slotIndex, session.nextValue);
    },
    [applyCellValue]
  );

  const finishSelection = React.useCallback(() => {
    dragSession.current = null;
    setIsDragging(false);
  }, []);

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => true,
        onMoveShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderGrant: (event) => {
          const cell = getCellFromPoint(
            event.nativeEvent.locationX,
            event.nativeEvent.locationY
          );

          if (cell) {
            beginSelection(cell);
          }
        },
        onPanResponderMove: (event) => {
          const cell = getCellFromPoint(
            event.nativeEvent.locationX,
            event.nativeEvent.locationY
          );

          if (cell) {
            if (!dragSession.current) {
              beginSelection(cell);
              return;
            }

            extendSelection(cell);
          }
        },
        onPanResponderRelease: finishSelection,
        onPanResponderTerminate: finishSelection,
        onPanResponderTerminationRequest: () => false,
      }),
    [beginSelection, extendSelection, finishSelection, getCellFromPoint]
  );

  const handleSave = () => {
    onSave?.(compressTimetableState(value));
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        scrollEnabled={!isDragging}
        showsVerticalScrollIndicator={false}
      >
        <View onLayout={(event) => setGridWidth(event.nativeEvent.layout.width)}>
          <View style={styles.gridShell}>
            <View style={styles.row}>
              <View
                style={[
                  styles.cornerCell,
                  styles.timeLabelCell,
                  { width: timeColumnWidth, height: headerHeight },
                ]}
              />

              {DAY_OF_WEEKS.map((dayOfWeek) => (
                <View
                  key={dayOfWeek}
                  style={[
                    styles.dayHeaderCell,
                    {
                      width: cellSize,
                      height: headerHeight,
                    },
                  ]}
                >
                  <Text style={styles.dayHeaderText}>{DAY_LABELS[dayOfWeek]}</Text>
                </View>
              ))}
            </View>

            {TIME_SLOTS.map((time, slotIndex) => (
              <View key={time} style={styles.row}>
                <View
                  style={[
                    styles.timeLabelCell,
                    {
                      width: timeColumnWidth,
                      height: cellSize,
                    },
                  ]}
                >
                  <Text style={styles.timeLabelText}>{time}</Text>
                </View>

                {DAY_OF_WEEKS.map((dayOfWeek) => {
                  const isSelected = value[dayOfWeek][slotIndex];

                  return (
                    <View
                      key={`${dayOfWeek}-${time}`}
                      style={[
                        styles.slotCell,
                        {
                          width: cellSize,
                          height: cellSize,
                        },
                        isSelected ? styles.slotCellSelected : styles.slotCellIdle,
                      ]}
                    />
                  );
                })}
              </View>
            ))}

            <View style={styles.touchOverlay} {...panResponder.panHandlers} />
          </View>
        </View>
      </ScrollView>

      <Pressable
        accessibilityRole="button"
        style={styles.saveButton}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>{saveLabel}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 20,
    paddingBottom: 24,
  },
  header: {
    gap: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700",
    color: "#111111",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#444444",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  gridShell: {
    position: "relative",
    gap: GRID_GAP,
  },
  row: {
    flexDirection: "row",
    gap: GRID_GAP,
  },
  touchOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  cornerCell: {
    borderRadius: 12,
    backgroundColor: "#d9d9d9",
  },
  dayHeaderCell: {
    borderRadius: 12,
    backgroundColor: "#d9d9d9",
    alignItems: "center",
    justifyContent: "center",
  },
  dayHeaderText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "700",
    color: "#111111",
  },
  timeLabelCell: {
    borderRadius: 12,
    backgroundColor: "#d9d9d9",
    alignItems: "center",
    justifyContent: "center",
  },
  timeLabelText: {
    fontSize: 12,
    lineHeight: 16,
    color: "#222222",
    fontWeight: "500",
  },
  slotCell: {
    borderRadius: 12,
  },
  slotCellIdle: {
    backgroundColor: "#d9d9d9",
  },
  slotCellSelected: {
    backgroundColor: "#e4f84a",
  },
  saveButton: {
    marginTop: 16,
    height: 56,
    borderRadius: 20,
    backgroundColor: "#4e5ce6",
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700",
  },
});

export default TimetableSelector;
