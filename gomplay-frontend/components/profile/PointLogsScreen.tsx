import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { getPointLogs } from "@/services/point/pointService";
import { getMyProfile } from "@/services/user/userService";
import { useUserStore } from "@/stores/user/userStore";
import type { PointLog, PointLogReason } from "@/types/domain/point";

import POINT_BEAR from "../../assets/home/pointbear.png";

const PRIMARY = "#4C5BE2";

type ReasonConfig = {
  label: string;
  iconName: string;
  iconFamily: "ion" | "material";
  iconBg: string;
  iconColor: string;
};

const REASON_CONFIG: Record<PointLogReason, ReasonConfig> = {
  signup: {
    label: "가입 보너스",
    iconName: "gift-outline",
    iconFamily: "ion",
    iconBg: "#F3E8FF",
    iconColor: "#9333EA",
  },
  quick_match: {
    label: "퀵 매치 시작",
    iconName: "flash",
    iconFamily: "ion",
    iconBg: "#FEE2E2",
    iconColor: "#EF4444",
  },
  gathering: {
    label: "모집글 등록",
    iconName: "document-text",
    iconFamily: "ion",
    iconBg: "#DCFCE7",
    iconColor: "#16A34A",
  },
  attendance: {
    label: "출석 체크",
    iconName: "calendar-check",
    iconFamily: "material",
    iconBg: "#DBEAFE",
    iconColor: "#2563EB",
  },
  review: {
    label: "리뷰 작성",
    iconName: "create-outline",
    iconFamily: "ion",
    iconBg: "#DCFCE7",
    iconColor: "#16A34A",
  },
  no_show: {
    label: "노쇼",
    iconName: "close-circle",
    iconFamily: "ion",
    iconBg: "#FEE2E2",
    iconColor: "#EF4444",
  },
  first_match: {
    label: "첫 매칭 완료",
    iconName: "star-outline",
    iconFamily: "ion",
    iconBg: "#FEF3C7",
    iconColor: "#D97706",
  },
  match_complete: {
    label: "운동 완료",
    iconName: "run-fast",
    iconFamily: "material",
    iconBg: "#DCFCE7",
    iconColor: "#16A34A",
  },
  exercise_complete: {
    label: "운동 완료",
    iconName: "run-fast",
    iconFamily: "material",
    iconBg: "#DCFCE7",
    iconColor: "#16A34A",
  },
  review_detail: {
    label: "상세 후기 작성",
    iconName: "create-outline",
    iconFamily: "ion",
    iconBg: "#DCFCE7",
    iconColor: "#16A34A",
  },
  recommendation_refresh: {
    label: "추천 새로고침",
    iconName: "refresh-outline",
    iconFamily: "ion",
    iconBg: "#F3F4F6",
    iconColor: "#6B7280",
  },
  post_boost: {
    label: "모집글 부스트",
    iconName: "rocket-outline",
    iconFamily: "ion",
    iconBg: "#F3E8FF",
    iconColor: "#7C3AED",
  },
  mutual_review: {
    label: "상호 리뷰 완료",
    iconName: "people-outline",
    iconFamily: "ion",
    iconBg: "#DCFCE7",
    iconColor: "#16A34A",
  },
};

const TABS = [
  { key: "all", label: "전체 내역" },
  { key: "earned", label: "획득 내역" },
  { key: "spent", label: "사용 내역" },
] as const;

const USAGE_ITEMS = [
  {
    key: "quick",
    name: "퀵 매치 시작",
    icon: "flash",
    iconBg: "#EEF2FF",
    iconColor: PRIMARY,
    cost: "10P",
    costColor: PRIMARY,
    desc: "빠르게 운동 파트너 찾기",
    onPress: () => router.push("/(tabs)" as any),
  },
  {
    key: "boost",
    name: "모집글 부스트",
    icon: "rocket-outline",
    iconBg: "#F3E8FF",
    iconColor: "#7C3AED",
    cost: "30P",
    costColor: "#7C3AED",
    desc: "더 많은 사람에게 노출",
    onPress: () => router.push("/(tabs)/partner" as any),
  },
];

const EARN_GUIDE = [
  { action: "회원가입", point: 100 },
  { action: "첫 매칭 완료", point: 30 },
  { action: "운동 완료", point: 4 },
  { action: "리뷰 작성", point: 2 },
  { action: "모집글 등록", point: 2 },
  { action: "출석", point: 1 },
];

const POINT_SPEND_GUIDE = [
  { action: "퀵 매치", point: -10 },
  { action: "모집글 부스트", point: -30 },
];

type Tab = (typeof TABS)[number]["key"];

