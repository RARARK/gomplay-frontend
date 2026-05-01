import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  checkIn,
  getAttendanceStatus,
} from "@/services/attendance/attendanceService";
import { useAuthStore } from "@/stores/auth/authStore";
import type { AttendanceStatus } from "@/types/domain/attendance";

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function parseDateParts(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return { year: y, month: m, day: d };
}

export default function AttendanceScreen() {
  const { user } = useAuthStore();
  const today = new Date();

  const [status, setStatus] = React.useState<AttendanceStatus | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isCheckingIn, setIsCheckingIn] = React.useState(false);
  const [viewYear, setViewYear] = React.useState(today.getFullYear());
  const [viewMonth, setViewMonth] = React.useState(today.getMonth());

  const loadStatus = React.useCallback(async () => {
    try {
      const data = await getAttendanceStatus(user?.id ?? 0);
      setStatus(data);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  React.useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  const handleCheckIn = async () => {
    if (isCheckingIn || status?.todayCheckedIn) return;
    setIsCheckingIn(true);
    try {
      const result = await checkIn(user?.id ?? 0);
      setStatus((prev) =>
        prev
          ? {
              ...prev,
              todayCheckedIn: true,
              checkedInDates: [...prev.checkedInDates, result.serverDate],
              totalPoints: result.totalPoints,
            }
          : prev,
      );
    } catch {
      await loadStatus();
    } finally {
      setIsCheckingIn(false);
    }
  };

  const serverParts = status
    ? parseDateParts(status.serverDate)
    : { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };

  const checkedInSet = new Set(status?.checkedInDates ?? []);
  const isCurrentMonth =
    viewYear === serverParts.year && viewMonth === serverParts.month - 1;

  const firstDay = getFirstDayOfWeek(viewYear, viewMonth);
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);

  const cells: (number | null)[] = [
    ...Array<null>(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (isCurrentMonth) return;
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const isToday = (day: number) =>
    isCurrentMonth && day === serverParts.day;

  const isCheckedIn = (day: number) => {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return checkedInSet.has(dateStr);
  };

  const monthCheckedCount = cells.filter(
    (day) => day !== null && isCheckedIn(day),
  ).length;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* 헤더 */}
      <View style={styles.headerRow}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#111111" />
        </Pressable>
        <Text style={styles.headerTitle}>출석 체크</Text>
        <View style={styles.headerSpacer} />
      </View>

      {isLoading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color="#4C5BE2" size="large" />
        </View>
      ) : (
        <>
          {/* 포인트 카드 */}
          <View style={styles.pointsCard}>
            <View style={styles.pointsRow}>
              <View>
                <Text style={styles.pointsLabel}>누적 출석 포인트</Text>
                <Text style={styles.pointsValue}>
                  {status?.totalPoints ?? 0}
                  <Text style={styles.pointsUnit}>P</Text>
                </Text>
              </View>
              <View style={styles.pointsBadge}>
                <Ionicons name="star" size={16} color="#F59E0B" />
                <Text style={styles.pointsBadgeText}>+10P / 출석</Text>
              </View>
            </View>
          </View>

          {/* 캘린더 카드 */}
          <View style={styles.calendarCard}>
            {/* 월 네비게이션 */}
            <View style={styles.calendarHeader}>
              <Pressable onPress={goToPrevMonth} style={styles.monthNavBtn}>
                <Ionicons name="chevron-back" size={20} color="#374151" />
              </Pressable>
              <View style={styles.monthLabelGroup}>
                <Text style={styles.monthLabel}>
                  {viewYear}년 {viewMonth + 1}월
                </Text>
                <Text style={styles.monthSubLabel}>
                  {monthCheckedCount}일 출석
                </Text>
              </View>
              <Pressable
                onPress={goToNextMonth}
                style={styles.monthNavBtn}
                disabled={isCurrentMonth}
              >
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={isCurrentMonth ? "#D1D5DB" : "#374151"}
                />
              </Pressable>
            </View>

            {/* 요일 헤더 */}
            <View style={styles.dayHeaders}>
              {DAY_LABELS.map((d, i) => (
                <Text
                  key={d}
                  style={[
                    styles.dayHeaderText,
                    i === 0 && styles.sundayText,
                  ]}
                >
                  {d}
                </Text>
              ))}
            </View>

            {/* 날짜 그리드 */}
            <View style={styles.calendarGrid}>
              {cells.map((day, idx) => {
                if (day === null) {
                  return <View key={`empty-${idx}`} style={styles.dayCell} />;
                }
                const todayCell = isToday(day);
                const checked = isCheckedIn(day);
                const isSunday = idx % 7 === 0;
                return (
                  <View key={day} style={styles.dayCell}>
                    <View
                      style={[
                        styles.dayCircle,
                        todayCell && !checked && styles.dayCirToday,
                        checked && styles.dayCirChecked,
                      ]}
                    >
                      {checked ? (
                        <Ionicons name="checkmark" size={15} color="#FFFFFF" />
                      ) : (
                        <Text
                          style={[
                            styles.dayText,
                            todayCell && styles.dayTextToday,
                            isSunday && styles.sundayText,
                          ]}
                        >
                          {day}
                        </Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* 출석 체크 버튼 */}
          <Pressable
            accessibilityRole="button"
            style={[
              styles.checkInButton,
              status?.todayCheckedIn && styles.checkInButtonDone,
            ]}
            onPress={handleCheckIn}
            disabled={status?.todayCheckedIn || isCheckingIn}
          >
            {isCheckingIn ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : status?.todayCheckedIn ? (
              <>
                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                <Text style={styles.checkInButtonText}>오늘 출석 완료!</Text>
              </>
            ) : (
              <>
                <Ionicons name="calendar-outline" size={20} color="#FFFFFF" />
                <Text style={styles.checkInButtonText}>출석 체크하기</Text>
              </>
            )}
          </Pressable>

          <Text style={styles.notice}>
            출석 체크는 서버 기준 하루 1회만 가능해요.
          </Text>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
    gap: 16,
  },

  /* 헤더 */
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    lineHeight: 28,
    color: "#111827",
    fontWeight: "800",
  },
  headerSpacer: {
    width: 40,
  },

  loadingBox: {
    minHeight: 400,
    alignItems: "center",
    justifyContent: "center",
  },

  /* 포인트 카드 */
  pointsCard: {
    backgroundColor: "#4C5BE2",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  pointsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pointsLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "600",
    marginBottom: 4,
  },
  pointsValue: {
    fontSize: 36,
    color: "#FFFFFF",
    fontWeight: "900",
    lineHeight: 42,
  },
  pointsUnit: {
    fontSize: 20,
    fontWeight: "700",
  },
  pointsBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pointsBadgeText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "700",
  },

  /* 캘린더 카드 */
  calendarCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    gap: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  monthNavBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  monthLabelGroup: {
    alignItems: "center",
    gap: 2,
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },
  monthSubLabel: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "600",
  },

  dayHeaders: {
    flexDirection: "row",
  },
  dayHeaderText: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },
  sundayText: {
    color: "#EF4444",
  },

  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: `${100 / 7}%` as `${number}%`,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCirToday: {
    borderWidth: 2,
    borderColor: "#4C5BE2",
  },
  dayCirChecked: {
    backgroundColor: "#4C5BE2",
  },
  dayText: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
  },
  dayTextToday: {
    color: "#4C5BE2",
    fontWeight: "800",
  },

  /* 출석 버튼 */
  checkInButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 54,
    borderRadius: 14,
    backgroundColor: "#4C5BE2",
    elevation: 3,
    shadowColor: "#4C5BE2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  checkInButtonDone: {
    backgroundColor: "#9CA3AF",
    elevation: 0,
    shadowOpacity: 0,
  },
  checkInButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  notice: {
    textAlign: "center",
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
});
