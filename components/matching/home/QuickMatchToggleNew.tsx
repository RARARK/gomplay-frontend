import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { HomeStatusVariant } from "@/types/ui/homeStatus";

type Props = {
  state?: HomeStatusVariant;
  onChange?: (value: boolean) => void;
};

const CARD_H = 112;
const TRACK_W = 56;
const TRACK_H = 30;
const THUMB = 24;

function ToggleTrack({ isOn }: { isOn: boolean }) {
  return (
    <View style={[track.rail, isOn ? track.railOn : track.railOff]}>
      <View style={[track.thumb, isOn ? track.thumbRight : track.thumbLeft]} />
    </View>
  );
}

const track = StyleSheet.create({
  rail: {
    width: TRACK_W,
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
    padding: (TRACK_H - THUMB) / 2,
    justifyContent: "center",
  },
  railOn: { backgroundColor: "#22C55E" },
  railOff: { backgroundColor: "#D1D5DB" },
  thumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    backgroundColor: "#FFFFFF",
    elevation: 2,
  },
  thumbLeft: { alignSelf: "flex-start" },
  thumbRight: { alignSelf: "flex-end" },
});

export default function QuickMatchToggleNew({ state, onChange }: Props) {
  const isOn = state === "Matching";

  const content = (
    <>
      <View style={[styles.iconWrap, isOn ? styles.iconWrapOn : styles.iconWrapOff]}>
        <Ionicons name="flash" size={30} color={isOn ? "#FCD34D" : "#9CA3AF"} />
      </View>

      <View style={styles.textBlock}>
        <Text style={[styles.title, isOn ? styles.titleOn : styles.titleOff]}>
          Quick Match
        </Text>

        <View style={styles.statusRow}>
          <View style={[styles.dot, isOn ? styles.dotOn : styles.dotOff]} />
          <Text style={[styles.statusText, isOn ? styles.statusOn : styles.statusOff]}>
            {isOn ? "공강 중 · 자동 매칭 활성화됨" : "공강 중 · 매칭 비활성화"}
          </Text>
        </View>

        <View style={[styles.helperPill, isOn ? styles.helperPillOn : styles.helperPillOff]}>
          <Ionicons
            name="time-outline"
            size={11}
            color={isOn ? "rgba(255,255,255,0.8)" : "#9CA3AF"}
          />
          <Text style={[styles.helperText, isOn ? styles.helperTextOn : styles.helperTextOff]}>
            {isOn
              ? "보다 빠르게 파트너를 찾아드려요"
              : "직접 원하는 시간에 매칭할 수 있어요"}
          </Text>
        </View>
      </View>

      <ToggleTrack isOn={isOn} />
    </>
  );

  return (
    <TouchableOpacity
      accessibilityRole="switch"
      accessibilityState={{ checked: isOn }}
      activeOpacity={0.88}
      onPress={() => onChange?.(!isOn)}
      style={[styles.cardOuter, isOn ? styles.cardOuterOn : styles.cardOuterOff]}
    >
      {isOn ? (
        <LinearGradient
          colors={["#7C3AED", "#4F46E5"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.cardInner}
        >
          {content}
        </LinearGradient>
      ) : (
        <View style={[styles.cardInner, styles.cardInnerOff]}>
          {content}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardOuter: {
    width: "100%",
    borderRadius: 20,
  },
  cardOuterOn: {
    elevation: 8,
  },
  cardOuterOff: {
    elevation: 2,
  },

  cardInner: {
    width: "100%",
    height: CARD_H,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 14,
  },
  cardInnerOff: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  iconWrapOn: { backgroundColor: "#FFFFFF" },
  iconWrapOff: { backgroundColor: "#F1F2F4" },

  textBlock: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  title: {
    fontSize: 22,
    lineHeight: 27,
    fontWeight: "900",
  },
  titleOn: { color: "#FFFFFF" },
  titleOff: { color: "#111827" },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  dotOn: { backgroundColor: "#4ADE80" },
  dotOff: { backgroundColor: "#9CA3AF" },
  statusText: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "600",
  },
  statusOn: { color: "rgba(255,255,255,0.9)" },
  statusOff: { color: "#6B7280" },

  helperPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
  },
  helperPillOn: { backgroundColor: "rgba(255,255,255,0.22)" },
  helperPillOff: { backgroundColor: "#F1F3F5" },
  helperText: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "500",
  },
  helperTextOn: { color: "rgba(255,255,255,0.85)" },
  helperTextOff: { color: "#9CA3AF" },
});
