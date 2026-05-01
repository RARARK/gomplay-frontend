import { Image } from "expo-image";
import React from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

import MatchLocationIcon from "@/assets/match/mdi-location.svg";
import MatchMapPreview from "@/assets/match/icon.png";
import type { Coords } from "@/services/location/locationService";
import { getStaticMapUrl } from "@/services/location/locationService";

type CreatePostLocationCardProps = {
  location: string;
  locationCoords?: Coords;
  isLocationLoading?: boolean;
  onUseCurrentLocation?: () => void;
  onRecommendNearby?: () => void;
  onMapPress?: () => void;
};

export default function CreatePostLocationCard({
  location,
  locationCoords,
  isLocationLoading = false,
  onUseCurrentLocation,
  onRecommendNearby,
  onMapPress,
}: CreatePostLocationCardProps) {
  const hasActions = Boolean(onUseCurrentLocation || onRecommendNearby);
  const mapSource = locationCoords
    ? { uri: getStaticMapUrl(locationCoords) }
    : MatchMapPreview;

  return (
    <View style={styles.container}>
      <Pressable
        disabled={!onMapPress}
        onPress={onMapPress}
        style={styles.mapFrame}
      >
        <Image
          source={mapSource}
          style={styles.mapImage}
          contentFit="cover"
        />
        {!locationCoords ? (
          <View style={styles.mapPin}>
            <MatchLocationIcon width={22} height={22} />
          </View>
        ) : null}
      </Pressable>

      <View style={styles.footer}>
        <View style={styles.locationRow}>
          <MatchLocationIcon width={18} height={18} />
          <Text style={styles.locationText}>{location}</Text>
        </View>

        {hasActions ? (
          <View style={styles.actions}>
            {onUseCurrentLocation ? (
              <Pressable
                disabled={isLocationLoading}
                onPress={onUseCurrentLocation}
                style={[styles.actionButton, isLocationLoading && styles.actionButtonDisabled]}
              >
                <Text style={styles.actionText}>
                  {isLocationLoading ? "불러오는 중..." : "현재 위치로 지정"}
                </Text>
              </Pressable>
            ) : null}
            {onRecommendNearby ? (
              <Pressable
                disabled={isLocationLoading}
                onPress={onRecommendNearby}
                style={[styles.actionButton, isLocationLoading && styles.actionButtonDisabled]}
              >
                <Text style={styles.actionText}>
                  {isLocationLoading ? "불러오는 중..." : "주변 스팟 추천"}
                </Text>
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
  actionButtonDisabled: {
    backgroundColor: "#B5BDEB",
  },
  actionText: {
    fontSize: 14,
    lineHeight: 18,
    color: "#FFFFFF",
    fontWeight: "600",
    textAlign: "center",
  },
});
