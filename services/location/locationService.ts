import * as Location from "expo-location";
import { isAxiosError } from "axios";

import apiClient from "@/lib/api/client";

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

export type Coords = { lat: number; lng: number };

export type NearbyPlaceSortBy = "rating" | "distance";

export type NearbyPlace = {
  id: string;
  name: string;
  address: string;
  coords: Coords;
  rating: number;
  distance: string;
};

async function getCoords(): Promise<Coords> {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    throw new Error("위치 권한이 필요합니다.");
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  };
}

export async function reverseGeocode(coords: Coords): Promise<string> {
  const { lat, lng } = coords;

  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=ko&key=${GOOGLE_API_KEY}`,
  );
  const data = await res.json();

  if (data.status !== "OK" || data.results.length === 0) {
    throw new Error("주소를 가져올 수 없습니다.");
  }

  return data.results[0].formatted_address as string;
}

export async function getCurrentCoords(): Promise<Coords> {
  return getCoords();
}

type NearbyPlaceResponse = {
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  distance: string;
};

type GetNearbyPlacesOptions = {
  coords?: Coords | null;
  sortBy?: NearbyPlaceSortBy;
};

export async function getNearbyPlaces(
  exerciseType: string,
  options: GetNearbyPlacesOptions = {},
): Promise<NearbyPlace[]> {
  const { coords, sortBy = "rating" } = options;
  const origin = coords ?? (await getCoords());

  try {
    const { data } = await apiClient.get<NearbyPlaceResponse[]>(
      "/api/places/nearby",
      {
        params: {
          lat: origin.lat,
          lng: origin.lng,
          sportType: exerciseType,
          sortBy,
        },
      },
    );

    return data.map((place) => ({
      id: `${place.lat}:${place.lng}:${place.name}`,
      name: place.name,
      address: place.address,
      coords: { lat: place.lat, lng: place.lng },
      rating: place.rating,
      distance: place.distance,
    }));
  } catch (error) {
    if (isAxiosError<{ message?: string }>(error)) {
      throw new Error(
        error.response?.data?.message ?? "주변 장소를 가져올 수 없습니다.",
      );
    }

    throw error;
  }
}

export function getStaticMapUrl(coords: Coords, width = 600, height = 300): string {
  const { lat, lng } = coords;
  return (
    `https://maps.googleapis.com/maps/api/staticmap` +
    `?center=${lat},${lng}&zoom=16&size=${width}x${height}` +
    `&markers=color:red%7C${lat},${lng}&key=${GOOGLE_API_KEY}`
  );
}
