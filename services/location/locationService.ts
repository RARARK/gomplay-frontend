import * as Location from "expo-location";

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

export type Coords = { lat: number; lng: number };

export type NearbyPlace = {
  id: string;
  name: string;
  coords: Coords;
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

const EXERCISE_KEYWORD_MAP: Record<string, string> = {
  당구: "당구장",
  야구: "야구장",
  볼링: "볼링장",
  자전거: "자전거",
  러닝: "운동장",
  축구: "축구장",
  풋살: "풋살장",
  테니스: "테니스장",
  등산: "등산로",
  농구: "농구장",
  배드민턴: "배드민턴장",
  헬스: "헬스장",
};

const STORE_TYPES = new Set([
  "store",
  "bicycle_store",
  "clothing_store",
  "convenience_store",
  "department_store",
  "electronics_store",
  "furniture_store",
  "hardware_store",
  "home_goods_store",
  "shoe_store",
  "shopping_mall",
  "supermarket",
  "grocery_or_supermarket",
  "food",
  "restaurant",
  "cafe",
]);

type PlaceResult = {
  place_id: string;
  name: string;
  types: string[];
  geometry: { location: { lat: number; lng: number } };
};

export async function getNearbyPlaces(exerciseType: string): Promise<NearbyPlace[]> {
  const { lat, lng } = await getCoords();
  const keyword = EXERCISE_KEYWORD_MAP[exerciseType] ?? exerciseType;

  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&keyword=${encodeURIComponent(keyword)}&language=ko&key=${GOOGLE_API_KEY}`,
  );
  const data = await res.json();

  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    throw new Error("주변 장소를 가져올 수 없습니다.");
  }

  return (data.results as PlaceResult[])
    .filter((p) => !p.types.some((t) => STORE_TYPES.has(t)))
    .slice(0, 8)
    .map((p) => ({
      id: p.place_id,
      name: p.name,
      coords: { lat: p.geometry.location.lat, lng: p.geometry.location.lng },
    }));
}

export function getStaticMapUrl(coords: Coords, width = 600, height = 300): string {
  const { lat, lng } = coords;
  return (
    `https://maps.googleapis.com/maps/api/staticmap` +
    `?center=${lat},${lng}&zoom=16&size=${width}x${height}` +
    `&markers=color:red%7C${lat},${lng}&key=${GOOGLE_API_KEY}`
  );
}
