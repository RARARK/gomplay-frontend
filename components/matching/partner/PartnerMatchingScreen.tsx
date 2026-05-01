import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import {
  Alert,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type RecommendedPartner = {
  id: string;
  matchPercentage: number;
  sharedInterests: number;
  name: string;
  studentId: string;
  department: string;
  activityStyle: string;
  tags: [string, string, string];
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const PANEL_WIDTH = Math.min(SCREEN_WIDTH - 42, 380);
const REFRESH_COST = 10;
const PROFILE_IMAGE = require("../../../assets/match/Ellipse-12.png");

const RECOMMENDED_PARTNERS: RecommendedPartner[] = [
  {
    id: "partner-1",
    matchPercentage: 82,
    sharedInterests: 3,
    name: "김단국",
    studentId: "21학번",
    department: "소프트웨어학과",
    activityStyle: "꾸준히 열심히",
    tags: ["활동적", "초보", "아웃도어"],
  },
  {
    id: "partner-2",
    matchPercentage: 91,
    sharedInterests: 5,
    name: "이서윤",
    studentId: "23학번",
    department: "체육교육과",
    activityStyle: "가볍게 오래",
    tags: ["아침형", "러닝", "친화적"],
  },
  {
    id: "partner-3",
    matchPercentage: 87,
    sharedInterests: 4,
    name: "박지훈",
    studentId: "22학번",
    department: "컴퓨터공학과",
    activityStyle: "루틴 중심",
    tags: ["근력", "저녁형", "꾸준함"],
  },
];

function PartnerCard({
  partner,
  onRefresh,
  onRequest,
}: {
  partner: RecommendedPartner;
  onRefresh: () => void;
  onRequest: () => void;
}) {
  return (
    <View style={styles.partnerCard}>
      <View style={styles.metricRow}>
        <View style={styles.metricPill}>
          <Text style={styles.metricText}>
            성향{" "}
            <Text style={styles.matchPercent}>{partner.matchPercentage}%</Text>{" "}
            일치
          </Text>
        </View>
        <View style={styles.metricPill}>
          <Text style={styles.metricText}>
            공통 관심사{" "}
            <Text style={styles.interestCount}>{partner.sharedInterests}</Text>
            개
          </Text>
        </View>
      </View>

      <View style={styles.profileStage}>
        <Image
          source={PROFILE_IMAGE}
          style={styles.profileImage}
          contentFit="cover"
        />
      </View>

      <View style={styles.infoBlock}>
        <Text style={styles.name}>{partner.name}</Text>
        <Text style={styles.department}>
          {partner.department} {partner.studentId}
        </Text>
      </View>

      <View style={styles.tagRow}>
        {partner.tags.map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <View style={styles.separator} />

      <View style={styles.activityRow}>
        <MaterialCommunityIcons name="dumbbell" size={28} color="#111827" />
        <Text style={styles.activityText}>
          운동 스타일: {partner.activityStyle}
        </Text>
      </View>

      <View style={styles.actionStack}>
        <Pressable
          accessibilityRole="button"
          style={[styles.actionButton, styles.refreshButton]}
          onPress={onRefresh}
        >
          <MaterialCommunityIcons name="gold" size={25} color="#FFFFFF" />
          <Text style={styles.actionText}>더 잘 맞는 파트너 찾기</Text>
          <Text style={styles.pointText}>{REFRESH_COST}P</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          style={[styles.actionButton, styles.requestButton]}
          onPress={onRequest}
        >
          <MaterialCommunityIcons
            name="handshake-outline"
            size={29}
            color="#FFFFFF"
          />
          <Text style={styles.actionText}>파트너 신청 보내기</Text>
          <Ionicons name="paper-plane-outline" size={25} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

export default function PartnerMatchingScreen() {
  const [partnerIndex, setPartnerIndex] = React.useState(0);
  const currentPartner = RECOMMENDED_PARTNERS[partnerIndex];

  const handleRefresh = () => {
    setPartnerIndex((current) => (current + 1) % RECOMMENDED_PARTNERS.length);
  };

  const handleRequest = () => {
    Alert.alert(
      "파트너 신청 완료",
      `${currentPartner.name}님에게 파트너 신청을 보냈어요.`,
    );
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.screenContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="people-outline" size={26} color="#111827" />
        </View>
        <Text style={styles.headerTitle}>파트너 매칭</Text>
      </View>

      <View style={styles.matchPanel}>
        <View style={styles.panelHeader}>
          <View style={styles.panelTitleRow}>
            <Ionicons name="sparkles" size={34} color="#FFF2A8" />
            <Text style={styles.panelTitle}>성향 일치 파트너 발견!</Text>
          </View>
          <Text style={styles.panelSubtitle}>지금 바로 연결해보세요.</Text>
        </View>

        <PartnerCard
          partner={currentPartner}
          onRefresh={handleRefresh}
          onRequest={handleRequest}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  screenContent: {
    flexGrow: 1,
    paddingTop: 18,
  },
  header: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },
  headerTitle: {
    flex: 1,
    marginRight: 48,
    fontSize: 17,
    lineHeight: 22,
    color: "#111827",
    fontWeight: "700",
    textAlign: "center",
  },
  matchPanel: {
    minHeight: 700,
    alignItems: "center",
    gap: 18,
    marginTop: 14,
    paddingHorizontal: 21,
    paddingTop: 18,
    paddingBottom: 28,
    backgroundColor: "#4C5BE2",
    overflow: "hidden",
  },
  panelHeader: {
    alignItems: "center",
    gap: 4,
  },
  panelTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  panelTitle: {
    fontSize: 20,
    lineHeight: 25,
    color: "#FFFFFF",
    fontWeight: "800",
    textAlign: "center",
  },
  panelSubtitle: {
    fontSize: 15,
    lineHeight: 20,
    color: "#FFFFFF",
    fontWeight: "600",
    opacity: 0.9,
  },
  partnerCard: {
    width: PANEL_WIDTH,
    minHeight: 560,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingTop: 27,
    paddingBottom: 24,
    gap: 13,
    shadowColor: "#C1CDFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 30,
    elevation: 18,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 40,
  },
  metricPill: {
    flex: 1,
    height: 44,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#374151",
    paddingHorizontal: 10,
  },
  metricText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#FFFFFF",
    fontWeight: "500",
    textAlign: "center",
  },
  matchPercent: {
    fontSize: 16,
    lineHeight: 21,
    color: "#F4DD64",
    fontWeight: "800",
  },
  interestCount: {
    fontSize: 16,
    lineHeight: 21,
    color: "#87C991",
    fontWeight: "800",
  },
  profileStage: {
    height: 166,
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: 166,
    height: 166,
    borderRadius: 83,
    backgroundColor: "#EEF2FF",
  },
  infoBlock: {
    alignItems: "center",
    gap: 6,
  },
  name: {
    fontSize: 17,
    lineHeight: 22,
    color: "#111827",
    fontWeight: "800",
    textAlign: "center",
  },
  department: {
    fontSize: 15,
    lineHeight: 20,
    color: "#4B5563",
    fontWeight: "700",
    textAlign: "center",
  },
  tagRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  tag: {
    minWidth: 54,
    height: 18,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#C1CDFF",
    paddingHorizontal: 10,
  },
  tagText: {
    fontSize: 11,
    lineHeight: 13,
    color: "#2A327D",
    fontWeight: "700",
    textAlign: "center",
  },
  separator: {
    height: 1,
    width: 192,
    alignSelf: "center",
    backgroundColor: "#F3F4F6",
    marginTop: 8,
  },
  activityRow: {
    height: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  activityText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#111827",
    fontWeight: "700",
    textAlign: "center",
  },
  actionStack: {
    gap: 15,
    marginTop: 2,
  },
  actionButton: {
    height: 44,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 4,
  },
  refreshButton: {
    backgroundColor: "#C8960C",
    gap: 6,
  },
  requestButton: {
    backgroundColor: "#FF7A70",
    gap: 24,
  },
  actionText: {
    fontSize: 15,
    lineHeight: 20,
    color: "#FFFFFF",
    fontWeight: "800",
    textAlign: "center",
  },
  pointText: {
    fontSize: 15,
    lineHeight: 20,
    color: "#FFFFFF",
    fontWeight: "900",
  },
});
