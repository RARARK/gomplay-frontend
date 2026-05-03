import * as React from "react";
import { Pressable, StyleSheet, View, type LayoutChangeEvent } from "react-native";
import PreviousButton from "@/assets/home/PreviousButton.svg";
import { HomeLayout } from "@/constants/locofyHomeStyles";
import type { PartnerCardProps } from "@/types/ui/homeCards";
import PartnerCard from "./PartnerCard";

export type PartnerCarouselProps = {
  partners?: PartnerCardProps[];
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
};

const PartnerCarousel = ({
  partners = [],
  initialIndex = 0,
  onIndexChange,
}: PartnerCarouselProps) => {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);
  const [containerWidth, setContainerWidth] = React.useState(0);

  const cardWidth = containerWidth > 0
    ? containerWidth - HomeLayout.navButtonSize * 2 - 24
    : undefined;

  const handleLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  React.useEffect(() => {
    if (partners.length === 0) {
      if (currentIndex !== 0) {
        setCurrentIndex(0);
      }
      return;
    }

    if (currentIndex > partners.length - 1) {
      setCurrentIndex(partners.length - 1);
    }
  }, [currentIndex, partners.length]);

  React.useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const moveTo = (nextIndex: number) => {
    setCurrentIndex(nextIndex);
    onIndexChange?.(nextIndex);
  };

  const currentPartner = partners[currentIndex];

  if (!currentPartner) {
    return null;
  }

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === partners.length - 1;

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <Pressable
        accessibilityRole="button"
        disabled={isFirst}
        onPress={() => moveTo(currentIndex - 1)}
        style={[styles.navButton, isFirst && styles.navButtonDisabled]}
      >
        <PreviousButton
          width={HomeLayout.navButtonSize}
          height={HomeLayout.navButtonSize}
        />
      </Pressable>

      <PartnerCard {...currentPartner} width={cardWidth} />

      <Pressable
        accessibilityRole="button"
        disabled={isLast}
        onPress={() => moveTo(currentIndex + 1)}
        style={[styles.navButton, isLast && styles.navButtonDisabled]}
      >
        <View style={styles.nextButton}>
          <PreviousButton
            width={HomeLayout.navButtonSize}
            height={HomeLayout.navButtonSize}
          />
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  navButton: {
    borderRadius: HomeLayout.navButtonSize / 2,
  },

  navButtonDisabled: {
    opacity: 0.35,
  },

  nextButton: {
    transform: [{ rotate: "180deg" }],
  },
});

export default PartnerCarousel;