function getWeekRange() {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const formatShort = (date: Date) =>
    `${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;

  return {
    start: monday,
    end: sunday,
    label: `${formatShort(monday)} - ${formatShort(sunday)}`,
  };
}

function formatDate(iso: string) {
  const date = new Date(iso);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${month}.${day} ${hours}:${minutes}`;
}

function formatPoint(value: number, withPlus = false) {
  const prefix = withPlus && value > 0 ? "+" : "";
  return `${prefix}${value.toLocaleString("ko-KR")}P`;
}

function LogIcon({ reason }: { reason: PointLogReason }) {
  const cfg = REASON_CONFIG[reason] ?? FALLBACK_CONFIG;

  return (
    <View style={[styles.logIcon, { backgroundColor: cfg.iconBg }]}>
      {cfg.iconFamily === "ion" ? (
        <Ionicons name={cfg.iconName as any} size={20} color={cfg.iconColor} />
      ) : (
        <MaterialCommunityIcons
          name={cfg.iconName as any}
          size={20}
          color={cfg.iconColor}
        />
      )}
    </View>
  );
}

const FALLBACK_CONFIG: ReasonConfig = {
  label: "포인트 변동",
  iconName: "ellipse-outline",
  iconFamily: "ion",
  iconBg: "#F3F4F6",
  iconColor: "#6B7280",
};

function LogItem({ item }: { item: PointLog }) {
  const isPositive = item.delta >= 0;
  const cfg = REASON_CONFIG[item.reason] ?? FALLBACK_CONFIG;

  return (
    <View style={styles.logItem}>
      <LogIcon reason={item.reason} />
      <View style={styles.logContent}>
        <Text style={styles.logLabel}>{cfg.label}</Text>
        <Text style={styles.logDate}>{formatDate(item.createdAt)}</Text>
      </View>
      <Text style={[styles.logDelta, isPositive ? styles.deltaPos : styles.deltaNeg]}>
        {formatPoint(item.delta, true)}
      </Text>
    </View>
  );
}

