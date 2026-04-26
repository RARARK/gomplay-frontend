import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Border, Color, FontFamily, FontSize } from "../GlobalStyles";

type PostMatchReviewCardProps = {
  title?: string;
  description?: string;
  buttonLabel?: string;
  inputPlaceholder?: string;
  onPressReview?: () => void;
};

export default function PostMatchReviewCard({
  title = "Workout finished!",
  description = "How was the session today? Leave a quick review for your match partner.",
  buttonLabel = "Leave review",
  inputPlaceholder = "Write a message...",
  onPressReview,
}: PostMatchReviewCardProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <View style={styles.innerCard}>
          <View style={styles.headerRow}>
            <Ionicons
              name="flag-outline"
              size={24}
              color={Color.labelsPrimary}
            />
            <Text style={styles.title}>{title}</Text>
          </View>

          <Text style={styles.description}>{description}</Text>

          <Pressable onPress={onPressReview} style={styles.actionButton}>
            <Text style={styles.actionLabel}>{buttonLabel}</Text>
            <Ionicons name="arrow-forward" size={18} color={Color.colorWhite} />
          </Pressable>
        </View>
      </View>

      <View style={styles.messageInputContainer}>
        <TextInput
          placeholder={inputPlaceholder}
          placeholderTextColor={Color.nuetral700}
          style={styles.messageInput}
        />
        <Pressable accessibilityLabel="Send message" style={styles.sendButton}>
          <Image
            source={require("../../assets/chat/airplane.png")}
            style={styles.sendIcon}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 15,
    gap: 20,
  },
  card: {
    borderRadius: Border.br_16,
    borderWidth: 1,
    borderColor: Color.colorGainsboro,
    backgroundColor: Color.colorGhostwhite100,
    paddingHorizontal: 13,
    paddingTop: 9,
    paddingBottom: 8,
  },
  innerCard: {
    borderRadius: Border.br_8,
    backgroundColor: Color.colorWhite,
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 18,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: FontSize.fs_17,
    lineHeight: 22,
    fontWeight: "600",
    fontFamily: FontFamily.inter,
    color: Color.labelsPrimary,
  },
  description: {
    fontSize: FontSize.fs_11,
    lineHeight: 16,
    fontFamily: FontFamily.inter,
    color: Color.nuetral700,
  },
  actionButton: {
    alignSelf: "flex-start",
    minHeight: 36,
    borderRadius: Border.br_8,
    backgroundColor: Color.primary100,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionLabel: {
    fontSize: FontSize.fs_17,
    lineHeight: 22,
    fontWeight: "600",
    fontFamily: FontFamily.inter,
    color: Color.colorWhite,
  },
  messageInputContainer: {
    minHeight: 66,
    borderRadius: Border.br_12,
    borderWidth: 1,
    borderColor: Color.colorGainsboro,
    backgroundColor: Color.colorWhite,
    paddingLeft: 13,
    paddingRight: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  messageInput: {
    flex: 1,
    fontSize: FontSize.fs_17,
    lineHeight: 22,
    fontFamily: FontFamily.inter,
    color: Color.labelsPrimary,
  },
  sendButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  sendIcon: {
    width: 26,
    height: 26,
    resizeMode: "contain",
  },
});
