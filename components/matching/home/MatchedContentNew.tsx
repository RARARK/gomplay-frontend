import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import { Pressable, StyleSheet, Text, View, type LayoutChangeEvent } from "react-native";
import PreviousButton from "@/assets/home/PreviousButton.svg";
import { HomeLayout } from "@/constants/locofyHomeStyles";
import { matchedPartners } from "./homeMockData";
import type { PartnerCardProps } from "@/types/ui/homeCards";
import PartnerCardNew from "./PartnerCardNew";

export type MatchedContentNewProps = {
  title?: string;
  description?: string;
  partners?: PartnerCardProps[];
  initialIndex?: number;
  onPartnerIndexChange?: (index: number) => void;
};

function CarouselNew({
  partners,
  initialIndex = 0,
  onIndexChange,
}: {
  partners: PartnerCardProps[];
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
}) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);
  const [containerWidth, setContainerWidth] = React.useState(0);

  const cardWidth = containerWidth > 0
    ? containerWidth - HomeLayout.navButtonSize * 2 - 24
    : undefined;

  React.useEffect(() => {
    if (partners.length === 0) { setCurrentIndex(0); return; }
    if (currentIndex > partners.length - 1) setCurrentIndex(partners.length - 1);
  }, [currentIndex, partners.length]);

  React.useEffect(() => { setCurrentIndex(initialIndex); }, [initialIndex]);

  const moveTo = (next: number) => { setCurrentIndex(next); onIndexChange?.(next); };
  const current = partners[currentIndex];
  if (!current) return null;

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === partners.length - 1;

  return (
    <View
      style={carouselStyles.container}
      onLayout={(e: LayoutChangeEvent) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <Pressable
        accessibilityRole="button"
        disabled={isFirst}
        onPress={() => moveTo(currentIndex - 1)}
        style={[carouselStyles.navButton, isFirst && carouselStyles.navButtonDisabled]}
      >
        <PreviousButton width={HomeLayout.navButtonSize} height={HomeLayout.navButtonSize} />
      </Pressable>

      <PartnerCardNew {...current} width={cardWidth} />

      <Pressable
        accessibilityRole="button"
        disabled={isLast}
        onPress={() => moveTo(currentIndex + 1)}
        style={[carouselStyles.navButton, isLast && carouselStyles.navButtonDisabled]}
      >
        <View style={carouselStyles.nextButton}>
          <PreviousButton width={HomeLayout.navButtonSize} height={HomeLayout.navButtonSize} />
        </View>
      </Pressable>
    </View>
  );
}

const carouselStyles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  navButton: { borderRadius: HomeLayout.navButtonSize / 2 },
  navButtonDisabled: { opacity: 0.35 },
  nextButton: { transform: [{ rotate: "180deg" }] },
});

const MatchedContentNew = ({
  partners = matchedPartners,
  initialIndex = 0,
  onPartnerIndexChange,
}: MatchedContentNewProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="sparkles" size={32} color="#F6C85F" />
          <Text style={styles.title}>Partner found!</Text>
        </View>
        <Text style={styles.subtitle}>Your match is ready. Connect right away.</Text>
      </View>

      <CarouselNew
        partners={partners}
        initialIndex={initialIndex}
        onIndexChange={onPartnerIndexChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    gap: 20,
    paddingBottom: 8,
  },
  header: {
    alignItems: "center",
    gap: 6,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    color: "#111827",
    fontWeight: "900",
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 21,
    color: "#6B7280",
    fontWeight: "500",
    textAlign: "center",
  },
});

export default MatchedContentNew;
