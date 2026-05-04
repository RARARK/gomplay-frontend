import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { ModernMatchCardProps } from "@/types/ui/homeCards";

const CARD_WIDTH = 195;
const IMAGE_HEIGHT = 160;
const CARD_RADIUS = 18;

const SPORT_ICONS: Partial<Record<string, keyof typeof Ionicons.glyphMap>> = {
  Tennis: "tennisball-outline",
  Basketball: "basketball-outline",
  Football: "football-outline",
  Futsal: "football-outline",
  Badminton: "barbell-outline",
  Running: "walk-outline",
  Climbing: "triangle-outline",
};

const TAG_COLORS = [
  { bg: "#EEF2FF", text: "#4338CA" },
  { bg: "#ECFDF5", text: "#059669" },
  { bg: "#FFF7ED", text: "#C2410C" },
];

export default function ModernMatchCard({
  imageSource,
  date,
  dayOfWeek,
  sport,
  time,
  location,
  tags = [],
  difficulty,
  currentParticipants,
  maxParticipants,
  onPress,
}: ModernMatchCardProps) {
  const sportIcon =
    (SPORT_ICONS[sport] as keyof typeof Ionicons.glyphMap | undefined) ??
    "fitness-outline";

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      {/* ── Image area (clean, no overlay) ──────────────────────────── */}
      <View style={styles.imageArea}>
        {imageSource ? (
          <Image
            source={imageSource}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
          />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.imageFallback]} />
        )}

        {/* Date badge — top left */}
        <View style={styles.dateBadge}>
          <Text style={styles.dateNum}>{date}</Text>
          <Text style={styles.dateDay}>{dayOfWeek}</Text>
        </View>
      </View>

      {/* ── Info area ───────────────────────────────────────────────── */}
      <View style={styles.infoArea}>
        {/* Sport name + icon */}
        <View style={styles.sportRow}>
          <Ionicons name={sportIcon} size={20} color="#111827" />
          <Text style={styles.sportName}>{sport}</Text>
        </View>

        <View style={styles.divider} />

        {/* Time */}
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={13} color="#9CA3AF" />
          <Text style={styles.infoText}>{time}</Text>
        </View>

        {/* Location */}
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={13} color="#9CA3AF" />
          <Text style={styles.infoText} numberOfLines={1}>
            {location}
          </Text>
        </View>

        {/* Tags */}
        {tags.length > 0 && (
          <View style={styles.tagRow}>
            {tags.slice(0, 3).map((tag, i) => {
              const c = TAG_COLORS[i % TAG_COLORS.length];
              return (
                <View key={tag} style={[styles.tag, { backgroundColor: c.bg }]}>
                  <Text style={[styles.tagText, { color: c.text }]}>{tag}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Footer: difficulty · participants */}
        {(difficulty != null || maxParticipants != null) && (
          <View style={styles.footer}>
            {difficulty != null && (
              <View style={styles.footerItem}>
                <Ionicons name="bar-chart-outline" size={11} color="#D1D5DB" />
                <Text style={styles.footerText}>{difficulty}</Text>
              </View>
            )}
            {difficulty != null && maxParticipants != null && (
              <Text style={styles.footerDot}>·</Text>
            )}
            {maxParticipants != null && (
              <View style={styles.footerItem}>
                <Ionicons name="people-outline" size={11} color="#D1D5DB" />
                <Text style={styles.footerText}>
                  {currentParticipants} / {maxParticipants}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: CARD_RADIUS,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#1F2937",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  pressed: {
    opacity: 0.93,
    transform: [{ scale: 0.985 }],
  },

  // ── Image ──────────────────────────────────────────────────────────
  imageArea: {
    height: IMAGE_HEIGHT,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
    borderTopLeftRadius: CARD_RADIUS - 1,
    borderTopRightRadius: CARD_RADIUS - 1,
  },
  imageFallback: {
    backgroundColor: "#C7D2FE",
  },
  dateBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#312E81",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: "center",
  },
  dateNum: {
    fontSize: 13,
    lineHeight: 16,
    color: "#FFFFFF",
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  dateDay: {
    fontSize: 10,
    lineHeight: 13,
    color: "#A5B4FC",
    fontWeight: "700",
    letterSpacing: 0.8,
  },

  // ── Info ───────────────────────────────────────────────────────────
  infoArea: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 14,
    gap: 7,
  },
  sportRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  sportName: {
    fontSize: 20,
    lineHeight: 25,
    color: "#111827",
    fontWeight: "900",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 17,
    color: "#374151",
    fontWeight: "600",
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    marginTop: 1,
  },
  tag: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 1,
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    lineHeight: 16,
    color: "#9CA3AF",
    fontWeight: "600",
  },
  footerDot: {
    fontSize: 12,
    color: "#D1D5DB",
    fontWeight: "400",
  },
});
