/**
 * 개발/테스트용 버튼 모음 — 홈 화면 상단에서 분리
 * 필요 시 (tabs)/index.tsx 에 다시 붙여 넣기
 */

import * as React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import OpponentProfileModal from "@/components/matching/OpponentProfileModal";
import WorkoutCompleteModal from "@/components/matching/WorkoutCompleteModal";
import PartnerCardNew from "@/components/matching/home/PartnerCardNew";
import type { PartnerCardProps } from "@/types/ui/homeCards";

type HomeDevButtonsProps = {
  newCardPreviewPartners: PartnerCardProps[];
};

const reviewTestRoute = "/review-complete-test" as const;

export default function HomeDevButtons({ newCardPreviewPartners }: HomeDevButtonsProps) {
  const [isWorkoutCompleteTestVisible, setIsWorkoutCompleteTestVisible] = React.useState(false);
  const [isPartnerCardTestVisible, setIsPartnerCardTestVisible] = React.useState(false);
  const [isProfileModalVisible, setIsProfileModalVisible] = React.useState(false);

  return (
    <>
      <View style={styles.testButtonRow}>
        <Pressable
          accessibilityRole="button"
          style={[styles.testButton, styles.testButtonProfile]}
          onPress={() => setIsProfileModalVisible(true)}
        >
          <Text style={[styles.testButtonText, styles.testButtonProfileText]}>상대 프로필</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          style={[styles.testButton, styles.testButtonComplete]}
          onPress={() => setIsWorkoutCompleteTestVisible(true)}
        >
          <Text style={[styles.testButtonText, styles.testButtonCompleteText]}>완료 테스트</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          style={[styles.testButton, styles.testButtonReview]}
          onPress={() => router.push(reviewTestRoute as any)}
        >
          <Text style={[styles.testButtonText, styles.testButtonReviewText]}>평가 테스트</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          style={[styles.testButton, styles.testButtonReport]}
          onPress={() => router.push("/tutorial-report-test" as any)}
        >
          <Text style={[styles.testButtonText, styles.testButtonReportText]}>리포트 테스트</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          style={[styles.testButton, styles.testButtonPartnerCard]}
          onPress={() => setIsPartnerCardTestVisible(true)}
        >
          <Text style={[styles.testButtonText, styles.testButtonPartnerCardText]}>파트너 카드</Text>
        </Pressable>
      </View>

      <WorkoutCompleteModal
        visible={isWorkoutCompleteTestVisible}
        onLaterPress={() => setIsWorkoutCompleteTestVisible(false)}
        onReviewPress={() => {
          setIsWorkoutCompleteTestVisible(false);
          router.push(reviewTestRoute as any);
        }}
      />
      <Modal
        visible={isPartnerCardTestVisible}
        animationType="slide"
        onRequestClose={() => setIsPartnerCardTestVisible(false)}
      >
        <SafeAreaView edges={["top"]} style={styles.partnerCardTestModal}>
          <View style={styles.partnerCardTestHeader}>
            <Text style={styles.partnerCardTestTitle}>파트너 카드 미리보기</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => setIsPartnerCardTestVisible(false)}
              style={styles.partnerCardTestClose}
            >
              <Text style={styles.partnerCardTestCloseText}>닫기</Text>
            </Pressable>
          </View>
          <ScrollView
            contentContainerStyle={styles.partnerCardTestContent}
            showsVerticalScrollIndicator={false}
          >
            <PartnerCardNew {...(newCardPreviewPartners[0] ?? {})} />
          </ScrollView>
        </SafeAreaView>
      </Modal>
      <OpponentProfileModal
        visible={isProfileModalVisible}
        onClose={() => setIsProfileModalVisible(false)}
        data={{
          name: "김단국",
          department: "컴퓨터공학과",
          studentId: "20학번",
          mannerTemperature: 36.5,
          exerciseTypes: ["풋살", "헬스", "러닝", "배드민턴", "농구"],
          partnerStyle: "독립형",
          exerciseIntensity: "꾸준형",
          exerciseReason: "건강관리",
          isVerified: true,
          matchCount: 12,
          noShowCount: 0,
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  testButtonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
    marginTop: -42,
    marginBottom: -42,
  },
  testButton: {
    minHeight: 34,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#4C5BE2",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  testButtonText: {
    fontSize: 12,
    lineHeight: 16,
    color: "#4C5BE2",
    fontWeight: "800",
  },
  testButtonComplete: { borderColor: "#16A34A" },
  testButtonCompleteText: { color: "#16A34A" },
  testButtonReview: { borderColor: "#7C3AED" },
  testButtonReviewText: { color: "#7C3AED" },
  testButtonReport: { borderColor: "#25258F" },
  testButtonReportText: { color: "#25258F" },
  testButtonProfile: { borderColor: "#0891B2" },
  testButtonProfileText: { color: "#0891B2" },
  testButtonPartnerCard: { borderColor: "#D97706" },
  testButtonPartnerCardText: { color: "#D97706" },
  partnerCardTestModal: { flex: 1, backgroundColor: "#0F172A" },
  partnerCardTestHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  partnerCardTestTitle: { fontSize: 17, fontWeight: "700", color: "#FFFFFF" },
  partnerCardTestClose: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  partnerCardTestCloseText: { fontSize: 14, fontWeight: "600", color: "#FFFFFF" },
  partnerCardTestContent: { paddingHorizontal: 16, paddingBottom: 40 },
});
