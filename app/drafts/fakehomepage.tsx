import React, { useState } from "react";
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

type RecommendedCardItem = {
  id: number;
  dateLabel: string;
  exerciseType: string;
  title: string;
  level: string;
  tags: string;
};

type GroupMatchItem = {
  id: number;
  remainLabel: string;
  exerciseType: string;
  date: string;
  location: string;
  capacity: string;
  level: string;
};

const recommendedMatches: RecommendedCardItem[] = [
  {
    id: 1,
    dateLabel: "04-03",
    exerciseType: "풋살",
    title: "혜당관",
    level: "초보",
    tags: "#조용히 #아무나",
  },
  {
    id: 2,
    dateLabel: "04-03",
    exerciseType: "풋살",
    title: "혜당관",
    level: "초보",
    tags: "#조용히",
  },
  {
    id: 3,
    dateLabel: "04-03",
    exerciseType: "풋살",
    title: "혜당관",
    level: "초보",
    tags: "#아무나",
  },
];

const groupMatches: GroupMatchItem[] = [
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
];

export default function HomeScreen() {
  const [isQuickMatchOn, setIsQuickMatchOn] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader />

        <HeroBanner />

        <QuickMatchSection isOn={isQuickMatchOn} onToggle={setIsQuickMatchOn} />

        <SectionHeader title="김단국님 맞춤 추천 매칭" />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recommendedListContent}
        >
          {recommendedMatches.map((item) => (
            <RecommendedMatchCard key={item.id} item={item} />
          ))}
        </ScrollView>

        <SectionHeader title="다수 모임" />

        <View style={styles.groupList}>
          {groupMatches.map((item) => (
            <GroupMatchCard key={item.id} item={item} />
          ))}
        </View>

        <HomeFooter />
      </ScrollView>
    </SafeAreaView>
  );
}

function HomeHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.logoEmoji}>🧸</Text>
      </View>

      <View style={styles.headerRight}>
        <Pressable style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={22} color="#1A1A1A" />
        </Pressable>
        <Pressable style={styles.iconButton}>
          <Ionicons name="person-circle-outline" size={24} color="#1A1A1A" />
        </Pressable>
        <Pressable style={styles.iconButton}>
          <Ionicons name="settings-outline" size={22} color="#1A1A1A" />
        </Pressable>
      </View>
    </View>
  );
}

function HeroBanner() {
  return (
    <View style={styles.bannerWrapper}>
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
        }}
        imageStyle={styles.bannerImage}
        style={styles.banner}
      >
        <Pressable style={styles.bannerArrow}>
          <Ionicons name="chevron-back" size={18} color="#1A1A1A" />
        </Pressable>

        <Text style={styles.bannerText}>just do it!</Text>

        <Pressable style={styles.bannerArrow}>
          <Ionicons name="chevron-forward" size={18} color="#1A1A1A" />
        </Pressable>
      </ImageBackground>
    </View>
  );
}

function QuickMatchSection({
  isOn,
  onToggle,
}: {
  isOn: boolean;
  onToggle: (value: boolean) => void;
}) {
  return (
    <View style={styles.quickMatchSection}>
      <View style={styles.quickMatchCard}>
        <View>
          <View style={styles.quickMatchTitleRow}>
            <Text style={styles.quickMatchTitle}>
              ⚡ 퀵매칭 {isOn ? "On" : "Off"}
            </Text>
          </View>
          <Text style={styles.quickMatchSubtitle}>
            공강 중 · 파트너 탐색 가능
          </Text>
        </View>

        <Switch
          value={isOn}
          onValueChange={onToggle}
          trackColor={{ false: "#5C5A63", true: "#7A72FF" }}
          thumbColor="#FFFFFF"
        />
      </View>

      <View style={styles.quickMatchHero}>
        <View style={styles.quickMatchMascot}>
          <Text style={styles.quickMatchMascotEmoji}>🧸</Text>
        </View>
        <Text style={styles.quickMatchHeroTitle}>
          근처 공강 파트너를 찾아보세요!
        </Text>
        <Text style={styles.quickMatchHeroSubtitle}>
          나와 같이 공강인 파트너를 찾아드려요!
        </Text>
      </View>
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderTitle}>{title}</Text>
      <Pressable>
        <Ionicons name="chevron-forward-circle" size={20} color="#111111" />
      </Pressable>
    </View>
  );
}

function RecommendedMatchCard({ item }: { item: RecommendedCardItem }) {
  return (
    <Pressable style={styles.recommendedCard}>
      <View style={styles.recommendedImageArea}>
        <View style={styles.topBadge}>
          <Text style={styles.topBadgeText}>{item.dateLabel}</Text>
        </View>

        <View style={styles.sportBadge}>
          <Text style={styles.sportBadgeIcon}>⚽</Text>
          <Text style={styles.sportBadgeText}>{item.exerciseType}</Text>
        </View>
      </View>

      <View style={styles.recommendedBottom}>
        <Text style={styles.recommendedBottomText}>
          {item.title}
          {"\n"}
          {item.level}
          {"\n"}
          {item.tags}
        </Text>
      </View>
    </Pressable>
  );
}

