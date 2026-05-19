import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, type Region } from "react-native-maps";

import type { Coords } from "@/services/location/locationService";

type CreatePostLocationPickerModalProps = {
  visible: boolean;
  initialCoords: Coords;
  onClose: () => void;
  onConfirm: (coords: Coords) => void;
};

const DELTA = 0.005;

export default function CreatePostLocationPickerModal({
  visible,
  initialCoords,
  onClose,
  onConfirm,
}: CreatePostLocationPickerModalProps) {
  const [selected, setSelected] = React.useState<Coords>(initialCoords);
  const [isMapReady, setIsMapReady] = React.useState(false);

  React.useEffect(() => {
    if (visible) {
      setSelected(initialCoords);
      setIsMapReady(false);
    }
  }, [visible, initialCoords]);

  const initialRegion: Region = {
    latitude: initialCoords.lat,
    longitude: initialCoords.lng,
    latitudeDelta: DELTA,
    longitudeDelta: DELTA,
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" onPress={onClose} style={styles.closeButton}>
            <Ionicons name="chevron-back" size={28} color="#111111" />
          </Pressable>
          <Text style={styles.headerTitle}>위치 선택</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.mapContainer}>
          {!isMapReady ? (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator color="#4C5BE2" />
            </View>
          ) : null}
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={initialRegion}
            onMapReady={() => setIsMapReady(true)}
            onPress={(e) => {
              const { latitude, longitude } = e.nativeEvent.coordinate;
              setSelected({ lat: latitude, lng: longitude });
            }}
          >
            <Marker
              coordinate={{ latitude: selected.lat, longitude: selected.lng }}
            />
          </MapView>
        </View>

        <View style={styles.footer}>
          <Text style={styles.hint}>지도를 눌러 위치를 선택하세요.</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => onConfirm(selected)}
            style={styles.confirmButton}
          >
            <Text style={styles.confirmButtonText}>결정</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 12,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    lineHeight: 28,
    color: "#111827",
    fontWeight: "800",
  },
  headerSpacer: {
    width: 40,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    zIndex: 1,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 32,
    gap: 12,
  },
  hint: {
    fontSize: 13,
    lineHeight: 18,
    color: "#6B7280",
    fontWeight: "600",
    textAlign: "center",
  },
  confirmButton: {
    minHeight: 56,
    borderRadius: 16,
    backgroundColor: "#4C5BE2",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonText: {
    fontSize: 17,
    lineHeight: 22,
    color: "#FFFFFF",
    fontWeight: "800",
  },
});
