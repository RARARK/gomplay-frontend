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
import * as React from "react";
import {
  type GestureResponderEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type TimetableSelectorProps = {
  value: UserTimetableState;
  onChange: React.Dispatch<React.SetStateAction<UserTimetableState>>;
  onSave?: (ranges: UserTimetableRange[]) => void;
  title?: string;
  subtitle?: string;
  saveLabel?: string;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
};

type TimetableCell = {
  dayOfWeek: DayOfWeek;
  slotIndex: number;
};

const GRID_GAP = 8;
const HORIZONTAL_PADDING = 16;
const FALLBACK_CELL_SIZE = 48;
const DRAG_ACTIVATION_DISTANCE = 2;
const LONG_PRESS_DELAY_MS = 220;
const AUTO_SCROLL_EDGE_DISTANCE = 72;
const AUTO_SCROLL_MAX_STEP = 22;
const AUTO_SCROLL_TICK_MS = 40;

const getTrackIndex = (
  coordinate: number,
  startOffset: number,
  size: number,
  gap: number,
  count: number,
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
  secondaryActionLabel,
  onSecondaryAction,
}: TimetableSelectorProps) => {
  const [gridWidth, setGridWidth] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);

  const dragSession = React.useRef<{
    nextValue: boolean;
    visitedKeys: Set<string>;
  } | null>(null);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const scrollViewport = React.useRef({ y: 0, height: 0 });
  const scrollOffsetY = React.useRef(0);
  const scrollContentHeight = React.useRef(0);
  const autoScrollTimer = React.useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const lastDragPoint = React.useRef<{ pageX: number; pageY: number } | null>(
    null,
  );
  const scrollFrameRef = React.useRef<View>(null);
  const gridRef = React.useRef<View>(null);
  const gridOrigin = React.useRef({ x: 0, y: 0 });
  const pendingStartCell = React.useRef<TimetableCell | null>(null);
  const longPressSelectionActive = React.useRef(false);
  const panSelectionActive = React.useRef(false);
  const suppressNextPress = React.useRef(false);
  const pressOutTimer = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

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
        TIME_SLOTS.length,
      );
      const dayIndex = getTrackIndex(
        x,
        timeColumnWidth + GRID_GAP,
        cellSize,
        GRID_GAP,
        DAY_OF_WEEKS.length,
      );

      if (slotIndex === null || dayIndex === null) {
        return null;
      }

      return {
        dayOfWeek: DAY_OF_WEEKS[dayIndex],
        slotIndex,
      };
    },
    [cellSize, headerHeight, timeColumnWidth],
  );

  const applyCellValue = React.useCallback(
    (dayOfWeek: DayOfWeek, slotIndex: number, nextValue: boolean) => {
      onChange((previous) =>
        updateTimetableCell(previous, dayOfWeek, slotIndex, nextValue),
      );
    },
    [onChange],
  );

  const beginSelection = React.useCallback(
    (cell: TimetableCell) => {
      if (dragSession.current) {
        return;
      }

      const nextValue = !value[cell.dayOfWeek][cell.slotIndex];
      dragSession.current = {
        nextValue,
        visitedKeys: new Set([`${cell.dayOfWeek}-${cell.slotIndex}`]),
      };
      setIsDragging(true);
      applyCellValue(cell.dayOfWeek, cell.slotIndex, nextValue);
    },
    [applyCellValue, value],
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
    [applyCellValue],
  );

  const finishSelection = React.useCallback(() => {
    dragSession.current = null;
    longPressSelectionActive.current = false;
    panSelectionActive.current = false;
    pendingStartCell.current = null;
    setIsDragging(false);
  }, []);

  const clearPressOutTimer = React.useCallback(() => {
    if (pressOutTimer.current) {
      clearTimeout(pressOutTimer.current);
      pressOutTimer.current = null;
    }
  }, []);

  const stopAutoScroll = React.useCallback(() => {
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
      autoScrollTimer.current = null;
    }
  }, []);

  const measureScrollView = React.useCallback(() => {
    scrollFrameRef.current?.measureInWindow((_x, y, _width, height) => {
      scrollViewport.current = { y, height };
    });
  }, []);

  const measureGrid = React.useCallback(() => {
    gridRef.current?.measureInWindow((x, y) => {
      gridOrigin.current = { x, y };
    });
  }, []);

  const rememberStartCell = React.useCallback((cell: TimetableCell) => {
    pendingStartCell.current = cell;
  }, []);

  const handleCellLongPress = React.useCallback(
    (cell: TimetableCell) => {
      measureScrollView();
      measureGrid();
      longPressSelectionActive.current = true;
      suppressNextPress.current = true;
      pendingStartCell.current = cell;
      beginSelection(cell);
    },
    [beginSelection, measureGrid, measureScrollView],
  );

  const extendSelectionAtPagePoint = React.useCallback(
    (pageX: number, pageY: number) => {
      if (!longPressSelectionActive.current || !dragSession.current) {
        return;
      }

      const cell = getCellFromPoint(
        pageX - gridOrigin.current.x,
        pageY - gridOrigin.current.y,
      );

      if (cell) {
        extendSelection(cell);
      }
    },
    [extendSelection, getCellFromPoint],
  );

  const getAutoScrollStep = React.useCallback((pageY: number) => {
    const { y, height } = scrollViewport.current;
    if (height <= 0) {
      return 0;
    }

    const topDistance = pageY - y;
    const bottomDistance = y + height - pageY;

    if (bottomDistance < AUTO_SCROLL_EDGE_DISTANCE) {
      const ratio =
        (AUTO_SCROLL_EDGE_DISTANCE - Math.max(bottomDistance, 0)) /
        AUTO_SCROLL_EDGE_DISTANCE;
      return Math.max(4, Math.ceil(ratio * AUTO_SCROLL_MAX_STEP));
    }

    if (topDistance < AUTO_SCROLL_EDGE_DISTANCE) {
      const ratio =
        (AUTO_SCROLL_EDGE_DISTANCE - Math.max(topDistance, 0)) /
        AUTO_SCROLL_EDGE_DISTANCE;
      return -Math.max(4, Math.ceil(ratio * AUTO_SCROLL_MAX_STEP));
    }

    return 0;
  }, []);

  const performAutoScrollStep = React.useCallback(() => {
    const point = lastDragPoint.current;
    if (!point || !longPressSelectionActive.current || !dragSession.current) {
      stopAutoScroll();
      return;
    }

    const step = getAutoScrollStep(point.pageY);
    if (step === 0) {
      stopAutoScroll();
      return;
    }

    const maxOffset = Math.max(
      scrollContentHeight.current - scrollViewport.current.height,
      0,
    );
    const previousOffset = scrollOffsetY.current;
    const nextOffset = Math.min(
      Math.max(previousOffset + step, 0),
      maxOffset,
    );

    if (nextOffset === previousOffset) {
      return;
    }

    scrollOffsetY.current = nextOffset;
    gridOrigin.current.y -= nextOffset - previousOffset;
    scrollViewRef.current?.scrollTo({ y: nextOffset, animated: false });
    extendSelectionAtPagePoint(point.pageX, point.pageY);
    requestAnimationFrame(() => {
      measureGrid();
    });
  }, [extendSelectionAtPagePoint, getAutoScrollStep, measureGrid, stopAutoScroll]);

  const updateAutoScroll = React.useCallback(
    (pageX: number, pageY: number) => {
      lastDragPoint.current = { pageX, pageY };

      if (getAutoScrollStep(pageY) === 0) {
        stopAutoScroll();
        return;
      }

      if (!autoScrollTimer.current) {
        autoScrollTimer.current = setInterval(
          performAutoScrollStep,
          AUTO_SCROLL_TICK_MS,
        );
      }
    },
    [getAutoScrollStep, performAutoScrollStep, stopAutoScroll],
  );

  const extendSelectionFromEvent = React.useCallback(
    (event: GestureResponderEvent) => {
      const { pageX, pageY } = event.nativeEvent;

      extendSelectionAtPagePoint(pageX, pageY);
      updateAutoScroll(pageX, pageY);
    },
    [extendSelectionAtPagePoint, updateAutoScroll],
  );

  const handleCellTouchMove = React.useCallback(
    (event: GestureResponderEvent) => {
      extendSelectionFromEvent(event);
    },
    [extendSelectionFromEvent],
  );

  const handleCellPressOut = React.useCallback(() => {
    clearPressOutTimer();

    pressOutTimer.current = setTimeout(() => {
      if (!panSelectionActive.current) {
        if (longPressSelectionActive.current && dragSession.current) {
          stopAutoScroll();
          finishSelection();
        }
      }
    }, 80);
  }, [clearPressOutTimer, finishSelection, stopAutoScroll]);

  const handleCellPress = React.useCallback(
    (dayOfWeek: DayOfWeek, slotIndex: number, isSelected: boolean) => {
      if (suppressNextPress.current) {
        suppressNextPress.current = false;
        return;
      }

      applyCellValue(dayOfWeek, slotIndex, !isSelected);
    },
    [applyCellValue],
  );

  const cellPanResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onStartShouldSetPanResponderCapture: () => false,
        onMoveShouldSetPanResponder: (_event, gestureState) => {
          if (!longPressSelectionActive.current || !dragSession.current) {
            return false;
          }

          return (
            Math.abs(gestureState.dx) > DRAG_ACTIVATION_DISTANCE ||
            Math.abs(gestureState.dy) > DRAG_ACTIVATION_DISTANCE
          );
        },
        onMoveShouldSetPanResponderCapture: (_event, gestureState) => {
          if (!longPressSelectionActive.current || !dragSession.current) {
            return false;
          }

          return (
            Math.abs(gestureState.dx) > DRAG_ACTIVATION_DISTANCE ||
            Math.abs(gestureState.dy) > DRAG_ACTIVATION_DISTANCE
          );
        },
        onPanResponderGrant: () => {
          clearPressOutTimer();
          panSelectionActive.current = true;
        },
        onPanResponderMove: extendSelectionFromEvent,
        onPanResponderRelease: () => {
          clearPressOutTimer();
          stopAutoScroll();
          finishSelection();
        },
        onPanResponderTerminate: () => {
          clearPressOutTimer();
          stopAutoScroll();
          finishSelection();
        },
        onPanResponderTerminationRequest: () => false,
      }),
    [clearPressOutTimer, extendSelectionFromEvent, finishSelection, stopAutoScroll],
  );

  React.useEffect(
    () => () => {
      clearPressOutTimer();
      stopAutoScroll();
    },
    [clearPressOutTimer, stopAutoScroll],
  );

  const handleScroll = React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollOffsetY.current = event.nativeEvent.contentOffset.y;
    },
    [],
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

      <View
        ref={scrollFrameRef}
        style={styles.scrollFrame}
        onLayout={measureScrollView}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          scrollEnabled={!isDragging}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          onContentSizeChange={(_width, height) => {
            scrollContentHeight.current = height;
          }}
          scrollEventThrottle={16}
        >
          <View
            onLayout={(event) => {
              setGridWidth(event.nativeEvent.layout.width);
              measureGrid();
            }}
          >
            <View
              ref={gridRef}
              style={styles.gridShell}
              onLayout={measureGrid}
            >
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
                    <Text style={styles.dayHeaderText}>
                      {DAY_LABELS[dayOfWeek]}
                    </Text>
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
                    const cell = { dayOfWeek, slotIndex };

                    return (
                      <View
                        key={`${dayOfWeek}-${time}`}
                        style={[
                          styles.slotCell,
                          {
                            width: cellSize,
                            height: cellSize,
                          },
                          isSelected
                            ? styles.slotCellSelected
                            : styles.slotCellIdle,
                        ]}
                        onTouchMove={handleCellTouchMove}
                        {...cellPanResponder.panHandlers}
                      >
                        <Pressable
                          accessibilityRole="button"
                          delayLongPress={LONG_PRESS_DELAY_MS}
                          onPressIn={() => {
                            measureGrid();
                            rememberStartCell(cell);
                          }}
                          onPress={() =>
                            handleCellPress(dayOfWeek, slotIndex, isSelected)
                          }
                          onLongPress={() => handleCellLongPress(cell)}
                          onPressOut={handleCellPressOut}
                          style={styles.slotPressable}
                        />
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>

      <Pressable
        accessibilityRole="button"
        style={styles.saveButton}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>{saveLabel}</Text>
      </Pressable>

      {secondaryActionLabel && onSecondaryAction ? (
        <Pressable
          accessibilityRole="button"
          onPress={onSecondaryAction}
          style={styles.secondaryAction}
        >
          <Text style={styles.secondaryActionText}>{secondaryActionLabel}</Text>
        </Pressable>
      ) : null}
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
  scrollFrame: {
    flex: 1,
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
    overflow: "hidden",
  },
  slotPressable: {
    flex: 1,
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
  secondaryAction: {
    marginTop: 14,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 28,
  },
  secondaryActionText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",
    color: "#6B7280",
    textAlign: "center",
  },
});

export default TimetableSelector;
