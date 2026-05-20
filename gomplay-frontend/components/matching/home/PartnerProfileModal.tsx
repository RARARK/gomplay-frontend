import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { ImageSourcePropType } from "react-native";

import DEFAULT_PROFILE_IMAGE from "../../../assets/home/PartnerProfileImage.png";

const { height: SCREEN_H } = Dimensions.get("window");

type Props = {
  visible: boolean;
  onClose: () => void;
  profileImageSource?: ImageSourcePropType;
  name?: string;
  department?: string;
  studentId?: string;
  matchScore?: number;
  partnerStyle?: string;
  exerciseIntensity?: string;
  exerciseReason?: string;
  exerciseTypes?: string[];
};

// ── Manner temperature bar ───────────────────────────────────────────────────

function MannerTemp({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(score, 100));
  const color = clamped >= 70 ? "#F97316" : clamped >= 40 ? "#4C5BE2" : "#38BDF8";

  return (
    <View style={M.tempRow}>
      <Ionicons name="thermometer-outline" size={20} color={color} />
      <Text style={[M.tempScore, { color }]}>{clamped}°C</Text>
      <View style={M.tempBarBg}>
        <View
          style={[
            M.tempBarFill,
            { width: `${clamped}%` as any, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
}

// ── Trait chip ───────────────────────────────────────────────────────────────

function TraitChip({
  icon,
  label,
  value,
  color,
  bg,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  color: string;
  bg: string;
}) {
  return (
    <View style={[M.traitChip, { backgroundColor: bg }]}>
      <Ionicons name={icon} size={15} color={color} />
      <View style={M.traitTexts}>
        <Text style={[M.traitLabel, { color }]}>{label}</Text>
        <Text style={[M.traitValue, { color }]}>{value}</Text>
      </View>
    </View>
  );
}

// ── Modal ────────────────────────────────────────────────────────────────────

export default function PartnerProfileModal({
  visible,
  onClose,
  profileImageSource,
  name = "파트너",
  department,
  studentId,
  matchScore,
  partnerStyle,
  exerciseIntensity,
  exerciseReason,
  exerciseTypes = [],
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={M.backdrop} onPress={onClose}>
        <Pressable style={M.sheet} onPress={() => {}}>
          {/* Profile photo */}
          <Image
            source={profileImageSource ?? DEFAULT_PROFILE_IMAGE}
            style={M.photo}
            contentFit="cover"
          />

          {/* Close button */}
          <Pressable onPress={onClose} style={M.closeBtn} hitSlop={8}>
            <Ionicons name="close" size={20} color="#FFFFFF" />
          </Pressable>

          {/* Info card */}
          <View style={M.infoCard}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={M.scroll}
              bounces={false}
            >
              {/* Name */}
              <Text style={M.name}>{name}</Text>

              {/* Department + studentId chips */}
              {(department || studentId) && (
                <View style={M.chipRow}>
                  {department && (
                    <View style={M.metaChip}>
                      <Ionicons name="school-outline" size={13} color="#4C5BE2" />
                      <Text style={M.metaChipText}>{department}</Text>
                    </View>
                  )}
                  {studentId && (
                    <View style={M.metaChip}>
                      <Ionicons name="card-outline" size={13} color="#4C5BE2" />
                      <Text style={M.metaChipText}>{studentId}</Text>
                    </View>
                  )}
                </View>
              )}

              {/* Manner temperature */}
              {matchScore != null && (
                <View style={M.section}>
                  <Text style={M.sectionLabel}>매너온도</Text>
                  <MannerTemp score={matchScore} />
                </View>
              )}

              {/* Personality */}
              {(partnerStyle ||
                exerciseIntensity ||
                exerciseReason ||
                exerciseTypes.length > 0) && (
                <View style={M.section}>
                  <Text style={M.sectionLabel}>성향 정보</Text>
                  <View style={M.traitGrid}>
                    {partnerStyle && (
                      <TraitChip
                        icon="people-outline"
                        label="파트너 성향"
                        value={partnerStyle}
                        color="#7C6FF7"
                        bg="#EDE9FF"
                      />
                    )}
                    {exerciseIntensity && (
                      <TraitChip
                        icon="flame-outline"
                        label="운동 강도"
                        value={exerciseIntensity}
                        color="#EA6F0A"
                        bg="#FEF3E2"
                      />
                    )}
                    {exerciseReason && (
                      <TraitChip
                        icon="trophy-outline"
                        label="운동 이유"
                        value={exerciseReason}
                        color="#2563EB"
                        bg="#EFF6FF"
                      />
                    )}
                    {exerciseTypes.map((t) => (
                      <TraitChip
                        key={t}
                        icon="barbell-outline"
                        label="선호 운동"
                        value={t}
                        color="#059669"
                        bg="#ECFDF5"
                      />
                    ))}
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const M = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "flex-end",
  },
  sheet: {
    height: SCREEN_H * 0.88,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  photo: {
    width: "100%",
    height: "55%",
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  infoCard: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 20,
  },
  scroll: {
    gap: 16,
    paddingBottom: 28,
  },
  name: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.5,
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    marginTop: -4,
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#EEF2FF",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  metaChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4C5BE2",
  },
  section: {
    gap: 10,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#9CA3AF",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  tempRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  tempScore: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.3,
    minWidth: 58,
  },
  tempBarBg: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F3F4F6",
    overflow: "hidden",
  },
  tempBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  traitGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  traitChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  traitTexts: {
    gap: 1,
  },
  traitLabel: {
    fontSize: 10,
    fontWeight: "600",
    opacity: 0.75,
  },
  traitValue: {
    fontSize: 13,
    fontWeight: "700",
  },
});
