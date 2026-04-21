import * as React from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Mdifire from "@/assets/home/mdi-fire.svg";
import {
  Border,
  BoxShadow,
  Color,
  FontFamily,
  FontSize,
  Gap,
  HomeLayout,
  LineHeight,
} from "@/constants/locofyHomeStyles";
import type { PartnerCardProps } from "@/types/ui/homeCards";

export type { PartnerCardProps } from "@/types/ui/homeCards";

const DEFAULT_BACKGROUND_IMAGE = require("../../../assets/home/PartnerCardBackground2.png");
const DEFAULT_PROFILE_IMAGE = require("../../../assets/home/PartnerProfileImage.png");

const PartnerCard = ({
  imageSource = DEFAULT_BACKGROUND_IMAGE,
  profileImageSource = DEFAULT_PROFILE_IMAGE,
  name = "Minjun Kim",
  age = 21,
  description = "A partner with a routine that fits well with yours",
  tags = ["Tennis", "Beginner", "Weekend AM", "Fair Play"],
  matchScore = 87,
  rejectLabel = "Pass",
  acceptLabel = "Accept",
  onReject,
  onAccept,
}: PartnerCardProps) => {
  return (
    <View style={styles.card}>
      <ImageBackground
        source={imageSource}
        resizeMode="cover"
        imageStyle={styles.visualImage}
        style={styles.visual}
      >
        <View style={styles.visualTint}>
          <Image
            source={profileImageSource}
            style={styles.profileImage}
            resizeMode="contain"
          />
        </View>
      </ImageBackground>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.age}>{age}</Text>
        </View>

        <Text style={styles.description}>{description}</Text>

        <View style={styles.tagList}>
          {tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.scoreRow}>
          <Mdifire width={24} height={24} />
          <Text style={styles.scoreText}>Match score {matchScore}%</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <Pressable
          accessibilityRole="button"
          style={[styles.actionButton, styles.rejectButton]}
          onPress={onReject}
        >
          <Text style={[styles.actionLabel, styles.rejectLabel]}>
            {rejectLabel}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          style={[styles.actionButton, styles.acceptButton]}
          onPress={onAccept}
        >
          <Text style={[styles.actionLabel, styles.acceptLabel]}>
            {acceptLabel}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: HomeLayout.partnerCardWidth,
    minHeight: HomeLayout.partnerCardMinHeight,
    borderRadius: Border.br_16,
    backgroundColor: Color.colorWhite,
    borderWidth: 1,
    borderColor: Color.colorGray,
    overflow: "hidden",
    elevation: 8,
    boxShadow: BoxShadow.shadow_drop,
  },

  visual: {
    height: HomeLayout.partnerCardVisualHeight,
    justifyContent: "flex-end",
    backgroundColor: Color.colorLightsteelblue,
  },

  visualImage: {
    borderTopLeftRadius: Border.br_16,
    borderTopRightRadius: Border.br_16,
  },

  visualTint: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.35)",
  },

  profileImage: {
    width: HomeLayout.partnerProfileSize,
    height: HomeLayout.partnerProfileSize,
    borderRadius: HomeLayout.partnerProfileSize / 2,
  },

  content: {
    gap: Gap.gap_12,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  name: {
    color: Color.colorBlack,
    fontFamily: FontFamily.inter,
    fontSize: FontSize.fs_22,
    lineHeight: 28,
    fontWeight: "700",
    textAlign: "center",
  },

  age: {
    color: Color.nuetral500,
    fontFamily: FontFamily.inter,
    fontSize: FontSize.fs_15,
    lineHeight: LineHeight.lh_20,
    fontWeight: "600",
  },

  description: {
    color: Color.nuetral500,
    fontFamily: FontFamily.inter,
    fontSize: FontSize.fs_13,
    lineHeight: LineHeight.lh_18,
    textAlign: "center",
  },

  tagList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },

  tag: {
    borderRadius: Border.br_32_7,
    backgroundColor: Color.colorLightsteelblue,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  tagText: {
    color: Color.primary900,
    fontFamily: FontFamily.inter,
    fontSize: FontSize.fs_10,
    lineHeight: 13,
    fontWeight: "600",
  },

  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  scoreText: {
    color: Color.primary100,
    fontFamily: FontFamily.inter,
    fontSize: FontSize.fs_13,
    lineHeight: LineHeight.lh_18,
    fontWeight: "600",
  },

  actionRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },

  actionButton: {
    flex: 1,
    height: HomeLayout.actionButtonHeight,
    borderRadius: Border.br_32_7,
    alignItems: "center",
    justifyContent: "center",
  },

  rejectButton: {
    backgroundColor: Color.colorGhostwhite,
  },

  acceptButton: {
    backgroundColor: Color.colorRoyalblue,
  },

  actionLabel: {
    fontFamily: FontFamily.inter,
    fontSize: FontSize.fs_15,
    lineHeight: LineHeight.lh_20,
    fontWeight: "600",
  },

  rejectLabel: {
    color: Color.colorBlack,
  },

  acceptLabel: {
    color: Color.nuetral100,
  },
});

export default PartnerCard;
