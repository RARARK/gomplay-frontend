import * as React from "react";
import { Pressable, StyleSheet, Text, View, type LayoutChangeEvent } from "react-native";
import SuccessIcon from "@/assets/home/Success-Icon.svg";
import PreviousButton from "@/assets/home/PreviousButton.svg";
import { Color, FontFamily, FontSize, HomeLayout, LineHeight } from "@/constants/locofyHomeStyles";
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
  title = "Partner found!",
  description = "Your match is ready. Connect right away.",
  partners = matchedPartners,
  initialIndex = 0,
  onPartnerIndexChange,
}: MatchedContentNewProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <View style={styles.titleRow}>
          <SuccessIcon width={36} height={36} />
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={styles.desc}>{description}</Text>
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
    paddingVertical: 14,
  },
  banner: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 4,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  title: {
    color: Color.colorBlack,
    fontFamily: FontFamily.inter,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: "700",
    textAlign: "center",
  },
  desc: {
    color: Color.neutral700,
    fontFamily: FontFamily.inter,
    fontSize: FontSize.fs_13,
    lineHeight: LineHeight.lh_18,
    textAlign: "center",
  },
});

export default MatchedContentNew;