export default function PointLogsScreen() {
  const profile = useUserStore((state) => state.profile);
  const setProfile = useUserStore((state) => state.setProfile);
  const [logs, setLogs] = useState<PointLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("all");
  const [showAll, setShowAll] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [week, setWeek] = useState(() => getWeekRange());

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      setWeek(getWeekRange());
      setLoading(true);
      setError(null);

      Promise.allSettled([getPointLogs(), getMyProfile()])
        .then(([logsResult, profileResult]) => {
          if (!isActive) return;

          if (logsResult.status === "fulfilled") {
            setLogs(logsResult.value ?? []);
          } else {
            const reason = logsResult.reason;
            setError(
              reason instanceof Error
                ? reason.message
                : "포인트 내역을 불러올 수 없습니다.",
            );
          }

          if (profileResult.status === "fulfilled") {
            setProfile(profileResult.value);
          }
        })
        .finally(() => {
          if (isActive) setLoading(false);
        });

      return () => {
        isActive = false;
      };
    }, [setProfile]),
  );

  const sortedLogs = useMemo(
    () =>
      [...logs].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [logs],
  );

  const visibleLogs = useMemo(
    () => sortedLogs.filter((log) => log.reason !== "recommendation_refresh"),
    [sortedLogs],
  );

  const latestBalanceSnapshot = visibleLogs[0]?.balanceSnapshot;
  const balance = profile?.pointBalance ?? latestBalanceSnapshot ?? 0;

  const { weekEarned, weekSpent } = useMemo(() => {
    const weekLogs = visibleLogs.filter((log) => {
      const createdAt = new Date(log.createdAt);
      return createdAt >= week.start && createdAt <= week.end;
    });

    return {
      weekEarned: weekLogs
        .filter((log) => log.delta > 0)
        .reduce((sum, log) => sum + log.delta, 0),
      weekSpent: weekLogs
        .filter((log) => log.delta < 0)
        .reduce((sum, log) => sum + log.delta, 0),
    };
  }, [visibleLogs, week]);

  const weekNet = weekEarned + weekSpent;

  const filteredLogs = useMemo(() => {
    if (tab === "earned") return visibleLogs.filter((log) => log.delta > 0);
    if (tab === "spent") return visibleLogs.filter((log) => log.delta < 0);
    return visibleLogs;
  }, [tab, visibleLogs]);

  const displayedLogs = showAll ? filteredLogs : filteredLogs.slice(0, 6);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable hitSlop={8} style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </Pressable>
        <Text style={styles.headerTitle}>포인트 내역</Text>
        <Pressable hitSlop={8} style={styles.guideBtn} onPress={() => setShowGuide(true)}>
          <Text style={styles.guideText}>포인트 가이드</Text>
          <View style={styles.guideCircle}>
            <Text style={styles.guideQ}>?</Text>
          </View>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.card, styles.balanceCard]}>
          <View style={styles.balanceLeft}>
            <Text style={styles.balanceLabel}>현재 보유 포인트</Text>
            <Text style={styles.balanceValue}>{formatPoint(balance)}</Text>
            <View style={styles.weekBadge}>
              <Text style={styles.weekBadgeText}>
                이번 주 {formatPoint(weekNet, true)}
              </Text>
              <Ionicons
                name={weekNet >= 0 ? "chevron-up" : "chevron-down"}
                size={12}
                color={PRIMARY}
              />
            </View>
            <Text style={styles.balanceDesc}>
              {"실제 포인트 내역과 프로필 정보를\n기준으로 표시하고 있어요."}
            </Text>
          </View>
          <Image source={POINT_BEAR} style={styles.mascotImage} contentFit="contain" />
        </View>

        <View style={styles.card}>
          <View style={styles.weekHeader}>
            <Text style={styles.cardTitle}>이번 주 포인트 요약</Text>
            <Text style={styles.weekRange}>{week.label}</Text>
          </View>
          <View style={styles.weekStats}>
            <View style={styles.weekStat}>
              <View style={[styles.statIcon, { backgroundColor: "#DCFCE7" }]}>
                <Text style={[styles.statIconText, { color: "#16A34A" }]}>+</Text>
              </View>
              <Text style={styles.statLabel}>획득</Text>
              <Text style={[styles.statValue, { color: "#16A34A" }]}>
                {formatPoint(weekEarned, true)}
              </Text>
            </View>
            <View style={styles.weekStat}>
              <View style={[styles.statIcon, { backgroundColor: "#FEE2E2" }]}>
                <Text style={[styles.statIconText, { color: "#EF4444" }]}>-</Text>
              </View>
              <Text style={styles.statLabel}>사용</Text>
              <Text style={[styles.statValue, { color: "#EF4444" }]}>
                {formatPoint(weekSpent)}
              </Text>
            </View>
            <View style={styles.weekStat}>
              <View style={[styles.statIcon, { backgroundColor: "#EEF2FF" }]}>
                <Text style={[styles.statIconText, { color: PRIMARY }]}>=</Text>
              </View>
              <Text style={styles.statLabel}>증감</Text>
              <Text style={[styles.statValue, { color: PRIMARY }]}>
                {formatPoint(weekNet, true)}
              </Text>
            </View>
            <View style={styles.weekStat}>
              <View style={[styles.statIcon, { backgroundColor: "#F3E8FF" }]}>
                <Text style={[styles.statIconText, { color: "#7C3AED" }]}>P</Text>
              </View>
              <Text style={styles.statLabel}>보유</Text>
              <Text style={[styles.statValue, { color: "#7C3AED" }]}>
                {formatPoint(balance)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={[styles.cardTitle, { marginBottom: 14 }]}>포인트 사용하기</Text>
          <View style={styles.usageRow}>
            {USAGE_ITEMS.map((item) => (
              <Pressable key={item.key} style={styles.usageCard} onPress={item.onPress}>
                <View style={[styles.usageIconBox, { backgroundColor: item.iconBg }]}>
                  <Ionicons name={item.icon as any} size={22} color={item.iconColor} />
                </View>
                <View style={styles.usageNameRow}>
                  <Text style={styles.usageName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Ionicons name="chevron-forward" size={11} color="#9CA3AF" />
                </View>
                <Text style={[styles.usageCost, { color: item.costColor }]}>
                  {item.cost}
                </Text>
                <Text style={styles.usageDesc}>{item.desc}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={[styles.card, styles.historyCard]}>
          <View style={styles.tabRow}>
            {TABS.map(({ key, label }) => (
              <Pressable
                key={key}
                style={[styles.tabItem, tab === key && styles.tabActive]}
                onPress={() => {
                  setTab(key);
                  setShowAll(false);
                }}
              >
                <Text style={[styles.tabLabel, tab === key && styles.tabLabelActive]}>
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>

          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={PRIMARY} />
            </View>
          ) : error ? (
            <View style={styles.center}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : displayedLogs.length === 0 ? (
            <View style={styles.center}>
              <Text style={styles.emptyText}>포인트 내역이 없어요</Text>
            </View>
          ) : (
            <>
              <View style={styles.logList}>
                {displayedLogs.map((item, index) => (
                  <React.Fragment key={item.id}>
                    {index > 0 && <View style={styles.separator} />}
                    <LogItem item={item} />
                  </React.Fragment>
                ))}
              </View>
              {!showAll && filteredLogs.length > 6 ? (
                <Pressable style={styles.showMore} onPress={() => setShowAll(true)}>
                  <Text style={styles.showMoreText}>더 많은 내역 보기</Text>
                  <Ionicons name="chevron-down" size={14} color="#6B7280" />
                </Pressable>
              ) : null}
            </>
          )}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      <Modal
        visible={showGuide}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGuide(false)}
      >
        <Pressable style={styles.guideOverlay} onPress={() => setShowGuide(false)}>
          <Pressable style={styles.guideSheet} onPress={() => {}}>
            <View style={styles.guideHandle} />
            <View style={styles.guideSheetHeader}>
              <Text style={styles.guideSheetTitle}>포인트 가이드</Text>
              <Pressable onPress={() => setShowGuide(false)} hitSlop={12}>
                <Ionicons name="close" size={22} color="#6B7280" />
              </Pressable>
            </View>

            <Text style={styles.guideSectionLabel}>포인트 획득</Text>
            <View style={styles.guideTable}>
              {EARN_GUIDE.map((row, index) => (
                <View
                  key={row.action}
                  style={[styles.guideRow, index % 2 === 1 && styles.guideRowAlt]}
                >
                  <Text style={styles.guideRowAction}>{row.action}</Text>
                  <Text style={styles.guideRowEarn}>+{row.point}P</Text>
                </View>
              ))}
            </View>

            <Text style={[styles.guideSectionLabel, { marginTop: 20 }]}>
              포인트 소비
            </Text>
            <View style={styles.guideTable}>
              {POINT_SPEND_GUIDE.map((row, index) => (
                <View
                  key={row.action}
                  style={[styles.guideRow, index % 2 === 1 && styles.guideRowAlt]}
                >
                  <Text style={styles.guideRowAction}>{row.action}</Text>
                  <Text style={styles.guideRowSpend}>{row.point}P</Text>
                </View>
              ))}
            </View>

            <Text style={styles.guideNote}>* 포인트 정책은 변경될 수 있습니다.</Text>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backBtn: {
    width: 32,
    height: 32,
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },
  guideBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  guideText: {
    fontSize: 13,
    color: PRIMARY,
    fontWeight: "500",
  },
  guideCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  guideQ: {
    fontSize: 10,
    color: PRIMARY,
    fontWeight: "700",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  historyCard: {
    padding: 0,
    overflow: "hidden",
  },
  balanceCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  balanceLeft: {
    flex: 1,
    gap: 8,
  },
  balanceLabel: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  balanceValue: {
    fontSize: 36,
    fontWeight: "800",
    color: PRIMARY,
  },
  weekBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  weekBadgeText: {
    fontSize: 12,
    color: PRIMARY,
    fontWeight: "600",
  },
  balanceDesc: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 18,
  },
  mascotImage: {
    marginLeft: 8,
    width: 120,
    height: 180,
    paddingVertical: 4,
  },
  weekHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  weekRange: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  weekStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  weekStat: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  statIconText: {
    fontSize: 16,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  statValue: {
    fontSize: 13,
    fontWeight: "700",
  },
  usageRow: {
    flexDirection: "row",
    gap: 12,
  },
  usageCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    borderRadius: 14,
    padding: 14,
    gap: 8,
    minHeight: 138,
  },
  usageIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  usageNameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  usageName: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
  },
  usageCost: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "800",
  },
  usageDesc: {
    fontSize: 11,
    color: "#9CA3AF",
    lineHeight: 16,
  },
  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: PRIMARY,
  },
  tabLabel: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  tabLabelActive: {
    color: PRIMARY,
    fontWeight: "700",
  },
  logList: {
    paddingHorizontal: 20,
  },
  logIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  logItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    gap: 12,
  },
  logContent: {
    flex: 1,
    gap: 4,
  },
  logLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  logDate: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  logDelta: {
    fontSize: 15,
    fontWeight: "700",
  },
  deltaPos: {
    color: PRIMARY,
  },
  deltaNeg: {
    color: "#EF4444",
  },
  separator: {
    height: 1,
    backgroundColor: "#F3F4F6",
  },
  showMore: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    marginTop: 4,
  },
  showMoreText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 14,
    color: "#EF4444",
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  guideOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  guideSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 12,
  },
  guideHandle: {
    width: 36,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  guideSheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  guideSheetTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },
  guideSectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 8,
  },
  guideTable: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  guideRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: "#FFFFFF",
  },
  guideRowAlt: {
    backgroundColor: "#F9FAFB",
  },
  guideRowAction: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  guideRowEarn: {
    fontSize: 14,
    fontWeight: "700",
    color: "#16A34A",
  },
  guideRowSpend: {
    fontSize: 14,
    fontWeight: "700",
    color: "#EF4444",
  },
  guideNote: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 16,
  },
});
