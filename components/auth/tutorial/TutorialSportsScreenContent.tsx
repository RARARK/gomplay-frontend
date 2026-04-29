import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import TutorialSportOptionCard from "./TutorialSportOptionCard";
import type { TutorialOption } from "./tutorialTypes";

type TutorialSportsScreenContentProps = {
  headerTitle: string;
  title: string;
  description: string;
  progressRatio: number;
  options: TutorialOption[];
  selectedOptionIds: string[];
  onSelectOption: (value: string) => void;
  onBack: () => void;
};

export default function TutorialSportsScreenContent({
  headerTitle,
  title,
  description,
  progressRatio,
  options,
  selectedOptionIds,
  onSelectOption,
  onBack,
}: TutorialSportsScreenContentProps) {
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="튜토리얼 이전 단계"
          hitSlop={10}
          onPress={onBack}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={32} color="#111111" />
        </Pressable>
        <Text style={styles.headerTitle}>{headerTitle}</Text>
      </View>

      <View style={styles.progressWrapper}>
        <View style={styles.progressTrack} />
        <View
          style={[
            styles.progressActive,
            { width: `${Math.min(Math.max(progressRatio, 0), 1) * 100}%` },
          ]}
        />
      </View>

      <View style={styles.copyBlock}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      <View style={styles.grid}>
        {options.map((option) => (
          <TutorialSportOptionCard
            key={option.id}
            icon={option.icon}
            label={option.label}
            selected={selectedOptionIds.includes(option.id)}
            onPress={() => onSelectOption(option.id)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 76,
    gap: 28,
    backgroundColor: "#FFFFFF",
  },
  header: {
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: -2,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.5,
    fontWeight: "600",
    color: "#111827",
    fontFamily: "System",
  },
  progressWrapper: {
    width: "100%",
    height: 16,
    justifyContent: "center",
    position: "relative",
  },
  progressTrack: {
    width: "100%",
    height: 8,
    borderRadius: 999,
    backgroundColor: "#E8E8F3",
  },
  progressActive: {
    position: "absolute",
    left: 0,
    top: 4,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#4C5BE2",
  },
  copyBlock: {
    gap: 10,
    paddingTop: 14,
  },
  title: {
    fontSize: 34,
    lineHeight: 48,
    fontWeight: "800",
    color: "#111111",
    fontFamily: "System",
    letterSpacing: -1,
  },
  description: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "700",
    color: "#C7C5D7",
    fontFamily: "System",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 18,
  },
});
