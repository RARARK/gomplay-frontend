import * as React from "react";
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
  type LayoutChangeEvent,
} from "react-native";
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
  const [dragDirection, setDragDirection] = React.useState<"left" | "right" | null>(null);
  const translateX = React.useRef(new Animated.Value(0)).current;
  const isAnimating = React.useRef(false);

  const cardWidth = containerWidth > 0
    ? containerWidth - 32
    : undefined;

  const swipeDistance = containerWidth > 0 ? containerWidth + 120 : 520;
  const nextIndex = currentIndex + 1;
  const prevIndex = currentIndex - 1;
  const previewIndex = dragDirection === "right" ? prevIndex : nextIndex;
  const previewPartner = partners[previewIndex];

  React.useEffect(() => {
    if (partners.length === 0) { setCurrentIndex(0); return; }
    if (currentIndex > partners.length - 1) setCurrentIndex(partners.length - 1);
  }, [currentIndex, partners.length]);

  React.useEffect(() => {
    setCurrentIndex(initialIndex);
    translateX.setValue(0);
    setDragDirection(null);
  }, [initialIndex, translateX]);

  const moveTo = React.useCallback((next: number) => {
    setCurrentIndex(next);
    onIndexChange?.(next);
  }, [onIndexChange]);

  const snapBack = React.useCallback(() => {
    Animated.spring(translateX, {
      toValue: 0,
      friction: 7,
      tension: 85,
      useNativeDriver: true,
    }).start(() => {
      isAnimating.current = false;
      setDragDirection(null);
    });
  }, [translateX]);

  const finishSwipe = React.useCallback((direction: "left" | "right") => {
    const targetIndex = direction === "left" ? currentIndex + 1 : currentIndex - 1;

    if (targetIndex < 0 || targetIndex > partners.length - 1) {
      snapBack();
      return;
    }

    isAnimating.current = true;
    setDragDirection(direction);

    Animated.timing(translateX, {
      toValue: direction === "left" ? -swipeDistance : swipeDistance,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      moveTo(targetIndex);
      requestAnimationFrame(() => {
        translateX.setValue(0);
        setDragDirection(null);
        isAnimating.current = false;
      });
    });
  }, [currentIndex, moveTo, partners.length, snapBack, swipeDistance, translateX]);

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dx) > 8 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
        onPanResponderGrant: () => {
          if (isAnimating.current) return;
          translateX.stopAnimation();
        },
        onPanResponderMove: (_, gesture) => {
          if (isAnimating.current) return;
          translateX.setValue(gesture.dx);
          if (Math.abs(gesture.dx) > 12) {
            setDragDirection(gesture.dx < 0 ? "left" : "right");
          }
        },
        onPanResponderRelease: (_, gesture) => {
          if (isAnimating.current) return;

          const shouldSwipe = Math.abs(gesture.dx) > 96 || Math.abs(gesture.vx) > 0.55;
          if (!shouldSwipe) {
            snapBack();
            return;
          }

          finishSwipe(gesture.dx < 0 ? "left" : "right");
        },
        onPanResponderTerminate: snapBack,
      }),
    [finishSwipe, snapBack, translateX],
  );

  const current = partners[currentIndex];
  if (!current) return null;

  const rotate = translateX.interpolate({
    inputRange: [-swipeDistance, 0, swipeDistance],
    outputRange: ["-7deg", "0deg", "7deg"],
  });
  const activeScale = translateX.interpolate({
    inputRange: [-swipeDistance, 0, swipeDistance],
    outputRange: [0.97, 1, 0.97],
    extrapolate: "clamp",
  });
  const previewOpacity = translateX.interpolate({
    inputRange: [-80, 0, 80],
    outputRange: [1, 0, 1],
    extrapolate: "clamp",
  });

  return (
    <View
      style={carouselStyles.container}
      onLayout={(e: LayoutChangeEvent) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <View style={carouselStyles.cardStage}>
        <View pointerEvents="none" style={[carouselStyles.stackCard, carouselStyles.stackCardBack]} />
        <View pointerEvents="none" style={[carouselStyles.stackCard, carouselStyles.stackCardMiddle]} />

        {previewPartner && (
          <Animated.View
            pointerEvents="none"
            style={[
              carouselStyles.cardLayer,
              {
                opacity: previewOpacity,
              },
            ]}
          >
            <PartnerCardNew
              {...previewPartner}
              width={cardWidth}
              activeIndex={previewIndex}
              totalCount={partners.length}
            />
          </Animated.View>
        )}

        <Animated.View
          {...panResponder.panHandlers}
          style={[
            carouselStyles.cardLayer,
            {
              transform: [
                { translateX },
                { rotate },
                { scale: activeScale },
              ],
            },
          ]}
        >
          <PartnerCardNew
            {...current}
            width={cardWidth}
            activeIndex={currentIndex}
            totalCount={partners.length}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const carouselStyles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  cardStage: {
    width: "100%",
    height: 594,
    alignItems: "center",
    justifyContent: "center",
  },
  stackCard: {
    position: "absolute",
    width: "93%",
    height: 548,
    borderRadius: 28,
    backgroundColor: "#F7F5FF",
    borderWidth: 1,
    borderColor: "rgba(124, 111, 247, 0.1)",
    shadowColor: "#4C5BE2",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 1,
  },
  stackCardBack: {
    top: 36,
    transform: [{ scaleX: 0.92 }],
    opacity: 0.44,
  },
  stackCardMiddle: {
    top: 22,
    transform: [{ scaleX: 0.965 }],
    opacity: 0.72,
  },
  cardLayer: {
    position: "absolute",
    width: "100%",
    alignItems: "center",
  },
});

const MatchedContentNew = ({
  partners = matchedPartners,
  initialIndex = 0,
  onPartnerIndexChange,
}: MatchedContentNewProps) => {
  const visiblePartners = React.useMemo(() => partners.slice(0, 3), [partners]);

  return (
    <View style={styles.container}>
      <CarouselNew
        partners={visiblePartners}
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
    paddingBottom: 8,
  },
});

export default MatchedContentNew;
