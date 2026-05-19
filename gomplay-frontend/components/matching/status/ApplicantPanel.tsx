import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import {
  Animated,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

const AVATAR = require("../../../assets/chat/Profileimage.png");

export type Applicant = {
  id: string;
  name: string;
  department: string;
  studentNumber: string;
  tags: string[];
  trustScore: number;
  status: "pending" | "accepted" | "rejected";
};

type Props = {
  visible: boolean;
  applicants: Applicant[];
  onClose: () => void;
  onAccept: (applicantId: string) => void;
  onReject: (applicantId: string) => void;
};

function ApplicantCard({
  applicant,
  onAccept,
  onReject,
}: {
  applicant: Applicant;
  onAccept: () => void;
  onReject: () => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <Image source={AVATAR} style={styles.avatar} contentFit="cover" />
        <View style={styles.cardInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {applicant.name}
            </Text>
            <Text style={styles.studentNo} numberOfLines={1}>
              {applicant.studentNumber}
            </Text>
            <Text style={styles.dept} numberOfLines={1}>
              {applicant.department}
            </Text>
          </View>
          {applicant.tags.length > 0 ? (
            <View style={styles.tagRow}>
              {applicant.tags.slice(0, 3).map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText} numberOfLines={1}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
          <View style={styles.trustBadge}>
            <Ionicons name="thermometer-outline" size={15} color="#F59E0B" />
            <Text style={styles.trustValue}>
              {applicant.trustScore.toFixed(1)}°C
            </Text>
          </View>
        </View>

        {applicant.status === "pending" ? (
          <View style={styles.actionIconRow}>
            <Pressable
              style={[styles.actionIconBtn, styles.acceptBtn]}
              onPress={onAccept}
              hitSlop={8}
            >
              <Ionicons name="checkmark" size={18} color="#FFFFFF" />
            </Pressable>
            <Pressable
              style={[styles.actionIconBtn, styles.rejectBtn]}
              onPress={onReject}
              hitSlop={8}
            >
              <Ionicons name="close" size={18} color="#EF4444" />
            </Pressable>
          </View>
        ) : (
          <View
            style={[
              styles.statusBadge,
              applicant.status === "accepted"
                ? styles.statusAccepted
                : styles.statusRejected,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                applicant.status === "accepted"
                  ? styles.statusTextAccepted
                  : styles.statusTextRejected,
              ]}
            >
              {applicant.status === "accepted" ? "수락됨" : "거절됨"}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default function ApplicantPanel({
  visible,
  applicants,
  onClose,
  onAccept,
  onReject,
}: Props) {
  const { width } = useWindowDimensions();
  const panelWidth = Math.min(Math.round(width * 0.86), 420);
  const swipeThreshold = Math.min(90, panelWidth * 0.28);
  const translateX = React.useRef(new Animated.Value(panelWidth)).current;
  const [modalVisible, setModalVisible] = React.useState(false);

  React.useEffect(() => {
    if (visible) {
      setModalVisible(true);
      translateX.setValue(panelWidth);
      Animated.spring(translateX, {
        toValue: 0,
        damping: 22,
        stiffness: 180,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateX, {
        toValue: panelWidth,
        duration: 210,
        useNativeDriver: true,
      }).start(() => setModalVisible(false));
    }
  }, [panelWidth, visible, translateX]);

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) =>
          Math.abs(g.dx) > Math.abs(g.dy) && g.dx > 8,
        onPanResponderMove: (_, g) => {
          if (g.dx > 0) translateX.setValue(g.dx);
        },
        onPanResponderRelease: (_, g) => {
          if (g.dx > swipeThreshold || g.vx > 0.8) {
            onClose();
          } else {
            Animated.spring(translateX, {
              toValue: 0,
              damping: 22,
              stiffness: 200,
              useNativeDriver: true,
            }).start();
          }
        },
      }),
    [onClose, swipeThreshold, translateX],
  );

  const pending = applicants.filter((a) => a.status === "pending").length;

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <Animated.View
          style={[
            styles.panel,
            { width: panelWidth, transform: [{ translateX }] },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.header}>
            <View style={styles.headerTextBlock}>
              <Text style={styles.headerTitle}>신청자 목록</Text>
              <Text style={styles.headerSub}>
                {pending}명 대기 중 · 총 {applicants.length}명
              </Text>
            </View>
            <Pressable style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={22} color="#374151" />
            </Pressable>
          </View>
          <View style={styles.headerDivider} />

          {applicants.length > 0 ? (
            <ScrollView
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            >
              {applicants.map((applicant) => (
                <ApplicantCard
                  key={applicant.id}
                  applicant={applicant}
                  onAccept={() => onAccept(applicant.id)}
                  onReject={() => onReject(applicant.id)}
                />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.empty}>
              <Ionicons name="people-outline" size={32} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>대기 중인 신청자가 없어요.</Text>
              <Text style={styles.emptyText}>
                새 신청이 들어오면 이곳에서 확인할 수 있어요.
              </Text>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  backdrop: {
    flex: 1,
  },
  panel: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 14,
  },
  headerTextBlock: {
    flex: 1,
    minWidth: 0,
    paddingRight: 10,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
  },
  headerSub: {
    fontSize: 12,
    fontWeight: "500",
    color: "#9CA3AF",
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  headerDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },

  listContent: {
    padding: 16,
    gap: 12,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
    gap: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EEF2FF",
    flexShrink: 0,
  },
  cardInfo: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "baseline",
    flexWrap: "wrap",
    gap: 6,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  dept: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B7280",
    flexShrink: 1,
  },
  studentNo: {
    fontSize: 11,
    fontWeight: "500",
    color: "#9CA3AF",
    flexShrink: 1,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 2,
  },
  tag: {
    maxWidth: "100%",
    borderRadius: 999,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#4C5BE2",
  },

  trustBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 4,
    marginTop: 2,
  },
  trustValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#F59E0B",
  },

  actionIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 0,
  },
  actionIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  rejectBtn: {
    borderWidth: 1,
    borderColor: "#FCA5A5",
    backgroundColor: "#FFF5F5",
  },
  acceptBtn: {
    backgroundColor: "#4C5BE2",
  },

  statusBadge: {
    height: 30,
    borderRadius: 15,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  statusAccepted: {
    backgroundColor: "#ECFDF5",
  },
  statusRejected: {
    backgroundColor: "#F9FAFB",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  statusTextAccepted: {
    color: "#10B981",
  },
  statusTextRejected: {
    color: "#9CA3AF",
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    lineHeight: 20,
    color: "#111827",
    fontWeight: "800",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 12,
    lineHeight: 18,
    color: "#9CA3AF",
    fontWeight: "600",
    textAlign: "center",
  },
});