function GroupMatchCard({ item }: { item: GroupMatchItem }) {
  return (
    <Pressable style={styles.groupCard}>
      <View style={styles.groupImageArea}>
        <View style={styles.topBadge}>
          <Text style={styles.topBadgeText}>{item.remainLabel}</Text>
        </View>

        <View style={styles.groupSportBadgeWrapper}>
          <View style={styles.sportBadge}>
            <Text style={styles.sportBadgeIcon}>⚽</Text>
            <Text style={styles.sportBadgeText}>{item.exerciseType}</Text>
          </View>
        </View>
      </View>

      <View style={styles.groupMetaArea}>
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

function HomeFooter() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        © 2026 곰플레이{"\n\n"}
        같이 운동할 사람을 더 쉽게 찾을 수 있도록{"\n\n"}
        단국대학교 컴퓨터공학과 캡스톤 디자인 프로젝트{"\n"}팀 곰플레이{"\n\n"}
        문의: gomplay.official@gmail.com{"\n\n"}
        이용약관 | 개인정보처리방침 | 공지사항
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentContainer: {
    paddingBottom: 32,
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    justifyContent: "center",
    alignItems: "center",
  },
  logoEmoji: {
    fontSize: 28,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },

  bannerWrapper: {
    marginTop: 4,
  },
  banner: {
    height: 209,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  bannerImage: {
    resizeMode: "cover",
  },
  bannerArrow: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.68)",
    justifyContent: "center",
    alignItems: "center",
  },
  bannerText: {
    fontSize: 34,
    fontWeight: "700",
    color: "#F347B6",
    textAlign: "center",
  },

  quickMatchSection: {
    paddingHorizontal: 16,
    paddingTop: 18,
    alignItems: "center",
  },
  quickMatchCard: {
    width: "100%",
    backgroundColor: "#23257A",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#736CFF",
    paddingLeft: 20,
    paddingRight: 18,
    paddingTop: 22,
    paddingBottom: 22,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  quickMatchTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  quickMatchTitle: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  quickMatchSubtitle: {
    fontSize: 11,
    color: "#CFCFE8",
  },
  quickMatchHero: {
    width: "100%",
    alignItems: "center",
    paddingTop: 26,
    paddingBottom: 10,
  },
  quickMatchMascot: {
    width: 144,
    height: 144,
    borderRadius: 72,
    backgroundColor: "#F7E8C8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 22,
  },
  quickMatchMascotEmoji: {
    fontSize: 64,
  },
  quickMatchHeroTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#121212",
    textAlign: "center",
    marginBottom: 18,
  },
  quickMatchHeroSubtitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#121212",
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
  sectionHeaderTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "600",
    color: "#111111",
  },

  recommendedListContent: {
    paddingLeft: 14,
    paddingRight: 8,
    paddingBottom: 10,
  },
  recommendedCard: {
    width: 142,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    marginRight: 14,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  recommendedImageArea: {
    width: 142,
    height: 133,
    backgroundColor: "#6D85A0",
    justifyContent: "flex-end",
    paddingBottom: 8,
  },
  topBadge: {
    position: "absolute",
    top: 0,
    left: 0,
    height: 24,
    minWidth: 55,
    borderRadius: 32,
    backgroundColor: "#FF5A1F",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    zIndex: 2,
  },
  topBadgeText: {
    fontSize: 11,
    color: "#FFFFFF",
    textAlign: "center",
  },
  sportBadge: {
    marginLeft: 9,
    width: 92,
    height: 33,
    borderRadius: 32,
    backgroundColor: "#E7DB4C",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    gap: 6,
  },
  sportBadgeIcon: {
    fontSize: 16,
  },
  sportBadgeText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#111111",
    textAlign: "center",
  },
  recommendedBottom: {
    height: 80,
    backgroundColor: "#F8F8FA",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  recommendedBottomText: {
    fontSize: 11,
    lineHeight: 13,
    color: "#111111",
    fontWeight: "600",
  },

  groupList: {
    paddingHorizontal: 14,
  },
  groupCard: {
    width: "100%",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  groupImageArea: {
    height: 133,
    backgroundColor: "#6B829D",
    justifyContent: "flex-end",
    paddingBottom: 8,
  },
  groupSportBadgeWrapper: {
    paddingLeft: 9,
  },
  groupMetaArea: {
    backgroundColor: "#F8F8FA",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingHorizontal: 9,
    paddingTop: 12,
    paddingBottom: 11,
  },
  metaChip: {
    minWidth: 55,
    height: 24,
    borderRadius: 32,
    backgroundColor: "#D9D7E1",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  metaChipText: {
    fontSize: 11,
    color: "#222222",
  },

  footer: {
    width: "100%",
    backgroundColor: "#F8F8FA",
    marginTop: 4,
    paddingLeft: 24,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 18,
  },
  footerText: {
    fontSize: 12,
    lineHeight: 16,
    color: "#111111",
  },
});
