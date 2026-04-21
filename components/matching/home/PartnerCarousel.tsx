import * as React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import PreviousButton from "@/assets/home/PreviousButton.svg";
import PartnerCard, { type PartnerCardProps } from "./PartnerCard";

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
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        disabled={isFirst}
        onPress={() => moveTo(currentIndex - 1)}
        style={[styles.navButton, isFirst && styles.navButtonDisabled]}
      >
        <PreviousButton width={48} height={48} />
      </Pressable>

      <PartnerCard {...currentPartner} />

      <Pressable
        accessibilityRole="button"
        disabled={isLast}
        onPress={() => moveTo(currentIndex + 1)}
        style={[styles.navButton, isLast && styles.navButtonDisabled]}
      >
        <View style={styles.nextButton}>
          <PreviousButton width={48} height={48} />
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
    borderRadius: 24,
  },

  navButtonDisabled: {
    opacity: 0.35,
  },

  nextButton: {
    transform: [{ rotate: "180deg" }],
  },
});

export default PartnerCarousel;
