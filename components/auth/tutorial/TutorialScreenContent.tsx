import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import type { TutorialOption } from "./tutorialTypes";
import TutorialOptionCard from "./TutorialOptionCard";

type TutorialScreenContentProps = {
  backLabel: string;
  headerTitle: string;
  titleLines: string[];
  description: string;
  progressRatio: number;
  options: TutorialOption[];
  selectedOptionId: string | null;
  centeredOptions?: boolean;
  onSelectOption: (value: string) => void;
  onBack: () => void;
};

export default function TutorialScreenContent({
  backLabel,
  headerTitle,
  titleLines,
  description,
  progressRatio,
  options,
  selectedOptionId,
  centeredOptions = true,
  onSelectOption,
  onBack,
}: TutorialScreenContentProps) {
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Pressable
          accessibilityLabel={backLabel}
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

      <View style={styles.heroSection}>
        <View style={styles.copyBlock}>
          {titleLines.map((line) => (
            <Text key={line} style={styles.title}>
              {line}
            </Text>
          ))}
          <Text style={styles.description}>{description}</Text>
        </View>

        <View style={styles.options}>
          {options.map((option) => (
            <TutorialOptionCard
              key={option.id}
              icon={option.icon}
              label={option.label}
              selected={selectedOptionId === option.id}
              centered={centeredOptions}
              onPress={() => onSelectOption(option.id)}
            />
          ))}
        </View>
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
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 76,
    gap: 24,
  },
  header: {
    minHeight: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: -2,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
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
    height: 8,
    justifyContent: "center",
    position: "relative",
  },
  progressTrack: {
    width: "100%",
    height: 8,
    borderRadius: 999,
    backgroundColor: "#F2F2F2",
  },
  progressActive: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 999,
    backgroundColor: "#4C5BE2",
  },
  heroSection: {
    flex: 1,
    justifyContent: "flex-start",
    gap: 40,
  },
  copyBlock: {
    gap: 10,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    lineHeight: 38,
    fontWeight: "700",
    color: "#111827",
    fontFamily: "System",
  },
  description: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",
    color: "#BBB7C7",
    fontFamily: "System",
  },
  options: {
    width: "100%",
    gap: 24,
    marginTop: 8,
  },
});
