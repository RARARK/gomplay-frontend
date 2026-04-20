import React, { useMemo, useState } from "react";
import {
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type RecommendedMatchCard = {
  id: number;
  dueLabel: string;
  exerciseType: string;
  title: string;
  level: string;
  tag: string;
};

type GroupPostCard = {
  id: number;
  remainLabel: string;
  exerciseType: string;
  date: string;
  location: string;
  capacity: string;
  level: string;
};

const recommendedMatches: RecommendedMatchCard[] = [
  {
    id: 1,
    dueLabel: "04-03",
    exerciseType: "풋살",
    title: "혜임달",
    level: "초보",
    tag: "#조용히 #아무나",
  },
  {
    id: 2,
    dueLabel: "04-03",
    exerciseType: "풋살",
    title: "혜임달",
    level: "초보",
    tag: "#조용히",
  },
  {
    id: 3,
    dueLabel: "04-03",
    exerciseType: "풋살",
    title: "혜임달",
    level: "초보",
    tag: "#아무나",
  },
];

const groupPosts: GroupPostCard[] = [
  {
    id: 1,
    remainLabel: "3명 남음",
    exerciseType: "풋살",
    date: "04-11",
    location: "대운동장",
    capacity: "4명",
    level: "초보",
  },
  {
    id: 2,
    remainLabel: "3명 남음",
    exerciseType: "풋살",
    date: "04-11",
    location: "대운동장",
    capacity: "4명",
    level: "초보",
  },
  {
    id: 3,
    remainLabel: "3명 남음",
    exerciseType: "풋살",
    date: "04-11",
    location: "대운동장",
    capacity: "4명",
    level: "초보",
  },
  {
    id: 4,
    remainLabel: "3명 남음",
    exerciseType: "풋살",
    date: "04-11",
    location: "대운동장",
    capacity: "4명",
    level: "초보",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [isQuickMatchOn, setIsQuickMatchOn] = useState(false);

  const greeting = useMemo(() => "김단국님 맞춤 추천 매칭", []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable style={styles.logoButton}>
            <Text style={styles.logoEmoji}>🧸</Text>
          </Pressable>

          <View style={styles.headerIcons}>
            <Pressable style={styles.iconButton}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color="#1E1E1E"
              />
            </Pressable>
            <Pressable style={styles.iconButton}>
              <Ionicons
                name="person-circle-outline"
                size={24}
                color="#1E1E1E"
              />
            </Pressable>
            <Pressable style={styles.iconButton}>
              <Ionicons name="settings-outline" size={22} color="#1E1E1E" />
            </Pressable>
          </View>
        </View>

        <Pressable style={styles.bannerWrapper}>
          <ImageBackground
            source={{
              uri: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
            }}
            imageStyle={styles.bannerImage}
            style={styles.banner}
          >
            <Pressable style={styles.bannerArrowButton}>
              <Ionicons name="chevron-back" size={18} color="#1E1E1E" />
            </Pressable>
            <Text style={styles.bannerText}>just do it!</Text>
          </ImageBackground>
        </Pressable>

        <View style={styles.quickMatchCard}>
          <View>
            <Text style={styles.quickMatchTitle}>⚡ 직매칭 OFF</Text>
            <Text style={styles.quickMatchSubtitle}>
              공강 중 · 파트너 탐색 가능
            </Text>
          </View>

          <Switch
            value={isQuickMatchOn}
            onValueChange={setIsQuickMatchOn}
            trackColor={{ false: "#D6D6DE", true: "#8C88FF" }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.heroInfoSection}>
          <View style={styles.mascotCircle}>
            <Text style={styles.mascotEmoji}>🧸</Text>
          </View>

          <Text style={styles.heroTitle}>근처 공강 파트너를 찾아보세요!</Text>
          <Text style={styles.heroSubtitle}>
            나와 같이 공강인 파트너를 찾아드려요!
          </Text>
        </View>

        <SectionHeader
          title={greeting}
          onPress={() => {
            // 추천 매칭 전체보기 자리
          }}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalListContent}
        >
          {recommendedMatches.map((item) => (
            <RecommendedCard
              key={item.id}
              item={item}
              onPress={() => {
                // 퀵매칭 상세나 파트너 프로필로 이동
              }}
            />
          ))}
        </ScrollView>

        <SectionHeader title="다수 모임" onPress={() => {}} />

        <View style={styles.groupPostList}>
          {groupPosts.map((item) => (
            <GroupPostCardItem
              key={item.id}
              item={item}
              onPress={() => {
                // 모집글 상세로 이동
              }}
            />
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerCopy}>© 2026 곰플레이</Text>
          <Text style={styles.footerText}>
            같이 운동할 사람을 더 쉽게 찾을 수 있도록
          </Text>
          <Text style={styles.footerText}>
            단국대학교 컴퓨터공학과 캡스톤 디자인 프로젝트
          </Text>
          <Text style={styles.footerText}>팀 곰플레이</Text>
          <Text style={[styles.footerText, styles.footerSpacing]}>
            문의: gomplay.official@gmail.com
          </Text>
          <Text style={styles.footerLinks}>
            이용약관 | 개인정보처리방침 | 공지사항
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionHeader({
  title,
  onPress,
}: {
  title: string;
  onPress?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Pressable onPress={onPress} hitSlop={8}>
        <Ionicons name="chevron-forward-circle" size={18} color="#111111" />
      </Pressable>
    </View>
  );
}

function RecommendedCard({
  item,
  onPress,
}: {
  item: RecommendedMatchCard;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.recommendedCard} onPress={onPress}>
      <View style={styles.recommendedImageArea}>
        <View style={styles.badgeTopLeft}>
          <Text style={styles.badgeTopLeftText}>{item.dueLabel}</Text>
        </View>

        <View style={styles.exerciseBadge}>
          <Text style={styles.exerciseBadgeIcon}>⚽</Text>
          <Text style={styles.exerciseBadgeText}>{item.exerciseType}</Text>
        </View>
      </View>

      <View style={styles.recommendedInfo}>
        <Text style={styles.recommendedTitle}>{item.title}</Text>
        <Text style={styles.recommendedLevel}>{item.level}</Text>
        <Text style={styles.recommendedTag}>{item.tag}</Text>
      </View>
    </Pressable>
  );
}

function GroupPostCardItem({
  item,
  onPress,
}: {
  item: GroupPostCard;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.groupCard} onPress={onPress}>
      <View style={styles.groupImageArea}>
        <View style={styles.badgeTopLeft}>
          <Text style={styles.badgeTopLeftText}>{item.remainLabel}</Text>
        </View>

        <View style={styles.exerciseBadge}>
          <Text style={styles.exerciseBadgeIcon}>⚽</Text>
          <Text style={styles.exerciseBadgeText}>{item.exerciseType}</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <MetaChip label={item.date} />
        <MetaChip label={item.exerciseType} />
        <MetaChip label={item.location} />
        <MetaChip label={item.capacity} />
        <MetaChip label={item.level} />
      </View>
    </Pressable>
  );
}

function MetaChip({ label }: { label: string }) {
  return (
    <View style={styles.metaChip}>
      <Text style={styles.metaChipText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F6F6F8",
  },
  container: {
    flex: 1,
    backgroundColor: "#F6F6F8",
  },
  contentContainer: {
    paddingBottom: 28,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  logoEmoji: {
    fontSize: 28,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerWrapper: {
    marginTop: 4,
  },
  banner: {
    height: 176,
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  bannerImage: {
    borderRadius: 0,
  },
  bannerArrowButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.72)",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    marginTop: 10,
  },
  bannerText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#F03DB3",
    alignSelf: "center",
    marginBottom: 30,
  },
  quickMatchCard: {
    marginTop: 34,
    marginHorizontal: 16,
    backgroundColor: "#2D2F8F",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  quickMatchTitle: {
    color: "#F3F4FF",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 4,
  },
  quickMatchSubtitle: {
    color: "#D9DBFF",
    fontSize: 12,
    fontWeight: "500",
  },
  heroInfoSection: {
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  mascotCircle: {
    width: 118,
    height: 118,
    borderRadius: 59,
    backgroundColor: "#FFF2DA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  mascotEmoji: {
    fontSize: 58,
  },
  heroTitle: {
    fontSize: 23,
    fontWeight: "800",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 19,
    lineHeight: 28,
    fontWeight: "700",
    color: "#252550",
    textAlign: "center",
  },
  sectionHeader: {
    marginTop: 18,
    marginBottom: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111111",
    flex: 1,
  },
  horizontalListContent: {
    paddingLeft: 16,
    paddingRight: 6,
    paddingBottom: 8,
  },
  recommendedCard: {
    width: 168,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginRight: 12,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  recommendedImageArea: {
    height: 128,
    backgroundColor: "#5879A7",
    justifyContent: "flex-end",
    padding: 10,
  },
  badgeTopLeft: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#FF7A00",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeTopLeftText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  exerciseBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E7DB4C",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 5,
  },
  exerciseBadgeIcon: {
    fontSize: 13,
  },
  exerciseBadgeText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111111",
  },
  recommendedInfo: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 86,
    backgroundColor: "#FFFFFF",
  },
  recommendedTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  recommendedLevel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#444444",
    marginBottom: 2,
  },
  recommendedTag: {
    fontSize: 12,
    color: "#666666",
  },
  groupPostList: {
    paddingHorizontal: 16,
  },
  groupCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  groupImageArea: {
    height: 154,
    backgroundColor: "#5A7696",
    justifyContent: "flex-end",
    padding: 12,
  },
  metaRow: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    backgroundColor: "#F9F9FB",
  },
  metaChip: {
    backgroundColor: "#D8D3E3",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  metaChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#46405B",
  },
  footer: {
    marginTop: 18,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  footerCopy: {
    fontSize: 13,
    color: "#444444",
    marginBottom: 16,
  },
  footerText: {
    fontSize: 13,
    lineHeight: 22,
    color: "#3F3F3F",
  },
  footerSpacing: {
    marginTop: 14,
  },
  footerLinks: {
    marginTop: 14,
    fontSize: 13,
    color: "#3F3F3F",
  },
});
