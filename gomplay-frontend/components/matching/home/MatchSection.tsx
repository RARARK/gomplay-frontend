import * as React from "react";
import { router, useFocusEffect } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import RecommendationSectionHeader from "./RecommendationSectionHeader";
import ModernMatchCard from "./ModernMatchCard";
import { Color, Gap } from "@/constants/locofyHomeStyles";
import { getGatheringRecommendations } from "@/services/gathering/gatheringService";
import { getSportImage } from "@/lib/utils/sportImageMap";
import type { GatheringRecommendItem } from "@/types/domain/gathering";
import type { ModernMatchCardProps } from "@/types/ui/homeCards";

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

function mapRecommendToCard(
  item: GatheringRecommendItem,
  onPress: () => void,
): ModernMatchCardProps {
  const start = new Date(item.scheduledAt);
  const end = new Date(item.scheduledEndAt);

  const month = String(start.getMonth() + 1).padStart(2, "0");
  const day = String(start.getDate()).padStart(2, "0");
  const date = `${month}.${day}`;
  const dayOfWeek = DAY_LABELS[start.getDay()];

  const startHH = String(start.getHours()).padStart(2, "0");
  const startMM = String(start.getMinutes()).padStart(2, "0");
  const endHH = String(end.getHours()).padStart(2, "0");
  const endMM = String(end.getMinutes()).padStart(2, "0");
  const time = `${startHH}:${startMM} ~ ${endHH}:${endMM}`;

  const tags = item.tags
    ? item.tags
        .split("#")
        .map((t) => t.trim())
        .filter(Boolean)
        .map((t) => `#${t}`)
    : [];

  return {
    imageSource: getSportImage(item.sportType),
    date,
    dayOfWeek,
    sport: item.sportType,
    time,
    location: item.venue,
    tags,
    difficulty: item.difficulty,
    currentParticipants: item.currentParticipants,
    maxParticipants: item.maxParticipants,
    onPress,
  };
}

const MatchSection = React.memo(function MatchSection() {
  const [items, setItems] = React.useState<GatheringRecommendItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const hasMountedRef = React.useRef(false);

  useFocusEffect(
    React.useCallback(() => {
      let active = true;
      // 첫 진입만 로딩 스피너 표시, 이후 재포커스 시 카드를 유지한 채 백그라운드 갱신
      if (!hasMountedRef.current) {
        setLoading(true);
      }
      getGatheringRecommendations()
        .then((data) => { if (active) { setItems(data); hasMountedRef.current = true; } })
        .catch(() => { if (active) setItems([]); })
        .finally(() => { if (active) setLoading(false); });
      return () => { active = false; };
    }, []),
  );

  const handleHeaderPress = React.useCallback(() => {
    router.push("/posts" as any);
  }, []);

  const handleCardPress = React.useCallback((id: number) => {
    router.push(`/posts/${id}` as any);
  }, []);

  const cardData = React.useMemo(() => {
    const seen = new Set<number>();
    return items
      .filter((item) => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      })
      .map((item) => ({ ...mapRecommendToCard(item, () => handleCardPress(item.id)), id: item.id }));
  }, [items, handleCardPress]);

  return (
    <View style={styles.container}>
      <View style={styles.headerBlock}>
        <RecommendationSectionHeader
          title="추천 매칭"
          onPress={handleHeaderPress}
        />
        <Text style={styles.subtitle}>관심 있는 운동을 선택해보세요</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={Color.primary100} style={styles.loader} />
      ) : items.length === 0 ? (
        <Text style={styles.empty}>추천 모집글이 없습니다.</Text>
      ) : (
        <FlatList
          horizontal
          data={cardData}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item: { id: _id, ...cardProps } }) => (
            <View style={styles.cardItem}>
              <ModernMatchCard {...cardProps} />
            </View>
          )}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
          contentContainerStyle={styles.cardList}
          removeClippedSubviews
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    gap: Gap.gap_14,
  },
  headerBlock: {
    gap: 2,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: "#9CA3AF",
    fontWeight: "500",
    marginTop: -4,
  },
  cardList: {
    flexDirection: "row",
    paddingRight: 16,
  },
  cardItem: {
    marginRight: Gap.gap_14,
  },
  loader: {
    marginVertical: 24,
    alignSelf: "center",
  },
  empty: {
    fontSize: 13,
    lineHeight: 18,
    color: "#9CA3AF",
    fontWeight: "500",
    marginVertical: 24,
    textAlign: "center",
  },
});

export default MatchSection;
