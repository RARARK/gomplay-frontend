import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Border, Color, FontFamily, FontSize } from "../GlobalStyles";

type MatchInfoCardProps = {
  locationName?: string;
  timeLabel?: string;
  surfaceLabel?: string;
  levelLabel?: string;
  playerCountLabel?: string;
};

type DetailItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
};

export default function MatchInfoCard({
  locationName = "OO Park",
  timeLabel = "Today 7:00 PM",
  surfaceLabel = "Futsal",
  levelLabel = "Beginner",
  playerCountLabel = "2 players",
}: MatchInfoCardProps) {
  const [collapsed, setCollapsed] = useState(false);

  const detailItems: DetailItem[] = [
    { icon: "walk", label: surfaceLabel },
    { icon: "stats-chart", label: levelLabel },
    { icon: "person-outline", label: playerCountLabel },
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <Pressable
          onPress={() => setCollapsed((prev) => !prev)}
          style={styles.locationRow}
        >
          <Image
            source={require("../../assets/chat/Locationpin.png")}
            style={styles.locationIcon}
          />
          <Text numberOfLines={1} style={styles.locationText}>
            {locationName}
          </Text>
          <Ionicons
            name={collapsed ? "chevron-down" : "chevron-up"}
            size={16}
            color={Color.neutral700}
          />
        </Pressable>

        {!collapsed && (
          <View style={styles.infoPanel}>
            <View style={styles.timeRow}>
              <Ionicons name="time-outline" size={16} color={Color.neutral700} />
              <Text style={styles.timeText}>{timeLabel}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              {detailItems.map((item) => (
                <View
                  key={`${item.icon}-${item.label}`}
                  style={styles.detailItem}
                >
                  <Ionicons
                    name={item.icon}
                    size={16}
                    color={Color.labelsPrimary}
                  />
                  <Text style={styles.detailText}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 14,
  },
  card: {
    borderRadius: Border.br_8,
    borderWidth: 1,
    borderColor: Color.colorSilver,
    backgroundColor: Color.colorAliceblue,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    paddingHorizontal: 4,
  },
  locationIcon: {
    width: 19,
    height: 27,
    resizeMode: "contain",
  },
  locationText: {
    flex: 1,
    fontSize: FontSize.fs_17,
    lineHeight: 22,
    fontWeight: "600",
    fontFamily: FontFamily.sFPro,
    color: Color.labelsPrimary,
  },
  infoPanel: {
    borderRadius: Border.br_12,
    borderWidth: 1,
    borderColor: Color.colorSilver,
    backgroundColor: Color.colorWhite,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  timeText: {
    fontSize: FontSize.fs_12,
    lineHeight: 16,
    fontWeight: "500",
    fontFamily: FontFamily.inter,
    color: Color.labelsPrimary,
  },
  divider: {
    borderTopWidth: 1,
    borderColor: Color.colorSilver,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    columnGap: 18,
    rowGap: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: FontSize.fs_12,
    lineHeight: 16,
    fontWeight: "500",
    fontFamily: FontFamily.inter,
    color: Color.labelsPrimary,
  },
});
