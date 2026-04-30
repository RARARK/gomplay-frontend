import { Image } from "expo-image";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import MatchLocationIcon from "@/assets/match/mdi-location.svg";
import MatchMapPreview from "@/assets/match/icon.png";

type CreatePostLocationCardProps = {
  location: string;
  onUseCurrentLocation?: () => void;
  onRecommendNearby?: () => void;
};

export default function CreatePostLocationCard({
  location,
  onUseCurrentLocation,
  onRecommendNearby,
}: CreatePostLocationCardProps) {
  const hasActions = Boolean(onUseCurrentLocation || onRecommendNearby);

  return (
    <View style={styles.container}>
      <View style={styles.mapFrame}>
        <Image
          source={MatchMapPreview}
          style={styles.mapImage}
          contentFit="cover"
        />
        <View style={styles.mapPin}>
          <MatchLocationIcon width={22} height={22} />
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.locationRow}>
          <MatchLocationIcon width={18} height={18} />
          <Text style={styles.locationText}>선택된 장소: {location}</Text>
        </View>

        {hasActions ? (
          <View style={styles.actions}>
            {onUseCurrentLocation ? (
              <Pressable onPress={onUseCurrentLocation} style={styles.actionButton}>
                <Text style={styles.actionText}>현재 위치로 지정</Text>
              </Pressable>
            ) : null}
            {onRecommendNearby ? (
              <Pressable onPress={onRecommendNearby} style={styles.actionButton}>
                <Text style={styles.actionText}>주변 스팟 추천</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  mapFrame: {
    height: 170,
    backgroundColor: "#F3F4F6",
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
  mapPin: {
    position: "absolute",
    top: "32%",
    left: "48%",
  },
  footer: {
    padding: 14,
    gap: 14,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  locationText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    color: "#111827",
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 12,
    backgroundColor: "#4C5BE2",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  actionText: {
    fontSize: 14,
    lineHeight: 18,
    color: "#FFFFFF",
    fontWeight: "600",
    textAlign: "center",
  },
});
